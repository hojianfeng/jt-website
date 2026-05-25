/* ============================================================
   JT Business Institute — script.js
   Handles: loader, navbar, hero anims, scroll anims, stats
            counter, course filter, testimonial carousel,
            FAQ accordion, enquiry form, dark mode, back-to-top
   ============================================================ */

'use strict';

/* ===== DOM REFS ===== */
const loader      = document.getElementById('loader');
const navbar      = document.getElementById('navbar');
const burger      = document.getElementById('burger');
const navLinks    = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const backTop     = document.getElementById('backTop');
const statsRow    = document.getElementById('statsRow');

/* ===================================================================
   LOADING SCREEN
   =================================================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hide');
    triggerHeroAnims();
  }, 1900);
});

function triggerHeroAnims() {
  document.querySelectorAll('.anim-hero').forEach((el, i) => {
    setTimeout(() => el.classList.add('loaded'), i * 150);
  });
}

/* ===================================================================
   NAVBAR — sticky + active link on scroll
   =================================================================== */
function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top visibility
  if (window.scrollY > 400) {
    backTop.classList.add('show');
  } else {
    backTop.classList.remove('show');
  }

  // Active nav link based on section position
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });
  document.querySelectorAll('.nl').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ===================================================================
   MOBILE MENU — hamburger toggle
   =================================================================== */
burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
document.querySelectorAll('.nl').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});

/* ===================================================================
   DARK / LIGHT MODE TOGGLE
   =================================================================== */
const THEME_KEY = 'jtbi-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
  localStorage.setItem(THEME_KEY, theme);
}

// Load saved theme
const savedTheme = localStorage.getItem(THEME_KEY) ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ===================================================================
   SCROLL ANIMATIONS — IntersectionObserver for .anim elements
   =================================================================== */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = entry.target.parentElement.querySelectorAll('.anim');
      siblings.forEach((sib, idx) => {
        if (!sib.classList.contains('visible')) {
          setTimeout(() => sib.classList.add('visible'), idx * 80);
        }
      });
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.anim').forEach(el => animObserver.observe(el));

/* ===================================================================
   BACK TO TOP
   =================================================================== */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===================================================================
   ANIMATED STATISTICS COUNTER
   =================================================================== */
let statsCounted = false;

function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsCounted) {
      statsCounted = true;
      document.querySelectorAll('.stat-n[data-target]').forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

if (statsRow) statsObserver.observe(statsRow);

/* ===================================================================
   COURSE FILTER
   =================================================================== */
const filterBtns = document.querySelectorAll('.f-btn');
const courseCards = document.querySelectorAll('.c-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    courseCards.forEach(card => {
      const cat = card.dataset.cat;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        // Re-trigger anim if needed
        card.classList.add('visible');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===================================================================
   TESTIMONIAL CAROUSEL
   =================================================================== */
const tSlides = document.querySelectorAll('.t-slide');
const tDots   = document.querySelectorAll('.t-dot');
const tPrev   = document.getElementById('tPrev');
const tNext   = document.getElementById('tNext');
let tCurrent  = 0;
let tAutoplay;

function showTestimonial(index) {
  tSlides.forEach(s => s.classList.remove('active'));
  tDots.forEach(d => d.classList.remove('active'));
  tCurrent = (index + tSlides.length) % tSlides.length;
  tSlides[tCurrent].classList.add('active');
  tDots[tCurrent].classList.add('active');
}

function startAutoplay() {
  tAutoplay = setInterval(() => showTestimonial(tCurrent + 1), 5000);
}
function stopAutoplay() {
  clearInterval(tAutoplay);
}

if (tPrev && tNext) {
  tPrev.addEventListener('click', () => { stopAutoplay(); showTestimonial(tCurrent - 1); startAutoplay(); });
  tNext.addEventListener('click', () => { stopAutoplay(); showTestimonial(tCurrent + 1); startAutoplay(); });
  tDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); showTestimonial(i); startAutoplay(); });
  });
  startAutoplay();
}

// Swipe support for testimonials
let touchStartX = 0;
const tTrack = document.getElementById('tTrack');
if (tTrack) {
  tTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  tTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      showTestimonial(diff > 0 ? tCurrent + 1 : tCurrent - 1);
      startAutoplay();
    }
  }, { passive: true });
}

