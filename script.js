/* ========================================
   SOSH GYM — JavaScript Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR SCROLL ----------
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ---------- MOBILE NAV TOGGLE ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navClose = document.getElementById('navClose');

  function openMobileNav() {
    navToggle.classList.add('active');
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close button inside mobile overlay
  if (navClose) {
    navClose.addEventListener('click', closeMobileNav);
  }

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // ---------- STAT COUNTER ANIMATION ----------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function animateStats() {
    if (statsCounted) return;
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      statsCounted = true;
      statNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          num.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', animateStats);
  animateStats(); // Check on load

  // ---------- PRICING TOGGLE ----------
  const pricingToggle = document.getElementById('pricingToggle');
  const toggleLabels = document.querySelectorAll('.toggle-label');
  const prices = document.querySelectorAll('.price');
  let isAnnual = false;

  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      pricingToggle.classList.toggle('active', isAnnual);

      toggleLabels.forEach(label => {
        const period = label.getAttribute('data-period');
        label.classList.toggle('active', isAnnual ? period === 'annual' : period === 'monthly');
      });

      prices.forEach(price => {
        const monthly = price.getAttribute('data-monthly');
        const annual = price.getAttribute('data-annual');
        price.textContent = isAnnual ? annual : monthly;
      });
    });
  }

  // ---------- SCROLL-TRIGGERED ANIMATIONS ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation based on element index within its parent
        const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
        let delay = 0;
        siblings.forEach((sibling, i) => {
          if (sibling === entry.target) delay = i * 100;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  // ---------- BOOKING FORM ----------
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show success state
      bookingForm.classList.add('success');
      bookingForm.innerHTML = `
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 class="success-title">Session Booked!</h3>
        <p class="success-text">Your trainer will confirm within 24 hours.<br/>Get ready to put in the work.</p>
      `;
    });
  }

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- PARALLAX HERO IMAGE ----------
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scroll * 0.15}px)`;
      }
    });
  }

  // ---------- ACTIVE NAV HIGHLIGHT ----------
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink.style.color = 'var(--green)';
        } else {
          navLink.style.color = '';
        }
      }
    });
  });

});
