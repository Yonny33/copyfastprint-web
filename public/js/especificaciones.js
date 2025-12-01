// ==========================================================================
// ===  FUNCIONALIDAD: TABS Y ACORDEÓN (ESPECÍFICO DE especificaciones.html)  ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Si no hay tabs, salir de la función
  if (tabButtons.length === 0 || tabContents.length === 0) {
    return;
  }

  // Agregar evento a cada botón de tab
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Remover clase active de todos los botones y contenidos
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Agregar clase active al botón y contenido seleccionado
      this.classList.add("active");
      const activeTab = document.getElementById(tabName);
      if (activeTab) {
        activeTab.classList.add("active");
        // Smooth scroll para pantallas más pequeñas
        if (window.innerWidth < 768) {
          activeTab.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Hacer clic en el primer tab por defecto
  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }
});