/* ===================================================================
   FAQ ACCORDION
   =================================================================== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item     = btn.closest('.faq-item');
    const isOpen   = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-q').setAttribute('aria-expanded', false);
    });

    // Open clicked if it wasn't already open
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', true);
    }
  });
});

/* ===================================================================
   ENQUIRY FORM — validation + FormSubmit integration
   =================================================================== */
const enquiryForm  = document.getElementById('enquiryForm');
const formCard     = document.getElementById('formCard');
const formSuccess  = document.getElementById('formSuccess');
const formErrorMsg = document.getElementById('formErrorMsg');
const submitBtn    = document.getElementById('submitBtn');
const btnText      = document.getElementById('btnText');
const btnLoad      = document.getElementById('btnLoad');

/* Simple validators */
const validators = {
  'f-name'  : v => v.trim().length >= 2   ? '' : 'Please enter your full name.',
  'f-email' : v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
  'f-phone' : v => v.trim().length >= 7   ? '' : 'Please enter a valid phone number.',
  'f-course': v => v.trim() !== ''        ? '' : 'Please select a course.',
};

function validateField(input) {
  const id  = input.id;
  const err = document.getElementById(id.replace('f-', '') + 'Err');
  if (!validators[id]) return true;
  const msg = validators[id](input.value);
  if (err) err.textContent = msg;
  input.classList.toggle('invalid', !!msg);
  return !msg;
}

// Live validation on blur
Object.keys(validators).forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(el);
    });
  }
});

function setLoading(on) {
  submitBtn.disabled = on;
  btnText.style.display = on ? 'none' : 'inline-flex';
  btnLoad.style.display = on ? 'inline-flex' : 'none';
}

function buildPayload() {
  const data = {};
  new FormData(enquiryForm).forEach((value, key) => { data[key] = value; });
  return data;
}

if (enquiryForm) {
  enquiryForm.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all required fields
    const fields = ['f-name', 'f-email', 'f-phone', 'f-course'];
    const valid  = fields.map(id => {
      const el = document.getElementById(id);
      return el ? validateField(el) : true;
    }).every(Boolean);

    if (!valid) {
      // Scroll to first error
      const firstErr = enquiryForm.querySelector('.invalid');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    try {
      const payload = buildPayload();
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify({
          access_key:  '39173b18-6f36-4bb4-8790-f909c3d77ccb',
          subject:     'New Course Enquiry — JT Business Institute',
          from_name:   'JT Business Institute Website',
          name:        payload.name    || '',
          email:       payload.email   || '',
          phone:       payload.phone   || '',
          company:     payload.company || '',
          course:      payload.course  || '',
          message:     payload.message || '',
          botcheck:    '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        formCard.style.display = 'none';
        formSuccess.style.display = 'flex';
        formErrorMsg.style.display = 'none';
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      setLoading(false);
      formErrorMsg.style.display = 'flex';
      formErrorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* Called by "Send Another Enquiry" button */
function resetEnquiryForm() {
  enquiryForm.reset();
  document.querySelectorAll('.f-err').forEach(el => el.textContent = '');
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  formCard.style.display = 'block';
  formSuccess.style.display = 'none';
  formErrorMsg.style.display = 'none';
  setLoading(false);
  formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
// Expose globally for inline onclick
window.resetEnquiryForm = resetEnquiryForm;

/* ===================================================================
   SMOOTH SCROLL for anchor links (polyfill for Safari)
   =================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================================================================
   HERO PARTICLES — subtle floating dots
   =================================================================== */
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const size  = Math.random() * 4 + 2;
    const x     = Math.random() * 100;
    const delay = Math.random() * 6;
    const dur   = Math.random() * 8 + 6;
    const op    = Math.random() * 0.15 + 0.05;
    dot.style.cssText = `
      position:absolute;
      left:${x}%;
      bottom:-10px;
      width:${size}px;
      height:${size}px;
      background:rgba(175,214,92,${op});
      border-radius:50%;
      animation:floatUp ${dur}s ${delay}s linear infinite;
      pointer-events:none;
    `;
    container.appendChild(dot);
  }
  // Inject keyframes if not already present
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      #heroParticles { position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:1; }
      @keyframes floatUp {
        0%   { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-110vh) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ===================================================================
   RESIZE — re-check navbar on window resize
   =================================================================== */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});
