// Menú responsive
const menu = document.getElementById("menu");
const toggleOpen = document.getElementById("toggle_open");
const toggleClose = document.getElementById("toggle_close");

if (menu && toggleOpen && toggleClose) {
  toggleOpen.addEventListener("click", toggleMenu);
  toggleClose.addEventListener("click", toggleMenu);

  function toggleMenu() {
    menu.classList.toggle("show-menu");
    const isMenuOpen = menu.classList.contains("show-menu");
    toggleOpen.style.display = isMenuOpen ? "none" : "block";
    toggleClose.style.display = isMenuOpen ? "block" : "none";
  }
}

// Campos dinámicos
document.addEventListener("DOMContentLoaded", function () {
  const servicioRadios = document.querySelectorAll('input[name="servicio"]');
  const prendasDTF = document.getElementById("prendasDTF");
  const prendasSublimacion = document.getElementById("prendasSublimacion");

  servicioRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      prendasDTF.style.display = "none";
      prendasSublimacion.style.display = "none";

      if (this.value === "dtf") {
        prendasDTF.style.display = "block";
      } else if (this.value === "sublimacion") {
        prendasSublimacion.style.display = "block";
      } else if (this.value === "ambos") {
        prendasDTF.style.display = "block";
        prendasSublimacion.style.display = "block";
      }
    });
  });
});

// ==========================================================================
// FUNCIONALIDAD BOTÓN "IR A ARRIBA"
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  // 1. Mostrar/Ocultar el botón al hacer scroll
  window.addEventListener("scroll", () => {
    if (scrollToTopBtn) {
      // Muestra el botón cuando el scroll vertical supera los 300px
      if (window.scrollY > 300) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
    }
  });

  // 2. Función de scroll suave al hacer clic
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Evita el salto instantáneo
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Desplazamiento suave
      });
    });
  }
});
