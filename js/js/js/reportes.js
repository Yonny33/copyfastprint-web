// js/reportes.js
document.addEventListener("DOMContentLoaded", () => {
  // Función para verificar la sesión y cerrar sesión (reusada de registro.html)
  document
    .getElementById("btnCerrarSesion")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        sessionStorage.clear();
        window.location.href = "login-registro.html";
      }
    });

  // Asumimos que formatVES existe globalmente (de admin.html o registro-ventas.js)
  function formatVES(numero) {
    return `Bs. ${parseFloat(numero).toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Función para cargar los datos de reportes desde la Netlify Function
  async function cargarReportes() {
    try {
      // Llama a la nueva Netlify Function con el parámetro 'reporte'
      const response = await fetch(
        "/.netlify/functions/obtener-data-admin?type=reporte"
      );
      const result = await response.json();

      if (!result.success || !result.reporteMensual) {
        throw new Error(
          result.error || "No se pudieron obtener los datos de reportes."
        );
      }

      renderVentasGastosChart(result.reporteMensual);
      renderGastosCategoriaChart(result.gastosCategoria);
      renderCreditosChart(result.creditosPendientes);
      renderServicioChart(result.ventasPorServicio);
    } catch (error) {
      console.error("Error al cargar los reportes:", error);
      alert(`Error al cargar los reportes: ${error.message}`);
    }
  }

  // ==========================================================
  // GRÁFICO 1: Ventas vs. Gastos (Líneas)
  // ==========================================================
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
            borderColor: "#4CAF50", // Verde para ingresos
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            tension: 0.3,
            fill: false,
          },
          {
            label: "Gastos (VES)",
            data: data.gastos,
            borderColor: "#c60e0f", // Rojo de la marca para gastos
            backgroundColor: "rgba(198, 14, 15, 0.1)",
            tension: 0.3,
            fill: false,
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
                return formatVES(value);
              },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Comparativa de Ingresos y Egresos",
          },
        },
      },
    });
  }

  // ==========================================================
  // GRÁFICO 2: Gastos por Categoría (Dona)
  // ==========================================================
  function renderGastosCategoriaChart(data) {
    const ctx = document
      .getElementById("gastosCategoriaChart")
      .getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map((d) => d.categoria),
        datasets: [
          {
            data: data.map((d) => d.monto),
            backgroundColor: [
              "#c60e0f", // Rojo Principal
              "#FF9800", // Naranja
              "#2196F3", // Azul
              "#4CAF50", // Verde
              "#9C27B0", // Púrpura
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed !== null) {
                  label += formatVES(context.parsed);
                }
                return label;
              },
            },
          },
        },
      },
    });
  }

  // ==========================================================
  // GRÁFICO 3: Créditos Pendientes (Métrica Simple - Muestra el valor)
  // ==========================================================
  function renderCreditosChart(monto) {
    const card = document
      .getElementById("creditosChart")
      .closest(".chart-card");
    card.innerHTML = `
            <div style="text-align: center; padding: 2em;">
                <p style="font-size: 1.2em; color: #777;">Monto Total Pendiente</p>
                <h2 style="font-size: 3em; color: #FF9800; margin: 0.5em 0;">${formatVES(
                  monto
                )}</h2>
                <p style="font-size: 0.9em; color: #555;">Basado en ventas a crédito registradas.</p>
            </div>
        `;
  }

  // ==========================================================
  // GRÁFICO 4: Ventas por Tipo de Servicio (Barra)
  // ==========================================================
  function renderServicioChart(data) {
    const ctx = document.getElementById("servicioChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Distribución de Ventas (%)",
            data: data.valores,
            backgroundColor: [
              "#c60e0f", // DTF
              "#2196F3", // Sublimación
              "#FF9800", // Copias/Impresión
            ],
            borderColor: ["#9c0b0c", "#006ac7", "#e08800"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: "y", // Hace el gráfico horizontal
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += context.parsed.x + "%";
                return label;
              },
            },
          },
        },
      },
    });
  }

  // Iniciar carga de datos
  cargarReportes();
});
