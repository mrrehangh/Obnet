// ── Privacy & Terms modals
function showPrivacy() { document.getElementById('modal-privacy').style.display='block'; }
function showTerms()   { document.getElementById('modal-terms').style.display='block'; }

// Close modals on background click
['modal-privacy','modal-terms'].forEach(id => {
  document.getElementById(id).addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
  });
});

// ── Compliance tile toggle
function toggleCF(tile) {
  const badge  = tile.querySelector('.cf-badge');
  const short  = tile.querySelector('.cf-short');
  const panel  = tile.querySelector('.cf-desc-panel');
  const label  = tile.dataset.label;
  const color  = tile.dataset.color;
  const what   = tile.dataset.what;
  const impl   = tile.dataset.impl;
  const isOpen = tile.classList.contains('cf-active');

  // Close all tiles first
  document.querySelectorAll('.compliance-framework').forEach(t => {
    t.classList.remove('cf-active');
    t.querySelector('.cf-badge').textContent = t.dataset.label;
    t.querySelector('.cf-short').style.display = '';
    const p = t.querySelector('.cf-desc-panel');
    p.classList.remove('cf-panel-open');
    p.innerHTML = '';
  });

  // If it was closed, open it
  if (!isOpen) {
    tile.classList.add('cf-active');
    badge.textContent = 'DokShield Implementation';
    short.style.display = 'none';
    panel.innerHTML =
      '<span class="cf-panel-what" style="color:' + color + '">What is ' + label + '?</span>' +
      '<span class="cf-panel-body">' + what + '</span>' +
      '<div class="cf-panel-impl">' +
        '<span class="cf-panel-impl-label" style="color:' + color + '">DokShield implementation</span>' +
        '<span class="cf-panel-impl-body">' + impl + '</span>' +
      '</div>';
    // Trigger transition on next frame
    requestAnimationFrame(() => panel.classList.add('cf-panel-open'));
  }
}

// ── Early Access form handler
function handleEarlyAccessSubmit(btn) {
  const firstName = document.getElementById('ea-firstname').value.trim();
  const lastName  = document.getElementById('ea-lastname').value.trim();
  const email     = document.getElementById('ea-email').value.trim();
  const jobTitle  = document.getElementById('ea-jobtitle').value.trim();
  const company   = document.getElementById('ea-company').value.trim();
  const industry  = document.getElementById('ea-industry').value;
  const country   = document.getElementById('ea-country').value;
  const current   = document.getElementById('ea-current').value;

  // Validation — required fields
  if (!firstName || !lastName || !email || !jobTitle || !company || !industry || !country || !current) {
    btn.textContent = '⚠ Please fill in all required fields';
    btn.style.background = '#b45309';
    setTimeout(() => {
      btn.textContent = 'Submit Early Access Application →';
      btn.style.background = '';
    }, 3500);
    return;
  }

  // Collect selected modules
  const modules = [...document.querySelectorAll('.ea-module-check input:checked')]
    .map(cb => cb.value).join(', ') || 'None selected';

  // Build email body
  const subject = encodeURIComponent('DokShield Early Access Application — ' + firstName + ' ' + lastName);
  const body = encodeURIComponent(
    'EARLY ACCESS APPLICATION — DokShield\n' +
    '=====================================\n\n' +
    'PERSONAL DETAILS\n' +
    'Name:        ' + firstName + ' ' + lastName + '\n' +
    'Email:       ' + email + '\n' +
    'Phone:       ' + (document.getElementById('ea-phone').value.trim() || 'Not provided') + '\n' +
    'Job Title:   ' + jobTitle + '\n' +
    'LinkedIn:    ' + (document.getElementById('ea-linkedin').value.trim() || 'Not provided') + '\n\n' +
    'ORGANISATION\n' +
    'Company:     ' + company + '\n' +
    'Industry:    ' + industry + '\n' +
    'Country:     ' + country + '\n' +
    'Website:     ' + (document.getElementById('ea-website').value.trim() || 'Not provided') + '\n' +
    'Data Centres: ' + (document.getElementById('ea-dccount').value || 'Not provided') + '\n' +
    'Officers:    ' + (document.getElementById('ea-officers').value || 'Not provided') + '\n\n' +
    'CURRENT SETUP\n' +
    'Current tools: ' + current + '\n' +
    'Pain point:    ' + (document.getElementById('ea-painpoint').value.trim() || 'Not provided') + '\n\n' +
    'MODULES OF INTEREST\n' + modules + '\n\n' +
    'PLAN & TIMELINE\n' +
    'Plan interest: ' + (document.getElementById('ea-plan').value || 'Not provided') + '\n' +
    'Timeline:      ' + (document.getElementById('ea-timeline').value || 'Not provided') + '\n\n' +
    'ADDITIONAL NOTES\n' + (document.getElementById('ea-notes').value.trim() || 'None') + '\n\n' +
    '— Submitted via obnet.org early access form'
  );

  btn.textContent = 'Opening email client...';
  btn.disabled = true;

  // Open mailto — sends to services@obnet.org
  window.location.href = 'mailto:services@obnet.org?subject=' + subject + '&body=' + body;

  // After a short delay, show success state
  setTimeout(() => {
    btn.textContent = '✓ Application ready — check your email client';
    btn.style.background = '#16a34a';
    btn.style.boxShadow = '0 4px 16px rgba(22,163,74,0.3)';
  }, 1200);
}

