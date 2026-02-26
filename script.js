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

  // ---------- PLAN SIGNUP MODAL ----------
  const planModal = document.getElementById('planModal');
  const modalClose = document.getElementById('modalClose');
  const modalPlanName = document.getElementById('modalPlanName');
  const modalPlanPrice = document.getElementById('modalPlanPrice');
  const mpesaAmount = document.getElementById('mpesaAmount');
  const planSignupForm = document.getElementById('planSignupForm');
  const planButtons = document.querySelectorAll('.plan-select-btn');

  function openPlanModal(planName, planPrice) {
    if (!planModal) return;
    modalPlanName.textContent = planName;
    modalPlanPrice.textContent = planPrice;
    // Extract just the Ksh amount for M-Pesa (e.g. "Ksh 6,500/mo" → "Ksh 6,500")
    const amountOnly = planPrice.replace(/\/.*$/, '');
    mpesaAmount.textContent = amountOnly;
    planModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePlanModal() {
    if (!planModal) return;
    planModal.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form if it was in success state
    if (planSignupForm && planSignupForm.classList.contains('modal-success')) {
      planSignupForm.classList.remove('modal-success');
      planSignupForm.innerHTML = planSignupForm.dataset.originalHtml;
    }
  }

  // Store original form HTML for reset
  if (planSignupForm) {
    planSignupForm.dataset.originalHtml = planSignupForm.innerHTML;
  }

  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan');
      const price = btn.getAttribute('data-price');
      openPlanModal(plan, price);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closePlanModal);
  }

  // Close on overlay click
  if (planModal) {
    planModal.addEventListener('click', (e) => {
      if (e.target === planModal) closePlanModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && planModal && planModal.classList.contains('open')) {
      closePlanModal();
    }
  });

  // Form submission
  if (planSignupForm) {
    planSignupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      planSignupForm.classList.add('modal-success');
      planSignupForm.innerHTML = `
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 class="success-title">Request Submitted!</h3>
        <p class="success-text">We've received your details for the <strong>${modalPlanName.textContent}</strong> plan.<br/>We'll confirm your membership within 24 hours.</p>
      `;
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
