// ==========================================================================
// ===  LÓGICA DEL PANEL ADMINISTRATIVO (admin.html)  ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const loadingOverlay = document.getElementById("loading-overlay");

  // 1. VERIFICACIÓN DE SESIÓN (Dejado sin cambios)
  if (sessionStorage.getItem("sesionActiva") !== "true") {
    window.location.href = "login-registro.html";
    return;
  }

  // 2. FUNCIÓN PARA FORMATEAR MONEDA (Dejado sin cambios)
  function formatVES(numero) {
    // Asegurarse de que el número es un float antes de formatear
    const num = parseFloat(numero);
    if (isNaN(num)) return "Bs. 0.00";
    return `Bs. ${num.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // 3. LÓGICA DE CÁLCULO DE INDICADORES (NUEVA FUNCIÓN)
  function calcularIndicadores(ventas, gastos) {
    const hoy = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const mesActual = new Date().toISOString().substring(0, 7); // 'YYYY-MM'

    let ventasDia = 0;
    let ingresosMes = 0;
    let creditosPendientes = 0;
    let gastosDia = 0;
    let clientesPendientes = 0; // Se usará para contar créditos

    // --- CÁLCULOS DE VENTAS Y CRÉDITOS ---
    ventas.forEach((v) => {
      // Intentar parsear las columnas con los nombres normalizados
      const montoTotal = parseFloat(v.venta_bruta_ves) || 0;
      const montoPendiente = parseFloat(v.saldo_pendiente_ves) || 0;
      const fechaVenta = v.fecha; // El formato es 'YYYY-MM-DD'

      // Ventas del día (venta bruta total)
      if (fechaVenta === hoy) {
        ventasDia += montoTotal;
      }

      // Ingresos del mes (venta bruta total)
      if (fechaVenta && fechaVenta.startsWith(mesActual)) {
        ingresosMes += montoTotal;
      }

      // Créditos Pendientes (acumulado total)
      if (v.saldo_pendiente_ves && montoPendiente > 0) {
        creditosPendientes += montoPendiente;
        clientesPendientes += 1; // Contar cada registro con saldo
      }
    });

    // --- CÁLCULOS DE GASTOS ---
    gastos.forEach((g) => {
      const montoGasto = parseFloat(g.monto_total_ves) || 0;
      const fechaGasto = g.fecha;

      // Gastos del día
      if (fechaGasto === hoy) {
        gastosDia += montoGasto;
      }
    });

    return {
      ventasDia,
      ingresosMes,
      creditosPendientes,
      gastosDia,
      clientesPendientes,
    };
  }

  // 4. FUNCIÓN PRINCIPAL DE CARGA
  async function cargarDashboard() {
    if (loadingOverlay) loadingOverlay.style.display = "flex";

    try {
      // 🚨 USAR LA FUNCIÓN REAL DE NETLIFY 🚨
      const response = await fetch(
        "/.netlify/functions/obtener-data-admin?type=dashboard"
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(
          result.error || "Datos incompletos o error de servidor."
        );
      }

      // 5. PROCESAR LOS DATOS DE GOOGLE SHEETS
      const { ventas, gastos } = result.data;
      const indicadores = calcularIndicadores(ventas, gastos);

      // Inyectar datos en el DOM
      document.getElementById("ventasDia").textContent = formatVES(
        indicadores.ventasDia
      );
      document.getElementById("ingresosMes").textContent = formatVES(
        indicadores.ingresosMes
      );
      document.getElementById("creditosPendientes").textContent = formatVES(
        indicadores.creditosPendientes
      );
      document.getElementById("gastosDia").textContent = formatVES(
        indicadores.gastosDia
      );
      document.getElementById("clientesPendientes").textContent =
        indicadores.clientesPendientes; // Este es un conteo, no moneda
    } catch (error) {
      console.error("❌ Error al cargar el dashboard:", error);
      // Mantener los valores en 0 o mostrar error
      document.getElementById("ventasDia").textContent = formatVES(0);
      document.getElementById("ingresosMes").textContent = formatVES(0);
      document.getElementById("creditosPendientes").textContent = formatVES(0);
      document.getElementById("gastosDia").textContent = formatVES(0);
      document.getElementById("clientesPendientes").textContent = 0;
      alert(`⚠️ Error al cargar datos: ${error.message}`);
    } finally {
      if (loadingOverlay) loadingOverlay.style.display = "none";
    }
  }

  // 6. Ejecutar la carga al inicio
  cargarDashboard();
});
