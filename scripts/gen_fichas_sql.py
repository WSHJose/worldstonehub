from docx import Document
import pandas as pd
import json
import re
import unicodedata

def slugify(s):
    s = unicodedata.normalize('NFKD', s)
    s = s.encode('ascii', 'ignore').decode('ascii')
    s = s.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s

def sql_str(s):
    if not s or str(s).strip() in ('nan', 'None', ''):
        return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

def sql_arr(lst):
    if not lst:
        return 'NULL'
    # Use single-quoted literals — double quotes are column identifiers in PostgreSQL
    items = ["'" + str(x).replace("'", "''") + "'" for x in lst]
    return "ARRAY[" + ",".join(items) + "]::text[]"

# ---- Load DOCX ----
doc = Document(r'C:/Users/joser/Downloads/WSH_Fichas_Completas_50_Piedras.docx')
paragraphs = [p.text.strip() for p in doc.paragraphs]
SECTIONS = ['DESCRIPCION GENERAL', 'PROPIEDADES TECNICAS', 'APLICACIONES RECOMENDADAS',
            'CONSEJOS DE INSTALACION Y MANTENIMIENTO', 'PERFIL COMERCIAL']
desc_positions = [i for i, p in enumerate(paragraphs) if p == 'DESCRIPCION GENERAL']
docx_stones = []
for idx, pos in enumerate(desc_positions):
    end_pos = desc_positions[idx+1] if idx+1 < len(desc_positions) else len(paragraphs)
    stone_paras = paragraphs[pos:end_pos]
    stone = {}
    current_section = None
    current_lines = []
    for p in stone_paras:
        if p in SECTIONS:
            if current_section and current_lines:
                stone[current_section] = [l for l in current_lines if l]
            current_section = p
            current_lines = []
        elif current_section:
            current_lines.append(p)
    if current_section and current_lines:
        stone[current_section] = [l for l in current_lines if l]
    docx_stones.append(stone)

# ---- Load XLSX ----
df = pd.read_excel(r'C:/Users/joser/Downloads/WSH_50_Piedras_Naturales.xlsx', header=1)
df = df.dropna(subset=['Nombre Comercial'])
df = df[df['#'].apply(lambda x: str(x).strip().isdigit())].reset_index(drop=True)

TIPO_MAP = {
    'Marmol': 'marmol', 'Marble': 'marmol',
    'Granito': 'granito', 'Granite': 'granito',
    'Travertino': 'travertino', 'Travertine': 'travertino',
    'Caliza': 'caliza', 'Limestone': 'caliza',
    'Cuarcita': 'cuarcita', 'Quartzite': 'cuarcita',
    'Arenisca': 'arenisca', 'Sandstone': 'arenisca',
    'Pizarra': 'pizarra', 'Slate': 'pizarra',
    'Onix': 'onix', 'Onyx': 'onix',
    'Basalto': 'basalto', 'Basalt': 'basalto',
    'Porfido': 'porfido',
    'Lava volcanica': 'basalto',
}

def normalize_tipo(t):
    t = str(t).strip()
    t_norm = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode('ascii')
    for k, v in TIPO_MAP.items():
        k_norm = unicodedata.normalize('NFKD', k).encode('ascii', 'ignore').decode('ascii')
        if k_norm.lower() in t_norm.lower():
            return v
    return t_norm.lower().split('/')[0].strip()

lines = []
lines.append("-- ============================================================")
lines.append("-- WSH: Fichas 50 Piedras Mas Comerciales del Mundo")
lines.append("-- Migración completa — Ejecutar en Supabase SQL Editor")
lines.append("-- ============================================================")
lines.append("")
lines.append("-- Paso 1: Nuevas columnas")
for col, typ in [
    ("descripcion_general", "text"),
    ("propiedades_tecnicas_texto", "text[]"),
    ("aplicaciones_recomendadas_txt", "text[]"),
    ("consejos_instalacion", "text[]"),
    ("perfil_comercial", "text"),
    ("precio_orientativo", "text"),
    ("formatos_disponibles", "text"),
    ("resistencia_desgaste_txt", "text"),
    ("principales_compradores", "text"),
    ("certificaciones_txt", "text"),
    ("observaciones_editoriales", "text"),
    ("imagenes_galeria", "text[]"),
    ("destacado", "boolean DEFAULT false"),
    ("orden_catalogo", "integer"),
]:
    lines.append(f"ALTER TABLE materiales ADD COLUMN IF NOT EXISTS {col} {typ};")

lines.append("")
lines.append("-- Paso 2: Upsert 50 piedras")

def clean_bullets(lst):
    return [re.sub(r'^-\s*', '', x).strip() for x in lst if x.strip()]

