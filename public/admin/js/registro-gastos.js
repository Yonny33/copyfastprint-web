document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registro-gastos-form");
  if (!form) return;

  const loadingOverlay = document.getElementById("loading-overlay");
  const API_URL = "/api";
  const fechaInput = document.getElementById("fecha");

  const showLoading = (show) => {
    if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Combinar el tipo de documento (V-, J-) con el número de RIF/Cédula
    if (data.tipo_documento && data.rit) {
      data.rit = `${data.tipo_documento}${data.rit}`;
    }
    // Ya no necesitamos el campo auxiliar
    delete data.tipo_documento;

    // Asegurar que el monto se envíe como número
    data.monto = parseFloat(data.monto) || 0;

    try {
      const response = await fetch(`${API_URL}/gastos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          (result && result.message) ||
            `Error del servidor: ${response.status} ${response.statusText}`,
        );
      }

      if (result.status === "success") {
        alert(result.message || "¡Gasto registrado con éxito!");
        form.reset();
        if (fechaInput) fechaInput.valueAsDate = new Date(); // Resetear fecha a hoy
      } else {
        throw new Error(
          result.message ||
            "Ocurrió un error desconocido al registrar el gasto.",
        );
      }
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
      alert(`Error: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  // Inicialización
  if (fechaInput) {
    fechaInput.valueAsDate = new Date();
  }
  form.addEventListener("submit", handleFormSubmit);
});
