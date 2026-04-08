/**
 * auth-nav.ts — World Stone Hub
 * Sistema de autenticación visual unificado para toda la navegación.
 * Incluye: detección de sesión, modal de login, dropdown de usuario, cerrar sesión.
 */
import { supabase } from '@services/http/config';

/* ─────────────────────────────────────────────
   ESTILOS — inyectados una sola vez en <head>
───────────────────────────────────────────── */
function injectStyles() {
  if (document.getElementById('wsh-auth-styles')) return;
  const s = document.createElement('style');
  s.id = 'wsh-auth-styles';
  s.textContent = [
    /* ── NAV AUTH SLOT — espacio reservado fijo para evitar layout shift ── */
    '#nav-auth-item{',
    'display:inline-flex;align-items:center;justify-content:flex-end;',
    'min-width:268px;',
    'padding-left:20px;',
    'border-left:1px solid #e2e0dc;',
    'margin-left:8px;',
    '}',

    /* Skeleton placeholder mientras carga auth */
    '.nav-auth-skeleton{',
    'display:inline-flex;align-items:center;gap:8px;',
    '}',
    '.nav-auth-skeleton-btn{',
    'height:30px;border-radius:2px;background:#e2e0dc;',
    'animation:navSkeletonPulse 1.4s ease-in-out infinite;',
    '}',
    '@keyframes navSkeletonPulse{0%,100%{opacity:.5}50%{opacity:1}}',

    /* ── NAV AUTH ESTADO A (sin sesión) ── */
    '.nav-auth-a{display:inline-flex;align-items:center;gap:8px;}',

    '.nav-btn-login{',
    'font-family:"Instrument Sans",sans-serif;font-size:10px;letter-spacing:2px;',
    'text-transform:uppercase;color:#4a4845;background:none;',
    'border:1px solid #d4d0ca;padding:7px 14px;cursor:pointer;white-space:nowrap;',
    'transition:border-color .2s,color .2s;',
    '}',
    '.nav-btn-login:hover{border-color:#A67C52;color:#A67C52;}',

    '.nav-btn-cta{',
    'font-family:"Instrument Sans",sans-serif;font-size:10px;letter-spacing:1.5px;',
    'text-transform:uppercase;background:#A67C52;color:#fff!important;',
    'padding:8px 16px;text-decoration:none;display:inline-block;white-space:nowrap;',
    'transition:background .2s;',
    '}',
    '.nav-btn-cta:hover{background:#1A1917!important;}',

    /* ── NAV AUTH ESTADO B (con sesión) ── */
    '.nav-user-wrap{display:inline-flex;align-items:center;vertical-align:middle;}',

    '.nav-avatar{',
    'width:30px;height:30px;border-radius:50%;',
    'background:#A67C52;color:#f8f7f5;',
    'font-family:"Cormorant Garamond",serif;font-size:14px;font-weight:600;',
    'display:inline-flex;align-items:center;justify-content:center;',
    'cursor:pointer;flex-shrink:0;',
    'border:1.5px solid rgba(166,124,82,.35);',
    'transition:box-shadow .2s;',
    '}',
    '.nav-avatar:hover{box-shadow:0 0 0 3px rgba(166,124,82,.2);}',

    '.nav-user-label{',
    'font-family:"Instrument Sans",sans-serif;font-size:10px;',
    'letter-spacing:1.5px;text-transform:uppercase;color:#4a4845;',
    'max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
    'margin:0 8px;',
    '}',

    '.nav-user-menu{position:relative;display:inline-flex;align-items:center;cursor:pointer;}',

    '.nav-user-dropdown{',
    'display:none;position:absolute;top:calc(100% + 10px);right:0;',
    'background:#ffffff;border:1px solid #e2e0dc;',
    'min-width:170px;z-index:9999;',
    'box-shadow:0 8px 24px rgba(0,0,0,.1);',
    '}',
    '.nav-user-menu:hover .nav-user-dropdown,',
    '.nav-user-menu.open .nav-user-dropdown{display:block;}',

    '.nav-user-dropdown a,',
    '.nav-user-dropdown button{',
    'display:block;width:100%;padding:11px 16px;text-align:left;',
    'font-family:"Instrument Sans",sans-serif;font-size:10px;',
    'letter-spacing:2px;text-transform:uppercase;',
    'color:#1A1917;background:none;border:none;cursor:pointer;',
    'text-decoration:none;border-bottom:1px solid #f0efed;',
    'transition:background .15s,color .15s;box-sizing:border-box;',
    '}',
    '.nav-user-dropdown a:last-child,',
    '.nav-user-dropdown button:last-child{border-bottom:none;}',
    '.nav-user-dropdown a:hover,',
    '.nav-user-dropdown button:hover{background:#f8f7f5;color:#A67C52;}',
    '.nav-user-dropdown .wsh-logout{color:#8a8784;}',
    '.nav-user-dropdown .wsh-logout:hover{color:#c0392b;background:#fff5f5;}',

    /* ── MODAL OVERLAY ── */
    '#wsh-login-overlay{',
    'display:none;position:fixed;inset:0;z-index:99999;',
    'background:rgba(26,25,23,.7);backdrop-filter:blur(4px);',
    'align-items:center;justify-content:center;',
    '}',
    '#wsh-login-overlay.open{display:flex;}',

    '#wsh-login-card{',
    'background:#fff;width:100%;max-width:420px;',
    'padding:48px 40px;position:relative;',
    'border:1px solid #e2e0dc;',
    'box-shadow:0 24px 64px rgba(0,0,0,.18);',
    'animation:wshFadeIn .18s ease;',
    '}',
    '@keyframes wshFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',

    '.wsh-modal-close{',
    'position:absolute;top:14px;right:16px;background:none;border:none;',
    'cursor:pointer;color:#b8b5b0;font-size:18px;line-height:1;',
    'padding:4px 6px;transition:color .2s;',
    '}',
    '.wsh-modal-close:hover{color:#1A1917;}',

    '.wsh-modal-logo{',
    'font-family:"Cormorant Garamond",serif;font-size:13px;',
    'letter-spacing:4px;text-transform:uppercase;color:#1A1917;',
    'text-align:center;margin-bottom:24px;display:block;',
    '}',
    '.wsh-modal-logo span{color:#A67C52;font-style:italic;}',

    '.wsh-modal-title{',
    'font-family:"Cormorant Garamond",serif;font-size:28px;font-weight:300;',
    'color:#1A1917;text-align:center;margin-bottom:6px;line-height:1.1;',
    '}',
    '.wsh-modal-sub{',
    'font-size:12px;color:#8a8784;text-align:center;',
    'margin-bottom:32px;line-height:1.6;',
    '}',

    '.wsh-field{margin-bottom:16px;}',
    '.wsh-field label{',
    'display:block;font-size:9px;letter-spacing:2.5px;',
    'text-transform:uppercase;color:#8a8784;margin-bottom:6px;',
    'font-family:"Instrument Sans",sans-serif;',
    '}',
    '.wsh-field input{',
    'width:100%;height:42px;padding:0 14px;',
    'border:1px solid #d4d0ca;background:#f8f7f5;',
    'font-family:"Instrument Sans",sans-serif;font-size:13px;',
    'color:#1A1917;outline:none;',
    'transition:border .2s,box-shadow .2s;border-radius:0;',
    '}',
    '.wsh-field input:focus{',
    'border-color:#A67C52;background:#fff;',
    'box-shadow:0 0 0 3px rgba(166,124,82,.1);',
    '}',

    '.wsh-btn-primary{',
    'width:100%;height:44px;background:#1A1917;color:#fff;',
    'border:none;cursor:pointer;',
    'font-family:"Instrument Sans",sans-serif;',
    'font-size:11px;letter-spacing:3px;text-transform:uppercase;',
    'transition:background .2s;margin-top:8px;',
    '}',
    '.wsh-btn-primary:hover{background:#A67C52;}',
    '.wsh-btn-primary:disabled{opacity:.5;cursor:not-allowed;}',

    '.wsh-modal-error{',
    'font-size:12px;color:#c0392b;text-align:center;',
    'margin-top:12px;min-height:18px;display:none;line-height:1.5;',
    '}',
    '.wsh-modal-error.visible{display:block;}',
    '.wsh-modal-info{',
    'font-size:12px;color:#2d7a4f;text-align:center;',
    'margin-top:12px;min-height:18px;display:none;line-height:1.5;',
    '}',
    '.wsh-modal-info.visible{display:block;}',

    '.wsh-modal-links{',
    'display:flex;flex-direction:column;align-items:center;gap:10px;',
    'margin-top:22px;padding-top:20px;border-top:1px solid #f0efed;',
    '}',
    '.wsh-modal-links a{',
    'font-size:11px;color:#8a8784;text-decoration:none;',
    'letter-spacing:.5px;transition:color .2s;',
    '}',
    '.wsh-modal-links a:hover{color:#A67C52;}',
    '.wsh-modal-links button{',
    'background:none;border:none;cursor:pointer;',
    'font-size:11px;color:#8a8784;letter-spacing:.5px;',
    'font-family:"Instrument Sans",sans-serif;transition:color .2s;padding:0;',
    '}',
    '.wsh-modal-links button:hover{color:#A67C52;}',
  ].join('');
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   MODAL HTML — inyectado en body una sola vez
───────────────────────────────────────────── */
function injectModal() {
  if (document.getElementById('wsh-login-overlay')) return;
  const el = document.createElement('div');
  el.innerHTML =
    '<div id="wsh-login-overlay" role="dialog" aria-modal="true" aria-label="Iniciar sesión en World Stone Hub">' +
    '<div id="wsh-login-card">' +
    '<button class="wsh-modal-close" id="wsh-modal-close" aria-label="Cerrar">&#x2715;</button>' +
    '<span class="wsh-modal-logo">World Stone <span>Hub</span></span>' +
    '<h2 class="wsh-modal-title">Accede a tu cuenta</h2>' +
    '<p class="wsh-modal-sub">Directorio global de la piedra natural</p>' +
    '<div class="wsh-field">' +
    '<label for="wsh-email">Email</label>' +
    '<input type="email" id="wsh-email" autocomplete="email" placeholder="empresa@ejemplo.com">' +
    '</div>' +
    '<div class="wsh-field">' +
    '<label for="wsh-pass">Contraseña</label>' +
    '<input type="password" id="wsh-pass" autocomplete="current-password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;">' +
    '</div>' +
    '<button class="wsh-btn-primary" id="wsh-btn-login">Entrar &#x2192;</button>' +
    '<div class="wsh-modal-error" id="wsh-error"></div>' +
    '<div class="wsh-modal-info"  id="wsh-info"></div>' +
    '<div class="wsh-modal-links">' +
    '<button id="wsh-btn-reset">¿Olvidaste tu contraseña?</button>' +
    '<a href="registro.html">¿Aún no tienes cuenta? &#8594; Regístrate</a>' +
    '</div>' +
    '</div>' +
    '</div>';
  document.body.appendChild(el.firstElementChild!);

  document.getElementById('wsh-modal-close')!.addEventListener('click', closeLoginModal);
  document.getElementById('wsh-login-overlay')!.addEventListener('click', function (e) {
    if (e.target === this) closeLoginModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLoginModal();
  });
  document.getElementById('wsh-btn-login')!.addEventListener('click', handleLogin);
  (document.getElementById('wsh-pass') as HTMLInputElement).addEventListener(
    'keydown',
    function (e) {
      if (e.key === 'Enter') handleLogin();
    }
  );
  document.getElementById('wsh-btn-reset')!.addEventListener('click', handleReset);
}

/* ─────────────────────────────────────────────
   MODAL — abrir / cerrar / mensajes
───────────────────────────────────────────── */
function openLoginModal() {
  let overlay = document.getElementById('wsh-login-overlay');
  if (!overlay) {
    injectModal();
    overlay = document.getElementById('wsh-login-overlay');
  }
  overlay!.classList.add('open');
  clearModalMessages();
  setTimeout(function () {
    const emailEl = document.getElementById('wsh-email') as HTMLInputElement | null;
    if (emailEl) emailEl.focus();
  }, 80);
}

function closeLoginModal() {
  const overlay = document.getElementById('wsh-login-overlay');
  if (overlay) overlay.classList.remove('open');
  clearModalMessages();
}

function clearModalMessages() {
  setMsg('wsh-error', '', false);
  setMsg('wsh-info', '', false);
}

function showError(msg: string) {
  setMsg('wsh-error', msg, true);
  setMsg('wsh-info', '', false);
}

function showInfo(msg: string) {
  setMsg('wsh-info', msg, true);
  setMsg('wsh-error', '', false);
}

function setMsg(id: string, text: string, visible: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList[visible ? 'add' : 'remove']('visible');
}

/* ─────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────── */
function handleLogin() {
  const emailEl = document.getElementById('wsh-email') as HTMLInputElement | null;
  const passEl = document.getElementById('wsh-pass') as HTMLInputElement | null;
  const btnEl = document.getElementById('wsh-btn-login') as HTMLButtonElement | null;
  if (!emailEl || !passEl || !btnEl) return;

  const email = emailEl.value.trim();
  const pass = passEl.value;

  if (!email || !pass) {
    showError('Introduce email y contraseña.');
    return;
  }

  btnEl.disabled = true;
  btnEl.textContent = 'Entrando\u2026';
  clearModalMessages();

  supabase.auth
    .signInWithPassword({ email, password: pass })
    .then(function (res) {
      btnEl.disabled = false;
      btnEl.textContent = 'Entrar \u2192';
      if (res.error) {
        const m = (res.error.message || '').toLowerCase();
        if (m.indexOf('invalid') !== -1 || m.indexOf('credentials') !== -1) {
          showError('Email o contraseña incorrectos.');
        } else {
          showError('Error: ' + res.error.message);
        }
      } else {
        closeLoginModal();
        /* onAuthStateChange actualizará el nav automáticamente */
      }
    })
    .catch(function () {
      btnEl.disabled = false;
      btnEl.textContent = 'Entrar \u2192';
      showError('Error de conexión. Inténtalo de nuevo.');
    });
}

/* ─────────────────────────────────────────────
   RESET PASSWORD
───────────────────────────────────────────── */
function handleReset() {
  const emailEl = document.getElementById('wsh-email') as HTMLInputElement | null;
  const email = emailEl ? emailEl.value.trim() : '';
  if (!email) {
    showError('Introduce tu email primero.');
    return;
  }

  supabase.auth
    .resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/panel.html',
    })
    .then(function (res) {
      if (res.error) {
        showError('Error: ' + res.error.message);
      } else {
        showInfo('Email enviado. Revisa tu bandeja de entrada.');
      }
    });
}

