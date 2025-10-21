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
