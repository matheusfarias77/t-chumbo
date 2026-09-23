/**
 * T-Chumbo Surf - JavaScript Principal
 * Experiência de Scroll Cinematográfico Premium com GSAP 3 + ScrollTrigger + ScrollToPlugin
 * 100% Compositor-friendly, responsivo e acessível
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
      
      // Atualiza posições do ScrollTrigger após abertura de accordion
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 300);
      }
    });
  });

  // ==========================================================================
  // 4. GALERIA LIGHTBOX MODAL
  // ==========================================================================
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

  // ==========================================================================
  // 5. ATIVAÇÃO GSAP & SCROLLTRIGGER CINEMATOGRÁFICO
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fallback caso GSAP não esteja disponível ou usuário prefira movimento reduzido
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
    document.querySelectorAll('.reveal-line').forEach(el => {
      el.style.transform = 'none';
      el.style.opacity = '1';
    });
    return;
  }

  // Registra plugins do GSAP
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
  }

  // Marcar elementos .reveal-on-scroll como revealed para o GSAP controlar diretamente
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.classList.add('revealed');
  });

  // Smooth scroll em âncoras compatível com ScrollTrigger pins
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        toggleMobileMenu(false);
        
        if (typeof ScrollToPlugin !== 'undefined') {
          gsap.to(window, {
            duration: 0.9,
            scrollTo: {
              y: target,
              offsetY: 65,
              autoKill: true
            },
            ease: 'power2.inOut'
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Configuração Responsiva via gsap.matchMedia()
  const mm = gsap.matchMedia();

  // --------------------------------------------------------------------------
  // A. DESKTOP (min-width: 1024px)
  // --------------------------------------------------------------------------
  mm.add('(min-width: 1024px)', () => {
    // 1. HERO PIN EM 5 FASES
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // FASE 1: Início nítido, fadeout do indicador de scroll
    heroTl.to('#heroScrollIndicator', {
      opacity: 0,
      y: -15,
      duration: 0.12,
      ease: 'power1.out'
    }, 0);

    // FASE 2: Zoom leve progressivo da imagem (scale 1 -> 1.08) e profundidade vertical
    heroTl.to('.hero-bg-img', {
      scale: 1.08,
      yPercent: 7,
      duration: 0.38,
      ease: 'none'
    }, 0.12);

    heroTl.to('.hero-overlay', {
      opacity: 0.92,
      duration: 0.38,
      ease: 'none'
    }, 0.12);

    heroTl.to('.hero-badge', {
      y: -22,
      opacity: 0.85,
      duration: 0.3,
      ease: 'power1.out'
    }, 0.15);

    heroTl.to('.hero-subtitle', {
      y: -20,
      duration: 0.3,
      ease: 'power1.out'
    }, 0.15);

    // FASE 3: Entrada dos cards/pills informativos com diferença de velocidade e direção
    heroTl.fromTo('.hero-features-bar',
      { opacity: 0, scale: 0.94, y: 25 },
      { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'power2.out' },
      0.38
    );

    const pills = document.querySelectorAll('.hero-feature-pill');
    if (pills.length >= 4) {
      // Pills 1 e 2 entram com leve inclinação e deslocamento da esquerda
      heroTl.fromTo(pills[0], 
        { x: -35, y: 35, opacity: 0, scale: 0.92 }, 
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, 
        0.42
      );
      heroTl.fromTo(pills[1], 
        { x: -18, y: 45, opacity: 0, scale: 0.92 }, 
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, 
        0.46
      );
      // Pills 3 e 4 entram da direita
      heroTl.fromTo(pills[2], 
        { x: 18, y: 45, opacity: 0, scale: 0.92 }, 
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, 
        0.46
      );
      heroTl.fromTo(pills[3], 
        { x: 35, y: 35, opacity: 0, scale: 0.92 }, 
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, 
        0.42
      );
    }

    // FASE 4: Egress suave dos textos secundários e preparação do título para transição
    heroTl.to('.hero-subtitle, .hero-cta-group', {
      opacity: 0.3,
      y: -28,
      scale: 0.97,
      duration: 0.22,
      ease: 'power2.inOut'
    }, 0.72);

    heroTl.to('.hero-title', {
      scale: 1.03,
      y: -12,
      duration: 0.22,
      ease: 'power1.out'
    }, 0.72);

    heroTl.to('.hero-features-bar', {
      y: -15,
      opacity: 0.85,
      duration: 0.22,
      ease: 'power1.out'
    }, 0.75);

    // FASE 5: Transição natural (o pin é liberado no final do timeline)

    // 2. PARALLAX DESKTOP EM SEÇÕES ESPECÍFICAS
    // Seção Sobre: Deslocamento oposto entre imagem e texto
    gsap.fromTo('.towin-visual', 
      { yPercent: 6 }, 
      { 
        yPercent: -6, 
        ease: 'none', 
        scrollTrigger: {
          trigger: '#sobre',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      }
    );

    gsap.fromTo('.towin-text-content', 
      { yPercent: -4 }, 
      { 
        yPercent: 4, 
        ease: 'none', 
        scrollTrigger: {
          trigger: '#sobre',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      }
    );

    // Seção Experiência: Parallax tridimensional entre as duas fotos da equipe
    const expPhotos = document.querySelectorAll('.exp-photo-card');
    if (expPhotos.length >= 2) {
      gsap.fromTo(expPhotos[0], 
        { y: 30 }, 
        { 
          y: -25, 
          ease: 'none', 
          scrollTrigger: {
            trigger: '#experiencia',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
      gsap.fromTo(expPhotos[1], 
        { y: -25 }, 
        { 
          y: 25, 
          ease: 'none', 
          scrollTrigger: {
            trigger: '#experiencia',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
    }

    // Seção Para Quem: Drift de alta profundidade no banner de alta performance
    gsap.fromTo('.performance-banner img', 
      { yPercent: -8, scale: 1.07 }, 
      { 
        yPercent: 8, 
        scale: 1.02, 
        ease: 'none', 
        scrollTrigger: {
          trigger: '.performance-banner',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      }
    );

    // Seção Picos: Micro-zoom e drift nas fotos de Saquarema e Barra
    document.querySelectorAll('.spot-card').forEach(spot => {
      const img = spot.querySelector('.spot-media img');
      if (img) {
        gsap.fromTo(img, 
          { yPercent: -6, scale: 1.05 }, 
          { 
            yPercent: 6, 
            scale: 1, 
            ease: 'none', 
            scrollTrigger: {
              trigger: spot,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8
            }
          }
        );
      }
    });
  });

  // --------------------------------------------------------------------------
  // B. TABLET (min-width: 768px e max-width: 1023px)
  // --------------------------------------------------------------------------
  mm.add('(min-width: 768px) and (max-width: 1023px)', () => {
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    heroTl.to('#heroScrollIndicator', { opacity: 0, y: -10, duration: 0.12 }, 0);
    heroTl.to('.hero-bg-img', { scale: 1.05, yPercent: 4, duration: 0.4, ease: 'none' }, 0.12);
    heroTl.fromTo('.hero-features-bar',
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      0.36
    );

    const pills = document.querySelectorAll('.hero-feature-pill');
    if (pills.length >= 4) {
      heroTl.fromTo(pills, 
        { y: 30, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.28, ease: 'power2.out' }, 
        0.4
      );
    }

    heroTl.to('.hero-subtitle, .hero-cta-group', { opacity: 0.4, y: -20, duration: 0.25 }, 0.72);

    // Parallax moderado para tablet
    gsap.fromTo('.towin-visual', 
      { yPercent: 4 }, 
      { yPercent: -4, ease: 'none', scrollTrigger: { trigger: '#sobre', start: 'top bottom', end: 'bottom top', scrub: 0.8 } }
    );
  });

  // --------------------------------------------------------------------------
  // C. MOBILE (max-width: 767px)
  // --------------------------------------------------------------------------
  mm.add('(max-width: 767px)', () => {
    // Pin encurtado para fluidez de polegar no mobile sem travar a navegação
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=95%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1
      }
    });

    heroTl.to('#heroScrollIndicator', { opacity: 0, y: -10, duration: 0.1 }, 0);
    heroTl.to('.hero-bg-img', { scale: 1.03, yPercent: 3, duration: 0.4, ease: 'none' }, 0.1);
    heroTl.to('.hero-badge, .hero-subtitle', { y: -10, duration: 0.3 }, 0.15);

    // No mobile, animar container e evitar deslocamentos horizontais para garantia contra overflow
    heroTl.fromTo('.hero-features-bar',
      { opacity: 0, scale: 0.96, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' },
      0.35
    );

    const pills = document.querySelectorAll('.hero-feature-pill');
    if (pills.length >= 4) {
      heroTl.fromTo(pills, 
        { y: 20, opacity: 0, scale: 0.96 }, 
        { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.25, ease: 'power2.out' }, 
        0.38
      );
    }

    heroTl.to('.hero-subtitle, .hero-cta-group', { opacity: 0.5, y: -12, duration: 0.25 }, 0.7);
  });

  // --------------------------------------------------------------------------
  // D. TEXT REVEALS CINEMATOGRÁFICOS (TODAS AS TELAS)
  // --------------------------------------------------------------------------
  const revealLines = document.querySelectorAll('.reveal-line');
  revealLines.forEach(line => {
    const parentHeading = line.closest('h1, h2, h3') || line;
    gsap.fromTo(line, 
      { yPercent: 105, opacity: 0 }, 
      { 
        yPercent: 0, 
        opacity: 1, 
        duration: 0.85, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: parentHeading,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // --------------------------------------------------------------------------
  // E. CARDS FLUTUANTES COM ENTRADA ESCALONADA (STAGGER)
  // --------------------------------------------------------------------------
  // 1. Passo a Passo (.step-card)
  const stepCards = document.querySelectorAll('.step-card');
  if (stepCards.length > 0) {
    gsap.fromTo(stepCards, 
      { opacity: 0, scale: 0.94, y: 45 }, 
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.75, 
        stagger: 0.12, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.steps-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 2. Perfis de Praticantes (.audience-card)
  const audienceCards = document.querySelectorAll('.audience-card');
  if (audienceCards.length > 0) {
    gsap.fromTo(audienceCards, 
      { opacity: 0, scale: 0.94, y: 40 }, 
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.75, 
        stagger: 0.14, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.audience-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 3. Picos Saquarema & Barra (.spot-card)
  const spotCards = document.querySelectorAll('.spot-card');
  if (spotCards.length > 0) {
    gsap.fromTo(spotCards, 
      { opacity: 0, scale: 0.95, y: 45 }, 
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.16, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.spots-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 4. Itens da Galeria (.gallery-item)
  const galItems = document.querySelectorAll('.gallery-item');
  if (galItems.length > 0) {
    gsap.fromTo(galItems, 
      { opacity: 0, scale: 0.95, y: 30 }, 
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.65, 
        stagger: 0.08, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // 5. Pilares Técnicos (.benefit-item) e Pontos de Experiência (.exp-point)
  document.querySelectorAll('.towin-benefits-list, .experience-points-grid').forEach(grid => {
    const items = grid.children;
    if (items.length > 0) {
      gsap.fromTo(items, 
        { opacity: 0, y: 25 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.65, 
          stagger: 0.1, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 84%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  // --------------------------------------------------------------------------
  // F. TRANSIÇÕES CONTÍNUAS ENTRE SEÇÕES
  // --------------------------------------------------------------------------
  document.querySelectorAll('section.section, section.final-cta-section').forEach(sec => {
    gsap.fromTo(sec, 
      { opacity: 0.92, y: 20 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.7, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top 92%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Recalcular posições de ScrollTrigger após carregamento de todas as imagens
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // ==========================================================================
  // 6. QUERY PARAMS & DEEP LINKING (REVELAÇÕES / TESTES)
  // ==========================================================================
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reveal') === 'all') {
    document.querySelectorAll('.reveal-line').forEach(el => {
      el.style.transform = 'none';
      el.style.opacity = '1';
    });
  }

  if (urlParams.get('menu') === 'open') {
    toggleMobileMenu(true);
  }

  const scrollTarget = urlParams.get('scroll');
  if (scrollTarget) {
    const targetEl = document.getElementById(scrollTarget);
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'instant' });
        ScrollTrigger.refresh();
      }, 100);
    }
  }
});
