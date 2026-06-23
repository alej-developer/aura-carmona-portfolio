/* eslint-env browser */
/* global Lenis, gsap, ScrollTrigger */

/**
 * ============================================================================
 * Aura Carmona Portfolio
 * Core Animation Engine ("The Runway") - Powered by GSAP & Lenis
 * ============================================================================
 */

const RunwayEngine = (() => {
  /**
   * Preloader Cinematográfico — Telón de Pasarela
   */
  const initPreloader = () => {
    return new Promise((resolve) => {
      const preloader = document.getElementById('preloader')
      if (!preloader) { resolve(); return }

      const logo = preloader.querySelector('.preloader-logo')
      const thread = preloader.querySelector('.preloader-thread')
      const curtainTop = preloader.querySelector('.preloader-curtain-top')
      const curtainBottom = preloader.querySelector('.preloader-curtain-bottom')

      document.body.classList.add('is-loading')

      const tl = gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none'
          document.body.classList.remove('is-loading')
          resolve()
        }
      })

      tl
        // Fase 1: Logo aparece
        .to(logo, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out'
        })
        // Fase 2: Hilo rojo se extiende
        .to(thread, {
          width: '120px',
          duration: 0.8,
          ease: 'power4.inOut'
        }, '-=0.3')
        // Fase 3: Pausa dramática
        .to({}, { duration: 0.5 })
        // Fase 4: Contenido desaparece
        .to([logo, thread], {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in'
        })
        // Fase 5: Cortinas se abren (telón)
        .to(curtainTop, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut'
        }, '-=0.1')
        .to(curtainBottom, {
          yPercent: 100,
          duration: 1.2,
          ease: 'power4.inOut'
        }, '<') // Simultáneo con curtainTop
    })
  }

  /**
   * Inicialización del sistema de Smooth Scroll y Animaciones
   */
  const init = async () => {
    // 0. Ejecutar Preloader primero
    await initPreloader()

    // 1. Inicializar Lenis para smooth scrolling inmersivo
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false
    })

    // 2. Integrar Lenis con GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // 3. Inicializar todos los módulos
    initCustomCursor()
    initCollectionsReveal()
    initHorizontalScroll()
    initRunwayItems()
    initEmailProtection()
  }

  /**
   * Collections Header Reveal (Clip-path + Mask Text)
   */
  const initCollectionsReveal = () => {
    const collectionsSection = document.querySelector('.collections')
    if (!collectionsSection) return

    const headerMaskTexts = collectionsSection.querySelectorAll('.collections-header .mask-text')

    gsap.set(headerMaskTexts, { yPercent: 100 })

    ScrollTrigger.create({
      trigger: collectionsSection,
      start: 'top 75%',
      animation: gsap.timeline()
        .to(headerMaskTexts, {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out'
        })
    })
  }

  /**
   * Scroll Horizontal para Colecciones (GSAP ScrollTrigger)
   */
  const initHorizontalScroll = () => {
    const wrapper = document.querySelector('.horizontal-scroll-wrapper')
    const track = document.querySelector('.horizontal-scroll-track')
    if (!wrapper || !track) return

    const slides = track.querySelectorAll('.runway-slide')
    const counterCurrent = document.querySelector('.slide-counter-current')
    const totalSlides = slides.length

    // Calcular cuánto hay que desplazar horizontalmente
    const getScrollAmount = () => {
      return -(track.scrollWidth - wrapper.clientWidth)
    }

    gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 15%',
        end: () => `+=${track.scrollWidth - wrapper.clientWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Actualizar contador
          if (counterCurrent) {
            const index = Math.min(
              Math.floor(self.progress * totalSlides) + 1,
              totalSlides
            )
            const formatted = String(index).padStart(2, '0')
            if (counterCurrent.textContent !== formatted) {
              counterCurrent.textContent = formatted
            }
          }
        }
      }
    })
  }

  /**
   * Runway Items — Aparición en Scroll (IntersectionObserver via GSAP)
   */
  const initRunwayItems = () => {
    const simpleItems = document.querySelectorAll('.runway-item')
    simpleItems.forEach(item => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        onEnter: () => item.classList.add('is-visible'),
        once: true
      })
    })
  }

  /**
   * Protección Anti-Spam: Ofuscación de Correo Electrónico
   */
  const initEmailProtection = () => {
    const emailBtns = document.querySelectorAll('.secure-email-btn')
    emailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const user = 'contacto'
        const domain = 'auracarmona.com'
        window.location.href = `mailto:${user}@${domain}`
      })
    })
  }

  /**
   * Custom Cursor — Dot + Ring Premium con inversión en secciones oscuras
   */
  const initCustomCursor = () => {
    // No cursor personalizado en dispositivos táctiles
    if (window.matchMedia('(hover: none)').matches) return

    const dot = document.querySelector('.cursor-dot')
    const ring = document.querySelector('.cursor-ring')
    const label = document.querySelector('.cursor-label')
    if (!dot || !ring) return

    // GSAP quickTo para movimiento suave con delay diferente
    const dotX = gsap.quickTo(dot, 'left', { duration: 0.15, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'top', { duration: 0.15, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'left', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'top', { duration: 0.45, ease: 'power3.out' })

    window.addEventListener('mousemove', (e) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    })

    // Detectar hovers en elementos interactivos
    const interactables = document.querySelectorAll('a, button, .model-img')

    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-active')
        ring.classList.add('is-active')
        if (label) {
          if (el.classList.contains('model-img')) {
            label.textContent = 'Ver'
          } else if (el.classList.contains('card-whatsapp') || el.classList.contains('whatsapp-btn')) {
            label.textContent = 'Enviar'
          } else if (el.classList.contains('secure-email-btn')) {
            label.textContent = 'Email'
          } else {
            label.textContent = 'Explorar'
          }
        }
      })

      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-active')
        ring.classList.remove('is-active')
      })
    })

    // Inversión automática del cursor en secciones oscuras
    const darkSections = document.querySelectorAll('.filosofia, .social-dark, .site-footer')
    darkSections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => { dot.classList.add('is-inverted'); ring.classList.add('is-inverted') },
        onLeave: () => { dot.classList.remove('is-inverted'); ring.classList.remove('is-inverted') },
        onEnterBack: () => { dot.classList.add('is-inverted'); ring.classList.add('is-inverted') },
        onLeaveBack: () => { dot.classList.remove('is-inverted'); ring.classList.remove('is-inverted') }
      })
    })
  }

  /**
   * Accesibilidad: Actualización dinámica del año del Copyright
   */
  const setCopyrightYear = () => {
    const yearElement = document.getElementById('current-year')
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear()
    }
  }

  // Controlador de arranque unificado
  const boot = () => {
    init()
    setCopyrightYear()
  }

  return { init: boot }
})()

// Iniciar el motor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  RunwayEngine.init()
})
