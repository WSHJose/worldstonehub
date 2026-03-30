-- ================================================================
-- WSH: Sistema de Contribuciones de Proveedores  v3
-- LIMPIA restos de ejecuciones anteriores antes de crear todo
-- ================================================================

-- 0. Limpieza total (CASCADE elimina vistas/triggers dependientes)
DROP TRIGGER  IF EXISTS trg_refresh_mv          ON public.material_contribuciones;
DROP TRIGGER  IF EXISTS trg_puntos_proveedor     ON public.material_contribuciones;
DROP VIEW     IF EXISTS public.v_proveedores_material;
DROP MATERIALIZED VIEW IF EXISTS public.mv_proveedores_por_material;
DROP FUNCTION IF EXISTS public.get_visibility_score(text,text,text);
DROP FUNCTION IF EXISTS public.refresh_mv_proveedores();
DROP FUNCTION IF EXISTS public.actualizar_puntos_proveedor();
DROP TABLE    IF EXISTS public.proveedor_puntos;
DROP TABLE    IF EXISTS public.material_contribuciones;

-- 1. Tabla principal (sin FK duras para evitar errores de constraint)
CREATE TABLE public.material_contribuciones (
  id              bigserial PRIMARY KEY,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  proveedor_slug  text NOT NULL,
  proveedor_plan  text DEFAULT 'free',
  material_slug   text NOT NULL,
  material_nombre text,
  tipo            text NOT NULL CHECK (tipo IN (
                    'foto','datos_tecnicos','precio','formato_acabado','correccion'
                  )),
  contenido_url   text,
  contenido_texto text,
  nota_proveedor  text,
  estado          text DEFAULT 'pendiente' CHECK (estado IN (
                    'pendiente','aprobado','rechazado'
                  )),
  nota_admin      text,
  revisado_por    text,
  revisado_at     timestamptz,
  puntos          integer DEFAULT 0
);

-- 2. Índices
CREATE INDEX idx_contrib_material  ON public.material_contribuciones (material_slug, estado);
CREATE INDEX idx_contrib_proveedor ON public.material_contribuciones (proveedor_slug, estado);
CREATE INDEX idx_contrib_estado    ON public.material_contribuciones (estado, created_at DESC);

-- 3. Función visibility_score (schema-qualified para evitar search_path issues)
CREATE FUNCTION public.get_visibility_score(
  p_proveedor_slug text,
  p_plan           text,
  p_material_slug  text
) RETURNS integer AS $$
DECLARE
  plan_pts    integer;
  contrib_pts integer;
  raw_score   numeric;
BEGIN
  plan_pts := CASE p_plan
    WHEN 'elite'        THEN 100
    WHEN 'profesional'  THEN 60
    WHEN 'presencia'    THEN 20
    ELSE 0
  END;

  SELECT COALESCE(SUM(
    CASE tipo
      WHEN 'foto'            THEN 22
      WHEN 'datos_tecnicos'  THEN 14
      WHEN 'precio'          THEN 10
      WHEN 'formato_acabado' THEN 7
      WHEN 'correccion'      THEN 4
      ELSE 0
    END
  ), 0)
  INTO contrib_pts
  FROM public.material_contribuciones
  WHERE proveedor_slug = p_proveedor_slug
    AND material_slug  = p_material_slug
    AND estado         = 'aprobado';

  contrib_pts := LEAST(contrib_pts * 100 / 70, 100);
  raw_score   := (plan_pts * 0.6) + (contrib_pts * 0.4);
  RETURN LEAST(ROUND(raw_score)::integer, 100);
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Vista materializada (WITH NO DATA = no ejecuta el SELECT al crearla)
CREATE MATERIALIZED VIEW public.mv_proveedores_por_material AS
SELECT
  p.slug                                                     AS proveedor_slug,
  p.nombre_empresa,
  p.plan,
  p.pais,
  p.ciudad,
  p.logo_url,
  p.descripcion,
  m_slug                                                     AS material_slug,
  public.get_visibility_score(p.slug, p.plan, m_slug)        AS visibility_score,
  CASE
    WHEN public.get_visibility_score(p.slug, p.plan, m_slug) >= 80 THEN 'oro'
    WHEN public.get_visibility_score(p.slug, p.plan, m_slug) >= 52 THEN 'plata'
    WHEN public.get_visibility_score(p.slug, p.plan, m_slug) >= 12 THEN 'bronce'
    ELSE 'base'
  END                                                        AS nivel_contribucion,
  (SELECT COUNT(*) FROM public.material_contribuciones mc
   WHERE mc.proveedor_slug = p.slug AND mc.material_slug = m_slug
     AND mc.estado = 'aprobado' AND mc.tipo = 'foto')        AS fotos_aportadas,
  (SELECT COUNT(*) FROM public.material_contribuciones mc
   WHERE mc.proveedor_slug = p.slug AND mc.material_slug = m_slug
     AND mc.estado = 'aprobado' AND mc.tipo != 'foto')       AS datos_aportados
