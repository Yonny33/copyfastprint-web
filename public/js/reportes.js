document.addEventListener("DOMContentLoaded", () => {
  const loadingOverlay = document.getElementById("loading-overlay");

  // --- VERIFICACIÓN DE SESIÓN Y CERRAR SESIÓN ---
  if (sessionStorage.getItem("sesionActiva") !== "true") {
    window.location.href = "login-registro.html";
    return;
  }

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "login-registro.html";
    });
  }

  // --- URL DEL SCRIPT DE GOOGLE ---
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";

  // --- FUNCIONES AUXILIARES ---
  const formatVES = (value) => {
    const number = parseFloat(value);
    return isNaN(number)
      ? "Bs. 0.00"
      : `Bs. ${number.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getMesNombre = (dateString) => {
      const date = new Date(dateString + 'T00:00:00'); // Asegurar que se interprete como local
      return date.toLocaleString('es-VE', { month: 'short', year: '2-digit' });
  };

  // --- PROCESAMIENTO DE DATOS PARA GRÁFICOS ---
  function procesarDatosParaReportes(ventas, gastos) {
    const hoy = new Date();
    const mesActual = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
    
    // Datos para Ventas vs Gastos (6 meses)
    const dataMensual = new Map();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        dataMensual.set(key, { label: getMesNombre(key + '-01'), ventas: 0, gastos: 0 });
    }

    ventas.forEach(v => {
        const fecha = v.fecha.substring(0, 7);
        if (dataMensual.has(fecha)) {
            dataMensual.get(fecha).ventas += parseFloat(v.venta_bruta_ves) || 0;
        }
    });

    gastos.forEach(g => {
        const fecha = g.fecha.substring(0, 7);
        if (dataMensual.has(fecha)) {
            dataMensual.get(fecha).gastos += parseFloat(g.monto_total_ves) || 0;
        }
    });

    const reporteMensual = {
        labels: Array.from(dataMensual.values()).map(d => d.label),
        ventas: Array.from(dataMensual.values()).map(d => d.ventas),
        gastos: Array.from(dataMensual.values()).map(d => d.gastos),
    };

    // Datos para Top 5 Categorías de Gasto
    const categoriasGastos = new Map();
    gastos.forEach(g => {
        const categoria = g.concepto || "Sin Categoría";
        const monto = parseFloat(g.monto_total_ves) || 0;
        categoriasGastos.set(categoria, (categoriasGastos.get(categoria) || 0) + monto);
    });
    const topGastos = [...categoriasGastos.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Datos para Composición de Ingresos del Mes
    let ingresosMes = 0;
    let creditosMes = 0;
    ventas.forEach(v => {
        if (v.fecha.substring(0, 7) === mesActual) {
            ingresosMes += parseFloat(v.abono_ves) || 0;
            creditosMes += parseFloat(v.saldo_pendiente_ves) || 0;
        }
    });

    // Datos para Ventas por Categoría
    const categoriasVentas = new Map();
    ventas.forEach(v => {
        const categoria = v.descripcion || "No especificado";
        const monto = parseFloat(v.venta_bruta_ves) || 0;
        categoriasVentas.set(categoria, (categoriasVentas.get(categoria) || 0) + monto);
    });
    const topVentasCategoria = [...categoriasVentas.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);

    return {
        reporteMensual,
        topGastos: { labels: topGastos.map(g => g[0]), valores: topGastos.map(g => g[1]) },
        composicionIngresos: { ingresos: ingresosMes, creditos: creditosMes },
        ventasPorCategoria: { labels: topVentasCategoria.map(v => v[0]), valores: topVentasCategoria.map(v => v[1]) }
    };
  }

  // --- RENDERIZADO DE GRÁFICOS ---
  const renderChart = (ctx, type, data, options) => new Chart(ctx, { type, data, options });
  const tooltipLabel = (context) => `${context.dataset.label}: ${formatVES(context.parsed.y)}`;
  const pieTooltipLabel = (context) => `${context.label}: ${formatVES(context.parsed)}`;
  const CHART_COLORS = [ '#C60E0F', '#FF9800', '#2196F3', '#4CAF50', '#9C27B0', '#F44336', '#00BCD4' ];

  // --- FUNCIÓN PRINCIPAL DE CARGA ---
  async function cargarYRenderizarReportes() {
    if (loadingOverlay) loadingOverlay.style.display = "flex";

    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getReportData`);
      if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
      
      const result = await response.json();
      if (result.status !== "success") throw new Error(result.message);

      const { ventas, gastos } = result.data;
      const datos = procesarDatosParaReportes(ventas, gastos);

      // 1. Ventas vs Gastos
      renderChart(document.getElementById("ventasGastosChart"), 'line', {
          labels: datos.reporteMensual.labels,
          datasets: [
              { label: "Ventas", data: datos.reporteMensual.ventas, borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)', tension: 0.1 },
              { label: "Gastos", data: datos.reporteMensual.gastos, borderColor: '#C60E0F', backgroundColor: 'rgba(198, 14, 15, 0.1)', tension: 0.1 }
          ]
      }, { responsive: true, plugins: { tooltip: { callbacks: { label: tooltipLabel } } } });

      // 2. Top 5 Gastos
      renderChart(document.getElementById("gastosCategoriaChart"), 'bar', {
          labels: datos.topGastos.labels,
          datasets: [{ label: "Monto de Gasto", data: datos.topGastos.valores, backgroundColor: CHART_COLORS }]
      }, { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: pieTooltipLabel } } } });

      // 3. Composición Ingresos
      renderChart(document.getElementById("creditosChart"), 'doughnut', {
          labels: ['Ingresos Cobrados (Mes)', 'Créditos por Cobrar (Mes)'],
          datasets: [{ data: [datos.composicionIngresos.ingresos, datos.composicionIngresos.creditos], backgroundColor: ['#4CAF50', '#FF9800'] }]
      }, { responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: pieTooltipLabel } } } });

      // 4. Ventas por Categoría
      renderChart(document.getElementById("ventasCategoriaChart"), 'pie', {
          labels: datos.ventasPorCategoria.labels,
          datasets: [{ label: "Ventas", data: datos.ventasPorCategoria.valores, backgroundColor: CHART_COLORS }]
      }, { responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: pieTooltipLabel } } } });

    } catch (error) {
      console.error("Error al cargar los reportes:", error);
      document.querySelector(".admin-container").innerHTML = `<p style='color: red; text-align: center;'>Error al cargar reportes: ${error.message}</p>`;
    } finally {
      if (loadingOverlay) loadingOverlay.style.display = "none";
    }
  }

  cargarYRenderizarReportes();
});