// ── Contact form handler
function handleFormSubmit(btn) {
  const form = btn.closest('.form-wrap');
  const firstName = form.querySelector('input[type="text"]').value.trim();
  const email     = form.querySelector('input[type="email"]').value.trim();
  const message   = form.querySelector('textarea').value.trim();

  if (!firstName || !email || !message) {
    btn.textContent = '⚠ Please fill in all required fields';
    btn.style.background = '#b45309';
    setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 3000);
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Send via Formspree (replace YOUR_FORM_ID with real ID when ready)
  fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: firstName,
      email: email,
      message: message
    })
  })
  .then(r => {
    if (r.ok) {
      btn.textContent = '✓ Message Sent — We\'ll be in touch!';
      btn.style.background = '#16a34a';
    } else {
      throw new Error();
    }
  })
  .catch(() => {
    // Fallback: open mail client
    const subject = encodeURIComponent('Enquiry from obnet.org');
    const body    = encodeURIComponent(`Name: ${firstName}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@obnet.org?subject=${subject}&body=${body}`;
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  });
}

// ── Custom cursor (desktop only — disabled on touch devices)
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

if (!isTouchDevice) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('button, a, .faq-item, .feat-card, .phil-card, .value-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      ring.style.width  = '56px';
      ring.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      ring.style.width  = '38px';
      ring.style.height = '38px';
    });
  });
}

// ── Mobile hamburger menu
function toggleMobileMenu() {
  const btn  = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.classList.toggle('open');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
  const btn  = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.classList.remove('open');
  menu.classList.remove('open');
  document.body.style.overflow = '';
}

// Close mobile menu when clicking outside
document.addEventListener('click', e => {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('navHamburger');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
    closeMobileMenu();
  }
});

// ── Scroll navbar
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

// ── Page navigation (multi-page: navigate to real HTML files)
function showPage(id) {
  const pages = {
    home: 'index.html',
    about: 'about.html',
    products: 'products.html',
    dokshield: 'dokshield.html',
    contact: 'contact.html',
    earlyaccess: 'earlyaccess.html'
  };
  if (pages[id]) {
    window.location.href = pages[id];
  }
}

// ── Scroll reveal
function observeReveal() {
  const els = document.querySelectorAll('.page.active .reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => { el.classList.remove('visible'); obs.observe(el); });
}

// ── FAQ toggle
function toggleFaq(el) {
  el.classList.toggle('open');
}

// ── Nav active state from CURRENT_PAGE
document.addEventListener('DOMContentLoaded', () => {
  if (typeof CURRENT_PAGE !== 'undefined') {
    document.querySelectorAll('.nav-center a').forEach(a => a.classList.remove('active'));
    const navLink = document.getElementById('nav-' + CURRENT_PAGE);
    if (navLink) navLink.classList.add('active');
    // Also set active on mobile menu
    document.querySelectorAll('.mobile-menu a[data-page]').forEach(a => a.classList.remove('active'));
    const mobLink = document.querySelector('.mobile-menu a[data-page="' + CURRENT_PAGE + '"]');
    if (mobLink) mobLink.classList.add('active');
  }
  // Run reveal on load
  observeReveal();
});
