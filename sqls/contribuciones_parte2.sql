-- ================================================================
-- WSH Contribuciones — PARTE 2 de 2
-- Ejecutar SOLO después de que la Parte 1 haya terminado sin errores
-- ================================================================

-- Función visibility_score
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

-- Vista materializada
CREATE MATERIALIZED VIEW mv_proveedores_por_material AS
SELECT
  p.slug                                      AS proveedor_slug,
  p.nombre_empresa,
  p.plan,
  p.pais,
  p.ciudad,
  p.logo_url,
  p.descripcion,
  m_slug                                      AS material_slug,
  get_visibility_score(p.slug, p.plan, m_slug) AS visibility_score,
  CASE
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 80 THEN 'oro'
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 52 THEN 'plata'
    WHEN get_visibility_score(p.slug, p.plan, m_slug) >= 12 THEN 'bronce'
    ELSE 'base'
  END AS nivel_contribucion,
  (SELECT COUNT(*) FROM material_contribuciones mc
   WHERE mc.proveedor_slug = p.slug AND mc.material_slug = m_slug
     AND mc.estado = 'aprobado' AND mc.tipo = 'foto')  AS fotos_aportadas,
  (SELECT COUNT(*) FROM material_contribuciones mc
   WHERE mc.proveedor_slug = p.slug AND mc.material_slug = m_slug
     AND mc.estado = 'aprobado' AND mc.tipo != 'foto') AS datos_aportados
FROM proveedores p,
     UNNEST(p.materiales) AS m_slug
WHERE p.plan_activo = true
  AND p.estado = 'activo'
WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_prov_mat
  ON mv_proveedores_por_material (proveedor_slug, material_slug);

REFRESH MATERIALIZED VIEW mv_proveedores_por_material;

-- Trigger: refrescar vista al modificar contribuciones
CREATE OR REPLACE FUNCTION refresh_mv_proveedores()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_proveedores_por_material;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_refresh_mv
  AFTER INSERT OR UPDATE OF estado ON material_contribuciones
  FOR EACH STATEMENT
  WHEN (pg_trigger_depth() = 0)
  EXECUTE FUNCTION refresh_mv_proveedores();

-- Trigger: acumular puntos al aprobar
CREATE OR REPLACE FUNCTION actualizar_puntos_proveedor()
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

    INSERT INTO proveedor_puntos
      (proveedor_slug, puntos_total, contribuciones, materiales_contribuidos)
    VALUES (NEW.proveedor_slug, pts, 1, 1)
    ON CONFLICT (proveedor_slug) DO UPDATE SET
      puntos_total    = proveedor_puntos.puntos_total + pts,
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

CREATE TRIGGER trg_puntos_proveedor
  BEFORE UPDATE OF estado ON material_contribuciones
  FOR EACH ROW EXECUTE FUNCTION actualizar_puntos_proveedor();

-- RLS
ALTER TABLE material_contribuciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proveedor_own" ON material_contribuciones
  FOR ALL USING (
    proveedor_slug = (
      SELECT slug FROM proveedores
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "insert_anon" ON material_contribuciones
  FOR INSERT WITH CHECK (true);

-- Vista pública
CREATE OR REPLACE VIEW v_proveedores_material AS
SELECT
  mv.*,
  CASE WHEN mv.plan = 'elite' THEN true ELSE false END AS slot_elite
FROM mv_proveedores_por_material mv
ORDER BY
  CASE WHEN mv.plan = 'elite' THEN 0 ELSE 1 END,
  mv.visibility_score DESC;

-- Verificación final
SELECT 'material_contribuciones'  AS tabla, COUNT(*) AS filas FROM material_contribuciones
UNION ALL
SELECT 'proveedor_puntos',                  COUNT(*) FROM proveedor_puntos
UNION ALL
SELECT 'mv_proveedores_por_material',       COUNT(*) FROM mv_proveedores_por_material;
