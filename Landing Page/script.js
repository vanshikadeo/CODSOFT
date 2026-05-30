/* ═══════════════════════════════════════════════════
   BloomStudio — script.js
   Pink Luxury Landing Page
   Author: BloomStudio / Web Internship Project
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────
   1. LOADER — Hide after page is ready
──────────────────────────────────────────────────*/
window.addEventListener('load', () => {
  // Wait for the loader bar animation (~1.8s) then hide
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Remove from DOM after transition ends
      loader.addEventListener('transitionend', () => loader.remove());
    }
  }, 1900);
});


/* ─────────────────────────────────────────────────
   2. SCROLL PROGRESS BAR
──────────────────────────────────────────────────*/
function updateScrollProgress() {
  const bar   = document.getElementById('scroll-progress');
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  const pct      = total > 0 ? (scrolled / total) * 100 : 0;
  if (bar) bar.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });


/* ─────────────────────────────────────────────────
   3. STICKY NAVBAR + Active Link
──────────────────────────────────────────────────*/
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavbar() {
  if (!navbar) return;

  // Scrolled class → glass effect
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link based on scroll position
  let currentSection = '';
  sections.forEach(section => {
    const top    = section.offsetTop - 120;
    const height = section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', handleNavbar, { passive: true });
handleNavbar(); // Run once on load


/* ─────────────────────────────────────────────────
   4. MOBILE HAMBURGER MENU
──────────────────────────────────────────────────*/
const hamburger     = document.getElementById('hamburger');
const mobileNavMenu = document.getElementById('navLinks');

if (hamburger && mobileNavMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNavMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  mobileNavMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNavMenu.classList.remove('open');
    });
  });
}


/* ─────────────────────────────────────────────────
   5. SMOOTH SCROLLING for all anchor links
──────────────────────────────────────────────────*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();

    const offset = document.getElementById('navbar')?.offsetHeight || 74;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────────
   6. DARK / LIGHT MODE TOGGLE
──────────────────────────────────────────────────*/
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('bloomTheme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bloomTheme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  themeIcon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
}


/* ─────────────────────────────────────────────────
   7. TYPING TEXT ANIMATION
──────────────────────────────────────────────────*/
const typedEl  = document.getElementById('typed-text');
const words    = ['Inspire', 'Captivate', 'Convert', 'Elevate', 'Delight'];
let   wordIdx  = 0;
let   charIdx  = 0;
let   deleting = false;

function typeEffect() {
  if (!typedEl) return;
  const currentWord = words[wordIdx];

  if (!deleting) {
    // Typing
    typedEl.textContent = currentWord.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === currentWord.length) {
      // Pause before deleting
      setTimeout(() => { deleting = true; typeEffect(); }, 1800);
      return;
    }
  } else {
    // Deleting
    typedEl.textContent = currentWord.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 110);
}
typeEffect();


/* ─────────────────────────────────────────────────
   8. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
──────────────────────────────────────────────────*/
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────────
   9. ANIMATED COUNTERS (Hero Stats)
──────────────────────────────────────────────────*/
function animateCounter(el, target, duration = 1800) {
  let start     = 0;
  const step    = 16; // ~60fps
  const totalSteps = duration / step;
  const increment = target / totalSteps;

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start);
  }, step);
}

// Observe stats to trigger counters when visible
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target') || 0);
      animateCounter(el, target);
      statsObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
statNumbers.forEach(el => statsObserver.observe(el));


/* ─────────────────────────────────────────────────
   10. FLOATING PARTICLES (Hero Background)
──────────────────────────────────────────────────*/
function createParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const count = 24;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size  = Math.random() * 8 + 3;    // 3–11px
    const left  = Math.random() * 100;       // 0–100%
    const delay = Math.random() * 6;         // 0–6s delay
    const dur   = Math.random() * 8 + 6;    // 6–14s duration
    const top   = Math.random() * 100;       // vertical start

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      top: ${top}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}
createParticles();


/* ─────────────────────────────────────────────────
   11. RIPPLE BUTTON EFFECT
──────────────────────────────────────────────────*/
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function (e) {
    // Remove existing ripples
    this.querySelectorAll('.ripple-wave').forEach(r => r.remove());

    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const wave = document.createElement('span');
    wave.classList.add('ripple-wave');
    wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    this.appendChild(wave);

    wave.addEventListener('animationend', () => wave.remove());
  });
});


/* ─────────────────────────────────────────────────
   12. BACK TO TOP BUTTON
──────────────────────────────────────────────────*/
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (!backToTopBtn) return;
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
}, { passive: true });

backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─────────────────────────────────────────────────
   13. CONTACT FORM VALIDATION & SUBMISSION
──────────────────────────────────────────────────*/
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  // Clear previous errors
  clearErrors();

  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');
  let   valid   = true;

  // Validate Name
  if (!name.value.trim()) {
    showError('nameError', 'Please enter your name.');
    name.focus();
    valid = false;
  } else if (name.value.trim().length < 2) {
    showError('nameError', 'Name must be at least 2 characters.');
    valid = false;
  }

  // Validate Email
  if (!email.value.trim()) {
    showError('emailError', 'Please enter your email address.');
    if (valid) email.focus();
    valid = false;
  } else if (!isValidEmail(email.value.trim())) {
    showError('emailError', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate Message
  if (!message.value.trim()) {
    showError('messageError', 'Please write a message.');
    valid = false;
  } else if (message.value.trim().length < 10) {
    showError('messageError', 'Message should be at least 10 characters.');
    valid = false;
  }

  if (!valid) return;

  // Simulate form submission (replace with real API call)
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = '<i class="ri-send-plane-2-line"></i> Send Message';
    submitBtn.disabled = false;

    // Show success message
    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 5000);
    }

    // Reset form
    contactForm.reset();
  }, 1500);
});

// Helper: show error
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

// Helper: clear all errors
function clearErrors() {
  ['nameError', 'emailError', 'messageError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

// Helper: validate email pattern
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Clear error on input
['name', 'email', 'message'].forEach(fieldId => {
  const input = document.getElementById(fieldId);
  input?.addEventListener('input', () => {
    const errId = fieldId + 'Error';
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  });
});


/* ─────────────────────────────────────────────────
   14. INPUT FOCUS GLOW LABELS
──────────────────────────────────────────────────*/
document.querySelectorAll('.input-wrap input, .input-wrap textarea').forEach(input => {
  // Highlight icon when focused
  input.addEventListener('focus', () => {
    const icon = input.parentElement.querySelector('i');
    if (icon) icon.style.color = 'var(--pink-hot)';
  });
  input.addEventListener('blur', () => {
    const icon = input.parentElement.querySelector('i');
    if (icon) icon.style.color = '';
  });
});


/* ─────────────────────────────────────────────────
   15. FEATURE CARD MOUSE-TILT effect (desktop only)
──────────────────────────────────────────────────*/
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.feature-card, .service-card, .testi-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect   = this.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      this.style.transform = `translateY(-8px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
}


/* ─────────────────────────────────────────────────
   16. ALL DONE — Log project info
──────────────────────────────────────────────────*/
console.log(
  '%c✦ BloomStudio Landing Page%c\nBuilt with ❤️ by a Web Dev Intern — Have fun customizing!\n',
  'background: linear-gradient(135deg,#f48fb1,#e91e8c); color:#fff; padding:8px 16px; border-radius:8px; font-size:14px; font-weight:700;',
  'color: #e91e8c; font-size: 12px;'
);
