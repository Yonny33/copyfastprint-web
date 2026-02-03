// ==========================================================================
// ===  FUNCIONALIDAD DEL MENÚ RESPONSIVE (CORREGIDO)  ===
// ==========================================================================

// Obtener los elementos del DOM por sus IDs correctos
const navLinks = document.getElementById("nav-links");
const navToggle = document.getElementById("nav-toggle");

// Verificar que los elementos existen antes de añadir escuchadores
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
  console.warn("No se encontraron los elementos del menú (ID: nav-links, nav-toggle).");
}


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
// ===  FUNCIONALIDAD DEL BOTÓN "IR ARRIBA"  ===
// ==========================================================================

// Obtener el botón del DOM
const backToTopButton = document.getElementById("back-to-top");

// Verificar que el botón existe antes de añadir escuchadores
if (backToTopButton) {
  // Función para mostrar u ocultar el botón basado en la posición del scroll
  const scrollFunction = () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  };

  // Escuchar el evento de scroll en la ventana
  window.onscroll = () => {
    scrollFunction();
  };

  // Función para volver arriba cuando se hace clic
  const topFunction = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    document.body.scrollTop = 0; // Para Safari
    document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
  };

  // Escuchar el evento de clic en el botón
  backToTopButton.addEventListener("click", topFunction);
}

// =================== LIGHTBOX CON NAVEGACIÓN (CONDICIONAL) ===================

// Solo ejecutar si estamos en una página con la galería.
const lightboxModal = document.getElementById("modal-lightbox");
const galleryImages = Array.from(document.querySelectorAll(".design-card img"));

if (lightboxModal && galleryImages.length > 0) {
  let currentImgIndex = 0;

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
      nextBtn.id = "lightbox-next";
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
    currentImgIndex = index;
    modalImg.src = galleryImages[index].src;

    const designCard = galleryImages[index].closest(".design-card");
    const titleElement = designCard.querySelector(".card-info h3");
    const descriptionElement = designCard.querySelector(".card-info p");

    const titulo = titleElement ? titleElement.textContent : "Diseño";
    modalTitle.textContent = titulo;
    modalDescription.textContent = descriptionElement ? descriptionElement.textContent : "";
    let color = "";
    const altText = galleryImages[index].alt;
    const match = altText.match(/Suéter\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)/i);
    if (match) {
      color = match[1];
    }

    const imagenUrl = galleryImages[index].src;

    const mensaje = encodeURIComponent(
      `Hola, me interesa el diseño: ${titulo} en color: ${color}. Enlace de la imagen: ${imagenUrl}`
    );
    // NÚMERO DE WHATSAPP ACTUALIZADO
    whatsappBtn.href = `https://wa.me/584220135069?text=${mensaje}`;

    lightboxModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  // Evento click en cada imagen para abrir el lightbox
  galleryImages.forEach((img, idx) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      ensureLightboxNavButtons();
      showLightboxImage(idx);
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
      let next = (currentImgIndex + 1) % galleryImages.length;
      showLightboxImage(next);
    }
    if (e.target.id === "modal-prev") {
      e.stopPropagation();
      let prev =
        (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
      showLightboxImage(prev);
    }
  });

  // Navegación con flechas del teclado
  document.addEventListener("keydown", function (e) {
    if (lightboxModal.style.display === "flex") {
      if (e.key === "ArrowRight") {
        let next = (currentImgIndex + 1) % galleryImages.length;
        showLightboxImage(next);
      }
      if (e.key === "ArrowLeft") {
        let prev =
          (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
        showLightboxImage(prev);
      }
      if (e.key === "Escape") {
        lightboxModal.style.display = "none";
        document.body.style.overflow = "";
      }
    }
  });
}
