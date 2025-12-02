// ==========================================================================
// ===  FUNCIONALIDAD DEL MENÚ RESPONSIVE  ===
// ==========================================================================

// Obtener elementos del DOM para el menú
const menu = document.getElementById("menu");
const toggleOpen = document.getElementById("toggle_open");
const toggleClose = document.getElementById("toggle_close");

// Verificar que los elementos del menú existen antes de añadir escuchadores
if (menu && toggleOpen && toggleClose) {
  // Agregar eventos a los botones de apertura y cierre
  
  toggleOpen.addEventListener("click", toggleMenu);
  toggleClose.addEventListener("click", toggleMenu);

  function toggleMenu() {
    // Alternar la clase para mostrar/ocultar el menú
    menu.classList.toggle("show-menu");

    // Verificar si el menú está abierto
    const isMenuOpen = menu.classList.contains("show-menu");

    // Controlar la visibilidad de los iconos de apertura/cierre
    toggleOpen.style.display = isMenuOpen ? "none" : "block";
    toggleClose.style.display = isMenuOpen ? "block" : "none";

    // Mejorar accesibilidad: actualizar el atributo aria-expanded
    toggleOpen.setAttribute("aria-expanded", isMenuOpen);
    toggleClose.setAttribute("aria-expanded", isMenuOpen);
  }
} else {
  console.warn(
    "Algunos elementos del menú (ID: menu, toggle_open, toggle_close) no se encontraron en el DOM."
  );
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
// ===  FUNCIONALIDAD: BOTÓN SCROLL TO TOP  ===
// ==========================================================================

const scrollToTopBtn = document.getElementById("scroll-to-top");

if (scrollToTopBtn) {
  // 1. Mostrar/Ocultar el botón al hacer scroll
  window.addEventListener("scroll", () => {
    // Muestra el botón si el scroll vertical es mayor a 300px (ajustable)
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  // 2. Desplazamiento suave al hacer clic
  scrollToTopBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Evita el salto instantáneo del enlace '#'

    window.scrollTo({
      top: 0,
      behavior: "smooth", // Desplazamiento suave para PC y móvil
    });
  });
} else {
  console.warn("El elemento 'scroll-to-top' no se encontró en el DOM.");
}

// =================== LIGHTBOX CON NAVEGACIÓN (CONDICIONAL) ===================

// Solo ejecutar si estamos en una página con la galería.
const lightboxModal = document.getElementById("lightbox-modal");
const galleryImages = Array.from(document.querySelectorAll(".design-card img"));

if (lightboxModal && galleryImages.length > 0) {
  let currentImgIndex = 0;

  // Crear botones de navegación si no existen
  function ensureLightboxNavButtons() {
    if (!document.getElementById("lightbox-prev")) {
      const prevBtn = document.createElement("button");
      prevBtn.id = "lightbox-prev";
      prevBtn.innerHTML = "&#10094;";
      prevBtn.className = "lightbox-nav";
      lightboxModal.appendChild(prevBtn);
    }
    if (!document.getElementById("lightbox-next")) {
      const nextBtn = document.createElement("button");
      nextBtn.id = "lightbox-next";
      nextBtn.innerHTML = "&#10095;";
      nextBtn.className = "lightbox-nav";
      lightboxModal.appendChild(nextBtn);
    }
  }

  // Mostrar imagen en el lightbox según el índice
  function showLightboxImage(index) {
    const modalImg = document.getElementById("lightbox-img");
    const caption = document.getElementById("lightbox-caption");
    const whatsappBtn = document.getElementById("whatsapp-btn");
    currentImgIndex = index;
    modalImg.src = galleryImages[index].src;
    caption.textContent = galleryImages[index].alt;

    const designCard = galleryImages[index].closest(".design-card");
    const titleElement = designCard.querySelector(".card-info h3");
    const titulo = titleElement
      ? titleElement.textContent
      : galleryImages[index].alt;

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
  document.getElementById("lightbox-close").onclick = function () {
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
    if (e.target.id === "lightbox-next") {
      e.stopPropagation();
      let next = (currentImgIndex + 1) % galleryImages.length;
      showLightboxImage(next);
    }
    if (e.target.id === "lightbox-prev") {
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