/* ─────────────────────────────────────────────
   RENDER NAV — Estado A (sin sesión) / Estado B (con sesión)
───────────────────────────────────────────── */
function escHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderNavAuth(session: { user?: { id?: string; email?: string } } | null) {
  const slot = document.getElementById('nav-auth-item');
  if (!slot) return;

  if (session && session.user) {
    const email = session.user.email || '';
    const initial = email ? email[0].toUpperCase() : '?';
    const label = email.split('@')[0].replace(/[._-]/g, ' ').slice(0, 20);

    slot.innerHTML =
      '<div class="nav-user-menu" id="wsh-user-menu">' +
      '<div class="nav-avatar" title="' +
      escHtml(email) +
      '">' +
      initial +
      '</div>' +
      '<span class="nav-user-label" id="wsh-user-label">' +
      escHtml(label) +
      '</span>' +
      '<div class="nav-user-dropdown">' +
      '<a href="panel.html">Mi panel</a>' +
      '<button class="wsh-logout" id="wsh-btn-logout">Cerrar sesi\u00f3n</button>' +
      '</div>' +
      '</div>';

    document.getElementById('wsh-btn-logout')!.addEventListener('click', function () {
      supabase.auth.signOut();
    });

    const menu = document.getElementById('wsh-user-menu');
    if (menu) {
      menu.addEventListener('click', function (e) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.closest('a')) return;
        if (target.classList.contains('wsh-logout') || target.closest('.wsh-logout')) return;
        menu.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (menu && !menu.contains(e.target as Node)) {
          menu.classList.remove('open');
        }
      });
    }

    if (session.user.id) fetchEmpresaLabel(session.user.id);
  } else {
    slot.innerHTML =
      '<div class="nav-auth-a">' +
      '<button class="nav-btn-login" id="wsh-btn-open-login">Iniciar sesi\u00f3n</button>' +
      '<a href="registro.html" class="nav-btn-cta">Publicar empresa</a>' +
      '</div>';

    document.getElementById('wsh-btn-open-login')!.addEventListener('click', openLoginModal);
  }
}

