document.addEventListener('DOMContentLoaded', () => {
    // Asegura que la autenticación se verifique al cargar la página.
    if (typeof setupAuth === 'function') {
        setupAuth();
    }

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";
    const loadingOverlay = document.getElementById("loading-overlay");
    let ingresosGastosChart = null;

    // --- HELPERS DE SEGURIDAD Y FORMATO ---
    const safeSetText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`Elemento con id '${id}' no encontrado.`);
        }
    };

    const formatCurrency = (value) => `$${parseFloat(value || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    const formatNumber = (value) => (value || 0).toLocaleString('es-CO');

    // --- FUNCIONES DE RENDERIZADO (ACTUALIZADO) ---
    const renderKpis = (kpis = {}) => {
        safeSetText("kpi-ingresos-mes", formatCurrency(kpis.ingresosMes));
        safeSetText("kpi-gastos-mes", formatCurrency(kpis.gastosMes));
        safeSetText("kpi-balance-neto", formatCurrency(kpis.balanceNeto));
        safeSetText("kpi-clientes-nuevos", formatNumber(kpis.clientesNuevos));
        safeSetText("kpi-clientes-deudas", formatNumber(kpis.clientesConDeuda)); // Corregido: nombre de la propiedad
        safeSetText("kpi-alertas-inventario", formatNumber(kpis.alertasInventario));
        
        // --- Nuevas Tarjetas ---
        safeSetText("kpi-balance-general", formatCurrency(kpis.balanceGeneral));
        safeSetText("kpi-items-stock", formatNumber(kpis.totalItemsStock));

        // Lógica de color para los balances
        const balanceNetoElement = document.getElementById("kpi-balance-neto");
        if (balanceNetoElement) {
            balanceNetoElement.style.color = (kpis.balanceNeto < 0) ? 'var(--error-color)' : 'var(--success-color)';
        }

        const balanceGeneralElement = document.getElementById("kpi-balance-general");
        if (balanceGeneralElement) {
            balanceGeneralElement.style.color = (kpis.balanceGeneral < 0) ? 'var(--error-color)' : 'var(--success-color)';
        }
    };

    const renderChart = (chartData = { labels: [], ingresos: [], gastos: [] }) => {
        const canvas = document.getElementById('ingresos-gastos-chart');
        if (!canvas) return console.warn("Canvas para el gráfico no encontrado.");
        const ctx = canvas.getContext('2d');

        if (ingresosGastosChart) ingresosGastosChart.destroy();

        ingresosGastosChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    { label: 'Ingresos', data: chartData.ingresos, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
                    { label: 'Gastos', data: chartData.gastos, backgroundColor: 'rgba(255, 99, 132, 0.6)' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, ticks: { callback: (value) => '$' + value.toLocaleString('es-CO') } } }
            }
        });
    };

    const renderTable = (tableId, data, columns) => {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (!tbody) return console.warn(`Cuerpo de tabla para #${tableId} no encontrado.`);
        
        tbody.innerHTML = '';
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center;">No hay datos.</td></tr>`;
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            columns.forEach(col => {
                const td = document.createElement('td');
                let value = item[col.key];
                if (col.format === 'currency') value = formatCurrency(value);
                else if (col.format === 'date') {
                    const date = value ? new Date(value + 'T00:00:00') : null;
                    value = date && !isNaN(date) ? date.toLocaleDateString('es-CO', { timeZone: 'UTC' }) : '-';
                }
                td.textContent = value || '-';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    };
    
    const showError = (message) => {
        console.error(message);
        const kpiIds = ["kpi-ingresos-mes", "kpi-gastos-mes", "kpi-balance-neto", "kpi-clientes-nuevos", "kpi-clientes-deudas", "kpi-alertas-inventario", "kpi-balance-general", "kpi-items-stock"];
        kpiIds.forEach(id => safeSetText(id, "Error"));
    };

    // --- FUNCIÓN PRINCIPAL DE CARGA ---
    const loadDashboardData = async () => {
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getEnhancedDashboardData`);
            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
            
            const result = await response.json();

            if (result.status === "success" && result.data) {
                const { kpis, chartData, ultimasVentas, ultimosGastos } = result.data;
                renderKpis(kpis);
                renderChart(chartData);
                renderTable('tabla-ultimas-ventas', ultimasVentas, [
                    { key: 'fecha', format: 'date' },
                    { key: 'nombre', format: 'text' },
                    { key: 'monto', format: 'currency' }
                ]);
                renderTable('tabla-ultimos-gastos', ultimosGastos, [
                    { key: 'fecha', format: 'date' },
                    { key: 'descripcion', format: 'text' },
                    { key: 'monto', format: 'currency' }
                ]);
            } else {
                throw new Error(result.message || "La API no devolvió el formato esperado.");
            }
        } catch (error) {
            showError(error.message);
        } finally {
            if (loadingOverlay) loadingOverlay.style.display = 'none';
        }
    };

    loadDashboardData();
});