for i, (_, row) in enumerate(df.iterrows()):
    d = docx_stones[i]
    nombre = str(row['Nombre Comercial']).strip()
    tipo_raw = str(row['Tipo de Roca']).strip()
    pais_raw = str(row['Pais / Region Origen'] if 'Pais / Region Origen' in row.index else row.iloc[3]).strip()
    color = str(row['Color Principal']).strip()
    acabados = str(row['Acabados Disponibles']).strip()
    formatos = str(row['Formatos Comunes (cm)']).strip()
    resistencia = str(row['Resistencia Desgaste']).strip()
    usos = str(row['Usos Principales']).strip()
    precio = str(row['Precio Orientativo ($/m2)'] if 'Precio Orientativo ($/m2)' in row.index else row.iloc[11]).strip()
    compradores = str(row['Principales Compradores']).strip()
    certs = str(row['Certificaciones']).strip()
    obs = str(row['Observaciones']).strip()

    m = re.match(r'^(.+?)\s*\((.+)\)$', pais_raw)
    if m:
        pais = m.group(1).strip()
        region = m.group(2).strip()
    else:
        pais = pais_raw
        region = ''
    paises = [p.strip() for p in pais.split('/')]

    slug = slugify(nombre)
    categoria = normalize_tipo(tipo_raw)

    desc = ' '.join(d.get('DESCRIPCION GENERAL', []))
    props = clean_bullets(d.get('PROPIEDADES TECNICAS', []))
    apps = clean_bullets(d.get('APLICACIONES RECOMENDADAS', []))
    consejos = clean_bullets(d.get('CONSEJOS DE INSTALACION Y MANTENIMIENTO', []))
    perfil = ' '.join(d.get('PERFIL COMERCIAL', []))

    usos_arr = [u.strip() for u in usos.split(',') if u.strip()]
    acabados_arr = [a.strip() for a in acabados.split(',') if a.strip()]

    paises_sql   = sql_arr(paises)
    region_sql   = sql_arr([region] if region else [])
    usos_sql     = sql_arr(usos_arr)
    acabados_sql = sql_arr(acabados_arr)

    props_sql    = sql_arr(props)
    apps_sql     = sql_arr(apps)
    consejos_sql = sql_arr(consejos)

    lines.append(f"INSERT INTO materiales (")
    lines.append(f"  slug, nombre_comercial, categoria, origen_pais, origen_region,")
    lines.append(f"  color_principal, acabados_disponibles, usos_recomendados,")
    lines.append(f"  descripcion_general, propiedades_tecnicas_texto,")
    lines.append(f"  aplicaciones_recomendadas_txt, consejos_instalacion, perfil_comercial,")
    lines.append(f"  precio_orientativo, formatos_disponibles, resistencia_desgaste_txt,")
    lines.append(f"  principales_compradores, certificaciones_txt, observaciones_editoriales,")
    lines.append(f"  activo, destacado, orden_catalogo")
    lines.append(f") VALUES (")
    lines.append(f"  {sql_str(slug)},")
    lines.append(f"  {sql_str(nombre)},")
    lines.append(f"  {sql_str(categoria)},")
    lines.append(f"  {paises_sql},")
    lines.append(f"  {region_sql},")
    lines.append(f"  {sql_str(color)},")
    lines.append(f"  {acabados_sql},")
    lines.append(f"  {usos_sql},")
    lines.append(f"  {sql_str(desc)},")
    lines.append(f"  {props_sql},")
    lines.append(f"  {apps_sql},")
    lines.append(f"  {consejos_sql},")
    lines.append(f"  {sql_str(perfil)},")
    lines.append(f"  {sql_str(precio)},")
    lines.append(f"  {sql_str(formatos)},")
    lines.append(f"  {sql_str(resistencia)},")
    lines.append(f"  {sql_str(compradores)},")
    lines.append(f"  {sql_str(certs)},")
    lines.append(f"  {sql_str(obs)},")
    lines.append(f"  true, true, {i+1}")
    lines.append(f") ON CONFLICT (slug) DO UPDATE SET")
    lines.append(f"  nombre_comercial = EXCLUDED.nombre_comercial,")
    lines.append(f"  categoria = EXCLUDED.categoria,")
    lines.append(f"  descripcion_general = EXCLUDED.descripcion_general,")
    lines.append(f"  propiedades_tecnicas_texto = EXCLUDED.propiedades_tecnicas_texto,")
    lines.append(f"  aplicaciones_recomendadas_txt = EXCLUDED.aplicaciones_recomendadas_txt,")
    lines.append(f"  consejos_instalacion = EXCLUDED.consejos_instalacion,")
    lines.append(f"  perfil_comercial = EXCLUDED.perfil_comercial,")
    lines.append(f"  precio_orientativo = EXCLUDED.precio_orientativo,")
    lines.append(f"  formatos_disponibles = EXCLUDED.formatos_disponibles,")
    lines.append(f"  resistencia_desgaste_txt = EXCLUDED.resistencia_desgaste_txt,")
    lines.append(f"  principales_compradores = EXCLUDED.principales_compradores,")
    lines.append(f"  certificaciones_txt = EXCLUDED.certificaciones_txt,")
    lines.append(f"  observaciones_editoriales = EXCLUDED.observaciones_editoriales,")
    lines.append(f"  destacado = EXCLUDED.destacado,")
    lines.append(f"  orden_catalogo = EXCLUDED.orden_catalogo,")
    lines.append(f"  activo = true;")
    lines.append("")

sql_content = "\n".join(lines)
with open(r'C:/Users/joser/OneDrive/Escritorio/worldstonehub-main/fichas_50_piedras.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print(f"SQL generated: {len(sql_content)} chars, {i+1} stones")
print("Slugs:", [slugify(df.iloc[j]['Nombre Comercial']) for j in range(5)])
