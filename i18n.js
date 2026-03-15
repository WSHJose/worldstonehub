/**
 * WSH i18n — Internationalisation engine (inline bundle)
 * World Stone Hub · v1.2
 *
 * Translations are bundled inline — works on file://, GitHub Pages, any server.
 * No fetch, no CORS issues, no build step.
 *
 * ── QUICK START ─────────────────────────────────────────────────────────────
 * 1. <script src="i18n.js"></script>  (before </body>)
 * 2. <element data-i18n="key.path">Texto</element>
 * 3. <input data-i18n-attr="placeholder:key.path">
 * 4. WSH_i18n.setLang('en')  or  WSH_i18n.t('nav.inicio')
 *
 * ── LANG SELECTOR HTML (after </ul> in nav) ──────────────────────────────────
 *   <div class="lang-switcher" role="group" aria-label="Idioma / Language">
 *     <button class="lang-btn" data-lang="es" aria-pressed="true">ES</button>
 *     <span class="lang-sep" aria-hidden="true"></span>
 *     <button class="lang-btn" data-lang="en" aria-pressed="false">EN</button>
 *   </div>
 *
 * ── LANG SELECTOR CSS ────────────────────────────────────────────────────────
 *   .lang-switcher{display:flex;align-items:center;gap:0;margin-left:16px;}
 *   .lang-btn{font-family:'DM Mono',monospace;font-size:10px;font-weight:400;
 *     letter-spacing:.14em;text-transform:uppercase;color:#8a8784;background:none;
 *     border:none;padding:5px 7px;cursor:pointer;transition:color .2s;line-height:1;border-radius:2px;}
 *   .lang-btn:hover{color:#1a1917;} .lang-btn.active{color:#A67C52;}
 *   .lang-btn.active::after{content:'';display:block;height:1px;background:#A67C52;margin-top:2px;opacity:.6;}
 *   .lang-sep{width:1px;height:10px;background:#c8c5bf;opacity:.45;flex-shrink:0;}
 *   @media(max-width:900px){.lang-switcher{display:none;}}
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function (window) {
  'use strict';

  /* ── Bundled translations ─────────────────────────────────────────────────── */
  var LANGS = {

    /* ════════════════════════════════ ESPAÑOL ════════════════════════════════ */
    es: {
      nav: {
        inicio:'Inicio', canteras:'Canteras', materiales:'Materiales',
        directorio:'Directorio', publicar:'Publicar', acceso:'Acceso',
        miPanel:'Mi Panel', mapaAriaLabel:'Mapa Mundial de Canteras',
        todosProveedores:'Todos los proveedores', distribuidores:'Distribuidores',
        fabricantes:'Fabricantes', arquitectura:'Arquitectura',
        constructoras:'Constructoras', maquinaria:'Maquinaria',
        laboratorios:'Laboratorios', logistica:'Logística'
      },
      search: {
        placeholder:'Buscar canteras, materiales, empresas...',
        placeholderCanteras:'Buscar cantera, país, material…',
        placeholderMateriales:'Buscar material, color, país, acabado…',
        placeholderProveedores:'Buscar empresa, país, material…',
        placeholderMapa:'Buscar cantera o material',
        resultados:'resultados', resultado:'resultado',
        sinResultados:'Sin resultados para esta búsqueda', limpiar:'Limpiar'
      },
      filter: {
        label:'Filtrar por', todos:'Todos', tipo:'Tipo', pais:'País',
        material:'Material', plan:'Plan', limpiar:'Limpiar filtros',
        aplicar:'Aplicar', activos:'Filtros activos', sector:'Sector',
        categoria:'Categoría', color:'Color'
      },
      stats: {
        empresas:'Empresas', canteras:'Canteras', materiales:'Materiales',
        paises:'Países', elite:'Elite', verificadas:'Verificadas',
        categorias:'Categorías', colores:'Colores'
      },
      card: {
        verFicha:'Ver ficha', verPerfil:'Ver perfil', website:'Sitio web',
        contactar:'Contactar', fundada:'Fundada', empleados:'Empleados',
        verificado:'Verificado', materiales:'Materiales', sectores:'Sectores', mas:'más',
        verPerfilCompleto:'Ver perfil completo →'
      },
      plan: { elite:'Elite', profesional:'Profesional', presencia:'Presencia' },

      /* ── Sector pages ── */
      sector: {
        introTitle:'Empresas verificadas en esta categoría',
        loading:'Cargando directorio',
        navTitle:'Explorar otros actores del sector',
        errorCarga:'Error cargando el directorio. Por favor, recarga la página.',
        nav: {
          distribuidores:'🚚 Distribuidores',
          fabricantes:'🏭 Fabricantes',
          arquitectura:'📐 Arquitectura',
          constructoras:'🏗️ Constructoras',
          maquinaria:'⚙️ Maquinaria',
          laboratorios:'🔬 Laboratorios',
          logistica:'🌍 Logística',
          todos:'◈ Todos los proveedores'
        },
        empty: {
          title:'Sé el', titleEm:'primero', desc:'en publicar aquí',
          body:'Aún no hay empresas de este sector en el directorio. Consigue visibilidad internacional frente a compradores, arquitectos y constructoras.',
          cta:'Publicar mi empresa →'
        },
        distribuidores: {
          eyebrow:'Distribución global · Directorio verificado',
          title:'Distribuidores', titleEm:'de Piedra Natural',
          desc:'Empresas especializadas en la distribución de piedra natural y artificial que conectan productores con arquitectos, interioristas y constructoras en todo el mundo.'
        },
        fabricantes: {
          eyebrow:'Serrerías, talleres y transformadores · Directorio global',
          title:'Fabricantes', titleEm:'y Talleres',
          desc:'Empresas de transformación y fabricación de piedra natural. Serrerías, talleres de corte y empresas de procesado con capacidad industrial.'
        },
        arquitectura: {
          eyebrow:'Diseño, proyectos y especificación · Directorio global',
          title:'Arquitectura', titleEm:'e Interiorismo',
          desc:'Estudios de arquitectura e interiorismo especializados en piedra natural. Proyectos de referencia, materiales especificados y perfil técnico completo.'
        },
        constructoras: {
          eyebrow:'Obra civil, edificación y promoción · Directorio global',
          title:'Constructoras', titleEm:'y Promotoras',
          desc:'Empresas constructoras y promotoras que trabajan con piedra natural en proyectos residenciales, hoteleros y de obra civil.'
        },
        maquinaria: {
          eyebrow:'Equipamiento y tecnología industrial · Directorio global',
          title:'Maquinaria', titleEm:'para Piedra',
          desc:'Fabricantes y distribuidores de maquinaria, herramientas y tecnología para la extracción, corte y transformación de piedra natural.'
        },
        laboratorios: {
          eyebrow:'Análisis, certificación y control de calidad · Directorio global',
          title:'Laboratorios', titleEm:'y Certificación',
          desc:'Laboratorios especializados en ensayos, análisis y certificación de piedra natural. Normas UNE, EN y estándares internacionales.'
        },
        logistica: {
          eyebrow:'Transporte, aduanas y almacenaje · Directorio global',
          title:'Logística', titleEm:'y Transporte',
          desc:'Operadores logísticos, transitarios y empresas de transporte especializados en piedra natural. Cobertura internacional y gestión aduanera.'
        }
      },

      /* ── Hero sections (lapidis pages) ── */
      hero: {
        eyebrow:'Directorio global',
        canteras: {
          eyebrow:'Lapidis · Directorio global',
          title:'Canteras', titleItalic:'del Mundo',
          desc:'Directorio global de canteras de piedra natural. Explora producción, materiales, localización y ficha técnica completa de cada yacimiento.'
        },
        materiales: {
          eyebrow:'Lapidis · Directorio técnico',
          title:'Materiales de', titleItalic:'Piedra Natural',
          desc:'Fichas técnicas completas de materiales de piedra natural y superficies. Propiedades, acabados, formatos, origen y proyectos de referencia.'
        },
        proveedores: {
          eyebrow:'Lapidis · Directorio comercial',
          title:'Proveedores', titleItalic:'y Distribuidores',
          desc:'Empresas del sector de la piedra natural con perfil verificado. Los perfiles Elite y Profesional incluyen ficha completa, materiales, certificaciones y contacto directo.'
        }
      },

      /* ── Canteras page specific ── */
      canteras: {
        loading:'Cargando canteras',
        filter: {
          continente:'Continente', tipo:'Tipo', estado:'Estado'
        },
        stats: { continentes:'Continentes', tipos:'Tipos' },
        continentes: {
          europa:'Europa', asia:'Asia', america:'América',
          africa:'África', oceania:'Oceanía'
        },
        tipos: {
          marmol:'Mármol', granito:'Granito', cuarcita:'Cuarcita',
          travertino:'Travertino', caliza:'Caliza', pizarra:'Pizarra', onix:'Ónix'
        },
        estados: { activa:'Activa', selectiva:'Selectiva', historica:'Histórica' }
      },

      /* ── Mapa ── */
      mapa: {
        titulo:'Mapa Mundial de Canteras', subtitulo:'Directorio mundial',
        buscar:'Buscar cantera o material', placeholderMapa:'Carrara, Granito, Blanco...',
        limpiar:'✕',
        filtros: {
          tipoPiedra:'Tipo de piedra', color:'Color predominante',
          pais:'País de origen', relevancia:'Relevancia histórica', limpiar:'Limpiar'
        },
        canteras:'canteras', enDirectorio:'en el directorio'
      },

      /* ── State messages ── */
      state: {
        cargando:'Cargando...', cargandoFicha:'Cargando ficha…',
        sinResultados:'No hay resultados',
        sinResultadosSub:'Prueba con otros filtros o términos de búsqueda',
        error:'Error al cargar datos', errorSub:'Inténtalo de nuevo en unos momentos',
        noEncontrado:'No encontrado',
        noEncontradoSub:'Esta ficha no existe o ha sido eliminada'
      },

      /* ── CTAs ── */
      cta: {
        publicarEmpresa:'Publicar mi empresa',
        explorarDirectorio:'Explorar directorio',
        verTodos:'Ver todos', verMas:'Ver más',
        registro:'Crear cuenta', upgrade:'Mejorar plan',
        contactar:'Contactar', verFicha:'Ver ficha completa'
      },

      /* ── Registro form ── */
      registro: {
        titulo:'Publica tu empresa',
        subtitulo:'Visibilidad global para tu negocio en piedra natural',
        nombre:'Nombre de empresa', email:'Email de contacto',
        tipo:'Tipo de empresa', pais:'País', ciudad:'Ciudad',
        descripcion:'Descripción', website:'Sitio web',
        enviar:'Enviar solicitud', enviando:'Enviando...',
        exito:'Solicitud recibida. Te contactaremos en 24 h.',
        error:'Error al enviar. Inténtalo de nuevo.'
      },

      /* ── Ad slots ── */
      ad: {
        label:'Publicidad',
        placeholder:'Espacio publicitario',
        cta:'Anunciarse en WSH'
      },

      /* ── Footer ── */
      footer: {
        tagline:'El portal internacional de referencia para todos los profesionales del sector de la piedra natural y artificial.',
        col: {
          directorio:'Directorio', sectores:'Sectores', portal:'Portal'
        },
        links: {
          canteras:'Canteras del mundo', mapa:'Mapa de canteras',
          materiales:'Materiales', directorio:'Directorio',
          publicar:'Publicar mi empresa', sobre:'Sobre World Stone Hub',
          contacto:'Contacto', blog:'Blog del sector', legal:'Aviso legal'
        },
        copyright:'© 2025 World Stone Hub · Where Stone Meets The World',
        avisoLink:'Aviso Legal & Privacidad'
      },

      /* ── Nosotros page ── */
      nosotros: {
        hero: {
          eyebrow:'Sobre el proyecto',
          title:'Nacimos del',
          titleEm:'sector',
          desc:'World Stone Hub es el directorio B2B internacional de referencia para la industria de la piedra natural y artificial. Un espacio donde canteras, distribuidores, fabricantes y profesionales de todo el mundo se encuentran, conectan y hacen negocio.'
        },
        stats: {
          paises:'Países representados', sectores:'Sectores cubiertos',
          directorio:'Directorio verificado', fundacion:'Año de fundación'
        },
        mision: {
          label:'Nuestra misión',
          title:'Conectar el mundo\nde la ',
          titleEm:'piedra natural',
          p1:'La industria de la piedra natural mueve miles de millones de euros al año y da trabajo a millones de personas en todo el mundo. Sin embargo, sigue siendo un sector atomizado, donde encontrar el proveedor adecuado depende en muchos casos del contacto personal o de la asistencia a ferias internacionales.',
          p2:'World Stone Hub nace para cambiar eso. Somos el punto de encuentro digital donde cualquier profesional del sector — desde una pequeña cantera en Turquía hasta un gran distribuidor en Estados Unidos — puede hacerse visible, encontrar socios y hacer crecer su negocio.',
          p3prefix:'Nuestra misión es simple: ',
          p3strong:'hacer que el comercio global de piedra natural sea más accesible, más transparente y más eficiente',
          accent:'Misión Global',
          year:'EST. 2025 · PETRER, ESPAÑA'
        },
        valores: {
          label:'Lo que nos guía',
          title:'Nuestros ',
          titleEm:'valores',
          rigor: {
            name:'Rigor',
            desc:'Solo publicamos empresas verificadas. Cada perfil es revisado manualmente antes de aparecer en el directorio. La calidad de los datos es nuestra principal responsabilidad hacia los usuarios.'
          },
          acceso: {
            name:'Acceso',
            desc:'Cualquier empresa del sector, independientemente de su tamaño o país de origen, merece tener presencia internacional. Hemos diseñado planes accesibles para que nadie quede fuera.'
          },
          comunidad: {
            name:'Comunidad',
            desc:'WSH no es solo un directorio. Es una comunidad donde los profesionales del sector se encuentran, comparten conocimiento y construyen relaciones comerciales duraderas a nivel global.'
          }
        },
        origen: {
          label:'El origen',
          titleEm:'sector',
          p1:'World Stone Hub nació en Petrer, Alicante — en el corazón del corredor industrial del mármol y la piedra del sureste español. La proximidad al sector, el conocimiento de sus dinámicas comerciales y la observación directa de sus ineficiencias en la distribución internacional fueron el punto de partida.',
          p2:'El proyecto arrancó con una pregunta simple: ¿por qué no existe todavía un directorio B2B serio, global y bien construido para la industria de la piedra natural? La respuesta era que alguien tenía que hacerlo. Y que hacerlo bien requería entender el sector desde dentro, no desde fuera.',
          p3prefix:'WSH es un proyecto independiente, construido con rigor y sin inversores externos. Cada decisión de diseño, cada línea de código y cada perfil publicado responde a una misma convicción: ',
          p3strong:'este sector merece una infraestructura digital a su altura',
          location:'Petrer, Alicante · España · Est. 2025'
        },
        cta: {
          titlePrefix:'¿Listo para ser parte\nde ',
          desc:'Publica tu empresa y llega a compradores de todo el mundo.',
          btn1:'Publicar mi empresa',
          btn2:'Contactar'
        }
      },

      /* ── Contacto page ── */
      contacto: {
        hero: {
          eyebrow:'Escríbenos',
          title:'Hablemos',
          sub:' · &lt; 24h respuesta'
        },
        form: {
          label:'Formulario de contacto',
          title:'¿En qué podemos',
          titleEm:'ayudarte?',
          nombre:'Nombre *', nombrePh:'Tu nombre completo',
          email:'Email *', emailPh:'tu@empresa.com',
          empresa:'Empresa', empresaPh:'Nombre de tu empresa',
          asunto:'Asunto *', asuntoPh:'Selecciona un asunto',
          mensaje:'Mensaje *', mensajePh:'Cuéntanos en qué podemos ayudarte...',
          enviar:'Enviar mensaje',
          opPublicar:'Quiero publicar mi empresa',
          opInfo:'Información sobre planes',
          opPrensa:'Prensa y medios',
          opColaboracion:'Colaboración o partnership',
          opSoporte:'Soporte técnico',
          opOtro:'Otro'
        },
        success: {
          title:'Mensaje ',
          titleEm:'recibido',
          desc:'Gracias por escribirnos. Revisaremos tu mensaje y te responderemos en menos de 24 horas en días laborables.'
        },
        info: {
          emailLabel:'Email directo',
          emailDetail:'Bandeja revisada cada día laborable. Para consultas urgentes sobre publicación de empresa usa el formulario con asunto "Quiero publicar mi empresa".',
          responseLabel:'Tiempo de respuesta',
          responseVal:'Menos de 24 horas en días laborables.',
          ubicacionLabel:'Ubicación',
          publicarLabel:'Quiero publicar mi empresa',
          publicarDesc:'Si quieres publicar tu empresa en el directorio, puedes empezar directamente desde el formulario de registro o escribirnos para que te guiemos.',
          publicarLink:'Ver planes y precios →'
        },
        faq: {
          label:'Preguntas frecuentes',
          title:'Lo que más nos ',
          titleEm:'preguntan',
          q1:'¿Cuánto tiempo tarda en publicarse mi empresa?',
          a1:'Una vez completado el registro y activado el pago, tu perfil es revisado manualmente y publicado en un plazo de 24-48 horas laborables. Te enviamos un email de confirmación cuando esté activo.',
          q2:'¿Puedo cambiar de plan más adelante?',
          a2:'Sí. Puedes hacer upgrade o downgrade en cualquier momento desde tu panel de control. El cambio se aplica en el siguiente ciclo de facturación. Escríbenos si necesitas ayuda con el proceso.',
          q3:'¿En qué idiomas está disponible el portal?',
          a3:'Actualmente el portal está en español e inglés. Las versiones en italiano y portugués están en desarrollo y estarán disponibles próximamente.',
          q4:'¿Cómo puedo proponer una colaboración o partnership?',
          a4:'Estamos abiertos a colaboraciones con asociaciones del sector, medios especializados, ferias y distribuidores de contenido B2B. Usa el formulario de contacto con el asunto "Colaboración o partnership" y cuéntanos tu propuesta.'
        }
      },

      /* ── Lang switcher labels ── */
      lang: { es:'Español', en:'English', cambiar:'Cambiar idioma' }
    },

    /* ════════════════════════════════ ENGLISH ════════════════════════════════ */
    en: {
      nav: {
        inicio:'Home', canteras:'Quarries', materiales:'Materials',
        directorio:'Directory', publicar:'List Now', acceso:'Sign In',
        miPanel:'My Panel', mapaAriaLabel:'World Quarry Map',
        todosProveedores:'All providers', distribuidores:'Distributors',
        fabricantes:'Manufacturers', arquitectura:'Architecture',
        constructoras:'Construction', maquinaria:'Machinery',
        laboratorios:'Laboratories', logistica:'Logistics'
      },
      search: {
        placeholder:'Search quarries, materials, companies...',
        placeholderCanteras:'Search quarry, country, material…',
        placeholderMateriales:'Search material, colour, country, finish…',
        placeholderProveedores:'Search company, country, material…',
        placeholderMapa:'Search quarry or material',
        resultados:'results', resultado:'result',
        sinResultados:'No results for this search', limpiar:'Clear'
      },
      filter: {
        label:'Filter by', todos:'All', tipo:'Type', pais:'Country',
        material:'Material', plan:'Plan', limpiar:'Clear filters',
        aplicar:'Apply', activos:'Active filters', sector:'Sector',
        categoria:'Category', color:'Colour'
      },
      stats: {
        empresas:'Companies', canteras:'Quarries', materiales:'Materials',
        paises:'Countries', elite:'Elite', verificadas:'Verified',
        categorias:'Categories', colores:'Colours'
      },
      card: {
        verFicha:'View profile', verPerfil:'View profile', website:'Website',
        contactar:'Contact', fundada:'Founded', empleados:'Employees',
        verificado:'Verified', materiales:'Materials', sectores:'Sectors', mas:'more',
        verPerfilCompleto:'View full profile →'
      },
      plan: { elite:'Elite', profesional:'Professional', presencia:'Presence' },

      /* ── Sector pages ── */
      sector: {
        introTitle:'Verified companies in this category',
        loading:'Loading directory',
        navTitle:'Explore other industry players',
        errorCarga:'Error loading the directory. Please reload the page.',
        nav: {
          distribuidores:'🚚 Distributors',
          fabricantes:'🏭 Manufacturers',
          arquitectura:'📐 Architecture',
          constructoras:'🏗️ Construction',
          maquinaria:'⚙️ Machinery',
          laboratorios:'🔬 Laboratories',
          logistica:'🌍 Logistics',
          todos:'◈ All providers'
        },
        empty: {
          title:'Be the', titleEm:'first', desc:'to list here',
          body:'No companies in this sector yet. Get international visibility in front of buyers, architects and construction firms.',
          cta:'List my company →'
        },
        distribuidores: {
          eyebrow:'Global distribution · Verified directory',
          title:'Natural Stone', titleEm:'Distributors',
          desc:'Companies specialised in distributing natural and engineered stone, connecting producers with architects, interior designers and construction firms worldwide.'
        },
        fabricantes: {
          eyebrow:'Sawmills, workshops & processors · Global directory',
          title:'Manufacturers', titleEm:'& Workshops',
          desc:'Natural stone processing and manufacturing companies. Sawmills, cutting workshops and processing firms with industrial capacity.'
        },
        arquitectura: {
          eyebrow:'Design, projects & specification · Global directory',
          title:'Architecture', titleEm:'& Interior Design',
          desc:'Architecture and interior design studios specialised in natural stone. Reference projects, specified materials and full technical profiles.'
        },
        constructoras: {
          eyebrow:'Civil works, building & development · Global directory',
          title:'Construction', titleEm:'& Development',
          desc:'Construction and real estate development companies working with natural stone in residential, hospitality and civil engineering projects.'
        },
        maquinaria: {
          eyebrow:'Industrial equipment & technology · Global directory',
          title:'Stone', titleEm:'Machinery',
          desc:'Manufacturers and distributors of machinery, tools and technology for natural stone extraction, cutting and processing.'
        },
        laboratorios: {
          eyebrow:'Testing, certification & quality control · Global directory',
          title:'Laboratories', titleEm:'& Certification',
          desc:'Specialised laboratories for testing, analysis and certification of natural stone. EN, ASTM and international standards.'
        },
        logistica: {
          eyebrow:'Transport, customs & warehousing · Global directory',
          title:'Logistics', titleEm:'& Transport',
          desc:'Logistics operators, freight forwarders and transport companies specialised in natural stone. International coverage and customs management.'
        }
      },

      /* ── Hero sections ── */
      hero: {
        eyebrow:'Global directory',
        canteras: {
          eyebrow:'Lapidis · Global directory',
          title:'World', titleItalic:'Quarry Directory',
          desc:'Global directory of natural stone quarries. Explore production, materials, location and full technical profile of each deposit.'
        },
        materiales: {
          eyebrow:'Lapidis · Technical directory',
          title:'Natural Stone', titleItalic:'Materials',
          desc:'Complete technical data sheets for natural stone and surface materials. Properties, finishes, formats, origin and reference projects.'
        },
        proveedores: {
          eyebrow:'Lapidis · Trade directory',
          title:'Providers', titleItalic:'& Distributors',
          desc:'Verified natural stone industry companies. Elite and Professional profiles include full data sheet, materials, certifications and direct contact.'
        }
      },

      /* ── Canteras page specific ── */
      canteras: {
        loading:'Loading quarries',
        filter: { continente:'Continent', tipo:'Type', estado:'Status' },
        stats: { continentes:'Continents', tipos:'Types' },
        continentes: {
          europa:'Europe', asia:'Asia', america:'Americas',
          africa:'Africa', oceania:'Oceania'
        },
        tipos: {
          marmol:'Marble', granito:'Granite', cuarcita:'Quartzite',
          travertino:'Travertine', caliza:'Limestone', pizarra:'Slate', onix:'Onyx'
        },
        estados: { activa:'Active', selectiva:'Selective', historica:'Historic' }
      },

      /* ── Mapa ── */
      mapa: {
        titulo:'World Quarry Map', subtitulo:'World directory',
        buscar:'Search quarry or material', placeholderMapa:'Carrara, Granite, White...',
        limpiar:'✕',
        filtros: {
          tipoPiedra:'Stone type', color:'Primary colour',
          pais:'Country of origin', relevancia:'Historical relevance', limpiar:'Clear'
        },
        canteras:'quarries', enDirectorio:'in the directory'
      },

      /* ── State messages ── */
      state: {
        cargando:'Loading...', cargandoFicha:'Loading profile…',
        sinResultados:'No results',
        sinResultadosSub:'Try different filters or search terms',
        error:'Error loading data', errorSub:'Please try again in a moment',
        noEncontrado:'Not found',
        noEncontradoSub:'This profile does not exist or has been removed'
      },

      /* ── CTAs ── */
      cta: {
        publicarEmpresa:'List your company',
        explorarDirectorio:'Explore directory',
        verTodos:'View all', verMas:'View more',
        registro:'Create account', upgrade:'Upgrade plan',
        contactar:'Contact', verFicha:'View full profile'
      },

      /* ── Registro form ── */
      registro: {
        titulo:'List your company',
        subtitulo:'Global visibility for your natural stone business',
        nombre:'Company name', email:'Contact email',
        tipo:'Company type', pais:'Country', ciudad:'City',
        descripcion:'Description', website:'Website',
        enviar:'Submit', enviando:'Sending...',
        exito:'Request received. We will contact you within 24 h.',
        error:'Failed to send. Please try again.'
      },

      /* ── Ad slots ── */
      ad: {
        label:'Advertisement',
        placeholder:'Advertising space',
        cta:'Advertise on WSH'
      },

      /* ── Footer ── */
      footer: {
        tagline:'The global reference platform for all professionals in the natural and engineered stone industry.',
        col: {
          directorio:'Directory', sectores:'Sectors', portal:'Company'
        },
        links: {
          canteras:'World quarry directory', mapa:'Quarry map',
          materiales:'Materials', directorio:'Directory',
          publicar:'List your company', sobre:'About World Stone Hub',
          contacto:'Contact', blog:'Industry blog', legal:'Legal notice'
        },
        copyright:'© 2025 World Stone Hub · Where Stone Meets The World',
        avisoLink:'Legal Notice & Privacy'
      },

      /* ── Nosotros page ── */
      nosotros: {
        hero: {
          eyebrow:'About the project',
          title:'Built from within',
          titleEm:'the industry',
          desc:'World Stone Hub is the international B2B reference directory for the natural and engineered stone industry. A space where quarries, distributors, manufacturers and professionals from around the world meet, connect and do business.'
        },
        stats: {
          paises:'Countries represented', sectores:'Sectors covered',
          directorio:'Verified directory', fundacion:'Year founded'
        },
        mision: {
          label:'Our mission',
          title:'Connecting the world\nof ',
          titleEm:'natural stone',
          p1:'The natural stone industry moves billions of euros a year and employs millions of people worldwide. Yet it remains a fragmented sector, where finding the right supplier often depends on personal contacts or attending international trade fairs.',
          p2:'World Stone Hub was built to change that. We are the digital meeting point where any industry professional — from a small quarry in Turkey to a major distributor in the United States — can become visible, find partners and grow their business.',
          p3prefix:'Our mission is simple: ',
          p3strong:'make global trade in natural stone more accessible, more transparent and more efficient',
          accent:'Global Mission',
          year:'EST. 2025 · PETRER, SPAIN'
        },
        valores: {
          label:'What guides us',
          title:'Our ',
          titleEm:'values',
          rigor: {
            name:'Rigour',
            desc:'We only publish verified companies. Every profile is manually reviewed before appearing in the directory. Data quality is our primary responsibility to users.'
          },
          acceso: {
            name:'Access',
            desc:'Every company in the sector, regardless of size or country of origin, deserves international visibility. We have designed accessible plans so that no one is left out.'
          },
          comunidad: {
            name:'Community',
            desc:'WSH is not just a directory. It is a community where industry professionals meet, share knowledge and build lasting business relationships on a global scale.'
          }
        },
        origen: {
          label:'The origin',
          titleEm:'industry',
          p1:'World Stone Hub was born in Petrer, Alicante — in the heart of the marble and stone industrial corridor of south-east Spain. Proximity to the sector, knowledge of its commercial dynamics and direct observation of its inefficiencies in international distribution were the starting point.',
          p2:'The project started with a simple question: why doesn\'t a serious, global, well-built B2B directory for the natural stone industry already exist? The answer was that someone had to do it. And doing it well required understanding the sector from the inside, not from the outside.',
          p3prefix:'WSH is an independent project, built with rigour and without external investors. Every design decision, every line of code and every published profile responds to a single conviction: ',
          p3strong:'this industry deserves a digital infrastructure worthy of it',
          location:'Petrer, Alicante · Spain · Est. 2025'
        },
        cta: {
          titlePrefix:'Ready to be part\nof ',
          desc:'List your company and reach buyers from around the world.',
          btn1:'List my company',
          btn2:'Contact us'
        }
      },

      /* ── Contacto page ── */
      contacto: {
        hero: {
          eyebrow:'Write to us',
          title:'Let\'s talk',
          sub:' · &lt; 24h response'
        },
        form: {
          label:'Contact form',
          title:'How can we',
          titleEm:'help you?',
          nombre:'Name *', nombrePh:'Your full name',
          email:'Email *', emailPh:'you@company.com',
          empresa:'Company', empresaPh:'Your company name',
          asunto:'Subject *', asuntoPh:'Select a subject',
          mensaje:'Message *', mensajePh:'Tell us how we can help you...',
          enviar:'Send message',
          opPublicar:'I want to list my company',
          opInfo:'Information about plans',
          opPrensa:'Press & media',
          opColaboracion:'Collaboration or partnership',
          opSoporte:'Technical support',
          opOtro:'Other'
        },
        success: {
          title:'Message ',
          titleEm:'received',
          desc:'Thank you for writing to us. We will review your message and reply within 24 hours on working days.'
        },
        info: {
          emailLabel:'Direct email',
          emailDetail:'Inbox reviewed every working day. For urgent company listing queries use the form with subject "I want to list my company".',
          responseLabel:'Response time',
          responseVal:'Less than 24 hours on working days.',
          ubicacionLabel:'Location',
          publicarLabel:'I want to list my company',
          publicarDesc:'If you want to list your company in the directory, you can start directly from the registration form or write to us for guidance.',
          publicarLink:'View plans and pricing →'
        },
        faq: {
          label:'Frequently asked questions',
          title:'What people ',
          titleEm:'ask us most',
          q1:'How long does it take to publish my company?',
          a1:'Once registration is complete and payment is activated, your profile is manually reviewed and published within 24-48 working hours. We send you a confirmation email when it is live.',
          q2:'Can I change my plan later?',
          a2:'Yes. You can upgrade or downgrade at any time from your control panel. The change applies on the next billing cycle. Write to us if you need help with the process.',
          q3:'What languages is the portal available in?',
          a3:'The portal is currently available in Spanish and English. Italian and Portuguese versions are in development and will be available soon.',
          q4:'How can I propose a collaboration or partnership?',
          a4:'We are open to collaborations with industry associations, specialist media, trade fairs and B2B content distributors. Use the contact form with subject "Collaboration or partnership" and tell us your proposal.'
        }
      },

      /* ── Lang switcher labels ── */
      lang: { es:'Español', en:'English', cambiar:'Change language' }
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
    if (val !== undefined && val !== null && val !== '' && typeof val !== 'object') return String(val);
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
