-- ================================================================
-- WSH: Sistema de Content Score automático
-- Ejecutar en Supabase SQL Editor
-- ================================================================

-- 1. Añadir columna
ALTER TABLE materiales ADD COLUMN IF NOT EXISTS content_score integer DEFAULT 0;

-- 2. Función de cálculo (0-100 puntos)
CREATE OR REPLACE FUNCTION calculate_content_score(m materiales)
RETURNS integer AS $$
DECLARE
  score integer := 0;
BEGIN
  -- FOTO PRINCIPAL (22 pts) — mayor impacto visual
  IF m.imagen_url_principal IS NOT NULL AND m.imagen_url_principal <> '' THEN
    score := score + 22;
  END IF;

  -- DESCRIPCIÓN EDITORIAL (18 pts) — texto largo = contenido real
  IF m.descripcion_general IS NOT NULL AND length(m.descripcion_general) > 100 THEN
    score := score + 18;
  END IF;

  -- PROPIEDADES TÉCNICAS TEXTO (9 pts) — detalle del DOCX
  IF m.propiedades_tecnicas_texto IS NOT NULL AND array_length(m.propiedades_tecnicas_texto, 1) > 0 THEN
    score := score + 9;
  END IF;

  -- APLICACIONES RECOMENDADAS (7 pts)
  IF m.aplicaciones_recomendadas_txt IS NOT NULL AND array_length(m.aplicaciones_recomendadas_txt, 1) > 0 THEN
    score := score + 7;
  END IF;

  -- CONSEJOS DE INSTALACIÓN (7 pts)
  IF m.consejos_instalacion IS NOT NULL AND array_length(m.consejos_instalacion, 1) > 0 THEN
    score := score + 7;
  END IF;

  -- PERFIL COMERCIAL (7 pts)
  IF m.perfil_comercial IS NOT NULL AND length(m.perfil_comercial) > 50 THEN
    score := score + 7;
  END IF;

  -- PRECIO ORIENTATIVO (6 pts) — dato de mercado muy buscado
  IF m.precio_orientativo IS NOT NULL AND m.precio_orientativo <> '' THEN
    score := score + 6;
  END IF;

  -- GALERÍA DE IMÁGENES (6 pts)
  IF m.imagenes_galeria IS NOT NULL AND array_length(m.imagenes_galeria, 1) > 0 THEN
    score := score + 6;
  END IF;

  -- PROPIEDADES TÉCNICAS DB (5 pts) — datos estructurados
  IF m.propiedades_tecnicas IS NOT NULL AND m.propiedades_tecnicas <> '{}'::jsonb THEN
    score := score + 5;
  END IF;

  -- CERTIFICACIONES (4 pts)
  IF m.certificaciones_txt IS NOT NULL AND m.certificaciones_txt <> '' THEN
    score := score + 4;
  END IF;

  -- FORMATOS DISPONIBLES (4 pts)
  IF m.formatos_disponibles IS NOT NULL AND m.formatos_disponibles <> '' THEN
    score := score + 4;
  END IF;

  -- MERCADOS PRINCIPALES (3 pts)
  IF m.principales_compradores IS NOT NULL AND m.principales_compradores <> '' THEN
    score := score + 3;
  END IF;

  -- OBSERVACIONES EDITORIALES (2 pts)
  IF m.observaciones_editoriales IS NOT NULL AND m.observaciones_editoriales <> '' THEN
    score := score + 2;
  END IF;

  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Trigger: recalcular automáticamente en cada INSERT/UPDATE
CREATE OR REPLACE FUNCTION trg_update_content_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_score := calculate_content_score(NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_content_score ON materiales;
CREATE TRIGGER trg_content_score
  BEFORE INSERT OR UPDATE ON materiales
  FOR EACH ROW EXECUTE FUNCTION trg_update_content_score();

-- 4. Recalcular todos los registros existentes ahora mismo
UPDATE materiales SET content_score = calculate_content_score(materiales.*);

-- 5. Índice para ordenación rápida
CREATE INDEX IF NOT EXISTS idx_materiales_content_score ON materiales (content_score DESC);

-- Verificación: top 20 materiales por score
SELECT slug, nombre_comercial, content_score,
  CASE
    WHEN content_score >= 80 THEN '★★★ Ficha completa'
    WHEN content_score >= 50 THEN '★★  Ficha parcial'
    WHEN content_score >= 20 THEN '★   Datos básicos'
    ELSE                          '·   Sin contenido'
  END AS nivel
FROM materiales
WHERE activo = true
ORDER BY content_score DESC
LIMIT 20;
