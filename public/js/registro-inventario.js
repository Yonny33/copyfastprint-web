// js/registro-inventario.js

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("registro-inventario-form");
  const loadingOverlay = document.getElementById("loading-overlay");

  // Función para mostrar animación de carga
  function showLoading() {
    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }
  }

  // Función para ocultar animación de carga
  function hideLoading() {
    if (loadingOverlay) {
      loadingOverlay.style.display = "none";
    }
  }

  if (formulario) {
    formulario.addEventListener("submit", async function (e) {
      e.preventDefault();
      showLoading();

      const formData = new FormData(formulario);
      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      // Validación de campos obligatorios para inventario
      if (!data.codigoProducto || !data.nombreProducto || !data.cantidad) {
        alert(
          "Por favor, complete todos los campos obligatorios (Código, Nombre, Cantidad)."
        );
        hideLoading();
        return;
      }

      // Asegurar que el usuario logueado se incluya en los datos
      data.usuario = sessionStorage.getItem("usuario") || "admin";

      try {
        const response = await fetch(
          "/.netlify/functions/registrar-inventario",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();

        if (result.success) {
          alert(
            `📦 Movimiento de Inventario registrado con éxito!\n\n` +
              `Producto: ${data.nombreProducto} (${data.codigoProducto})\n` +
              `Tipo: ${data.tipoMovimiento}\n` +
              `Cantidad: ${data.cantidad} ${data.unidadMedida}`
          );
          formulario.reset();
        } else {
          throw new Error(
            result.error || "Error desconocido al registrar el movimiento."
          );
        }
      } catch (error) {
        console.error(
          "❌ Error al registrar el movimiento de inventario:",
          error
        );
        alert(`⚠️ Error al registrar el inventario: ${error.message}`);
      } finally {
        hideLoading();
      }
    });
  }
});
