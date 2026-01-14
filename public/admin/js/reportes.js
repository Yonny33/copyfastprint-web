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
    const goTopBtn = document.getElementById('btn-go-top');

    const ventasTableBody = document.querySelector('#ventas-table tbody');
    const ventasTableTitle = document.getElementById('ventas-table-title');
    const summaryVentas = document.getElementById('summary-ventas');

    const abonoModal = document.getElementById('abono-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const abonoForm = document.getElementById('abono-form');
    const abonoDetails = document.getElementById('abono-details');
    const abonoTransaccionIdInput = document.getElementById('abono-transaccion-id');
    const montoAbonoInput = document.getElementById('monto-abono');

    // --- ALMACÉN DE DATOS ---
    let originalVentas = [];
    let currentVentas = [];
    
    // --- INICIALIZACIÓN DE SELECTORES DE FECHA ---
    flatpickr(startDateInput, { dateFormat: "Y-m-d" });
    flatpickr(endDateInput, { dateFormat: "Y-m-d" });

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

    // --- RENDERIZADO DE LA TABLA DE VENTAS ---
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
                
                let accionesHtml = '-';
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

    // --- LÓGICA DEL MODAL DE ABONOS ---
    const openAbonoModal = (event) => {
        const button = event.target;
        abonoTransaccionIdInput.value = button.dataset.id;
        abonoDetails.innerHTML = `<strong>Cliente:</strong> ${button.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${formatCurrency(button.dataset.saldo)}`;
        montoAbonoInput.value = '';
        montoAbonoInput.max = button.dataset.saldo;
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
                alert(result.message);
                closeAbonoModal();
                loadReportData(); // Recargar datos
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

        if (showOnlyDebts) {
            filteredVentas = filteredVentas.filter(v => String(v.estado_pedido).toLowerCase() === 'pendiente' && (parseFloat(v.saldo_pendiente) || 0) > 0);
        }

        if (startDate && endDate) {
            filteredVentas = filteredVentas.filter(v => {
                const vDate = parseDate(v.fecha);
                return vDate && vDate >= startDate && vDate <= endDate;
            });
            if(ventasTableTitle) ventasTableTitle.textContent = "Ventas del Periodo Seleccionado";
        } else {
            const sortedVentas = [...filteredVentas].sort((a, b) => parseDate(b.fecha) - parseDate(a.fecha));
            filteredVentas = showOnlyDebts ? sortedVentas : sortedVentas.slice(0, 20); // Mostrar últimas 20 por defecto
            if(ventasTableTitle) ventasTableTitle.textContent = showOnlyDebts ? "Todas las Ventas con Deuda" : "Últimas 20 Ventas Registradas";
        }
        
        currentVentas = filteredVentas;
        renderVentasTable(currentVentas);
    };

    const resetAndRender = () => {
        if(startDateInput) startDateInput._flatpickr.clear();
        if(endDateInput) endDateInput._flatpickr.clear();
        if(debtToggle) debtToggle.checked = false;
        applyAndRenderFilters();
    };

    const loadReportData = async () => {
        showLoading(true);
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getReportData`);
            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
            
            const result = await response.json();
            if (result.status === 'success' && result.data && result.data.ventas) {
                originalVentas = result.data.ventas || [];
                resetAndRender(); // Aplicar filtros iniciales (mostrar últimas ventas)
            } else {
                throw new Error(result.message || 'La respuesta del servidor no contiene datos de ventas.');
            }
        } catch (error) {
            console.error('Error fatal al cargar los reportes:', error);
            alert(`No se pudieron cargar los datos de los reportes: ${error.message}`);
            if(ventasTableBody) ventasTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar datos.</td></tr>';
        } finally {
            showLoading(false);
        }
    };

    // --- LÓGICA DEL BOTÓN IR ARRIBA ---
    if(goTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                goTopBtn.style.display = "block";
            } else {
                goTopBtn.style.display = "none";
            }
        };
        goTopBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // --- ASIGNACIÓN DE EVENTOS ---
    if (filterBtn) filterBtn.addEventListener('click', applyAndRenderFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetAndRender);
    if (debtToggle) debtToggle.addEventListener('change', applyAndRenderFilters);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAbonoModal);
    if (abonoForm) abonoForm.addEventListener('submit', handleAbonoSubmit);

    // --- INICIALIZACIÓN ---
    if (ventasTableBody) {
        loadReportData();
    } else {
        console.error("El cuerpo de la tabla de ventas no se encontró en el DOM.");
    }
});
