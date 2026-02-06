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
  const clearConverterBtn = document.getElementById("clearConverterBtn");
  const openCalcBtn = document.getElementById("openCalcBtn");
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

    // === FUNCIONALIDAD DE LIMPIEZA ===
    if (clearConverterBtn) {
      clearConverterBtn.addEventListener("click", () => {
        amountInput.value = "1";
        // Disparar evento input para recalcular
        amountInput.dispatchEvent(new Event("input"));
      });
    }

    // === FUNCIONALIDAD DE LA CALCULADORA ===
    const simpleCalculator = document.getElementById("simpleCalculator");
    const closeCalcBtn = document.getElementById("closeCalcBtn");
    const calcDisplay = document.getElementById("calcDisplay");
    const calcKeys = document.querySelectorAll(".calc-key");

    // Abrir/Cerrar Calculadora
    if (openCalcBtn && simpleCalculator && closeCalcBtn) {
      openCalcBtn.addEventListener("click", () => {
        simpleCalculator.style.display = "block";
      });
      closeCalcBtn.addEventListener("click", () => {
        simpleCalculator.style.display = "none";
      });
    }

    // Lógica de la Calculadora
    if (calcDisplay && calcKeys.length > 0) {
      let expression = "";

      const updateDisplay = () => {
        calcDisplay.value = expression || "0";
        calcDisplay.scrollLeft = calcDisplay.scrollWidth; // Auto-scroll al final
      };

      const processInput = (key, type) => {
        if (type === "number") {
          // Evitar múltiples puntos en el mismo número
          if (key === ".") {
            const parts = expression.split(/[\+\-\*\/]/);
            const currentPart = parts[parts.length - 1];
            if (currentPart && currentPart.includes(".")) return;
            if (!currentPart) key = "0.";
          }
          expression += key;
        } else if (type === "operator") {
          if (expression === "" && key !== "-") return; // Solo permitir negativo al inicio
          const lastChar = expression.slice(-1);
          if (["+", "-", "*", "/"].includes(lastChar)) {
            // Reemplazar operador si ya existe uno
            expression = expression.slice(0, -1) + key;
          } else {
            expression += key;
          }
        } else if (type === "action") {
          if (key === "clear") {
            expression = "";
          } else if (key === "backspace") {
            expression = expression.slice(0, -1);
          } else if (key === "calculate") {
            try {
              if (expression) {
                // Evaluar expresión de forma segura
                // eslint-disable-next-line no-new-func
                const result = new Function("return " + expression)();
                // Limitar decimales y convertir a string
                expression = String(Math.round(result * 100000) / 100000);
              }
            } catch (e) {
              expression = "Error";
              setTimeout(() => { expression = ""; updateDisplay(); }, 1500);
            }
          }
        }
        updateDisplay();
      };

      // 1. Eventos de Clic en Botones (Ratón/Táctil)
      calcKeys.forEach((key) => {
        key.addEventListener("click", () => {
          const action = key.dataset.action;
          const number = key.dataset.number;

          if (number !== undefined) processInput(number, "number");
          else if (["+", "-", "*", "/"].includes(action)) processInput(action, "operator");
          else if (action) processInput(action, "action");
        });
      });

      // 2. Eventos de Teclado (PC)
      document.addEventListener("keydown", (e) => {
        // Solo si la calculadora está visible
        if (simpleCalculator.style.display === "none") return;
        
        const key = e.key;
        if (/^[0-9.]$/.test(key)) { e.preventDefault(); processInput(key, "number"); }
        else if (["+", "-", "*", "/"].includes(key)) { e.preventDefault(); processInput(key, "operator"); }
        else if (key === "Enter" || key === "=") { e.preventDefault(); processInput("calculate", "action"); }
        else if (key === "Backspace") { e.preventDefault(); processInput("backspace", "action"); }
        else if (key === "Escape") { e.preventDefault(); processInput("clear", "action"); }
      });
    }
  }
});
