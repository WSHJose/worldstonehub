-- ================================================================
-- WSH Contribuciones — PARTE 1 de 2
-- Ejecutar primero. Espera a que termine antes de ejecutar parte 2.
-- ================================================================

-- Limpieza (por si hay restos de intentos anteriores)
DROP VIEW     IF EXISTS v_proveedores_material             CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_proveedores_por_material CASCADE;
DROP TRIGGER  IF EXISTS trg_refresh_mv       ON material_contribuciones;
DROP TRIGGER  IF EXISTS trg_puntos_proveedor ON material_contribuciones;
DROP FUNCTION IF EXISTS get_visibility_score(text,text,text) CASCADE;
DROP FUNCTION IF EXISTS refresh_mv_proveedores()           CASCADE;
DROP FUNCTION IF EXISTS actualizar_puntos_proveedor()      CASCADE;
DROP TABLE    IF EXISTS proveedor_puntos                   CASCADE;
DROP TABLE    IF EXISTS material_contribuciones            CASCADE;

-- Tabla principal
CREATE TABLE material_contribuciones (
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

CREATE INDEX idx_contrib_material  ON material_contribuciones (material_slug, estado);
CREATE INDEX idx_contrib_proveedor ON material_contribuciones (proveedor_slug, estado);
CREATE INDEX idx_contrib_estado    ON material_contribuciones (estado, created_at DESC);

-- Tabla de puntos
CREATE TABLE proveedor_puntos (
  proveedor_slug          text PRIMARY KEY,
  puntos_total            integer DEFAULT 0,
  contribuciones          integer DEFAULT 0,
  materiales_contribuidos integer DEFAULT 0,
  updated_at              timestamptz DEFAULT now()
);

-- Verificación: si ves las 2 tablas, ejecuta la Parte 2
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('material_contribuciones','proveedor_puntos')
ORDER BY table_name;
