/* ===================================
   PORTFOLIO - JAVASCRIPT PRINCIPAL
   Desarrollador: Francisco González
   =================================== */

// ===================================
// VARIABLES GLOBALES
// ===================================
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.getElementById('theme-toggle');
const header = document.getElementById('header');

// ===================================
// MENÚ MÓVIL
// ===================================

/**
 * Muestra el menú móvil
 */
function showMenu() {
  if (navMenu) {
    navMenu.classList.add('show-menu');
  }
}

/**
 * Oculta el menú móvil
 */
function hideMenu() {
  if (navMenu) {
    navMenu.classList.remove('show-menu');
  }
}

// Event listeners para abrir/cerrar menú
if (navToggle) {
  navToggle.addEventListener('click', showMenu);
}

if (navClose) {
  navClose.addEventListener('click', hideMenu);
}

// Cerrar menú al hacer click en un link
navLinks.forEach(link => {
  link.addEventListener('click', hideMenu);
});

// ===================================
// NAVEGACIÓN ACTIVA AL SCROLL
// ===================================

/**
 * Actualiza el link activo en la navegación según la sección visible
 */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add('active-link');
    } else {
      navLink?.classList.remove('active-link');
    }
  });
}

// Actualizar link activo al hacer scroll
window.addEventListener('scroll', updateActiveLink);

// ===================================
// HEADER CON SOMBRA AL SCROLL
// ===================================

/**
 * Agrega sombra al header cuando se hace scroll
 */
function scrollHeader() {
  if (window.scrollY >= 50) {
    header?.classList.add('scroll-header');
  } else {
    header?.classList.remove('scroll-header');
  }
}

window.addEventListener('scroll', scrollHeader);

// ===================================
// MODO OSCURO
// ===================================

// Obtener tema guardado del localStorage
const currentTheme = localStorage.getItem('theme');

// Aplicar tema guardado al cargar la página
if (currentTheme) {
  document.body.classList.add(currentTheme);
}

/**
 * Toggle entre modo claro y oscuro
 */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  
  // Guardar preferencia en localStorage
  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark-theme');
  } else {
    localStorage.removeItem('theme');
  }
}

// Event listener para el botón de tema
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// ===================================
// ANIMACIONES AL SCROLL (INTERSECTION OBSERVER)
// ===================================

/**
 * Observa elementos y los anima cuando entran en el viewport
 */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      // Si es una barra de progreso, animar el ancho
      if (entry.target.classList.contains('skill__progress')) {
        const progress = entry.target.getAttribute('data-progress');
        entry.target.style.width = `${progress}%`;
      }
    }
  });
}, observerOptions);

// Observar todos los elementos con clase 'reveal'
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => observer.observe(el));

// Observar barras de progreso de habilidades
const skillBars = document.querySelectorAll('.skill__progress');
skillBars.forEach(bar => observer.observe(bar));

// ===================================
// ANIMACIÓN DE ENTRADA INICIAL
// ===================================

/**
 * Anima elementos al cargar la página
 */
function animateOnLoad() {
  const heroElements = document.querySelectorAll('.hero__content > *');
  
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('fade-in');
    }, index * 100);
  });
}

// Ejecutar animación al cargar la página
window.addEventListener('load', animateOnLoad);

// ===================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ===================================

/**
 * Scroll suave al hacer click en links de navegación
 * Nota: CSS scroll-behavior ya maneja esto, pero esto es un fallback
 */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    // Solo aplicar smooth scroll a anchors internos
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const headerHeight = header?.offsetHeight || 0;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ===================================
// LAZY LOADING DE IMÁGENES
// ===================================

/**
 * Carga imágenes de forma diferida para mejorar performance
 */
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute('data-src');
      
      if (src) {
        img.setAttribute('src', src);
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    }
  });
});

// Observar todas las imágenes con data-src
const lazyImages = document.querySelectorAll('img[data-src]');
lazyImages.forEach(img => imageObserver.observe(img));

// ===================================
// DETECCIÓN DE SCROLL HACIA ARRIBA/ABAJO
// ===================================

let lastScrollTop = 0;

/**
 * Detecta dirección del scroll y oculta/muestra header
 */
