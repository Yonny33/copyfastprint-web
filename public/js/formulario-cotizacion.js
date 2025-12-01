
document.addEventListener("DOMContentLoaded", () => {
  // Lógica para mostrar/ocultar campos de DTF/Sublimación
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
