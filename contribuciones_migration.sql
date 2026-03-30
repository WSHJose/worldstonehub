-- ================================================================
-- WSH: Sistema de Contribuciones de Proveedores  v2
-- Ejecutar en Supabase SQL Editor (después de content_score_migration.sql)
-- Cambios v2: sin FK duras en proveedor_slug (evita error si slug no es PK/UNIQUE),
--             vista materializada con WITH NO DATA + refresh posterior
-- ================================================================

-- 1. Tabla principal de contribuciones
--    Sin FK en proveedor_slug para evitar el error 42830 si slug no es PK/UNIQUE
CREATE TABLE IF NOT EXISTS material_contribuciones (
  id              bigserial PRIMARY KEY,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  -- Quién
  proveedor_slug  text NOT NULL,            -- referencia lógica (sin FK dura)
  proveedor_plan  text DEFAULT 'free',      -- snapshot del plan al contribuir

  -- Sobre qué material
  material_slug   text NOT NULL,
  material_nombre text,                     -- denormalizado para el admin

  -- Qué aporta
  tipo            text NOT NULL CHECK (tipo IN (
                    'foto',
                    'datos_tecnicos',
                    'precio',
                    'formato_acabado',
                    'correccion'
                  )),
  contenido_url   text,                     -- URL imagen (tipo='foto')
  contenido_texto text,                     -- Texto/JSON para datos, precios, etc.
  nota_proveedor  text,                     -- Nota libre del proveedor

  -- Moderación
  estado          text DEFAULT 'pendiente' CHECK (estado IN (
                    'pendiente',
                    'aprobado',
                    'rechazado'
                  )),
  nota_admin      text,
  revisado_por    text,
  revisado_at     timestamptz,

  -- Puntos asignados al aprobar
  puntos          integer DEFAULT 0
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_contrib_material  ON material_contribuciones (material_slug, estado);
CREATE INDEX IF NOT EXISTS idx_contrib_proveedor ON material_contribuciones (proveedor_slug, estado);
CREATE INDEX IF NOT EXISTS idx_contrib_estado    ON material_contribuciones (estado, created_at DESC);

-- 3. Función visibility_score
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
  FROM material_contribuciones
  WHERE proveedor_slug = p_proveedor_slug
    AND material_slug  = p_material_slug
    AND estado         = 'aprobado';

  contrib_pts := LEAST(contrib_pts * 100 / 70, 100);
  raw_score   := (plan_pts * 0.6) + (contrib_pts * 0.4);
  RETURN LEAST(ROUND(raw_score)::integer, 100);
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Vista materializada — WITH NO DATA evita el error durante la creación
--    cuando la tabla acaba de crearse y aún no tiene filas
DROP MATERIALIZED VIEW IF EXISTS mv_proveedores_por_material;
CREATE MATERIALIZED VIEW mv_proveedores_por_material AS
SELECT
  p.slug                                                    AS proveedor_slug,
  p.nombre_empresa,
  p.plan,
  p.pais,
  p.ciudad,
  p.logo_url,
  p.descripcion,
  m_slug                                                    AS material_slug,
  get_visibility_score(p.slug, p.plan, m_slug)              AS visibility_score,
  CASE
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 80 THEN 'oro'
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 52 THEN 'plata'
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 12 THEN 'bronce'
    ELSE 'base'
  END                                                       AS nivel_contribucion,
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
WITH NO DATA;

-- Índice único (necesario para REFRESH CONCURRENTLY)
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_prov_mat
  ON mv_proveedores_por_material (proveedor_slug, material_slug);

-- Poblar la vista ahora que el índice existe
REFRESH MATERIALIZED VIEW mv_proveedores_por_material;

-- 5. Trigger para refrescar la vista al aprobar contribuciones
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

-- 6. RLS
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

DROP POLICY IF EXISTS "insert_anon" ON material_contribuciones;
CREATE POLICY "insert_anon" ON material_contribuciones
  FOR INSERT WITH CHECK (true);

-- 7. Tabla de puntos (sin FK dura, igual que material_contribuciones)
CREATE TABLE IF NOT EXISTS proveedor_puntos (
  proveedor_slug          text PRIMARY KEY,
  puntos_total            integer DEFAULT 0,
  contribuciones          integer DEFAULT 0,
  materiales_contribuidos integer DEFAULT 0,
  updated_at              timestamptz DEFAULT now()
);

-- 8. Trigger de puntos al aprobar
CREATE OR REPLACE FUNCTION actualizar_puntos_proveedor()
RETURNS TRIGGER AS $$
DECLARE
  puntos_contribucion integer;
BEGIN
  IF NEW.estado = 'aprobado' AND (OLD.estado IS NULL OR OLD.estado != 'aprobado') THEN
    puntos_contribucion := CASE NEW.tipo
      WHEN 'foto'            THEN 22
      WHEN 'datos_tecnicos'  THEN 14
      WHEN 'precio'          THEN 10
      WHEN 'formato_acabado' THEN 7
      WHEN 'correccion'      THEN 4
      ELSE 0
    END;

    NEW.puntos := puntos_contribucion;

    INSERT INTO proveedor_puntos (proveedor_slug, puntos_total, contribuciones, materiales_contribuidos)
    VALUES (NEW.proveedor_slug, puntos_contribucion, 1, 1)
    ON CONFLICT (proveedor_slug) DO UPDATE SET
      puntos_total    = proveedor_puntos.puntos_total + puntos_contribucion,
      contribuciones  = proveedor_puntos.contribuciones + 1,
      materiales_contribuidos = (
        SELECT COUNT(DISTINCT material_slug)
        FROM material_contribuciones
        WHERE proveedor_slug = NEW.proveedor_slug AND estado = 'aprobado'
      ),
      updated_at = now();

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

-- 9. Vista pública para material.html
CREATE OR REPLACE VIEW v_proveedores_material AS
SELECT
  mv.*,
  CASE WHEN mv.plan = 'elite' THEN true ELSE false END AS slot_elite
FROM mv_proveedores_por_material mv
ORDER BY
  CASE WHEN mv.plan = 'elite' THEN 0 ELSE 1 END,
  mv.visibility_score DESC;

-- Verificación final
SELECT
  'material_contribuciones' AS tabla, COUNT(*) AS filas FROM material_contribuciones
UNION ALL
SELECT 'proveedor_puntos', COUNT(*) FROM proveedor_puntos
UNION ALL
SELECT 'mv_proveedores_por_material', COUNT(*) FROM mv_proveedores_por_material;
