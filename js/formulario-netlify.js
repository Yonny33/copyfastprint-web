// ==========================================================================
// FUNCIONALIDAD DEL MENÚ RESPONSIVE
// ==========================================================================

const menu = document.getElementById("menu");
const toggleOpen = document.getElementById("toggle_open");
const toggleClose = document.getElementById("toggle_close");

if (menu && toggleOpen && toggleClose) {
  toggleOpen.addEventListener("click", toggleMenu);
  toggleClose.addEventListener("click", toggleMenu);

  function toggleMenu() {
    menu.classList.toggle("show-menu");
    const isMenuOpen = menu.classList.contains("show-menu");

    if (isMenuOpen) {
      toggleOpen.style.display = "none";
      toggleClose.style.display = "block";
    } else {
      toggleOpen.style.display = "block";
      toggleClose.style.display = "none";
    }

    toggleOpen.setAttribute("aria-expanded", isMenuOpen);
    toggleClose.setAttribute("aria-expanded", isMenuOpen);
  }
}

// Cerrar menú al hacer click en un enlace
const menuLinks = document.querySelectorAll(".menu li a");
menuLinks.forEach((link) => {
  link.addEventListener("click", function () {
    if (menu && menu.classList.contains("show-menu")) {
      menu.classList.remove("show-menu");
      if (toggleOpen) toggleOpen.style.display = "block";
      if (toggleClose) toggleClose.style.display = "none";
    }
  });
});

// ==========================================================================
// FUNCIONALIDAD DEL FORMULARIO
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  const servicioRadios = document.querySelectorAll('input[name="servicio"]');
  const prendasDTFDiv = document.getElementById("prendasDTF");
  const prendasSublimacionDiv = document.getElementById("prendasSublimacion");

  if (servicioRadios.length > 0) {
    servicioRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (prendasDTFDiv) prendasDTFDiv.style.display = "none";
        if (prendasSublimacionDiv) prendasSublimacionDiv.style.display = "none";

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

// ==========================================================================
// ===  FUNCIONALIDAD: BOTÓN SCROLL TO TOP  ===
// ==========================================================================

const scrollToTopBtn = document.getElementById("scroll-to-top");

if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
// ==========================================================================
// CALCULADORA DE DIVISAS CON FASTFOREX API
// ==========================================================================

const API_KEY = "3a8ce0acef-aaeef20681-t3vl30";
const API_URL = "https://api.fastforex.io/fetch-multi";

let exchangeRates = {};
let lastUpdateTime = null;

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

// Función para obtener tasas de cambio desde FastForex API
async function fetchExchangeRates() {
  try {
    loadingOverlay.style.display = "flex";

    // Obtener tasas para nuestras monedas base
    const currencies = "COP,VES,USD,EUR";
    const response = await fetch(
      `${API_URL}?from=USD&to=${currencies}&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener tasas de cambio");
    }

    const data = await response.json();

    if (data.results) {
      // Construir objeto de tasas de cambio
      const usdRates = data.results;

      exchangeRates = {
        USD: {
          COP: usdRates.COP || 4000,
          VES: usdRates.VES || 44,
          EUR: usdRates.EUR || 0.92,
          USD: 1,
        },
        COP: {
          USD: 1 / (usdRates.COP || 4000),
          VES: (usdRates.VES || 44) / (usdRates.COP || 4000),
          EUR: (usdRates.EUR || 0.92) / (usdRates.COP || 4000),
          COP: 1,
        },
        VES: {
          USD: 1 / (usdRates.VES || 44),
          COP: (usdRates.COP || 4000) / (usdRates.VES || 44),
          EUR: (usdRates.EUR || 0.92) / (usdRates.VES || 44),
          VES: 1,
        },
        EUR: {
          USD: 1 / (usdRates.EUR || 0.92),
          COP: (usdRates.COP || 4000) / (usdRates.EUR || 0.92),
          VES: (usdRates.VES || 44) / (usdRates.EUR || 0.92),
          EUR: 1,
        },
      };

      lastUpdateTime = new Date();
      updateLastUpdateDisplay();
      calculateConversion();

      console.log("Tasas actualizadas correctamente");
    }
  } catch (error) {
    console.error("Error al obtener tasas:", error);
    // Usar tasas de respaldo si falla la API
    useFallbackRates();
    alert(
      "No se pudieron obtener las tasas en tiempo real. Usando tasas aproximadas."
    );
  } finally {
    loadingOverlay.style.display = "none";
  }
}

// Tasas de respaldo en caso de error de API
function useFallbackRates() {
  exchangeRates = {
    COP: {
      USD: 0.00025,
      EUR: 0.00023,
      VES: 0.011,
      COP: 1,
    },
    USD: {
      COP: 4000,
      EUR: 0.92,
      VES: 44,
      USD: 1,
    },
    EUR: {
      COP: 4350,
      USD: 1.09,
      VES: 48,
      EUR: 1,
    },
    VES: {
      COP: 90,
      USD: 0.023,
      EUR: 0.021,
      VES: 1,
    },
  };
  lastUpdateTime = new Date();
  lastUpdateDisplay.textContent = "Tasas aproximadas (no actualizadas)";
}

// Función para actualizar el display de última actualización
function updateLastUpdateDisplay() {
  if (lastUpdateTime) {
    const timeString = lastUpdateTime.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    lastUpdateDisplay.textContent = `Actualizado: ${timeString}`;
  }
}

// Función para formatear números
function formatNumber(num, currency) {
  try {
    const formatted = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
    return formatted;
  } catch (error) {
    return `${currency} ${num.toFixed(2)}`;
  }
}

// Función para calcular conversión
function calculateConversion() {
  const amount = parseFloat(amountInput.value) || 0;
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  if (amount <= 0) {
    resultAmount.textContent = formatNumber(0, toCurrency);
    exchangeRateDisplay.textContent = "Ingresa una cantidad válida";
    return;
  }

  if (!exchangeRates[fromCurrency]) {
    exchangeRateDisplay.textContent = "Cargando tasas...";
    return;
  }

  // Obtener tasa de cambio
  const rate = exchangeRates[fromCurrency][toCurrency];
  const result = amount * rate;

  // Mostrar resultado
  resultAmount.textContent = formatNumber(result, toCurrency);

  // Mostrar tasa con más decimales para tasas pequeñas
  const rateDisplay = rate < 0.01 ? rate.toFixed(6) : rate.toFixed(4);
  exchangeRateDisplay.textContent = `1 ${fromCurrency} = ${rateDisplay} ${toCurrency}`;
}

// Función para intercambiar monedas
function swapCurrencies() {
  const tempFrom = fromCurrencySelect.value;
  fromCurrencySelect.value = toCurrencySelect.value;
  toCurrencySelect.value = tempFrom;
  calculateConversion();
}

// Event Listeners
calculateBtn.addEventListener("click", calculateConversion);
swapBtn.addEventListener("click", swapCurrencies);
refreshBtn.addEventListener("click", fetchExchangeRates);
amountInput.addEventListener("input", calculateConversion);
fromCurrencySelect.addEventListener("change", calculateConversion);
toCurrencySelect.addEventListener("change", calculateConversion);

// Cargar tasas al iniciar
fetchExchangeRates();
