document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTES Y URL DEL SCRIPT ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";

    // --- ELEMENTOS DEL DOM ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterBtn = document.getElementById('filter-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Tablas y resúmenes
    const ventasTableBody = document.querySelector('#ventas-table tbody');
    const gastosTableBody = document.querySelector('#gastos-table tbody');
    const ventasTableTitle = document.getElementById('ventas-table-title');
    const gastosTableTitle = document.getElementById('gastos-table-title');
    const summaryVentas = document.getElementById('summary-ventas');
    const summaryGastos = document.getElementById('summary-gastos');

    // Contextos de los gráficos
    const ventasChartCtx = document.getElementById('total-ventas-chart')?.getContext('2d');
    const gastosChartCtx = document.getElementById('total-gastos-chart')?.getContext('2d');

    // --- ALMACENES DE DATOS Y GRÁFICOS ---
    let originalVentas = [];
    let originalGastos = [];
    let totalVentasChart = null;
    let totalGastosChart = null;

    // --- FUNCIONES AUXILIARES ---
    const showLoading = (show) => {
        if (loadingOverlay) loadingOverlay.style.display = show ? 'flex' : 'none';
    };

    const formatCurrency = (amount) => {
        return `Bs. ${Number(amount).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const parseDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString.split(' ')[0] + 'T00:00:00');
        return isNaN(date.getTime()) ? null : date;
    };

    // --- FUNCIONES DE GRÁFICOS ---
    const createTotalChart = (ctx, label, totalAmount, color) => {
        if (!ctx) return null;

        // Destruir el gráfico anterior si existe para evitar solapamientos
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [label],
                datasets: [{
                    data: [totalAmount > 0 ? totalAmount : 1], // Se pone 1 si es 0 para que el gráfico no se rompa
                    backgroundColor: [totalAmount > 0 ? color : '#E0E0E0'],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    title: {
                        display: true,
                        text: formatCurrency(totalAmount),
                        position: 'bottom',
                        align: 'center',
                        font: { size: 16, weight: 'bold' },
                        color: '#333'
                    }
                }
            }
        });
        ctx.chart = chart; // Guardar la referencia en el contexto
        return chart;
    };

    // --- FUNCIONES DE RENDERIZADO DE TABLAS ---
    const renderVentasTable = (ventas) => {
        if (!ventasTableBody) return;
        ventasTableBody.innerHTML = '';
        let totalPeriodo = 0;

        if (!ventas || ventas.length === 0) {
            ventasTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay ventas para mostrar.</td></tr>';
        } else {
            ventas.forEach(v => {
                totalPeriodo += parseFloat(v.venta_bruta) || 0;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${v.fecha ? v.fecha.split(' ')[0] : 'N/A'}</td>
                    <td>${v.nombre || 'Cliente General'}</td>
                    <td>${formatCurrency(v.venta_bruta)}</td>
                    <td><span class="status ${String(v.estado_pedido).toLowerCase()}">${v.estado_pedido || 'N/A'}</span></td>
                `;
                ventasTableBody.appendChild(row);
            });
        }
        if (summaryVentas) summaryVentas.textContent = `Total del Periodo: ${formatCurrency(totalPeriodo)}`;
    };

    const renderGastosTable = (gastos) => {
        if (!gastosTableBody) return;
        gastosTableBody.innerHTML = '';
        let totalPeriodo = 0;

        if (!gastos || gastos.length === 0) {
            gastosTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay gastos para mostrar.</td></tr>';
        } else {
            gastos.forEach(g => {
                totalPeriodo += parseFloat(g.monto) || 0;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${g.fecha ? g.fecha.split(' ')[0] : 'N/A'}</td>
                    <td>${g.descripcion || 'N/A'}</td>
                    <td>${g.categoria || 'N/A'}</td>
                    <td>${formatCurrency(g.monto)}</td>
                `;
                gastosTableBody.appendChild(row);
            });
        }
        if (summaryGastos) summaryGastos.textContent = `Total del Periodo: ${formatCurrency(totalPeriodo)}`;
    };

    // --- LÓGICA DE FILTRADO Y CARGA ---
    const applyFilters = () => {
        const startDate = startDateInput.value ? parseDate(startDateInput.value) : null;
        const endDate = endDateInput.value ? parseDate(endDateInput.value) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999);

        if (!startDate || !endDate) {
            alert("Por favor, selecciona una fecha de inicio y una de fin.");
            return;
        }

        const filteredVentas = originalVentas.filter(v => {
            const vDate = parseDate(v.fecha);
            return vDate && vDate >= startDate && vDate <= endDate;
        });

        const filteredGastos = originalGastos.filter(g => {
            const gDate = parseDate(g.fecha);
            return gDate && gDate >= startDate && gDate <= endDate;
        });

        if(ventasTableTitle) ventasTableTitle.textContent = "Ventas del Periodo";
        if(gastosTableTitle) gastosTableTitle.textContent = "Gastos del Periodo";
        renderVentasTable(filteredVentas);
        renderGastosTable(filteredGastos);
    };

    const resetFilters = () => {
        if(startDateInput) startDateInput.value = '';
        if(endDateInput) endDateInput.value = '';

        // Ordenar por fecha descendente para obtener los últimos
        const sortedVentas = [...originalVentas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const sortedGastos = [...originalGastos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        const ultimas10Ventas = sortedVentas.slice(0, 10);
        const ultimos10Gastos = sortedGastos.slice(0, 10);

        if(ventasTableTitle) ventasTableTitle.textContent = "Últimas 10 Ventas";
        if(gastosTableTitle) gastosTableTitle.textContent = "Últimos 10 Gastos";
        renderVentasTable(ultimas10Ventas);
        renderGastosTable(ultimos10Gastos);
    };

    const loadReportData = async () => {
        showLoading(true);
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getReportData`);
            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
            
            const result = await response.json();
            if (result.status === 'success' && result.data) {
                originalVentas = result.data.ventas || [];
                originalGastos = result.data.gastos || [];
                
                // 1. Crear los gráficos con los totales absolutos
                const totalVentasAbsoluto = originalVentas.reduce((sum, v) => sum + (parseFloat(v.venta_bruta) || 0), 0);
                const totalGastosAbsoluto = originalGastos.reduce((sum, g) => sum + (parseFloat(g.monto) || 0), 0);
                totalVentasChart = createTotalChart(ventasChartCtx, 'Ventas Totales', totalVentasAbsoluto, '#28a745');
                totalGastosChart = createTotalChart(gastosChartCtx, 'Gastos Totales', totalGastosAbsoluto, '#dc3545');

                // 2. Cargar las tablas con los últimos 10 registros
                resetFilters();
            } else {
                throw new Error(result.message || 'El formato de respuesta del servidor no es válido.');
            }
        } catch (error) {
            console.error('Error fatal al cargar los reportes:', error);
            alert(`No se pudieron cargar los datos de los reportes: ${error.message}`);
            if (summaryVentas) summaryVentas.textContent = 'Error al cargar.';
            if (summaryGastos) summaryGastos.textContent = 'Error al cargar.';
        } finally {
            showLoading(false);
        }
    };

    // --- ASIGNACIÓN DE EVENTOS ---
    if (filterBtn) filterBtn.addEventListener('click', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    // --- INICIALIZACIÓN ---
    if (ventasChartCtx && gastosChartCtx && ventasTableBody && gastosTableBody) {
        loadReportData();
    } else {
        console.error("Algunos elementos clave (gráficos o tablas) no se encontraron en el DOM. El script no se ejecutará.");
    }
});
