// ==========================================================================
// FUNCIONALIDAD DEL MENÚ RESPONSIVE
// ==========================================================================

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
    toggleOpen.setAttribute("aria-expanded", isMenuOpen);
    toggleClose.setAttribute("aria-expanded", isMenuOpen);
  }
}

// Cerrar menú al hacer click en un enlace
const menuLinks = document.querySelectorAll(".menu li a");
menuLinks.forEach((link) => {
  link.addEventListener("click", function () {
    if (menu && menu.classList.contains("show-menu")) {
      menu.classList.remove("show-menu");
      if (toggleOpen) toggleOpen.style.display = "block";
      if (toggleClose) toggleClose.style.display = "none";
    }
  });
});

// ==========================================================================
// FUNCIONALIDAD DEL FORMULARIO
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  const servicioRadios = document.querySelectorAll('input[name="servicio"]');
  const prendasDTFDiv = document.getElementById("prendasDTF");
  const prendasSublimacionDiv = document.getElementById("prendasSublimacion");

  // Mostrar/Ocultar campos según servicio
  servicioRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      prendasDTFDiv.style.display = "none";
      prendasSublimacionDiv.style.display = "none";

      if (this.value === "dtf") {
        prendasDTFDiv.style.display = "block";
      } else if (this.value === "sublimacion") {
        prendasSublimacionDiv.style.display = "block";
      } else if (this.value === "ambos") {
        prendasDTFDiv.style.display = "block";
        prendasSublimacionDiv.style.display = "block";
      }
    });
  });
});
