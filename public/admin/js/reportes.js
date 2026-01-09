document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTES Y URL DEL SCRIPT ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";

    // --- ELEMENTOS DEL DOM ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterBtn = document.getElementById('filter-btn');
    const resetBtn = document.getElementById('reset-btn');
    const debtToggle = document.getElementById('debt-toggle');

    const ventasTableBody = document.querySelector('#ventas-table tbody');
    const gastosTableBody = document.querySelector('#gastos-table tbody');
    const ventasTableTitle = document.getElementById('ventas-table-title');
    const gastosTableTitle = document.getElementById('gastos-table-title');
    const summaryVentas = document.getElementById('summary-ventas');
    const summaryGastos = document.getElementById('summary-gastos');

    const abonoModal = document.getElementById('abono-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const abonoForm = document.getElementById('abono-form');
    const abonoDetails = document.getElementById('abono-details');
    const abonoTransaccionIdInput = document.getElementById('abono-transaccion-id');
    const montoAbonoInput = document.getElementById('monto-abono');

    const ventasChartCtx = document.getElementById('total-ventas-chart')?.getContext('2d');
    const gastosChartCtx = document.getElementById('total-gastos-chart')?.getContext('2d');

    // --- ALMACENES DE DATOS Y GRÁFICOS ---
    let originalVentas = [];
    let originalGastos = [];
    let totalVentasChart = null;
    let totalGastosChart = null;
    let currentVentas = [];

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
        if (ctx.chart) {
            ctx.chart.destroy();
        }
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: { datasets: [{ data: [totalAmount > 0 ? totalAmount : 1], backgroundColor: [totalAmount > 0 ? color : '#E0E0E0'], borderWidth: 2 }] },
            options: { 
                responsive: true, 
                maintainAspectRatio: true, 
                cutout: '70%', 
                plugins: { 
                    legend: { display: false }, 
                    tooltip: { enabled: false }, 
                    title: { display: true, text: formatCurrency(totalAmount), position: 'bottom', font: { size: 16, weight: 'bold' } } 
                }
            }
        });
        ctx.chart = chart;
        return chart;
    };

    // --- FUNCIONES DE RENDERIZADO DE TABLAS (CON CORRECCIÓN) ---
    const renderVentasTable = (ventas) => {
        if (!ventasTableBody) return;
        ventasTableBody.innerHTML = '';
        let totalPeriodo = 0;

        if (!ventas || ventas.length === 0) {
            ventasTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay ventas para mostrar.</td></tr>';
        } else {
            ventas.forEach(v => {
                totalPeriodo += parseFloat(v.venta_bruta) || 0;
                const row = document.createElement('tr');
                
                let accionesHtml = '-'; // Por defecto no hay acciones
                // CORRECCIÓN: Solo mostrar el botón si hay un ID de transacción válido
                if (v.id_transaccion && String(v.estado_pedido).toLowerCase() === 'pendiente' && (parseFloat(v.saldo_pendiente) || 0) > 0) {
                    accionesHtml = `<button class="btn-abono" data-id="${v.id_transaccion}" data-cliente="${v.nombre_cliente}" data-saldo="${v.saldo_pendiente}">Abonar</button>`;
                }

                row.innerHTML = `
                    <td>${v.fecha ? v.fecha.split(' ')[0] : 'N/A'}</td>
                    <td>${v.nombre_cliente || 'Cliente General'}</td>
                    <td>${formatCurrency(v.venta_bruta)}</td>
                    <td><span class="status ${String(v.estado_pedido).toLowerCase()}">${v.estado_pedido || 'N/A'}</span></td>
                    <td>${accionesHtml}</td>
                `;
                ventasTableBody.appendChild(row);
            });
        }
        if (summaryVentas) summaryVentas.textContent = `Total del Periodo: ${formatCurrency(totalPeriodo)}`;
        
        document.querySelectorAll('.btn-abono').forEach(button => {
            button.addEventListener('click', openAbonoModal);
        });
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

    // --- LÓGICA DEL MODAL DE ABONOS ---
    const openAbonoModal = (event) => {
        const button = event.target;
        const transaccionId = button.dataset.id;
        const cliente = button.dataset.cliente;
        const saldo = button.dataset.saldo;

        abonoTransaccionIdInput.value = transaccionId;
        abonoDetails.innerHTML = `<strong>Cliente:</strong> ${cliente}<br><strong>Saldo Pendiente:</strong> ${formatCurrency(saldo)}`;
        montoAbonoInput.value = '';
        montoAbonoInput.max = saldo;
        abonoModal.style.display = 'flex';
    };

    const closeAbonoModal = () => {
        abonoModal.style.display = 'none';
    };

    const handleAbonoSubmit = async (event) => {
        event.preventDefault();
        const id_transaccion = abonoTransaccionIdInput.value;
        const monto_abono = parseFloat(montoAbonoInput.value);

        if (!monto_abono || monto_abono <= 0) {
            alert('Por favor, introduce un monto de abono válido.');
            return;
        }

        showLoading(true);
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'gestionarAbono', id_transaccion, monto_abono })
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert('Abono registrado con éxito.');
                closeAbonoModal();
                loadReportData();
            } else {
                throw new Error(result.message || 'Error al procesar el abono.');
            }
        } catch (error) {
            console.error('Error al registrar abono:', error);
            alert(`Error: ${error.message}`);
        } finally {
            showLoading(false);
        }
    };

    // --- LÓGICA DE FILTRADO Y CARGA ---
    const applyAndRenderFilters = () => {
        const startDate = startDateInput.value ? parseDate(startDateInput.value) : null;
        const endDate = endDateInput.value ? parseDate(endDateInput.value) : null;
        if (endDate) endDate.setHours(23, 59, 59, 999);
        
        const showOnlyDebts = debtToggle.checked;

        let filteredVentas = originalVentas;
        let filteredGastos = originalGastos;

        if (showOnlyDebts) {
            filteredVentas = filteredVentas.filter(v => String(v.estado_pedido).toLowerCase() === 'pendiente' && (parseFloat(v.saldo_pendiente) || 0) > 0);
        }

        if (startDate && endDate) {
            filteredVentas = filteredVentas.filter(v => {
                const vDate = parseDate(v.fecha);
                return vDate && vDate >= startDate && vDate <= endDate;
            });
            filteredGastos = filteredGastos.filter(g => {
                const gDate = parseDate(g.fecha);
                return gDate && gDate >= startDate && gDate <= endDate;
            });
            if(ventasTableTitle) ventasTableTitle.textContent = "Ventas del Periodo";
            if(gastosTableTitle) gastosTableTitle.textContent = "Gastos del Periodo";
        } else {
            const sortedVentas = [...filteredVentas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            filteredVentas = showOnlyDebts ? sortedVentas : sortedVentas.slice(0, 10);

            const sortedGastos = [...originalGastos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            filteredGastos = sortedGastos.slice(0, 10);

            if(ventasTableTitle) ventasTableTitle.textContent = showOnlyDebts ? "Ventas con Deuda" : "Últimas 10 Ventas";
            if(gastosTableTitle) gastosTableTitle.textContent = "Últimos 10 Gastos";
        }
        
        currentVentas = filteredVentas;
        renderVentasTable(currentVentas);
        renderGastosTable(filteredGastos);
    };

    const resetAndRender = () => {
        if(startDateInput) startDateInput.value = '';
        if(endDateInput) endDateInput.value = '';
        if(debtToggle) debtToggle.checked = false;
        applyAndRenderFilters();
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
                
                const totalVentasAbsoluto = originalVentas.reduce((sum, v) => sum + (parseFloat(v.venta_bruta) || 0), 0);
                const totalGastosAbsoluto = originalGastos.reduce((sum, g) => sum + (parseFloat(g.monto) || 0), 0);
                totalVentasChart = createTotalChart(ventasChartCtx, 'Ventas Totales', totalVentasAbsoluto, '#28a745');
                totalGastosChart = createTotalChart(gastosChartCtx, 'Gastos Totales', totalGastosAbsoluto, '#dc3545');

                resetAndRender();
            } else {
                throw new Error(result.message || 'El formato de respuesta del servidor no es válido.');
            }
        } catch (error) {
            console.error('Error fatal al cargar los reportes:', error);
            alert(`No se pudieron cargar los datos de los reportes: ${error.message}`);
        } finally {
            showLoading(false);
        }
    };

    // --- ASIGNACIÓN DE EVENTOS ---
    if (filterBtn) filterBtn.addEventListener('click', applyAndRenderFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetAndRender);
    if (debtToggle) debtToggle.addEventListener('change', applyAndRenderFilters);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAbonoModal);
    if (abonoForm) abonoForm.addEventListener('submit', handleAbonoSubmit);

    // --- INICIALIZACIÓN ---
    if (ventasChartCtx && gastosChartCtx && ventasTableBody && gastosTableBody) {
        loadReportData();
    } else {
        console.error("Algunos elementos clave no se encontraron en el DOM.");
    }
});
