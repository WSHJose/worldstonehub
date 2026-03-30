-- ================================================================
-- WSH: Sistema de Contribuciones de Proveedores
-- Ejecutar en Supabase SQL Editor (después de content_score_migration.sql)
-- ================================================================

-- 1. Tabla principal de contribuciones
CREATE TABLE IF NOT EXISTS material_contribuciones (
  id              bigserial PRIMARY KEY,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  -- Quién
  proveedor_slug  text NOT NULL REFERENCES proveedores(slug) ON DELETE CASCADE,
  proveedor_plan  text DEFAULT 'free',   -- snapshot del plan en el momento de contribuir

  -- Sobre qué material
  material_slug   text NOT NULL,         -- no FK dura para permitir slugs nuevos
  material_nombre text,                  -- denormalizado para el admin

  -- Qué aporta
  tipo            text NOT NULL CHECK (tipo IN (
                    'foto',              -- foto de losa/stock/proyecto
                    'datos_tecnicos',    -- corrección o adición de props técnicas
                    'precio',            -- confirmación/actualización de precio
                    'formato_acabado',   -- nuevo formato o acabado disponible
                    'correccion'         -- corrección de error en la ficha
                  )),
  contenido_url   text,                  -- URL de imagen (para tipo='foto')
  contenido_texto text,                  -- Texto/JSON para datos, precios, etc.
  nota_proveedor  text,                  -- Nota libre del proveedor al enviar

  -- Moderación
  estado          text DEFAULT 'pendiente' CHECK (estado IN (
                    'pendiente',
                    'aprobado',
                    'rechazado'
                  )),
  nota_admin      text,                  -- Nota interna del moderador
  revisado_por    text,                  -- email del admin que revisó
  revisado_at     timestamptz,

  -- Puntos asignados al aprobar
  puntos          integer DEFAULT 0
);

-- 2. Índices útiles
CREATE INDEX IF NOT EXISTS idx_contrib_material  ON material_contribuciones (material_slug, estado);
CREATE INDEX IF NOT EXISTS idx_contrib_proveedor ON material_contribuciones (proveedor_slug, estado);
CREATE INDEX IF NOT EXISTS idx_contrib_estado    ON material_contribuciones (estado, created_at DESC);

-- 3. Función visibility_score por proveedor + material
--    score = (plan_pts * 0.6) + (contrib_pts * 0.4), máximo 100
CREATE OR REPLACE FUNCTION get_visibility_score(
  p_proveedor_slug text,
  p_plan           text,
  p_material_slug  text
) RETURNS integer AS $$
DECLARE
  plan_pts    integer;
  contrib_pts integer;
  raw_score   numeric;
BEGIN
  -- Puntos por plan
  plan_pts := CASE p_plan
    WHEN 'elite'        THEN 100
    WHEN 'profesional'  THEN 60
    WHEN 'presencia'    THEN 20
    ELSE 0
  END;

  -- Puntos por contribuciones aprobadas a ese material concreto
  SELECT COALESCE(SUM(
    CASE tipo
      WHEN 'foto'           THEN 22
      WHEN 'datos_tecnicos' THEN 14
      WHEN 'precio'         THEN 10
      WHEN 'formato_acabado' THEN 7
      WHEN 'correccion'     THEN 4
      ELSE 0
    END
  ), 0)
  INTO contrib_pts
  FROM material_contribuciones
  WHERE proveedor_slug = p_proveedor_slug
    AND material_slug  = p_material_slug
    AND estado         = 'aprobado';

  -- Normalizar contrib_pts a 0-100 (máximo teórico ~70)
  contrib_pts := LEAST(contrib_pts * 100 / 70, 100);

  raw_score := (plan_pts * 0.6) + (contrib_pts * 0.4);
  RETURN LEAST(ROUND(raw_score)::integer, 100);
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Vista materializada: proveedores por material con su score
--    (se refresca al aprobar una contribución)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_proveedores_por_material AS
SELECT
  p.slug                                                    AS proveedor_slug,
  p.nombre_empresa,
  p.plan,
  p.pais,
  p.ciudad,
  p.logo_url,
  p.descripcion_corta,
  m_slug                                                    AS material_slug,
  get_visibility_score(p.slug, p.plan, m_slug)              AS visibility_score,
  -- Nivel calculado
  CASE
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 80 THEN 'oro'
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 52 THEN 'plata'
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 12 THEN 'bronce'
    ELSE 'base'
  END                                                       AS nivel_contribucion,
  -- Resumen contribuciones para mostrar en ficha
  (SELECT COUNT(*) FROM material_contribuciones mc
   WHERE mc.proveedor_slug = p.slug AND mc.material_slug = m_slug
     AND mc.estado = 'aprobado' AND mc.tipo = 'foto')       AS fotos_aportadas,
  (SELECT COUNT(*) FROM material_contribuciones mc
   WHERE mc.proveedor_slug = p.slug AND mc.material_slug = m_slug
     AND mc.estado = 'aprobado' AND mc.tipo != 'foto')      AS datos_aportados
