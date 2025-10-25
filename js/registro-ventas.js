// ==========================================================================
// ===  LÓGICA DEL FORMULARIO DE REGISTRO DE VENTAS  ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("registro-ventas-form");
  const loadingOverlay = document.getElementById("loading-overlay");
  const montoTotalInput = document.getElementById("montoTotal");
  const montoPagadoInput = document.getElementById("montoPagado");
  const divisaSelect = document.getElementById("divisa");
  const divisaHint = document.getElementById("divisaHint");

  // Mapeo de símbolos de divisa
  const divisaSymbols = {
    COP: { symbol: "$", name: "Pesos Colombianos (COP)", flag: "🇨🇴" },
    USD: { symbol: "$", name: "Dólares Americanos (USD)", flag: "🇺🇸" },
    VES: { symbol: "Bs.", name: "Bolívares Venezolanos (VES)", flag: "🇻🇪" },
    EUR: { symbol: "€", name: "Euros (EUR)", flag: "🇪🇺" },
  };

  // Actualizar hint cuando cambie la divisa
  if (divisaSelect && divisaHint) {
    divisaSelect.addEventListener("change", function () {
      const selectedDivisa = this.value;
      const divisaInfo = divisaSymbols[selectedDivisa];
      divisaHint.innerHTML = `${divisaInfo.flag} Valor en <strong>${divisaInfo.name}</strong>`;

      // Actualizar placeholder con símbolo correcto
      if (selectedDivisa === "COP") {
        montoTotalInput.placeholder = "150000";
        montoPagadoInput.placeholder = "50000";
      } else if (selectedDivisa === "USD") {
        montoTotalInput.placeholder = "50.00";
        montoPagadoInput.placeholder = "20.00";
      } else if (selectedDivisa === "VES") {
        montoTotalInput.placeholder = "500.00";
        montoPagadoInput.placeholder = "200.00";
      } else if (selectedDivisa === "EUR") {
        montoTotalInput.placeholder = "45.00";
        montoPagadoInput.placeholder = "20.00";
      }
    });
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
          "El monto pagado no puede ser mayor al monto total"
        );
        montoPagadoInput.reportValidity();
      } else {
        montoPagadoInput.setCustomValidity("");
      }
    });
  }

  if (formulario) {
    formulario.addEventListener("submit", async function (e) {
      e.preventDefault();

      // 1. Validación adicional
      const montoTotal = parseFloat(
        document.getElementById("montoTotal").value
      );
      const montoPagado =
        parseFloat(document.getElementById("montoPagado").value) || 0;

      if (montoPagado > montoTotal) {
        alert("❌ Error: El monto pagado no puede ser mayor al monto total.");
        return;
      }

      // 2. Mostrar animación de carga
      showLoading();

      // 3. Calcular crédito
      const montoPendiente = montoTotal - montoPagado;
      const estadoCredito = montoPendiente > 0 ? "PENDIENTE" : "PAGADO";

      // 4. Recolectar datos del formulario
      const formData = new FormData(formulario);
      const data = Object.fromEntries(formData);

      const payload = {
        ...data,
        montoTotal: montoTotal.toFixed(2),
        montoPagado: montoPagado.toFixed(2),
        montoPendiente: montoPendiente.toFixed(2),
        estadoCredito: estadoCredito,
        fechaRegistro: new Date().toISOString(),
      };

      console.log("📊 Datos a enviar:", payload);

      // 5. Enviar datos a la Netlify Function / Backend
      try {
        const response = await fetch("/.netlify/functions/registrar-venta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        // 6. Manejar la respuesta
        if (response.ok && result.success) {
          // Obtener símbolo de la divisa
          const divisaSeleccionada = document.getElementById("divisa").value;
          const simbolo = divisaSymbols[divisaSeleccionada].symbol;

          // Mostrar mensaje de éxito
          alert(
            `✅ Venta registrada con éxito!\n\n` +
              `Estado: ${estadoCredito}\n` +
              `Divisa: ${divisaSeleccionada}\n` +
              `Monto Total: ${simbolo}${montoTotal.toFixed(2)}\n` +
              `Monto Pagado: ${simbolo}${montoPagado.toFixed(2)}\n` +
              `Saldo Pendiente: ${simbolo}${montoPendiente.toFixed(2)}`
          );

          // Limpiar el formulario
          formulario.reset();

          // Restaurar hint a COP (valor por defecto)
          if (divisaHint) {
            divisaHint.innerHTML = `🇨🇴 Valor en <strong>Pesos Colombianos (COP)</strong>`;
          }

          // Opcional: Redirigir a una página de éxito
          // setTimeout(() => {
          //   window.location.href = "/gracias-registro.html";
          // }, 2000);
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
  } else {
    console.error(
      "❌ No se encontró el formulario con id 'registro-ventas-form'"
    );
  }
});
