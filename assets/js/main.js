/**
 * T-Chumbo Surf - JavaScript Principal
 * Interações leves, acessíveis e otimizadas para touch e mobile
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Menu Mobile Drawer
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean' ? forceState : !mobileDrawer?.classList.contains('open');
    if (isOpen) {
      mobileDrawer?.classList.add('open');
      menuToggle?.classList.add('active');
      menuToggle?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer?.classList.remove('open');
      menuToggle?.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  menuToggle?.addEventListener('click', () => toggleMobileMenu());

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Fechar drawer com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha outros itens para manter o layout limpo
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          otherTrigger?.setAttribute('aria-expanded', 'false');
        }
      });

      // Alterna o item atual
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 4. Galeria Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  const openLightbox = (src, caption) => {
    if (!lightbox || !lightboxImg || !lightboxTitle) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxTitle.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption')?.textContent || 'T-Chumbo Surf';
      if (img) openLightbox(img.src, caption);
    });

    // Acessibilidade via teclado
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption')?.textContent || 'T-Chumbo Surf';
        if (img) openLightbox(img.src, caption);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 5. Scroll Reveal Suave (Intersection Observer)
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback caso não suporte
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
  }

  // Instant scroll if requested via query param ?scroll=sectionId
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reveal') === 'all') {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
  }

  if (urlParams.get('menu') === 'open') {
    toggleMobileMenu(true);
  }

  const scrollTarget = urlParams.get('scroll');
  if (scrollTarget) {
    const targetEl = document.getElementById(scrollTarget);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'instant' });
      targetEl.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
      if (targetEl.classList.contains('reveal-on-scroll')) targetEl.classList.add('revealed');
    }
  }
});