function fetchEmpresaLabel(userId: string) {
  supabase
    .from('proveedores')
    .select('nombre_empresa')
    .eq('user_id', userId)
    .maybeSingle()
    .then(function (res) {
      if (res.data && (res.data as { nombre_empresa?: string }).nombre_empresa) {
        const labelEl = document.getElementById('wsh-user-label');
        if (labelEl) {
          labelEl.textContent = (res.data as { nombre_empresa: string }).nombre_empresa.slice(
            0,
            22
          );
        }
      }
    });
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
function init() {
  injectStyles();
  injectModal();

  const slot = document.getElementById('nav-auth-item');
  if (slot)
    slot.innerHTML =
      '<div class="nav-auth-skeleton">' +
      '<div class="nav-auth-skeleton-btn" style="width:90px"></div>' +
      '<div class="nav-auth-skeleton-btn" style="width:130px"></div>' +
      '</div>';

  supabase.auth.getSession().then(function (res) {
    renderNavAuth(res.data && res.data.session ? res.data.session : null);
  });

  supabase.auth.onAuthStateChange(function (_event, session) {
    renderNavAuth(session);
  });
}

/* Exponer openLoginModal globalmente para uso desde otros scripts */
(window as Window & { openLoginModal?: () => void }).openLoginModal = openLoginModal;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
