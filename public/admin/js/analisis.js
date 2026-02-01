document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "/api";
  const loadingOverlay = document.getElementById("loading-overlay");
  const displayYear = document.getElementById("display-year");
  const yearProfitability = document.getElementById("year-profitability");
  const monthsGrid = document.getElementById("months-grid");
  const historicalTableBody = document.querySelector("#historical-table tbody");
  const trendChartCanvas = document.getElementById("trend-chart");

  let allYearsData = [];
  let trendChart = null;
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const showLoading = (show) => {
    if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none";
  };

  const formatCurrency = (val) =>
    `Bs. ${parseFloat(val || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // --- CARGAR DATOS ---
  const fetchAnalysisData = async () => {
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/analisis`);
      const result = await response.json();

      if (result.status === "success") {
        allYearsData = result.data;
        if (allYearsData.length > 0) {
          renderHistoricalTable(allYearsData);
          // Seleccionar el año más reciente por defecto
          selectYear(allYearsData[0]);
        } else {
          monthsGrid.innerHTML =
            "<p style='grid-column: 1/-1; text-align: center;'>No hay datos registrados aún.</p>";
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error cargando análisis:", error);
      alert("Error al cargar datos de análisis.");
    } finally {
      showLoading(false);
    }
  };

  // --- RENDERIZAR TABLA HISTÓRICA ---
  const renderHistoricalTable = (data) => {
    historicalTableBody.innerHTML = "";
    data.forEach((yearData) => {
      const row = document.createElement("tr");
      row.className = "historical-row";
      row.dataset.year = yearData.year;

      const mesEstrellaNombre =
        yearData.mesEstrella.mes >= 0
          ? monthNames[yearData.mesEstrella.mes]
          : "-";

      row.innerHTML = `
        <td style="font-weight: bold; font-size: 1.1rem;">${yearData.year}</td>
        <td style="color: var(--success-color);">${formatCurrency(yearData.totalIngresos)}</td>
        <td style="color: var(--error-color);">${formatCurrency(yearData.totalGastos)}</td>
        <td style="font-weight: bold;">${formatCurrency(yearData.totalNeto)}</td>
        <td>${yearData.rentabilidad}%</td>
        <td>${mesEstrellaNombre !== "-" ? `<span class="star-month-badge"><i class="fas fa-star"></i> ${mesEstrellaNombre}</span>` : "-"}</td>
        <td>${yearData.totalNeto >= 0 ? '<span class="status pagado">Rentable</span>' : '<span class="status pendiente">Pérdida</span>'}</td>
      `;

      row.addEventListener("click", () => selectYear(yearData));
      historicalTableBody.appendChild(row);
    });
  };

  // --- SELECCIONAR AÑO Y ACTUALIZAR VISTA ---
  const selectYear = (yearData) => {
    // Actualizar UI Header
    displayYear.textContent = yearData.year;
    yearProfitability.textContent = `${yearData.rentabilidad}%`;
    yearProfitability.style.color =
      parseFloat(yearData.rentabilidad) >= 0
        ? "var(--success-color)"
        : "var(--error-color)";

    // Resaltar fila en tabla
    document
      .querySelectorAll(".historical-row")
      .forEach((r) => r.classList.remove("active-year"));
    const activeRow = document.querySelector(
      `.historical-row[data-year="${yearData.year}"]`,
    );
    if (activeRow) activeRow.classList.add("active-year");

    renderMonthCards(yearData);
    renderTrendChart(yearData);
  };

  // --- RENDERIZAR TARJETAS DE MESES ---
  const renderMonthCards = (yearData) => {
    monthsGrid.innerHTML = "";
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    yearData.months.forEach((mes, index) => {
      const isFuture = yearData.year === currentYear && index > currentMonth;
      const card = document.createElement("div");
      card.className = `month-card ${isFuture ? "future" : ""}`;

      const netoClass = mes.neto >= 0 ? "positive" : "negative";

      card.innerHTML = `
        <div class="month-name">${monthNames[index]}</div>
        <div class="month-stat">
            <span class="stat-label">Ingresos</span>
            <span class="stat-value income">${formatCurrency(mes.ingresos)}</span>
        </div>
        <div class="month-stat">
            <span class="stat-label">Gastos</span>
            <span class="stat-value expense">${formatCurrency(mes.gastos)}</span>
        </div>
        <div class="month-net ${netoClass}">
            <span>Utilidad Neta</span>
            <strong>${formatCurrency(mes.neto)}</strong>
        </div>
      `;
      monthsGrid.appendChild(card);
    });
  };

  // --- RENDERIZAR GRÁFICO ---
  const renderTrendChart = (yearData) => {
    if (trendChart) trendChart.destroy();

    const ctx = trendChartCanvas.getContext("2d");

    // Gradientes
    const gradientIncome = ctx.createLinearGradient(0, 0, 0, 400);
    gradientIncome.addColorStop(0, "rgba(16, 185, 129, 0.5)");
    gradientIncome.addColorStop(1, "rgba(16, 185, 129, 0.0)");

    const gradientExpense = ctx.createLinearGradient(0, 0, 0, 400);
    gradientExpense.addColorStop(0, "rgba(239, 68, 68, 0.5)");
    gradientExpense.addColorStop(1, "rgba(239, 68, 68, 0.0)");

    trendChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "Ingresos",
            data: yearData.months.map((m) => m.ingresos),
            borderColor: "#10b981",
            backgroundColor: gradientIncome,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Gastos",
            data: yearData.months.map((m) => m.gastos),
            borderColor: "#ef4444",
            backgroundColor: gradientExpense,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Utilidad Neta",
            data: yearData.months.map((m) => m.neto),
            borderColor: "#ffffff",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: { labels: { color: "#ccc" } },
        },
        scales: {
          y: { grid: { color: "#333" }, ticks: { color: "#888" } },
          x: { grid: { display: false }, ticks: { color: "#888" } },
        },
      },
    });
  };

  // Iniciar
  fetchAnalysisData();
});
