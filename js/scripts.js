// ==========================================================================
// ===  FUNCIONALIDAD DE LA GALERÍA Y EL LIGHTBOX (ESPECÍFICO DE diseño.html)  ===
// ==========================================================================

const galleryImages = document.querySelectorAll(".design-image");
let currentImgIndex = 0;

function showLightboxImage(index) {
  if (galleryImages.length === 0) return;

  // Actualizar índice actual
  currentImgIndex = index;

  // Obtener elementos del lightbox
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const whatsappBtn = document.getElementById("whatsapp-btn");

  // Mostrar la imagen actual
  const image = galleryImages[currentImgIndex];
  lightboxImg.src = image.src;
  lightboxCaption.textContent = image.alt;

  // Actualizar enlace de WhatsApp
  const whatsappMessage = `¡Hola! Me interesa el diseño de la galería: "${image.alt}". ¿Me podrían dar más información?`;
  const whatsappLink = `https://wa.me/573003050186?text=${encodeURIComponent(
    whatsappMessage
  )}`;
  whatsappBtn.href = whatsappLink;
}

// Abrir lightbox al hacer click en cualquier imagen de la galería
galleryImages.forEach((image, index) => {
  image.addEventListener("click", () => {
    document.getElementById("lightbox-modal").style.display = "flex";
    document.body.style.overflow = "hidden"; // Evita el scroll en el body
    showLightboxImage(index);
  });
});

// Cerrar lightbox
const lightboxClose = document.getElementById("lightbox-close");
if (lightboxClose) {
  lightboxClose.onclick = function () {
    document.getElementById("lightbox-modal").style.display = "none";
    document.body.style.overflow = "";
  };
}

// Cerrar al hacer click fuera de la imagen
const lightboxModal = document.getElementById("lightbox-modal");
if (lightboxModal) {
  lightboxModal.onclick = function (e) {
    if (e.target === this) {
      this.style.display = "none";
      document.body.style.overflow = "";
    }
  };
}

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

// Opcional: navegación con flechas del teclado
document.addEventListener("keydown", function (e) {
  const modal = document.getElementById("lightbox-modal");
  if (modal && modal.style.display === "flex") {
    if (e.key === "ArrowRight") {
      let next = (currentImgIndex + 1) % galleryImages.length;
      showLightboxImage(next);
    }
    if (e.key === "ArrowLeft") {
      let prev =
        (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
      showLightboxImage(prev);
    }
  }
});
