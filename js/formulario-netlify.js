// ==========================================================================
// ===  FUNCIONALIDAD DEL FORMULARIO Y LÓGICA DE VISIBILIDAD DE CAMPOS (ESPECÍFICO DE formulario.html)  ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("cotizacion-form");
  const loadingOverlay = document.getElementById("loading-overlay");

  if (formulario) {
    formulario.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Mostrar animación de carga
      if (loadingOverlay) {
        loadingOverlay.style.display = "flex";
      }

      // ** NOTA: EL ENVÍO REAL DEL FORMULARIO SE MANEJA POR NETLIFY
      // DEJA QUE LA ACCIÓN DE NETLIFY SE ENCARGUE DE LA PERSISTENCIA DE DATOS
      // El siguiente código solo simula y redirige a la página de gracias.

      setTimeout(() => {
        if (loadingOverlay) {
          loadingOverlay.style.display = "none";
        }
        // Redirigir a una página de agradecimiento
        window.location.href = "/gracias.html";
      }, 1500);
    });
  }

  // ==========================================================================
  // === Lógica para mostrar/ocultar campos de DTF/Sublimación ===
  // ==========================================================================

  const servicioRadios = document.querySelectorAll('input[name="servicio"]');
  const prendasDTFDiv = document.getElementById("prendasDTF");
  const prendasSublimacionDiv = document.getElementById("prendasSublimacion");

  if (servicioRadios.length > 0) {
    servicioRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        // Ocultar ambos por defecto
        if (prendasDTFDiv) prendasDTFDiv.style.display = "none";
        if (prendasSublimacionDiv) prendasSublimacionDiv.style.display = "none";

        // Mostrar solo el relevante
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