FROM proveedores p,
     UNNEST(p.materiales) AS m_slug
WHERE p.plan_activo = true
  AND p.estado = 'activo'
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_prov_mat
  ON mv_proveedores_por_material (proveedor_slug, material_slug);

-- 5. Función para refrescar la vista tras aprobar contribución
CREATE OR REPLACE FUNCTION refresh_mv_proveedores()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_proveedores_por_material;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_refresh_mv ON material_contribuciones;
CREATE TRIGGER trg_refresh_mv
  AFTER INSERT OR UPDATE OF estado ON material_contribuciones
  FOR EACH STATEMENT
  WHEN (pg_trigger_depth() = 0)
  EXECUTE FUNCTION refresh_mv_proveedores();

-- 6. RLS: proveedores solo ven/insertan sus propias contribuciones
ALTER TABLE material_contribuciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "proveedor_own" ON material_contribuciones;
CREATE POLICY "proveedor_own" ON material_contribuciones
  FOR ALL USING (
    proveedor_slug = (
      SELECT slug FROM proveedores
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

-- Los anon pueden INSERT (envío del formulario) pero no SELECT ni UPDATE
DROP POLICY IF EXISTS "insert_anon" ON material_contribuciones;
CREATE POLICY "insert_anon" ON material_contribuciones
  FOR INSERT WITH CHECK (true);

-- 7. Tabla de puntos acumulados por proveedor (para ranking y recompensas)
CREATE TABLE IF NOT EXISTS proveedor_puntos (
  proveedor_slug  text PRIMARY KEY REFERENCES proveedores(slug) ON DELETE CASCADE,
  puntos_total    integer DEFAULT 0,
  contribuciones  integer DEFAULT 0,
  materiales_contribuidos integer DEFAULT 0,
  updated_at      timestamptz DEFAULT now()
);

-- 8. Función que actualiza puntos al aprobar contribución
CREATE OR REPLACE FUNCTION actualizar_puntos_proveedor()
RETURNS TRIGGER AS $$
DECLARE
  puntos_contribucion integer;
BEGIN
  -- Solo actuar cuando cambia a 'aprobado'
  IF NEW.estado = 'aprobado' AND (OLD.estado IS NULL OR OLD.estado != 'aprobado') THEN
    puntos_contribucion := CASE NEW.tipo
      WHEN 'foto'            THEN 22
      WHEN 'datos_tecnicos'  THEN 14
      WHEN 'precio'          THEN 10
      WHEN 'formato_acabado' THEN 7
      WHEN 'correccion'      THEN 4
      ELSE 0
    END;

    -- Guardar puntos en la contribución
    NEW.puntos := puntos_contribucion;

    -- Upsert en tabla de puntos
    INSERT INTO proveedor_puntos (proveedor_slug, puntos_total, contribuciones, materiales_contribuidos)
    VALUES (
      NEW.proveedor_slug,
      puntos_contribucion,
      1,
      1
    )
    ON CONFLICT (proveedor_slug) DO UPDATE SET
      puntos_total    = proveedor_puntos.puntos_total + puntos_contribucion,
      contribuciones  = proveedor_puntos.contribuciones + 1,
      materiales_contribuidos = (
        SELECT COUNT(DISTINCT material_slug)
        FROM material_contribuciones
        WHERE proveedor_slug = NEW.proveedor_slug AND estado = 'aprobado'
      ),
      updated_at = now();

    -- Recalcular content_score del material afectado
    UPDATE materiales
    SET content_score = calculate_content_score(materiales.*)
    WHERE slug = NEW.material_slug;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_puntos_proveedor ON material_contribuciones;
CREATE TRIGGER trg_puntos_proveedor
  BEFORE UPDATE OF estado ON material_contribuciones
  FOR EACH ROW EXECUTE FUNCTION actualizar_puntos_proveedor();

-- 9. Vista pública para la ficha de material (lo que consume material.html)
CREATE OR REPLACE VIEW v_proveedores_material AS
SELECT
  mv.*,
  -- Slot garantizado para élite (siempre los primeros 2)
  CASE WHEN mv.plan = 'elite' THEN true ELSE false END AS slot_elite
FROM mv_proveedores_por_material mv
ORDER BY
  CASE WHEN mv.plan = 'elite' THEN 0 ELSE 1 END,  -- élite siempre arriba
  mv.visibility_score DESC;

-- Verificación final
SELECT
  'material_contribuciones' AS tabla, COUNT(*) AS filas FROM material_contribuciones
UNION ALL
SELECT 'proveedor_puntos', COUNT(*) FROM proveedor_puntos;
