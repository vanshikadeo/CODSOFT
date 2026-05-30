/* ============================================================
   VANSHIKA DEOVANSHI — PORTFOLIO JAVASCRIPT
   Author: Vanshika Deovanshi
   Version: 1.0
   Features:
     - Loading screen
     - Scroll progress bar
     - Sticky navbar + active link tracking
     - Mobile hamburger menu
     - Dark / Light theme toggle (persisted in localStorage)
     - Typing / typewriter animation
     - Scroll reveal animations
     - Animated skill progress bars
     - Animated counters (achievements)
     - Floating particle background
     - Contact form validation
     - Back-to-top button
     - Button ripple effect
     - Smooth scrolling
============================================================ */

/* ─────────────────────────────────────
   UTILITY: Wait for DOM
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════
     1. LOADING SCREEN
  ══════════════════════════════════ */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    // Give a tiny extra delay so the animation looks intentional
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger initial reveal animations after load
      revealOnScroll();
    }, 800);
  });


  /* ══════════════════════════════════
     2. SCROLL PROGRESS BAR
  ══════════════════════════════════ */
  const scrollBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = (scrollTop / docHeight) * 100;
    scrollBar.style.width = `${scrollPct}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });


  /* ══════════════════════════════════
     3. STICKY NAVBAR
  ══════════════════════════════════ */
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar(); // run on init


  /* ══════════════════════════════════
     4. ACTIVE NAV LINK (Scroll Spy)
  ══════════════════════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
      const top    = section.offsetTop - 80;
      const bottom = top + section.offsetHeight;

      if (scrollMid >= top && scrollMid <= bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });


  /* ══════════════════════════════════
     5. HAMBURGER / MOBILE MENU
  ══════════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const navLinksList = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksList.classList.toggle('open');
    // Trap body scroll when menu open
    document.body.style.overflow = navLinksList.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksList.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinksList.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ══════════════════════════════════
     6. DARK / LIGHT THEME TOGGLE
  ══════════════════════════════════ */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');
  const html        = document.documentElement;

  // Read saved preference
  const savedTheme = localStorage.getItem('vd-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('vd-theme', next);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-moon';
    } else {
      themeIcon.className = 'fas fa-sun';
    }
  }


  /* ══════════════════════════════════
     7. TYPING / TYPEWRITER ANIMATION
  ══════════════════════════════════ */
  const typedEl  = document.getElementById('typed-text');
  const words    = ['Web Developer', 'Frontend Developer', 'Tech Enthusiast', 'Creative Coder'];
  let   wIndex   = 0;  // current word
  let   cIndex   = 0;  // current character
  let   isDeleting = false;
  let   typingSpeed = 120;

  function typeWriter() {
    const currentWord = words[wIndex];

    if (isDeleting) {
      // Remove a character
      typedEl.textContent = currentWord.slice(0, cIndex - 1);
      cIndex--;
      typingSpeed = 60;
    } else {
      // Add a character
      typedEl.textContent = currentWord.slice(0, cIndex + 1);
      cIndex++;
      typingSpeed = 120;
    }

    // Word fully typed
    if (!isDeleting && cIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1600; // pause before deleting
    }

    // Word fully deleted
    if (isDeleting && cIndex === 0) {
      isDeleting = false;
      wIndex = (wIndex + 1) % words.length;
      typingSpeed = 400; // pause before next word
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // Start typing after loader duration
  setTimeout(typeWriter, 1000);


  /* ══════════════════════════════════
     8. FLOATING PARTICLES
  ══════════════════════════════════ */
  const particleContainer = document.getElementById('particles');

  if (particleContainer) {
    const PARTICLE_COUNT = 50;

    const colors = [
      'rgba(124,58,237,0.6)',
      'rgba(6,182,212,0.6)',
      'rgba(236,72,153,0.4)',
      'rgba(255,255,255,0.3)',
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');

      const size  = Math.random() * 4 + 1;
      const left  = Math.random() * 100;
      const delay = Math.random() * 15;
      const dur   = Math.random() * 15 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -${size}px;
        background: ${color};
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
      `;

      particleContainer.appendChild(p);
    }
  }


  /* ══════════════════════════════════
     9. SCROLL REVEAL ANIMATIONS
  ══════════════════════════════════ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  function revealOnScroll() {
    revealEls.forEach(el => {
      const elTop   = el.getBoundingClientRect().top;
      const trigger = window.innerHeight * 0.88;

      if (elTop < trigger) {
        // Apply delay if set via data-delay attribute
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // run once on init for above-fold elements


  /* ══════════════════════════════════
     10. SKILL BAR ANIMATION
  ══════════════════════════════════ */
  const skillFills = document.querySelectorAll('.skill-fill');
  let   skillsAnimated = false;

  function animateSkills() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection || skillsAnimated) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      skillsAnimated = true;
      skillFills.forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.dataset.width + '%';
        }, i * 120);
      });
    }
  }

  window.addEventListener('scroll', animateSkills, { passive: true });
  animateSkills(); // run on init


  /* ══════════════════════════════════
     11. ANIMATED COUNTERS
  ══════════════════════════════════ */
  const counters       = document.querySelectorAll('.counter');
  let   countersStarted = false;

  function animateCounters() {
    const achieveSection = document.getElementById('achievements');
    if (!achieveSection || countersStarted) return;

    const rect = achieveSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      countersStarted = true;

      counters.forEach(counter => {
        const target   = parseInt(counter.dataset.target);
        const duration = 2000; // ms
        const step     = Math.ceil(target / (duration / 16)); // ~60fps
        let   current  = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = current;
        }, 16);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();


  /* ══════════════════════════════════
     12. CONTACT FORM VALIDATION
  ══════════════════════════════════ */
  const contactForm   = document.getElementById('contact-form');
  const successMsg    = document.getElementById('form-success');
  const errorMsg      = document.getElementById('form-error-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Hide previous toasts
      successMsg.hidden = true;
      errorMsg.hidden   = true;

      // Reset errors
      clearErrors();

      // Get values
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      let isValid = true;

      // Validate name
      if (!name || name.length < 2) {
        showError('name', 'Please enter your full name (min. 2 characters).');
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate subject
      if (!subject || subject.length < 3) {
        showError('subject', 'Please enter a subject (min. 3 characters).');
        isValid = false;
      }

      // Validate message
      if (!message || message.length < 10) {
        showError('message', 'Please enter a message (min. 10 characters).');
        isValid = false;
      }

      if (isValid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          submitBtn.disabled  = false;
          successMsg.hidden   = false;
          contactForm.reset();

          // Auto-hide success after 5 seconds
          setTimeout(() => { successMsg.hidden = true; }, 5000);
        }, 1500);
      } else {
        errorMsg.hidden = false;
        setTimeout(() => { errorMsg.hidden = true; }, 4000);
      }
    });

    // Live validation feedback
    ['name', 'email', 'subject', 'message'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        clearError(id);
      });
    });
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (field)  field.classList.add('error');
    if (error)  error.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (field)  field.classList.remove('error');
    if (error)  error.textContent = '';
  }

  function clearErrors() {
    ['name', 'email', 'subject', 'message'].forEach(clearError);
  }


  /* ══════════════════════════════════
     13. BACK TO TOP BUTTON
  ══════════════════════════════════ */
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();


  /* ══════════════════════════════════
     14. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-h')) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════════════
     15. RIPPLE EFFECT ON BUTTONS
  ══════════════════════════════════ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');

      const size = Math.max(rect.width, rect.height);
      const x    = e.clientX - rect.left  - size / 2;
      const y    = e.clientY - rect.top   - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframes once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id    = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }


  /* ══════════════════════════════════
     16. HOVER TILT EFFECT ON PROJECT CARDS
  ══════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) *  6;

      card.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ══════════════════════════════════
     17. NAVBAR PARALLAX LOGO GLOW
     (subtle extra polish on scroll)
  ══════════════════════════════════ */
  const logoEl = document.querySelector('.nav-logo');
  let   lastY  = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 100) {
      logoEl.style.filter = 'brightness(1.2)';
    } else {
      logoEl.style.filter = '';
    }
    lastY = y;
  }, { passive: true });


  /* ══════════════════════════════════
     18. CONSOLE EASTER EGG 🥚
  ══════════════════════════════════ */
  console.log(`%c
  ██╗   ██╗ █████╗ ███╗   ██╗███████╗██╗  ██╗██╗██╗  ██╗ █████╗
  ██║   ██║██╔══██╗████╗  ██║██╔════╝██║  ██║██║██║ ██╔╝██╔══██╗
  ██║   ██║███████║██╔██╗ ██║███████╗███████║██║█████╔╝ ███████║
  ╚██╗ ██╔╝██╔══██║██║╚██╗██║╚════██║██╔══██║██║██╔═██╗ ██╔══██║
   ╚████╔╝ ██║  ██║██║ ╚████║███████║██║  ██║██║██║  ██╗██║  ██║
    ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
  `,
  'color: #7c3aed; font-size: 8px; font-family: monospace;');

  console.log('%c👋 Hey there, fellow developer!', 'color: #06b6d4; font-size: 14px; font-weight: bold;');
  console.log('%c🚀 Built by Vanshika Deovanshi — Web Development Intern', 'color: #e8e8ff; font-size: 12px;');
  console.log('%c📧 vanshika@example.com', 'color: #9999cc; font-size: 11px;');

}); // end DOMContentLoaded
