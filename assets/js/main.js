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
   * Inicialización del sistema de Smooth Scroll y Animaciones
   */
  const init = () => {
    // 1. Inicializar Lenis para smooth scrolling inmersivo
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva elegante
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

    // Sincronizar el ticker de GSAP con el requestAnimationFrame de Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    // Desactivar el lag smoothing de GSAP para evitar conflictos
    gsap.ticker.lagSmoothing(0)

    // 3. Revelación de Pantalla Completa (Hero -> Colecciones)
    const collectionsSection = document.querySelector('.collections')
    if (collectionsSection) {
      const headerMaskTexts = collectionsSection.querySelectorAll('.collections-header .mask-text')
      const firstModelImg = collectionsSection.querySelector('.runway-model-3d:nth-child(1) .model-img')

      // Estado inicial: textos ocultos abajo (máscara) e imagen cerrada al centro
      gsap.set(headerMaskTexts, { yPercent: 100 })
      gsap.set(firstModelImg, { clipPath: 'inset(0 50% 0 50%)', scale: 1.4 })

      // Timeline de entrada orquestada con easing premium
      ScrollTrigger.create({
        trigger: collectionsSection,
        start: "top 75%",
        animation: gsap.timeline()
          // Telón de la primera imagen
          .to(firstModelImg, {
            clipPath: 'inset(0 0% 0 0%)',
            scale: 1,
            duration: 2,
            ease: "power4.out"
          })
          // Textos entrando línea por línea desde abajo
          .to(headerMaskTexts, {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out"
          }, "-=1.5") // Solapado pesado para mayor fluidez
      })
    }

    // 4. Efecto Pasarela 3D (Caminar hacia adelante con Parallax y Zoom)
    const models3D = document.querySelectorAll('.runway-model-3d')
    
    models3D.forEach((model, index) => {
      // Estado inicial (lejos y abajo)
      gsap.set(model, { 
        scale: 0.5, 
        y: 300, 
        opacity: 0,
        transformOrigin: "center center" 
      })

      // Animación atada al scroll (acercándose)
      gsap.to(model, {
        scale: 1,
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: model,
          start: "top 110%", // Empieza muy abajo
          end: "center 45%", // Termina cuando la imagen pasa el centro
          scrub: 1.5 // Interpolación supersuave
        }
      })
    })

    // Mantenemos animaciones para otros elementos como textos
    const simpleItems = document.querySelectorAll('.runway-item')
    simpleItems.forEach(item => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        onEnter: () => item.classList.add('is-visible'),
        once: true
      })
    })

    initEmailProtection()
  }

  /**
   * Protección Anti-Spam: Ofuscación de Correo Electrónico
   * Evita que bots de scraping capturen el email desde el HTML puro.
   */
  const initEmailProtection = () => {
    const emailBtns = document.querySelectorAll('.secure-email-btn')
    emailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        // El email se ensambla dinámicamente en tiempo de ejecución
        const user = 'contacto'
        const domain = 'auracarmona.com'
        window.location.href = `mailto:${user}@${domain}`
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
