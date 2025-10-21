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

    if (isMenuOpen) {
      toggleOpen.style.display = "none";
      toggleClose.style.display = "block";
    } else {
      toggleOpen.style.display = "block";
      toggleClose.style.display = "none";
    }

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

  if (servicioRadios.length > 0) {
    servicioRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (prendasDTFDiv) prendasDTFDiv.style.display = "none";
        if (prendasSublimacionDiv) prendasSublimacionDiv.style.display = "none";

        if (this.value === "dtf") {
          if (prendasDTFDiv) prendasDTFDiv.style.display = "block";
        } else if (this.value === "sublimacion") {
          if (prendasSublimacionDiv)
            prendasSublimacionDiv.style.display = "block";
        } else if (this.value === "ambos") {
          if (prendasDTFDiv) prendasDTFDiv.style.display = "block";
          if (prendasSublimacionDiv)
            prendasSublimacionDiv.style.display = "block";
        }
      });
    });
  }
});

// ==========================================================================
// ===  FUNCIONALIDAD: BOTÓN SCROLL TO TOP  ===
// ==========================================================================

const scrollToTopBtn = document.getElementById("scroll-to-top");

if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
