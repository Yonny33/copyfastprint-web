document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DEL DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");

  // --- ESTADO Y CONFIGURACIÓN ---
  const API_URL = "/api";
  let ingresosGastosChart = null;

  // --- HELPERS ---
  const safeSetText = (id, text) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  };
  const formatCurrency = (value) =>
    `Bs. ${parseFloat(value || 0).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (value) => (value || 0).toLocaleString("es-VE");
  const showLoading = (show) => {
    if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none";
  };

  // --- FUNCIONES DE RENDERIZADO ---
  const renderKpis = (kpis = {}) => {
    safeSetText("kpi-ingresos-mes", formatCurrency(kpis.ingresosMes));
    safeSetText("kpi-gastos-mes", formatCurrency(kpis.gastosMes));
    safeSetText("kpi-balance-neto", formatCurrency(kpis.balanceNeto));
    safeSetText("kpi-clientes-nuevos", formatNumber(kpis.clientesNuevos));
    safeSetText("kpi-clientes-deudas", formatNumber(kpis.clientesConDeuda));
    safeSetText("kpi-alertas-inventario", formatNumber(kpis.alertasInventario));
    safeSetText("kpi-balance-general", formatCurrency(kpis.balanceGeneral));
    safeSetText("kpi-items-stock", formatNumber(kpis.totalItemsStock));
    safeSetText("kpi-saldo-pendiente", formatCurrency(kpis.totalSaldoPendiente));

    const balanceNetoEl = document.getElementById("kpi-balance-neto");
    if (balanceNetoEl) balanceNetoEl.style.color = kpis.balanceNeto < 0 ? "var(--error-color)" : "var(--success-color)";
    
    const balanceGeneralEl = document.getElementById("kpi-balance-general");
    if (balanceGeneralEl) balanceGeneralEl.style.color = kpis.balanceGeneral < 0 ? "var(--error-color)" : "var(--success-color)";
  };

  const renderChart = (chartData = { labels: [], ingresos: [], gastos: [] }) => {
    const canvas = document.getElementById("ingresos-gastos-chart");
    if (!canvas) return;
    if (ingresosGastosChart) ingresosGastosChart.destroy();
 
    const ctx = canvas.getContext("2d");
    const gradientIngresos = ctx.createLinearGradient(0, 0, 0, 400);
    gradientIngresos.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
    gradientIngresos.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const gradientGastos = ctx.createLinearGradient(0, 0, 0, 400);
    gradientGastos.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    gradientGastos.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

    ingresosGastosChart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Ingresos",
            data: chartData.ingresos,
            backgroundColor: gradientIngresos,
            borderColor: "#10b981",
            borderWidth: 3,
            pointBackgroundColor: "#10b981",
            fill: true,
            tension: 0.4
          },
          {
            label: "Gastos",
            data: chartData.gastos,
            backgroundColor: gradientGastos,
            borderColor: "#ef4444",
            borderWidth: 3,
            pointBackgroundColor: "#ef4444",
            fill: true,
            tension: 0.4
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { position: "top", labels: { color: "#eaeaea" } },
        },
      },
    });
  };

  // --- FUNCIÓN PRINCIPAL DE CARGA ---
  const loadDashboardData = async () => {
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/dashboard`);
      if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);

      const result = await response.json();

      if (result.status === "success" && result.data) {
        const { kpis, chartData } = result.data;
        renderKpis(kpis);
        if (chartData) renderChart(chartData);
      } else {
        throw new Error(result.message || "La API no devolvió el formato esperado.");
      }
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error.message);
      // Opcional: mostrar un error en la UI
      document.querySelector(".admin-main-content").innerHTML = `<p style="color: var(--error-color); text-align: center;">No se pudieron cargar los datos del dashboard. ${error.message}</p>`;
    } finally {
      showLoading(false);
    }
  };

  // --- INICIALIZACIÓN ---
  loadDashboardData();
});
