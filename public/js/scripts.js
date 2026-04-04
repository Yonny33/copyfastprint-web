// ==========================================================================
// ===  FUNCIONALIDAD DEL MENÚ RESPONSIVE (CORREGIDO)  ===
// ==========================================================================
window.initMobileMenu = function() {
    const navLinks = document.getElementById("nav-links");
    const navToggle = document.getElementById("nav-toggle");

    if (navLinks && navToggle) {
    const navIcon = navToggle.querySelector("i"); // Obtener el elemento <i> del ícono

    // Añadir el evento de clic al botón de la hamburguesa
    navToggle.addEventListener("click", () => {
        // Alternar la clase "show-menu" en la lista de enlaces para mostrarla/ocultarla
        navLinks.classList.toggle("show-menu");

        // Verificar si el menú está abierto
        const isMenuOpen = navLinks.classList.contains("show-menu");

        // Cambiar el ícono de barras a una 'X' y viceversa
        if (isMenuOpen) {
            navIcon.classList.remove("fa-bars");
            navIcon.classList.add("fa-times");
        } else {
            navIcon.classList.remove("fa-times");
            navIcon.classList.add("fa-bars");
        }

        // Mejorar accesibilidad: actualizar el atributo aria-expanded
        navToggle.setAttribute("aria-expanded", isMenuOpen);
    });
} else {
    }
};

// Ejecutar por si el header ya estuviera en el DOM (fallback)
document.addEventListener("DOMContentLoaded", window.initMobileMenu);


// ==========================================================================
// ===  FUNCIONALIDAD DEL CATÁLOGO DE DISEÑOS (FILTRADO)  ===
// ==========================================================================

// Asegurarse de que el DOM esté completamente cargado antes de ejecutar el script de filtrado
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los botones de filtro y las tarjetas de diseño
  const filterButtons = document.querySelectorAll(".filter-btn");
  const designCards = document.querySelectorAll(".design-card");

  // Verificar si hay botones de filtro y tarjetas de diseño para evitar errores
  if (filterButtons.length === 0 && designCards.length === 0) {
    // console.log("No se encontraron botones de filtro o tarjetas de diseño en esta página. La funcionalidad de filtrado no se activará.");
    return; // Salir de la función si no hay elementos relevantes
  }

  // Añadir un escuchador de eventos a cada botón de filtro
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. Eliminar la clase 'active' de todos los botones de filtro
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // 2. Añadir la clase 'active' al botón que fue clickeado
      button.classList.add("active");

      // 3. Obtener la categoría del botón clickeado (del atributo data-category)
      const category = button.dataset.category;

      // 4. Iterar sobre todas las tarjetas de diseño
      designCards.forEach((card) => {
        const cardCategory = card.dataset.category; // Obtener la categoría de la tarjeta

        // Si la categoría es 'all' (mostrar todo) o la categoría de la tarjeta
        // coincide con la categoría seleccionada, mostrar la tarjeta.
        // De lo contrario, ocultarla.
        if (category === "all" || cardCategory === category) {
          card.classList.remove("hidden"); // Remover la clase 'hidden'
        } else {
          card.classList.add("hidden"); // Añadir la clase 'hidden'
        }
      });
    });
  });
});

// ==========================================================================
// ===  FUNCIONALIDAD DEL BOTÓN "IR ARRIBA" UNIVERSAL  ===
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Crear el botón dinámicamente y añadirlo al body
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-to-top-btn';
    scrollTopBtn.title = 'Ir Arriba';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // Lógica para mostrar/ocultar el botón
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Lógica para el clic del botón
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});


// =================== LIGHTBOX CON NAVEGACIÓN (CONDICIONAL) ===================

// Solo ejecutar si estamos en una página con la galería.
const lightboxModal = document.getElementById("modal-lightbox");
const designCards = document.querySelectorAll(".design-card");

