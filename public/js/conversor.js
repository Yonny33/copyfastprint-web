document.addEventListener("DOMContentLoaded", () => {
  // --- URL DE LA FIREBASE FUNCTION ---
  // Reemplaza 'YOUR_PROJECT_ID' con el ID de tu proyecto de Firebase.
  const firebaseFunctionURL =
    "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/getExchangeRates";

  // === MANEJO DE LA CALCULADORA DE DIVISAS ===
  const amountInput = document.getElementById("amount");
  const fromCurrencySelect = document.getElementById("fromCurrency");
  const toCurrencySelect = document.getElementById("toCurrency");
  const calculateBtn = document.getElementById("calculateBtn");
  const swapBtn = document.getElementById("swapBtn");
  const refreshBtn = document.getElementById("refreshRates");
  const resultAmount = document.getElementById("resultAmount");
  const exchangeRateDisplay = document.getElementById("exchangeRate");
  const lastUpdateDisplay = document.getElementById("lastUpdate");
  const loadingOverlay = document.getElementById("loadingOverlay");

  // Solo inicializar si todos los elementos existen
  if (
    amountInput &&
    fromCurrencySelect &&
    toCurrencySelect &&
    calculateBtn &&
    swapBtn &&
    refreshBtn &&
    resultAmount &&
    exchangeRateDisplay &&
    lastUpdateDisplay &&
    loadingOverlay
  ) {
    let exchangeRates = {};

    async function fetchExchangeRates() {
      if (loadingOverlay) loadingOverlay.style.display = "flex";
      try {
        const response = await fetch(firebaseFunctionURL);
        if (!response.ok) throw new Error("Error de red al obtener tasas.");

        const rates = await response.json();
        if (rates) {
          exchangeRates = rates;
          if (lastUpdateDisplay) {
            lastUpdateDisplay.textContent = `✓ Actualizado: ${new Date().toLocaleTimeString()}`;
            lastUpdateDisplay.style.color = "var(--success-color)";
          }
          calculateConversion();
        } else {
          throw new Error(
            "No se pudieron obtener las tasas desde el servidor.",
          );
        }
      } catch (error) {
        console.error("Error al obtener tasas de cambio:", error);
        if (lastUpdateDisplay) {
          lastUpdateDisplay.textContent = "Error al actualizar tasas";
          lastUpdateDisplay.style.color = "var(--error-color)";
        }
      } finally {
        if (loadingOverlay) loadingOverlay.style.display = "none";
      }
    }

    function calculateConversion() {
      const amount = parseFloat(amountInput.value) || 0;
      const from = fromCurrencySelect.value;
      const to = toCurrencySelect.value;

      if (amount <= 0 || !exchangeRates[from] || !exchangeRates[to]) {
        resultAmount.textContent = new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: to,
        }).format(0);
        exchangeRateDisplay.textContent = "Ingresa un valor válido";
        return;
      }

      const rate = exchangeRates[to] / exchangeRates[from];
      const result = amount * rate;

      resultAmount.textContent = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: to,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(result);

      exchangeRateDisplay.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    }

    // Event Listeners
    calculateBtn.addEventListener("click", calculateConversion);
    swapBtn.addEventListener("click", () => {
      [fromCurrencySelect.value, toCurrencySelect.value] = [
        toCurrencySelect.value,
        fromCurrencySelect.value,
      ];
      calculateConversion();
    });
    refreshBtn.addEventListener("click", fetchExchangeRates);

    // Calcular en tiempo real al cambiar valores
    amountInput.addEventListener("input", calculateConversion);
    fromCurrencySelect.addEventListener("change", calculateConversion);
    toCurrencySelect.addEventListener("change", calculateConversion);

    // Carga inicial de las tasas de cambio
    fetchExchangeRates();
  }
});
