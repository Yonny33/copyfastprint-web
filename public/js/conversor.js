document.addEventListener("DOMContentLoaded", () => {
  // --- URL DE LA API ---
  // Usamos la ruta relativa a nuestra API Express en Firebase Functions
  const firebaseFunctionURL = "/api/exchange-rates";

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
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || "Error de red al obtener tasas.",
          );
        }

        if (!responseData.rates) {
          throw new Error(
            responseData.message || "La respuesta no contiene tasas válidas.",
          );
        }

        exchangeRates = responseData.rates;
        if (lastUpdateDisplay) {
          const updateDate = new Date(responseData.last_updated);
          lastUpdateDisplay.textContent = `✓ Actualizado: ${updateDate.toLocaleString()}`;
          lastUpdateDisplay.style.color = "var(--success-color)";
        }
        calculateConversion();
      } catch (error) {
        console.error("Error al obtener tasas de cambio:", error);
        if (lastUpdateDisplay) {
          lastUpdateDisplay.textContent = `Error: ${error.message}`;
          lastUpdateDisplay.style.color = "var(--error-color)";
        }
      } finally {
        if (loadingOverlay) loadingOverlay.style.display = "none";
      }
    }

    function calculateConversion() {
      // MEJORA: Permitir comas y puntos (ej: 10,50 o 10.50)
      let rawValue = amountInput.value
        ? amountInput.value.replace(",", ".")
        : "";
      const amount = parseFloat(rawValue) || 0;

      const from = fromCurrencySelect.value;
      const to = toCurrencySelect.value;

      if (amount <= 0 || !exchangeRates[from] || !exchangeRates[to]) {
        // Forzamos el formato "1.000,00" para consistencia
        resultAmount.textContent = new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: to,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(0);
        exchangeRateDisplay.textContent = "Ingresa un valor válido";
        return;
      }

      const rate = exchangeRates[to] / exchangeRates[from];
      const result = amount * rate;

      // Forzamos el formato "1.000,00" para consistencia
      resultAmount.textContent = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: to,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(result);

      // Ajustar decimales visuales para tasas muy pequeñas (ej: COP a USD)
      const decimals = rate < 0.01 ? 7 : 4;
      exchangeRateDisplay.textContent = `1 ${from} = ${rate.toFixed(decimals)} ${to}`;
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