if (lightboxModal && designCards.length > 0) {
  let currentGallery = []; // Array de imágenes del producto actual
  let currentImgIndex = 0;
  let activeCard = null;

  // Crear botones de navegación si no existen
  function ensureLightboxNavButtons() {
    if (!document.getElementById("modal-prev")) {
      const prevBtn = document.createElement("button");
      prevBtn.id = "modal-prev";
      prevBtn.innerHTML = "&#10094;";
      prevBtn.className = "lightbox-nav";
      lightboxModal.appendChild(prevBtn);
    }
    if (!document.getElementById("modal-next")) {
      const nextBtn = document.createElement("button");
      nextBtn.id = "modal-next";
      nextBtn.innerHTML = "&#10095;";
      nextBtn.className = "lightbox-nav";
      lightboxModal.appendChild(nextBtn);
    }
  }

  // Mostrar imagen en el lightbox según el índice
  function showLightboxImage(index) {
    const modalImg = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const whatsappBtn = document.getElementById("modal-whatsapp-btn");

    // Navegación circular
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;

    currentImgIndex = index;
    modalImg.src = currentGallery[currentImgIndex];

    // Obtener info de la tarjeta activa
    const titleElement = activeCard.querySelector(".card-info h3") || activeCard.querySelector("h3");
    const descriptionElement = activeCard.querySelector(".card-info p") || activeCard.querySelector("p");
    
    const titulo = titleElement ? titleElement.textContent : "Diseño";
    modalTitle.textContent = titulo;
    modalDescription.textContent = descriptionElement ? descriptionElement.textContent : "";

    // Usar la URL completa para el enlace de WhatsApp
    const imagenUrl = new URL(currentGallery[currentImgIndex], window.location.origin).href;

    const mensaje = encodeURIComponent(
      `Hola, me interesa el diseño: ${titulo}. Enlace de la imagen: ${imagenUrl}`
    );
    // NÚMERO DE WHATSAPP ACTUALIZADO
    whatsappBtn.href = `https://wa.me/584220135069?text=${mensaje}`;

    lightboxModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  // Evento click en cada TARJETA (no solo la imagen)
  designCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", function (e) {
      // Evitar abrir si se hace clic en botones internos
      if (e.target.closest('button') || e.target.closest('a')) return;

      activeCard = card;
      const dataImages = card.getAttribute("data-images");

      if (dataImages) {
        // Si tiene múltiples imágenes (generado por el script), úsalas
        try {
          currentGallery = JSON.parse(dataImages);
        } catch (err) { console.error("Error parsing images", err); currentGallery = [card.querySelector("img").src]; }
      } else {
        // Si es una tarjeta simple, usa solo la imagen principal
        currentGallery = [card.querySelector("img").src];
      }

      ensureLightboxNavButtons();
      showLightboxImage(0); // Empezar por la primera imagen
    });
  });

  // Botón cerrar
  document.getElementById("modal-close").onclick = function () {
    lightboxModal.style.display = "none";
    document.body.style.overflow = "";
  };

  // Cerrar al hacer click fuera de la imagen
  lightboxModal.onclick = function (e) {
    if (e.target === this) {
      this.style.display = "none";
      document.body.style.overflow = "";
    }
  };

  // Navegación siguiente/anterior
  document.addEventListener("click", function (e) {
    if (e.target.id === "modal-next") {
      e.stopPropagation();
      showLightboxImage(currentImgIndex + 1);
    }
    if (e.target.id === "modal-prev") {
      e.stopPropagation();
      showLightboxImage(currentImgIndex - 1);
    }
  });

  // Navegación con flechas del teclado
  document.addEventListener("keydown", function (e) {
    if (lightboxModal.style.display === "flex") {
      if (e.key === "ArrowRight") {
        showLightboxImage(currentImgIndex + 1);
      }
      if (e.key === "ArrowLeft") {
        showLightboxImage(currentImgIndex - 1);
      }
      if (e.key === "Escape") {
        lightboxModal.style.display = "none";
        document.body.style.overflow = "";
      }
    }
  });
}
