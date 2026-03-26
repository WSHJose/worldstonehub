(function() {
  var SB_URL = 'https://whcptmdapnavcxcszwwk.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY3B0bWRhcG5hdmN4Y3N6d3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTk4MTAsImV4cCI6MjA4ODY3NTgxMH0.BVDpghOAPrMnt-IsVtCdgLR1OnOP_83UmeU8bfUena8';

  var PLAN_ORDER  = { 'elite': 0, 'profesional': 1, 'presencia': 2, 'free': 3 };
  var PLAN_COLORS = {
    'elite':       { hex: '#c9a84c', rgb: '201,168,76' },
    'profesional': { hex: '#8090b0', rgb: '128,144,176' },
    'presencia':   { hex: '#6a8060', rgb: '106,128,96' },
    'free':        { hex: '#6a6764', rgb: '106,103,100' }
  };
  var TIER_LABELS = {
    'elite':       { label: 'Elite',       dot: 'elite', desc: '— Presencia editorial completa · 299€/mes' },
    'profesional': { label: 'Profesional', dot: 'pro',   desc: '— Ficha destacada con galeria · 129€/mes' },
    'presencia':   { label: 'Presencia',   dot: 'pres',  desc: '— Ficha verificada y visible · 49€/mes' },
    'free':        { label: 'Directorio',  dot: 'dir',   desc: '— Ficha basica · Gratis' }
  };

  function esc(s) {
    if (!s && s !== 0) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function arr(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

  function getTags(p) {
    var tags = [];
    var te = (p.tipo_empresa || '').toLowerCase();
    arr(p.sector).concat([te]).forEach(function(s) {
      var sl = s.toLowerCase().replace(/[áàä]/g,'a').replace(/[éè]/g,'e');
      if (sl.indexOf('fabric') >= 0) tags.push('fabricante');
      if (sl.indexOf('distrib') >= 0) tags.push('distribuidor');
      if (sl.indexOf('export') >= 0) tags.push('exportador');
      if (sl.indexOf('import') >= 0) tags.push('importador');
    });
    var pais = (p.pais || '').toLowerCase().replace(/ñ/g,'n').replace(/[áà]/g,'a').replace(/[éè]/g,'e');
    if (pais.indexOf('espa') >= 0) tags.push('espana');
    if (pais.indexOf('ital') >= 0) tags.push('italia');
    if (pais.indexOf('india') >= 0) tags.push('india');
    if (pais.indexOf('brasil') >= 0 || pais.indexOf('brazil') >= 0) tags.push('brasil');
    if (pais.indexOf('estados') >= 0 || pais.indexOf('eeuu') >= 0 || pais.indexOf('usa') >= 0) tags.push('eeuu');
    return tags.filter(function(v,i,a){ return a.indexOf(v)===i; }).join(' ');
  }

  function cleanWeb(url) {
    return (url || '').replace(/^https?:\/\//,'').replace(/\/$/,'');
  }

  function buildTierSep(plan) {
    var t = TIER_LABELS[plan] || TIER_LABELS.free;
    return '<div class="tier-sep"><div class="tier-sep-inner">' +
      '<span class="tier-sep-dot ' + t.dot + '"></span>' +
      '<span class="tier-sep-label">' + t.label + '</span>' +
      '<span class="tier-sep-desc">' + t.desc + '</span>' +
      '</div><div class="tier-sep-line"></div></div>';
  }

  function buildElite(p) {
    var acc = PLAN_COLORS.elite;
    var tags = getTags(p);
    var tipos = arr(p.sector).map(function(t){ return '<span class="tipo-tag">' + esc(t) + '</span>'; }).join('');
    var mats  = arr(p.materiales).map(function(m){ return '<span class="mat-tag">' + esc(m) + '</span>'; }).join('');
    var certs = arr(p.certificaciones).map(function(c){ return '<span class="e-cert">' + esc(c) + '</span>'; }).join('');
    var logoText = p.nombre_empresa.split(' ')[0].toUpperCase();
    var webLabel = p.website ? esc(cleanWeb(p.website)) : '';
    var webHtml  = p.website ? '<a href="' + esc(p.website) + '" target="_blank" class="e-web-link" onclick="event.stopPropagation()">' + webLabel + '</a>' : '—';
    var webLink  = p.website ? '<a href="' + esc(p.website) + '" class="e-link" target="_blank" onclick="event.stopPropagation()">' + webLabel + '</a>' : '';
    var logoImg  = p.logo_url
      ? '<img src="' + esc(p.logo_url) + '" alt="' + esc(p.nombre_empresa) + '" style="max-width:120px;max-height:60px;object-fit:contain">'
      : '<div class="e-logo-text" style="color:' + acc.hex + '">' + esc(logoText) + '</div>';
    return '' +
      '<article class="profile-elite" id="' + esc(p.slug) + '" data-slug="' + esc(p.slug) + '" data-tags="' + esc(tags) + '" ' +
        'style="--acc:' + acc.hex + ';--acc-rgb:' + acc.rgb + ';cursor:pointer" ' +
        'onclick="window.open(\'proveedor.html?id=' + esc(p.slug) + '\',\'_blank\')">' +
        '<div class="e-topband">' +
          '<div class="e-topband-accent" style="background:linear-gradient(90deg,' + acc.hex + 'cc,' + acc.hex + '40,transparent)"></div>' +
          '<div class="e-topband-inner">' +
            '<div class="e-plan-badge e-plan-elite">&#9670; ELITE</div>' +
            '<div class="e-topband-name">' + esc(p.nombre_empresa) + '</div>' +
            '<div class="e-topband-tipo">' + tipos + '</div>' +
            (p.verificado ? '<div class="e-verified" style="margin-left:auto">&#9670; Verificado</div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="e-body">' +
          '<aside class="e-sidebar">' +
            '<div class="e-logo-zone">' + logoImg + (p.ano_fundacion ? '<div class="e-logo-year">Est. ' + p.ano_fundacion + '</div>' : '') + '</div>' +
            '<div class="e-meta-block">' +
              '<div class="e-meta-row"><span class="e-meta-k">Sede</span><span class="e-meta-v">' + esc((p.ciudad || '') + (p.pais ? ', ' + p.pais : '')) + '</span></div>' +
              (p.ano_fundacion ? '<div class="e-meta-row"><span class="e-meta-k">Fundación</span><span class="e-meta-v">' + p.ano_fundacion + '</span></div>' : '') +
              (p.num_empleados ? '<div class="e-meta-row"><span class="e-meta-k">Equipo</span><span class="e-meta-v">' + esc(p.num_empleados) + '</span></div>' : '') +
              (p.website ? '<div class="e-meta-row"><span class="e-meta-k">Web</span><span class="e-meta-v">' + webHtml + '</span></div>' : '') +
            '</div>' +
            (certs ? '<div class="e-certs-block"><div class="e-block-lbl">Certificaciones</div><div class="e-certs">' + certs + '</div></div>' : '') +
          '</aside>' +
          '<div class="e-main">' +
            '<div class="e-head">' +
              '<div class="e-eyebrow">' + esc(p.pais || '') + (p.ciudad ? ' · ' + esc(p.ciudad) : '') + '</div>' +
              '<h2 class="e-name">' + esc(p.nombre_empresa) + '</h2>' +
              '<p class="e-tagline">' + esc(p.tipo_empresa || '') + '</p>' +
              (p.descripcion ? '<p class="e-desc">' + esc(p.descripcion) + '</p>' : '') +
            '</div>' +
            (mats ? '<div class="e-mats-block"><div class="e-block-lbl">Materiales comercializados</div><div class="e-mats">' + mats + '</div></div>' : '') +
            '<div class="e-footer">' +
              '<div class="e-links">' + webLink + '</div>' +
              '<span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:' + acc.hex + ';border:1px solid rgba(' + acc.rgb + ',.35);padding:7px 16px">Ver perfil completo →</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function buildPro(p) {
    var acc = PLAN_COLORS.profesional;
    var tags = getTags(p);
    var tipos = arr(p.sector).map(function(t){ return '<span class="tipo-tag">' + esc(t) + '</span>'; }).join('');
    var mats  = arr(p.materiales).map(function(m){ return '<span class="mat-tag">' + esc(m) + '</span>'; }).join('');
    var certs = arr(p.certificaciones).map(function(c){ return '<span class="e-cert">' + esc(c) + '</span>'; }).join('');
    var logoText = p.nombre_empresa.split(' ')[0].toUpperCase();
    var logoImg  = p.logo_url
      ? '<img src="' + esc(p.logo_url) + '" alt="' + esc(p.nombre_empresa) + '" style="max-width:100px;max-height:50px;object-fit:contain;margin-top:8px">'
      : '<div class="p-logo-text" style="color:' + acc.hex + ';margin-top:8px">' + esc(logoText) + '</div>';
    return '' +
      '<article class="profile-pro" id="' + esc(p.slug) + '" data-slug="' + esc(p.slug) + '" data-tags="' + esc(tags) + '" ' +
        'style="--acc:' + acc.hex + ';--acc-rgb:' + acc.rgb + ';cursor:pointer" ' +
        'onclick="window.open(\'proveedor.html?id=' + esc(p.slug) + '\',\'_blank\')">' +
        '<div class="p-accent-bar" style="background:' + acc.hex + '"></div>' +
        '<div class="p-inner">' +
          '<aside class="p-sidebar">' +
            '<div class="p-logo-zone">' +
              '<div class="p-plan-badge e-plan-pro">Profesional</div>' +
              logoImg +
              (p.ano_fundacion ? '<div class="p-logo-year">Est. ' + p.ano_fundacion + '</div>' : '') +
            '</div>' +
            '<div class="p-meta">' +
              '<div class="p-meta-row"><span class="p-meta-k">Sede</span><span class="p-meta-v">' + esc((p.ciudad || '') + (p.pais ? ', ' + p.pais : '')) + '</span></div>' +
              (p.num_empleados ? '<div class="p-meta-row"><span class="p-meta-k">Equipo</span><span class="p-meta-v">' + esc(p.num_empleados) + '</span></div>' : '') +
              (p.website ? '<div class="p-meta-row"><span class="p-meta-k">Web</span><span class="p-meta-v"><a href="' + esc(p.website) + '" target="_blank" class="p-web" onclick="event.stopPropagation()">' + esc(cleanWeb(p.website)) + '</a></span></div>' : '') +
            '</div>' +
            '<div class="p-tipo">' + tipos + '</div>' +
            (certs ? '<div class="p-certs">' + certs + '</div>' : '') +
          '</aside>' +
          '<div class="p-content">' +
            '<div class="p-head">' +
              '<div class="p-eyebrow">' + esc(p.pais || '') + (p.ciudad ? ' · ' + esc(p.ciudad) : '') + '</div>' +
              '<h2 class="p-name">' + esc(p.nombre_empresa) + '</h2>' +
              '<p class="p-tagline">' + esc(p.tipo_empresa || '') + '</p>' +
              (p.descripcion ? '<p class="p-desc">' + esc(p.descripcion) + '</p>' : '') +
            '</div>' +
            (mats ? '<div class="p-mats-wrap"><div class="p-mats-lbl">Materiales</div><div class="p-mats">' + mats + '</div></div>' : '') +
            '<div class="p-footer">' +
              '<div class="p-links"></div>' +
              '<div style="display:flex;align-items:center;gap:12px">' +
                (p.verificado ? '<div style="font-size:8px;letter-spacing:2px;text-transform:uppercase;color:' + acc.hex + '">&#9670; Verificado</div>' : '') +
                '<span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:' + acc.hex + ';border:1px solid rgba(' + acc.rgb + ',.35);padding:6px 14px">Ver perfil →</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function buildPres(p) {
    var acc = PLAN_COLORS.presencia;
    var tags = getTags(p);
    var tipos = arr(p.sector).map(function(t){ return '<span class="tipo-tag">' + esc(t) + '</span>'; }).join('');
    var mats  = arr(p.materiales).map(function(m){ return '<span class="mat-tag">' + esc(m) + '</span>'; }).join('');
    var logoText = p.nombre_empresa.split(' ').map(function(w){ return w[0] || ''; }).join('').toUpperCase().slice(0,3);
    var logoImg  = p.logo_url
      ? '<img src="' + esc(p.logo_url) + '" alt="' + esc(p.nombre_empresa) + '" style="max-width:80px;max-height:40px;object-fit:contain">'
      : '<div class="pr-logo" style="color:' + acc.hex + ';border-color:' + acc.hex + '40">' + esc(logoText) + '</div>';
    return '' +
      '<article class="profile-pres" id="' + esc(p.slug) + '" data-slug="' + esc(p.slug) + '" data-tags="' + esc(tags) + '" ' +
        'style="--acc:' + acc.hex + ';--acc-rgb:' + acc.rgb + ';cursor:pointer" ' +
        'onclick="window.open(\'proveedor.html?id=' + esc(p.slug) + '\',\'_blank\')">' +
        '<div class="pr-strip" style="background:' + acc.hex + '"></div>' +
        '<div class="pr-logo-col">' +
          '<div class="pr-plan-badge e-plan-pres">Presencia</div>' +
          logoImg +
          '<div class="pr-tipo">' + tipos + '</div>' +
        '</div>' +
        '<div class="pr-info">' +
          '<div class="pr-eyebrow">' + esc(p.pais || '') + (p.ciudad ? ' · ' + esc(p.ciudad) : '') + (p.ano_fundacion ? ' · Est. ' + p.ano_fundacion : '') + '</div>' +
          '<h2 class="pr-name">' + esc(p.nombre_empresa) + '</h2>' +
          '<p class="pr-tagline">' + esc(p.tipo_empresa || '') + '</p>' +
          (p.descripcion ? '<p class="pr-desc">' + esc(p.descripcion) + '</p>' : '<p class="pr-desc"></p>') +
          (mats ? '<div class="pr-mats-lbl">Materiales</div><div class="pr-mats">' + mats + '</div>' : '') +
        '</div>' +
        '<div class="pr-contact">' +
          '<div class="pr-contact-lbl">Contacto</div>' +
          (p.email_contacto ? '<div class="pr-contact-row">&#9993; ' + esc(p.email_contacto) + '</div>' : '') +
          (p.telefono ? '<div class="pr-contact-row">&#9742; ' + esc(p.telefono) + '</div>' : '') +
          (p.website ? '<div class="pr-contact-row"><a href="' + esc(p.website) + '" class="pr-web" target="_blank" onclick="event.stopPropagation()">' + esc(cleanWeb(p.website)) + '</a></div>' : '') +
          '<span style="margin-top:auto;display:flex;align-items:center;padding:9px 14px;background:rgba(' + acc.rgb + ',.07);border:1px solid rgba(' + acc.rgb + ',.25);font-size:8px;letter-spacing:2px;text-transform:uppercase;color:' + acc.hex + '">Ver perfil →</span>' +
        '</div>' +
      '</article>';
  }

  function buildDir(p) {
    var tags = getTags(p);
    var tipos = arr(p.sector).map(function(t){ return '<span class="tipo-tag">' + esc(t) + '</span>'; }).join('');
    var mats  = arr(p.materiales).map(function(m){ return '<span class="mat-tag">' + esc(m) + '</span>'; }).join('');
    var initials = p.nombre_empresa.split(' ').map(function(w){ return w[0] || ''; }).join('').toUpperCase().slice(0,2);
    return '' +
      '<article class="profile-dir" id="' + esc(p.slug) + '" data-slug="' + esc(p.slug) + '" data-tags="' + esc(tags) + '" ' +
        'style="cursor:pointer" ' +
        'onclick="window.open(\'proveedor.html?id=' + esc(p.slug) + '\',\'_blank\')">' +
        '<div class="d-avatar" style="color:#6a6050;border-color:#6a605030">' + esc(initials) + '</div>' +
        '<div class="d-body">' +
          '<div class="d-name">' + esc(p.nombre_empresa) + '</div>' +
          '<div class="d-meta">' + esc((p.ciudad || '') + (p.pais ? ' · ' + p.pais : '') + (p.ano_fundacion ? ' · Est. ' + p.ano_fundacion : '')) + '</div>' +
          '<div class="d-tipo">' + tipos + '</div>' +
          (mats ? '<div class="d-mats">' + mats + '</div>' : '') +
        '</div>' +
        '<div class="d-right">' +
          '<div class="d-plan-badge">Directorio</div>' +
          '<span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#A67C52">Ver perfil →</span>' +
        '</div>' +
      '</article>';
  }

  function buildCard(p) {
    var plan = (p.plan || 'free').toLowerCase();
    if (plan === 'elite')       return buildElite(p);
    if (plan === 'profesional') return buildPro(p);
    if (plan === 'presencia')   return buildPres(p);
    return buildDir(p);
  }

  function renderProveedores(data) {
    var list = document.getElementById('providersList');
    if (!list) return;

    data.sort(function(a, b) {
      return (PLAN_ORDER[(a.plan||'free').toLowerCase()] || 3) - (PLAN_ORDER[(b.plan||'free').toLowerCase()] || 3);
    });

    var html = '';
    var lastPlan = null;
    data.forEach(function(p) {
      var plan = (p.plan || 'free').toLowerCase();
      if (plan !== lastPlan) {
        html += buildTierSep(plan);
        lastPlan = plan;
      }
      html += buildCard(p);
    });

    html += '<div class="join-cta"><div class="jc-text"><h2>¿Tu empresa no aparece aquí?</h2><p>Crea tu ficha gratuita en minutos y empieza a ser visible para compradores, arquitectos y constructoras de todo el mundo.</p></div><a href="registro.html" class="jc-btn">Publicar mi empresa →</a></div>';

    list.innerHTML = html;

    var eyebrow = document.querySelector('.ph-eyebrow');
    if (eyebrow) {
      eyebrow.textContent = 'Directorio verificado · ' + data.length + ' perfiles activos';
    }
  }

  var list = document.getElementById('providersList');
  if (list) list.innerHTML = '<div style="text-align:center;padding:80px;color:#8a8784;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Cargando proveedores\u2026</div>';

  fetch(SB_URL + '/rest/v1/proveedores?select=*&estado=eq.activo', {
    headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (!Array.isArray(data) || data.length === 0) {
      if (list) list.innerHTML = '<div style="text-align:center;padding:80px;color:#8a8784;">No se encontraron proveedores.</div>';
      return;
    }
    renderProveedores(data);
  })
  .catch(function(err) {
    console.error('Error cargando proveedores:', err);
    if (list) list.innerHTML = '<div style="text-align:center;padding:80px;color:#8a8784;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Error al cargar proveedores.</div>';
  });
})();
