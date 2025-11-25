// js/reportes.js
document.addEventListener("DOMContentLoaded", () => {
  // Configuración de Chart.js y funciones auxiliares
  const loadingOverlay = document.getElementById("loading-overlay");

  // Función para cerrar sesión (dejada sin cambios)
  document
    .getElementById("btnCerrarSesion")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        sessionStorage.clear();
        window.location.href = "login-registro.html";
      }
    });

  // Asumimos que formatVES existe globalmente o lo definimos aquí
  function formatVES(numero) {
    const num = parseFloat(numero);
    if (isNaN(num)) return "Bs. 0.00";
    return `Bs. ${num.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Función auxiliar para obtener el nombre del mes
  function getMesNombre(fechaISO) {
    const date = new Date(fechaISO);
    const options = { month: "short", year: "numeric" };
    return date.toLocaleDateString("es-VE", options);
  }

  // ==========================================================================
  // === LÓGICA DE PROCESAMIENTO DE DATOS PARA GRÁFICOS (NUEVA FUNCIÓN) ===
  // ==========================================================================
  function procesarDatosParaReportes(ventas, gastos) {
    const meses = new Map();
    const categoriasGastos = new Map();
    let totalCreditosPendientes = 0;

    // --- PROCESAMIENTO DE VENTAS ---
    ventas.forEach((v) => {
      const fecha = v.fecha;
      const montoVenta = parseFloat(v.venta_bruta_ves) || 0;
      const saldoPendiente = parseFloat(v.saldo_pendiente_ves) || 0;

      if (fecha) {
        const mes = fecha.substring(0, 7); // 'YYYY-MM'
        if (!meses.has(mes)) {
          meses.set(mes, { ventas: 0, gastos: 0 });
        }
        meses.get(mes).ventas += montoVenta;
      }

      // Créditos Pendientes
      if (saldoPendiente > 0) {
        totalCreditosPendientes += saldoPendiente;
      }
    });

    // --- PROCESAMIENTO DE GASTOS ---
    gastos.forEach((g) => {
      const fecha = g.fecha;
      const montoGasto = parseFloat(g.monto_total_ves) || 0;
      const concepto = g.concepto || "Sin Categoría";

      if (fecha) {
        const mes = fecha.substring(0, 7); // 'YYYY-MM'
        if (!meses.has(mes)) {
          meses.set(mes, { ventas: 0, gastos: 0 });
        }
        meses.get(mes).gastos += montoGasto;
      }

      // Categorías de Gasto
      if (montoGasto > 0) {
        categoriasGastos.set(
          concepto,
          (categoriasGastos.get(concepto) || 0) + montoGasto
        );
      }
    });

    // --- ORGANIZAR DATOS POR MES PARA GRÁFICO ---
    const sortedMeses = Array.from(meses.keys()).sort();
    const reporteMensual = {
      labels: sortedMeses.map((mes) => getMesNombre(`${mes}-01`)),
      ventas: sortedMeses.map((mes) => meses.get(mes).ventas),
      gastos: sortedMeses.map((mes) => meses.get(mes).gastos),
    };

    // --- ORGANIZAR DATOS DE GASTOS POR CATEGORÍA ---
    const sortedCategorias = Array.from(categoriasGastos.entries())
      .sort(([, a], [, b]) => b - a) // Ordenar de mayor a menor
      .slice(0, 5); // Tomar solo el Top 5

    const topGastos = {
      labels: sortedCategorias.map(([concepto]) => concepto),
      valores: sortedCategorias.map(([, monto]) => monto),
    };

    return {
      reporteMensual,
      topGastos,
      totalCreditosPendientes,
    };
  }

  // ==========================================================================
  // === LÓGICA DE CARGA DE DATOS Y RENDERIZADO (MODIFICADA) ===
  // ==========================================================================

  async function cargarReportes() {
    if (loadingOverlay) loadingOverlay.style.display = "flex";

    try {
      const response = await fetch(
        "/.netlify/functions/obtener-data-admin?type=reporte"
      );
      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(
          result.error || "No se pudieron obtener los datos de reportes."
        );
      }

      const { ventas, gastos } = result.data;
      const datosProcesados = procesarDatosParaReportes(ventas, gastos);

      // 1. Gráfico Ventas vs. Gastos
      renderVentasGastosChart(datosProcesados.reporteMensual);

      // 2. Gráfico Top 5 Gastos
      renderGastosCategoriaChart(datosProcesados.topGastos);

      // 3. Gráfico de Créditos (Simplificado a un indicador y Donut Chart simple)
      renderCreditosChart(datosProcesados.totalCreditosPendientes);

      // 4. Se omite el 'servicioChart' por falta de una columna clara de Servicio en el CSV de ventas.
      // Se puede remplazar por un indicador simple o usar el 'CreditosChart' en su lugar.
      // Aquí se deja un indicador simple para que no haya un error.
      document.getElementById("servicioChartContainer").innerHTML = `
          <div style="text-align: center; padding: 20px;">
              <h4 style="color: #4CAF50;">Saldo Disponible Estimado</h4>
              <p style="font-size: 2em; font-weight: bold;">${formatVES(
                datosProcesados.totalCreditosPendientes * 0.5
              )}</p>
              <small>Fórmula: 50% de Créditos Pendientes (Estimación de liquidez).</small>
          </div>`;
    } catch (error) {
      console.error("❌ Error al cargar reportes:", error);
      alert(`⚠️ Error al cargar datos de reportes: ${error.message}`);
    } finally {
      if (loadingOverlay) loadingOverlay.style.display = "none";
    }
  }

  // ==========================================================================
  // === RENDERIZADO DE GRÁFICOS (Modificados para usar nuevos datos) ===
  // ==========================================================================

  // Gráfico 1: Ventas vs. Gastos
  function renderVentasGastosChart(data) {
    const ctx = document.getElementById("ventasGastosChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Ventas (VES)",
            data: data.ventas,
            borderColor: "#4CAF50", // Éxito/Ingreso (Verde)
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            tension: 0.1,
          },
          {
            label: "Gastos (VES)",
            data: data.gastos,
            borderColor: "#c60e0f", // Principal/Alerta (Rojo)
            backgroundColor: "rgba(198, 14, 15, 0.1)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return formatVES(value).replace("Bs.", ""); // Solo el número para el eje
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${formatVES(
                  context.parsed.y
                )}`;
              },
            },
          },
        },
      },
    });
  }

  // Gráfico 2: Top 5 Categorías de Gasto
  function renderGastosCategoriaChart(data) {
    const ctx = document
      .getElementById("gastosCategoriaChart")
      .getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Monto de Gasto (VES)",
            data: data.valores,
            backgroundColor: [
              "#c60e0f",
              "#FF9800",
              "#2196F3",
              "#4CAF50",
              "#9C27B0",
            ],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return formatVES(value).replace("Bs.", "");
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${formatVES(context.parsed.y)}`;
              },
            },
          },
        },
      },
    });
  }

  // Gráfico 3: Estado de Créditos Pendientes (Usando un Donut/Doughnut simple)
  function renderCreditosChart(totalCreditos) {
    const totalVentas =
      parseFloat(
        document
          .getElementById("ingresosMes")
          .textContent.replace("Bs. ", "")
          .replace(/\./g, "")
          .replace(/,/g, ".")
      ) || 0;

    const data = {
      labels: ["Créditos Pendientes", "Ingresos Mes (Cerrados)"],
      datasets: [
        {
          data: [totalCreditos, totalVentas - totalCreditos],
          backgroundColor: ["#f44336", "#4CAF50"],
          hoverOffset: 4,
        },
      ],
    };

    const ctx = document.getElementById("creditosChart").getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed;
                return `${label}: ${formatVES(value)}`;
              },
            },
          },
        },
      },
    });

    // Se agrega el total de créditos al contenedor
    document.getElementById("totalCreditosValue").textContent =
      formatVES(totalCreditos);
  }

  // ==========================================================================
  // === INICIO ===
  // ==========================================================================
  // Asegurarse de que el dashboard cargue primero para que 'ingresosMes' esté disponible para 'renderCreditosChart'
  // Si 'admin-dashboard.js' se carga correctamente, no hay necesidad de duplicar el código aquí.
  // Pero para que 'reportes.js' funcione de forma independiente:
  cargarReportes();
});
