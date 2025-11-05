// js/registro-ventas.js

// ==========================================================================
// ===  LÓGICA DEL FORMULARIO DE REGISTRO DE VENTAS (VES)  ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("registro-ventas-form");
  const loadingOverlay = document.getElementById("loading-overlay");
  const montoTotalInput = document.getElementById("montoTotal");
  const montoPagadoInput = document.getElementById("montoPagado");

  // Función para formatear números en VES
  function formatVES(numero) {
    return `Bs. ${parseFloat(numero).toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Función para mostrar loading
  function showLoading() {
    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }
  }

  // Función para ocultar loading
  function hideLoading() {
    if (loadingOverlay) {
      loadingOverlay.style.display = "none";
    }
  }

  // Validación en tiempo real del monto pagado
  if (montoPagadoInput && montoTotalInput) {
    montoPagadoInput.addEventListener("input", function () {
      const montoTotal = parseFloat(montoTotalInput.value) || 0;
      const montoPagado = parseFloat(montoPagadoInput.value) || 0;

      if (montoPagado > montoTotal) {
        montoPagadoInput.setCustomValidity(
          "El monto pagado no puede ser mayor que el monto total."
        );
      } else {
        montoPagadoInput.setCustomValidity("");
      }
    });
  }

  if (formulario) {
    formulario.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Forzar la validación de HTML5 (incluyendo la personalizada)
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }

      showLoading();

      // 1. Obtener datos del formulario
      const formData = new FormData(formulario);
      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      // 2. Incluir usuario
      data.usuario = sessionStorage.getItem("usuario") || "admin";

      // 3. Preparar los montos
      const montoTotal = parseFloat(data.montoTotal);
      const montoPagado = parseFloat(data.montoPagado);
      const montoPendiente = montoTotal - montoPagado;
      let estadoCredito = montoPendiente > 0 ? "Crédito" : "Completada";

      try {
        // 4. Llamar a la función de Netlify
        const response = await fetch("/.netlify/functions/registrar-venta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        // 5. Manejar la respuesta
        if (result.success) {
          // Mensaje de éxito con formato VES
          alert(
            `✅ Venta registrada con éxito!\n\n` +
              `Estado: ${estadoCredito}\n` +
              `Divisa: Bolívares (VES) 🇻🇪\n` +
              `Monto Total: ${formatVES(montoTotal)}\n` +
              `Monto Pagado: ${formatVES(montoPagado)}\n` +
              `Saldo Pendiente: ${formatVES(montoPendiente)}`
          );

          // Limpiar el formulario
          formulario.reset();
        } else {
          throw new Error(result.error || "Error desconocido en el servidor");
        }
      } catch (error) {
        console.error("❌ Error de conexión:", error);

        // Mensaje de error amigable
        alert(
          `⚠️ Error al registrar la venta:\n\n${error.message}\n\n` +
            `Si el problema persiste, contacta al administrador del sistema.`
        );
      } finally {
        // 7. Ocultar animación de carga
        hideLoading();
      }
    });

    // Evento para el botón reset
    formulario.addEventListener("reset", function () {
      // Limpiar cualquier validación personalizada
      if (montoPagadoInput) {
        montoPagadoInput.setCustomValidity("");
      }
    });
  }
});
