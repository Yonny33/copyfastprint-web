document.addEventListener("DOMContentLoaded", () => {
  // Autenticación
  if (typeof setupAuth === "function") {
    setupAuth();
  }

  // --- ELEMENTOS DEL DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");

  // --- ESTADO Y CONFIGURACIÓN ---
  const API_URL = "/api"; // <-- URL Relativa para usar el rewrite de Firebase
  let ingresosGastosChart = null;
  let recentVentas = [];
  let recentGastos = [];

  // --- HELPERS ---
  const safeSetText = (id, text) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  };
  const formatCurrency = (value) =>
    `Bs. ${parseFloat(value || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (value) => (value || 0).toLocaleString("de-DE");
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
    safeSetText(
      "kpi-saldo-pendiente",
      formatCurrency(kpis.totalSaldoPendiente),
    );

    const balanceNetoEl = document.getElementById("kpi-balance-neto");
    if (balanceNetoEl)
      balanceNetoEl.style.color =
        kpis.balanceNeto < 0 ? "var(--error-color)" : "var(--success-color)";
    const balanceGeneralEl = document.getElementById("kpi-balance-general");
    if (balanceGeneralEl)
      balanceGeneralEl.style.color =
        kpis.balanceGeneral < 0 ? "var(--error-color)" : "var(--success-color)";
  };

  const renderChart = (
    chartData = { labels: [], ingresos: [], gastos: [] },
  ) => {
    const canvas = document.getElementById("ingresos-gastos-chart");
    if (!canvas) return;
    if (ingresosGastosChart) ingresosGastosChart.destroy();
    ingresosGastosChart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Ingresos",
            data: chartData.ingresos,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
          },
          {
            label: "Gastos",
            data: chartData.gastos,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "var(--text-secondary)",
              callback: (v) => formatCurrency(v),
            },
          },
          x: {
            ticks: {
              color: "var(--text-secondary)",
              autoSkip: true,
              maxTicksLimit: 20,
            },
          },
        },
        plugins: {
          legend: { position: "top", labels: { color: "var(--text-primary)" } },
        },
      },
    });
  };

  const renderTable = (tableId, data, columns, type) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${columns.length + 1}" style="text-align: center;">No hay datos recientes.</td></tr>`;
      return;
    }

    data.forEach((item) => {
      const tr = document.createElement("tr");
      columns.forEach((col) => {
        const td = document.createElement("td");
        let value = item[col.key];
        if (col.format === "currency")
          value = formatCurrency(item[col.moneyKey]);
        else if (col.format === "date") {
          const date = value ? new Date(value) : null; // Firebase devuelve fechas ISO
          value = date && !isNaN(date) ? date.toLocaleDateString("es-CO") : "-";
        }
        td.textContent = value || "-";
        tr.appendChild(td);
      });

      const actionsTd = document.createElement("td");
      actionsTd.className = "actions";
      // Botón de eliminar con estilo rojo
      actionsTd.innerHTML = `<button class="btn-delete" data-id="${item.id}" data-type="${type}" title="Eliminar" style="background-color: var(--error-color); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; transition: background 0.3s;"><i class="fas fa-trash"></i></button>`;
      tr.appendChild(actionsTd);
      tbody.appendChild(tr);
    });

    tbody.addEventListener("click", (event) => {
      const button = event.target.closest(".btn-delete");
      if (button) {
        handleDeleteClick(button.dataset.id, button.dataset.type);
      }
    });
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDeleteClick = async (id, type) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar este registro de ${type}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    showLoading(true);
    try {
      const endpoint = type === "venta" ? "ventas" : "gastos";
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.status === "success") {
        alert(result.message);
        loadDashboardData(); // Recargar la tabla
      } else {
        throw new Error(result.message || "Error al eliminar.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      showLoading(false);
    }
  };

  // --- FUNCIÓN PRINCIPAL DE CARGA (CONECTADA A FIREBASE) ---
  const loadDashboardData = async () => {
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/dashboard`); // <-- PETICIÓN AL NUEVO BACKEND
      if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);

      const result = await response.json();

      if (result.status === "success" && result.data) {
        const { kpis, ultimasVentas, ultimosGastos, chartData } = result.data;
        recentVentas = ultimasVentas || [];
        recentGastos = ultimosGastos || [];

        renderKpis(kpis);
        if (chartData) renderChart(chartData);
        renderTable(
          "tabla-ultimas-ventas",
          recentVentas,
          [
            { key: "fecha", format: "date" },
            { key: "nombre_cliente", format: "text" },
            { key: "venta_bruta", format: "currency", moneyKey: "venta_bruta" },
          ],
          "venta",
        );
        renderTable(
          "tabla-ultimos-gastos",
          recentGastos,
          [
            { key: "fecha", format: "date" },
            { key: "descripcion", format: "text" },
            { key: "monto", format: "currency", moneyKey: "monto" },
          ],
          "gasto",
        );
      } else {
        throw new Error(
          result.message || "La API no devolvió el formato esperado.",
        );
      }
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error.message);
      // Aquí podrías mostrar un error en la UI
    } finally {
      showLoading(false);
    }
  };

  // --- INICIALIZACIÓN ---
  loadDashboardData();
});
