/**
 * WSH i18n — Internationalisation engine (inline bundle)
 * World Stone Hub · v1.1
 *
 * Translations are bundled inline — works on file://, GitHub Pages, any server.
 * No fetch, no CORS issues, no build step.
 *
 * ── QUICK START ─────────────────────────────────────────────────────────────
 *
 * 1. Load the script (before </body>):
 *      <script src="i18n.js"></script>
 *
 * 2. Optional config (before the script tag):
 *      <script>window.WSH_i18n_config = { defaultLang: 'es' };</script>
 *
 * 3. Mark elements with data-i18n="key.path":
 *      <a href="index.html" data-i18n="nav.inicio">Inicio</a>
 *
 * 4. Translate attributes with data-i18n-attr="attr:key.path[,attr2:key2]":
 *      <input data-i18n-attr="placeholder:search.placeholder">
 *
 * 5. Translate innerHTML (rich content):
 *      <p data-i18n-html="hero.distribuidores.desc"></p>
 *
 * 6. Change language programmatically:
 *      WSH_i18n.setLang('en');
 *
 * 7. Get a translation string in JS:
 *      const label = WSH_i18n.t('stats.empresas');
 *
 * ── LANG SELECTOR HTML (insert inside <nav>, after </ul>) ───────────────────
 *
 *   <div class="lang-switcher" role="group" aria-label="Idioma / Language">
 *     <button class="lang-btn" data-lang="es" aria-pressed="true">ES</button>
 *     <span class="lang-sep" aria-hidden="true"></span>
 *     <button class="lang-btn" data-lang="en" aria-pressed="false">EN</button>
 *   </div>
 *
 * ── LANG SELECTOR CSS ────────────────────────────────────────────────────────
 *
 *   .lang-switcher{display:flex;align-items:center;gap:0;margin-left:16px;}
 *   .lang-btn{font-family:'DM Mono',monospace;font-size:10px;font-weight:400;
 *     letter-spacing:.14em;text-transform:uppercase;color:#8a8784;background:none;
 *     border:none;padding:5px 7px;cursor:pointer;transition:color .2s;line-height:1;
 *     border-radius:2px;}
 *   .lang-btn:hover{color:#1a1917;}
 *   .lang-btn.active{color:#A67C52;}
 *   .lang-btn.active::after{content:'';display:block;height:1px;background:#A67C52;
 *     margin-top:2px;opacity:.6;}
 *   .lang-sep{width:1px;height:10px;background:#c8c5bf;opacity:.45;flex-shrink:0;}
 *   @media(max-width:900px){.lang-switcher{display:none;}}
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function (window) {
  'use strict';

  /* ── Bundled translations ───────────────────────────────────────────────── */
  var LANGS = {
    es: {
      nav: {
        inicio: 'Inicio', canteras: 'Canteras', materiales: 'Materiales',
        directorio: 'Directorio', publicar: 'Publicar', acceso: 'Acceso',
        miPanel: 'Mi Panel', mapaAriaLabel: 'Mapa Mundial de Canteras',
        todosProveedores: 'Todos los proveedores', distribuidores: 'Distribuidores',
        fabricantes: 'Fabricantes', arquitectura: 'Arquitectura',
        constructoras: 'Constructoras', maquinaria: 'Maquinaria',
        laboratorios: 'Laboratorios', logistica: 'Logística'
      },
      search: {
        placeholder: 'Buscar canteras, materiales, empresas...',
        placeholderCanteras: 'Buscar por nombre, material, país...',
        placeholderMapa: 'Buscar cantera o material',
        resultados: 'resultados', resultado: 'resultado',
        sinResultados: 'Sin resultados para esta búsqueda', limpiar: 'Limpiar'
      },
      filter: {
        label: 'Filtrar por', todos: 'Todos', tipo: 'Tipo', pais: 'País',
        material: 'Material', plan: 'Plan', limpiar: 'Limpiar filtros',
        aplicar: 'Aplicar', activos: 'Filtros activos'
      },
      stats: {
        empresas: 'Empresas', canteras: 'Canteras', materiales: 'Materiales',
        paises: 'Países', elite: 'Elite', verificadas: 'Verificadas'
      },
      card: {
        verFicha: 'Ver ficha', verPerfil: 'Ver perfil', website: 'Sitio web',
        contactar: 'Contactar', fundada: 'Fundada', empleados: 'Empleados',
        verificado: 'Verificado', materiales: 'Materiales', sectores: 'Sectores', mas: 'más'
      },
      plan: { elite: 'Elite', profesional: 'Profesional', presencia: 'Presencia' },
      sector: {
        distribuidores: 'Distribuidores',
        fabricantes: 'Fabricantes y Talleres',
        arquitectura: 'Arquitectura e Interiorismo',
        constructoras: 'Constructoras y Promotoras',
        maquinaria: 'Maquinaria para Piedra',
        laboratorios: 'Laboratorios y Certificación',
        logistica: 'Logística y Transporte'
      },
      hero: {
        eyebrow: 'Directorio global',
        distribuidores: {
          eyebrow: 'Red comercial · Directorio global', title: 'Distribuidores',
          titleItalic: 'de Piedra Natural',
          desc: 'Importadores, exportadores y distribuidores de piedra natural con presencia global. Perfiles verificados con cobertura geográfica, materiales y contacto directo.'
        },
        fabricantes: {
          eyebrow: 'Serrerías, talleres y transformadores · Directorio global', title: 'Fabricantes',
          titleItalic: 'y Talleres',
          desc: 'Empresas de transformación y fabricación de piedra natural. Capacidad productiva, tecnología y ficha técnica completa.'
        },
        arquitectura: {
          eyebrow: 'Diseño, proyectos y especificación · Directorio global', title: 'Arquitectura',
          titleItalic: 'e Interiorismo',
          desc: 'Estudios de arquitectura e interiorismo especializados en piedra natural. Proyectos de referencia y materiales especificados.'
        },
        constructoras: {
          eyebrow: 'Obra civil, edificación y promoción · Directorio global', title: 'Constructoras',
          titleItalic: 'y Promotoras',
          desc: 'Empresas de construcción y promoción inmobiliaria que trabajan con piedra natural en obra residencial y civil.'
        },
        maquinaria: {
          eyebrow: 'Equipamiento y tecnología industrial · Directorio global', title: 'Maquinaria',
          titleItalic: 'para Piedra',
          desc: 'Fabricantes y distribuidores de maquinaria, herramientas y tecnología para la extracción y transformación de piedra natural.'
        },
        laboratorios: {
          eyebrow: 'Análisis, certificación y control de calidad · Directorio global', title: 'Laboratorios',
          titleItalic: 'y Certificación',
          desc: 'Laboratorios especializados en ensayos, análisis y certificación de piedra natural. Normas UNE, EN y estándares internacionales.'
        },
        logistica: {
          eyebrow: 'Transporte, aduanas y almacenaje · Directorio global', title: 'Logística',
          titleItalic: 'y Transporte',
          desc: 'Operadores logísticos, transitarios y empresas de transporte especializados en piedra natural. Cobertura internacional y gestión aduanera.'
        },
        canteras: {
          eyebrow: 'Lapidis · Directorio global', title: 'Canteras',
          titleItalic: 'del Mundo',
          desc: 'Directorio global de canteras de piedra natural. Explora producción, materiales, localización y ficha técnica completa de cada yacimiento.'
        },
        materiales: {
          eyebrow: 'Lapidis · Directorio técnico', title: 'Materiales de',
          titleItalic: 'Piedra Natural',
          desc: 'Fichas técnicas completas de materiales de piedra natural y superficies. Propiedades, acabados, formatos, origen y proyectos de referencia.'
        },
        proveedores: {
          eyebrow: 'Lapidis · Directorio comercial', title: 'Proveedores',
          titleItalic: 'y Distribuidores',
          desc: 'Empresas del sector de la piedra natural con perfil verificado. Los perfiles Elite y Profesional incluyen ficha completa, materiales, certificaciones y contacto directo.'
        }
      },
      mapa: {
        titulo: 'Mapa Mundial de Canteras', subtitulo: 'Directorio mundial',
        buscar: 'Buscar cantera o material', placeholderMapa: 'Carrara, Granito, Blanco...',
        limpiar: '✕',
        filtros: { tipoPiedra: 'Tipo de piedra', color: 'Color predominante', pais: 'País de origen', relevancia: 'Relevancia histórica', limpiar: 'Limpiar' },
        canteras: 'canteras', enDirectorio: 'en el directorio'
      },
      state: {
        cargando: 'Cargando...', cargandoFicha: 'Cargando ficha…',
        sinResultados: 'No hay resultados', sinResultadosSub: 'Prueba con otros filtros o términos de búsqueda',
        error: 'Error al cargar datos', errorSub: 'Inténtalo de nuevo en unos momentos',
        noEncontrado: 'No encontrado', noEncontradoSub: 'Esta ficha no existe o ha sido eliminada'
      },
      cta: {
        publicarEmpresa: 'Publicar mi empresa', explorarDirectorio: 'Explorar directorio',
        verTodos: 'Ver todos', verMas: 'Ver más', registro: 'Crear cuenta',
        upgrade: 'Mejorar plan', contactar: 'Contactar', verFicha: 'Ver ficha completa'
      },
      registro: {
        titulo: 'Publica tu empresa', subtitulo: 'Visibilidad global para tu negocio en piedra natural',
        nombre: 'Nombre de empresa', email: 'Email de contacto', tipo: 'Tipo de empresa',
        pais: 'País', ciudad: 'Ciudad', descripcion: 'Descripción', website: 'Sitio web',
        enviar: 'Enviar solicitud', enviando: 'Enviando...',
        exito: 'Solicitud recibida. Te contactaremos en 24 h.',
        error: 'Error al enviar. Inténtalo de nuevo.'
      },
      footer: {
        tagline: 'La plataforma global de referencia para el sector de la piedra natural.',
        directorio: 'Directorio', empresa: 'Empresa', legal: 'Aviso legal',
        privacidad: 'Privacidad', contacto: 'Contacto', nosotros: 'Sobre WSH',
        copyright: '© 2026 World Stone Hub. Todos los derechos reservados.'
      },
      ad: { label: 'Publicidad', placeholder: 'Espacio publicitario disponible', cta: 'Anunciarse en WSH' },
      lang: { es: 'Español', en: 'English', cambiar: 'Cambiar idioma' }
    },

    en: {
      nav: {
        inicio: 'Home', canteras: 'Quarries', materiales: 'Materials',
        directorio: 'Directory', publicar: 'List Now', acceso: 'Sign In',
        miPanel: 'My Panel', mapaAriaLabel: 'World Quarry Map',
        todosProveedores: 'All providers', distribuidores: 'Distributors',
        fabricantes: 'Manufacturers', arquitectura: 'Architecture',
        constructoras: 'Construction', maquinaria: 'Machinery',
        laboratorios: 'Laboratories', logistica: 'Logistics'
      },
      search: {
        placeholder: 'Search quarries, materials, companies...',
        placeholderCanteras: 'Search by name, material, country...',
        placeholderMapa: 'Search quarry or material',
        resultados: 'results', resultado: 'result',
        sinResultados: 'No results for this search', limpiar: 'Clear'
      },
      filter: {
        label: 'Filter by', todos: 'All', tipo: 'Type', pais: 'Country',
        material: 'Material', plan: 'Plan', limpiar: 'Clear filters',
        aplicar: 'Apply', activos: 'Active filters'
      },
      stats: {
        empresas: 'Companies', canteras: 'Quarries', materiales: 'Materials',
        paises: 'Countries', elite: 'Elite', verificadas: 'Verified'
      },
      card: {
        verFicha: 'View profile', verPerfil: 'View profile', website: 'Website',
        contactar: 'Contact', fundada: 'Founded', empleados: 'Employees',
        verificado: 'Verified', materiales: 'Materials', sectores: 'Sectors', mas: 'more'
      },
      plan: { elite: 'Elite', profesional: 'Professional', presencia: 'Presence' },
      sector: {
        distribuidores: 'Distributors',
        fabricantes: 'Manufacturers & Workshops',
        arquitectura: 'Architecture & Interior Design',
        constructoras: 'Construction & Development',
        maquinaria: 'Stone Machinery',
        laboratorios: 'Laboratories & Certification',
        logistica: 'Logistics & Transport'
      },
      hero: {
        eyebrow: 'Global directory',
        distribuidores: {
          eyebrow: 'Commercial network · Global directory', title: 'Natural Stone',
          titleItalic: 'Distributors',
          desc: 'Importers, exporters and distributors of natural stone with global reach. Verified profiles with geographic coverage, materials and direct contact.'
        },
        fabricantes: {
          eyebrow: 'Sawmills, workshops & processors · Global directory', title: 'Manufacturers',
          titleItalic: '& Workshops',
          desc: 'Natural stone processing and manufacturing companies. Full production capacity, technology and technical profiles.'
        },
        arquitectura: {
          eyebrow: 'Design, projects & specification · Global directory', title: 'Architecture',
          titleItalic: '& Interior Design',
          desc: 'Architecture and interior design studios specialised in natural stone. Reference projects and specified materials.'
        },
        constructoras: {
          eyebrow: 'Civil works, building & development · Global directory', title: 'Construction',
          titleItalic: '& Development',
          desc: 'Construction and real estate development companies working with natural stone in residential and civil projects.'
        },
        maquinaria: {
          eyebrow: 'Industrial equipment & technology · Global directory', title: 'Stone',
          titleItalic: 'Machinery',
          desc: 'Manufacturers and distributors of machinery, tools and technology for natural stone extraction and processing.'
        },
        laboratorios: {
          eyebrow: 'Testing, certification & quality control · Global directory', title: 'Laboratories',
          titleItalic: '& Certification',
          desc: 'Specialised laboratories for testing, analysis and certification of natural stone. EN, ASTM and international standards.'
        },
        logistica: {
          eyebrow: 'Transport, customs & warehousing · Global directory', title: 'Logistics',
          titleItalic: '& Transport',
          desc: 'Logistics operators, freight forwarders and transport companies specialised in natural stone. International coverage and customs management.'
        },
        canteras: {
          eyebrow: 'Lapidis · Global directory', title: 'World',
          titleItalic: 'Quarry Directory',
          desc: 'Global directory of natural stone quarries. Explore production, materials, location and full technical profile of each deposit.'
        },
        materiales: {
          eyebrow: 'Lapidis · Technical directory', title: 'Natural Stone',
          titleItalic: 'Materials',
          desc: 'Complete technical data sheets for natural stone and surface materials. Properties, finishes, formats, origin and reference projects.'
        },
        proveedores: {
          eyebrow: 'Lapidis · Trade directory', title: 'Providers',
          titleItalic: '& Distributors',
          desc: 'Verified natural stone industry companies. Elite and Professional profiles include full data sheet, materials, certifications and direct contact.'
        }
      },
      mapa: {
        titulo: 'World Quarry Map', subtitulo: 'World directory',
        buscar: 'Search quarry or material', placeholderMapa: 'Carrara, Granite, White...',
        limpiar: '✕',
        filtros: { tipoPiedra: 'Stone type', color: 'Primary colour', pais: 'Country of origin', relevancia: 'Historical relevance', limpiar: 'Clear' },
        canteras: 'quarries', enDirectorio: 'in the directory'
      },
      state: {
        cargando: 'Loading...', cargandoFicha: 'Loading profile…',
        sinResultados: 'No results', sinResultadosSub: 'Try different filters or search terms',
        error: 'Error loading data', errorSub: 'Please try again in a moment',
        noEncontrado: 'Not found', noEncontradoSub: 'This profile does not exist or has been removed'
      },
      cta: {
        publicarEmpresa: 'List your company', explorarDirectorio: 'Explore directory',
        verTodos: 'View all', verMas: 'View more', registro: 'Create account',
        upgrade: 'Upgrade plan', contactar: 'Contact', verFicha: 'View full profile'
      },
      registro: {
        titulo: 'List your company', subtitulo: 'Global visibility for your natural stone business',
        nombre: 'Company name', email: 'Contact email', tipo: 'Company type',
        pais: 'Country', ciudad: 'City', descripcion: 'Description', website: 'Website',
        enviar: 'Submit', enviando: 'Sending...',
        exito: 'Request received. We will contact you within 24 h.',
        error: 'Failed to send. Please try again.'
      },
      footer: {
        tagline: 'The global reference platform for the natural stone industry.',
        directorio: 'Directory', empresa: 'Company', legal: 'Legal notice',
        privacidad: 'Privacy', contacto: 'Contact', nosotros: 'About WSH',
        copyright: '© 2026 World Stone Hub. All rights reserved.'
      },
      ad: { label: 'Advertisement', placeholder: 'Advertising space available', cta: 'Advertise on WSH' },
      lang: { es: 'Español', en: 'English', cambiar: 'Change language' }
    }
  };

  /* ── Configuration ── */
  var cfg          = window.WSH_i18n_config || {};
  var DEFAULT_LANG = cfg.defaultLang || 'es';
  var SUPPORTED    = ['es', 'en'];
  var STORAGE_KEY  = 'wsh_lang';

  /* ── Internal state ── */
  var _lang = DEFAULT_LANG;
  var _data = LANGS[DEFAULT_LANG];

  /* ── Resolve dot-notation key ── */
  function _get(obj, key) {
    if (!key) return undefined;
    var parts = key.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  /* ── Translate a key ── */
  function t(key, fallback) {
    var val = _get(_data, key);
    if (val !== undefined && val !== null && val !== '') return String(val);
    if (fallback !== undefined) return fallback;
    return key;
  }

  /* ── Apply all data-i18n* attributes in a root element ── */
  function _applyIn(root) {
    root = root || document;

    var els = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], key = el.getAttribute('data-i18n'), val = t(key);
      if (val !== key) el.textContent = val;
    }

    var htmlEls = root.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var hel = htmlEls[j], hkey = hel.getAttribute('data-i18n-html'), hval = t(hkey);
      if (hval !== hkey) hel.innerHTML = hval;
    }

    var attrEls = root.querySelectorAll('[data-i18n-attr]');
    for (var k = 0; k < attrEls.length; k++) {
      var ael = attrEls[k], pairs = ael.getAttribute('data-i18n-attr').split(',');
      for (var p = 0; p < pairs.length; p++) {
        var pair = pairs[p].trim().split(':');
        if (pair.length < 2) continue;
        var attr = pair[0].trim(), akey = pair.slice(1).join(':').trim(), aval = t(akey);
        if (aval !== akey) ael.setAttribute(attr, aval);
      }
    }
  }

  /* ── Sync lang-btn active states ── */
  function _syncSelector(lang) {
    var btns = document.querySelectorAll('.lang-btn[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i], active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    }
  }

  /* ── Public: set language ── */
  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    _lang = lang;
    _data = LANGS[lang];
    document.documentElement.setAttribute('lang', lang);
    _applyIn(document);
    _syncSelector(lang);
    try {
      document.dispatchEvent(new CustomEvent('wsh:langchange', {
        detail: { lang: lang }, bubbles: false
      }));
    } catch (e) {}
  }

  /* ── Public: translate a freshly-inserted DOM fragment ── */
  function applyTo(rootEl) { _applyIn(rootEl); }

  /* ── Public: current language ── */
  function getLang() { return _lang; }

  /* ── Click delegation for lang buttons ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.lang-btn[data-lang]');
    if (!btn) return;
    var lang = btn.getAttribute('data-lang');
    if (lang && lang !== _lang) setLang(lang);
  });

  /* ── Boot ── */
  function init() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var browser = ((navigator.language || '').slice(0, 2) || '').toLowerCase();
    var lang = (stored && SUPPORTED.indexOf(stored) !== -1) ? stored
             : (SUPPORTED.indexOf(browser) !== -1 ? browser : DEFAULT_LANG);
    setLang(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API ── */
  window.WSH_i18n = { t: t, setLang: setLang, getLang: getLang, applyTo: applyTo, init: init };

}(window));