function handleScrollDirection() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scroll hacia abajo - ocultar header
    header?.classList.add('header-hidden');
  } else {
    // Scroll hacia arriba - mostrar header
    header?.classList.remove('header-hidden');
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Debounce para optimizar performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  
  scrollTimeout = window.requestAnimationFrame(() => {
    handleScrollDirection();
  });
});

// ===================================
// ANIMACIÓN DE CONTADOR (OPCIONAL)
// ===================================

/**
 * Anima números desde 0 hasta su valor final
 * @param {HTMLElement} element - Elemento que contiene el número
 * @param {number} target - Valor final del contador
 * @param {number} duration - Duración de la animación en ms
 */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      element.textContent = Math.round(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

// Observar elementos con clase 'counter' y animarlos
const counterElements = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(counter => counterObserver.observe(counter));

// ===================================
// VALIDACIÓN DE FORMULARIO (SI SE AGREGA)
// ===================================

/**
 * Valida un campo de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Muestra mensaje de error en un campo
 * @param {HTMLElement} field - Campo del formulario
 * @param {string} message - Mensaje de error
 */
function showError(field, message) {
  const errorElement = field.nextElementSibling;
  
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  field.classList.add('error');
}

/**
 * Limpia mensaje de error de un campo
 * @param {HTMLElement} field - Campo del formulario
 */
function clearError(field) {
  const errorElement = field.nextElementSibling;
  
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.style.display = 'none';
  }
  
  field.classList.remove('error');
}

// Event listener para formulario de contacto (si existe)
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    
    let isValid = true;
    
    // Validar nombre
    if (nameField && nameField.value.trim() === '') {
      showError(nameField, 'Por favor ingresa tu nombre');
      isValid = false;
    } else if (nameField) {
      clearError(nameField);
    }
    
    // Validar email
    if (emailField && emailField.value.trim() === '') {
      showError(emailField, 'Por favor ingresa tu email');
      isValid = false;
    } else if (emailField && !validateEmail(emailField.value)) {
      showError(emailField, 'Por favor ingresa un email válido');
      isValid = false;
    } else if (emailField) {
      clearError(emailField);
    }
    
    // Validar mensaje
    if (messageField && messageField.value.trim() === '') {
      showError(messageField, 'Por favor ingresa un mensaje');
      isValid = false;
    } else if (messageField) {
      clearError(messageField);
    }
    
    // Si todo es válido, enviar formulario
    if (isValid) {
      console.log('Formulario válido - listo para enviar');
      // Aquí iría la lógica de envío (ej: fetch a un endpoint)
      
      // Mostrar mensaje de éxito
      alert('¡Mensaje enviado con éxito! Te contactaré pronto.');
      contactForm.reset();
    }
  });
}

// ===================================
// UTILIDADES
// ===================================

/**
 * Debounce function para optimizar eventos que se disparan frecuentemente
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función debounced
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function para limitar la frecuencia de ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Tiempo mínimo entre ejecuciones en ms
 * @returns {Function} - Función throttled
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===================================
// CONSOLE LOG DE BIENVENIDA
// ===================================

console.log('%c¡Hola! 👋', 'color: #06b6d4; font-size: 24px; font-weight: bold;');
console.log('%c¿Interesado en el código? Visita mi GitHub:', 'color: #64748b; font-size: 14px;');
console.log('%cgithub.com/tu-usuario', 'color: #8b5cf6; font-size: 14px; font-weight: bold;');
console.log('%c\nEste portfolio fue desarrollado con:', 'color: #64748b; font-size: 12px;');
console.log('%c✓ HTML5 semántico\n✓ CSS3 moderno (Grid, Flexbox, Custom Properties)\n✓ JavaScript ES6+ (Intersection Observer, LocalStorage)\n✓ Diseño responsive mobile-first\n✓ Accesibilidad WCAG', 'color: #0891b2; font-size: 12px;');

// ===================================
// INICIALIZACIÓN
// ===================================

/**
 * Función de inicialización que se ejecuta al cargar el DOM
 */
function init() {
  console.log('Portfolio inicializado correctamente ✓');
  
  // Aplicar animaciones iniciales
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