FROM public.proveedores p,
     UNNEST(p.materiales) AS m_slug
WHERE p.plan_activo = true
  AND p.estado = 'activo'
WITH NO DATA;

-- Índice único (requerido para REFRESH CONCURRENTLY)
CREATE UNIQUE INDEX idx_mv_prov_mat
  ON public.mv_proveedores_por_material (proveedor_slug, material_slug);

-- Poblar la vista
REFRESH MATERIALIZED VIEW public.mv_proveedores_por_material;

-- 5. Trigger para refrescar la vista al aprobar/insertar
CREATE FUNCTION public.refresh_mv_proveedores()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_proveedores_por_material;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_refresh_mv
  AFTER INSERT OR UPDATE OF estado ON public.material_contribuciones
  FOR EACH STATEMENT
  WHEN (pg_trigger_depth() = 0)
  EXECUTE FUNCTION public.refresh_mv_proveedores();

-- 6. RLS
ALTER TABLE public.material_contribuciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proveedor_own" ON public.material_contribuciones
  FOR ALL USING (
    proveedor_slug = (
      SELECT slug FROM public.proveedores
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "insert_anon" ON public.material_contribuciones
  FOR INSERT WITH CHECK (true);

-- 7. Tabla de puntos
CREATE TABLE public.proveedor_puntos (
  proveedor_slug          text PRIMARY KEY,
  puntos_total            integer DEFAULT 0,
  contribuciones          integer DEFAULT 0,
  materiales_contribuidos integer DEFAULT 0,
  updated_at              timestamptz DEFAULT now()
);

-- 8. Trigger de puntos
CREATE FUNCTION public.actualizar_puntos_proveedor()
RETURNS TRIGGER AS $$
DECLARE
  pts integer;
BEGIN
  IF NEW.estado = 'aprobado' AND (OLD.estado IS NULL OR OLD.estado != 'aprobado') THEN
    pts := CASE NEW.tipo
      WHEN 'foto'            THEN 22
      WHEN 'datos_tecnicos'  THEN 14
      WHEN 'precio'          THEN 10
      WHEN 'formato_acabado' THEN 7
      WHEN 'correccion'      THEN 4
      ELSE 0
    END;

    NEW.puntos := pts;

    INSERT INTO public.proveedor_puntos
      (proveedor_slug, puntos_total, contribuciones, materiales_contribuidos)
    VALUES (NEW.proveedor_slug, pts, 1, 1)
    ON CONFLICT (proveedor_slug) DO UPDATE SET
      puntos_total    = public.proveedor_puntos.puntos_total + pts,
      contribuciones  = public.proveedor_puntos.contribuciones + 1,
      materiales_contribuidos = (
        SELECT COUNT(DISTINCT material_slug)
        FROM public.material_contribuciones
        WHERE proveedor_slug = NEW.proveedor_slug AND estado = 'aprobado'
      ),
      updated_at = now();

    UPDATE public.materiales
    SET content_score = public.calculate_content_score(materiales.*)
    WHERE slug = NEW.material_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_puntos_proveedor
  BEFORE UPDATE OF estado ON public.material_contribuciones
  FOR EACH ROW EXECUTE FUNCTION public.actualizar_puntos_proveedor();

-- 9. Vista pública para material.html
CREATE VIEW public.v_proveedores_material AS
SELECT
  mv.*,
  CASE WHEN mv.plan = 'elite' THEN true ELSE false END AS slot_elite
FROM public.mv_proveedores_por_material mv
ORDER BY
  CASE WHEN mv.plan = 'elite' THEN 0 ELSE 1 END,
  mv.visibility_score DESC;

-- Verificación final
SELECT 'material_contribuciones'   AS tabla, COUNT(*) AS filas FROM public.material_contribuciones
UNION ALL
SELECT 'proveedor_puntos',                   COUNT(*) FROM public.proveedor_puntos
UNION ALL
SELECT 'mv_proveedores_por_material',        COUNT(*) FROM public.mv_proveedores_por_material;
