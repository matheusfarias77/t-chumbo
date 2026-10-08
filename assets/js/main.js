/**
 * T-Chumbo Surf - JavaScript Principal (Ocean Performance Redesign)
 * Interações leves, rápidas, acessíveis e mobile-first
 * Sem pins pesados, sem travamentos de scroll e sem zoom contínuo
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. HEADER SCROLL EFFECT
  // ==========================================================================
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

  // ==========================================================================
  // 2. MENU MOBILE DRAWER
  // ==========================================================================
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  // ==========================================================================
  // 3. FAQ ACCORDION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          otherTrigger?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
      
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 200);
      }
    });
  });

  // ==========================================================================
  // 4. GALERIA LIGHTBOX MODAL
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-card, .gallery-item');
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
    const handleOpen = () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-card-title')?.textContent || 
                      item.querySelector('.gallery-caption')?.textContent || 
                      'T-Chumbo Surf';
      if (img) openLightbox(img.src, caption);
    };

    item.addEventListener('click', handleOpen);

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
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

  // ==========================================================================
  // 5. SMOOTH SCROLL PARA ÂNCORAS
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        toggleMobileMenu(false);
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 6. ANIMAÇÕES DISCRETAS (REVEAL SUTIL E RESPEITOSO)
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Revelação imediata caso o usuário prefira movimento reduzido ou GSAP offline
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
    document.querySelectorAll('.reveal-line').forEach(el => {
      el.style.transform = 'none';
      el.style.opacity = '1';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Marcar como revelado para CSS
  document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));

  // Revelação sutil de títulos (fade-up limpo, sem zoom contínuo nem pin travado)
  document.querySelectorAll('.reveal-line').forEach(line => {
    const parent = line.closest('h1, h2, h3') || line;
    gsap.fromTo(line, 
      { yPercent: 40, opacity: 0 }, 
      { 
        yPercent: 0, 
        opacity: 1, 
        duration: 0.7, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Fade-up suave e discreto para grids de conteúdo
  const fadeUpTargets = [
    '.levels-grid',
    '.editorial-layout',
    '.structure-grid',
    '.spots-grid',
    '.gallery-duo-grid'
  ];

  fadeUpTargets.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      gsap.fromTo(el.children, 
        { opacity: 0, y: 24 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });

  // Atualizar triggers ao finalizar carregamento de recursos
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
