// js/registro-gastos.js

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("registro-gastos-form");
  const loadingOverlay = document.getElementById("loading-overlay");

  // Función para formatear números en VES
  function formatVES(numero) {
    return `Bs. ${parseFloat(numero).toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

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

      // Validación básica del monto
      const monto = parseFloat(data.monto);
      if (isNaN(monto) || monto <= 0) {
        alert("El monto debe ser un número positivo.");
        hideLoading();
        return;
      }

      // Asegurar que el usuario logueado se incluya en los datos
      data.usuario = sessionStorage.getItem("usuario") || "admin";

      try {
        const response = await fetch("/.netlify/functions/registrar-gasto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          alert(
            `✅ Gasto registrado con éxito!\n\n` +
              `Monto: ${formatVES(monto)}\n` +
              `Categoría: ${data.categoria}`
          );
          formulario.reset();
        } else {
          throw new Error(
            result.error || "Error desconocido al registrar el gasto."
          );
        }
      } catch (error) {
        console.error("❌ Error al registrar el gasto:", error);
        alert(`⚠️ Error al registrar el gasto: ${error.message}`);
      } finally {
        hideLoading();
      }
    });
  }
});
