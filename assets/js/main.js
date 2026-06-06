/**
 * ============================================================================
 * Aura Carmona Portfolio
 * Core Animation Engine ("The Runway")
 * ============================================================================
 */

const RunwayEngine = (() => {
  // Configuración del IntersectionObserver
  const observerOptions = {
    root: null, // Viewport por defecto
    rootMargin: '0px 0px -15% 0px', // Se activa un poco antes de llegar al borde inferior
    threshold: 0.1 // Requiere que al menos el 10% del elemento sea visible
  }

  /**
   * Callback principal del Observer
   */
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Simulamos la entrada a la pasarela (aplica la clase de transición)
        entry.target.classList.add('is-visible')

        // Optimización: dejamos de observar el elemento una vez animado
        // para ahorrar recursos y mejorar el rendimiento de scroll
        observer.unobserve(entry.target)
      }
    })
  }

  /**
   * Inicialización del motor
   */
  const init = () => {
    // Graceful degradation: si no soporta IntersectionObserver, se muestra todo
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.runway-item').forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    const items = document.querySelectorAll('.runway-item')

    items.forEach(item => {
      observer.observe(item)
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
