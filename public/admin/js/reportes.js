document.addEventListener("DOMContentLoaded", function () {
  // --- CONSTANTES Y URL DE TU API FIREBASE ---
  const API_URL = "/api";

  // --- ELEMENTOS DEL DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");

  const ventasTableBody = document.querySelector("#deudores-tbody");
  const ventasTableTitle = document.getElementById("ventas-table-title");
  const summaryVentas = document.getElementById("summary-ventas");

  // Modal de Abono
  const abonoModal = document.getElementById("abono-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const abonoForm = document.getElementById("abono-form");
  const abonoDetails = document.getElementById("abono-details");
  const abonoTransaccionIdInput = document.getElementById("abono-transaccion-id");
  const montoAbonoInput = document.getElementById("monto-abono");
  
  // Modal de Detalles Unificado
  const detallesModal = document.getElementById("detalles-modal");
  const closeDetallesModalBtn = document.getElementById("close-detalles-modal");
  const detallesVentaInfo = document.getElementById("detalles-venta-info");
  const detallesAbonosList = document.getElementById("detalles-abonos-list");

  // --- ALMACÉN DE DATOS ---
  let originalVentas = [];
  let todosLosAbonos = [];
  let currentVentas = [];

  const cedulaSearchInput = document.getElementById("cedula-search");

  // --- FUNCIONES AUXILIARES ---
  const showLoading = (show, element = loadingOverlay) => {
      if (element) element.style.display = show ? "flex" : "none";
  };

  const formatCurrency = (amount) => {
    return `Bs. ${Number(amount).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) { 
          const datePart = dateString.split(" ")[0];
          const newDate = new Date(datePart + "T00:00:00");
          if(isNaN(newDate.getTime())) return dateString;
          return newDate.toLocaleDateString("es-VE");
      }
      return date.toLocaleDateString("es-VE");
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString.split(" ")[0] + "T00:00:00");
    return isNaN(date.getTime()) ? null : date;
  };

  // --- RENDERIZADO DE LA TABLA ---
  const renderVentasTable = (ventas) => {
    if (!ventasTableBody) return;
    ventasTableBody.innerHTML = "";
    let totalPeriodo = 0;

    if (!ventas || ventas.length === 0) {
      ventasTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay clientes con saldo pendiente.</td></tr>';
    } else {
      const unaSemanaEnMilisegundos = 7 * 24 * 60 * 60 * 1000;
      const ahora = new Date();

      ventas.forEach((v) => {
        totalPeriodo += parseFloat(v.saldo_pendiente) || 0;
        const row = document.createElement("tr");
        
        let alertaAbono = '';
        const abonosDelCliente = todosLosAbonos.filter(abono => abono.id_cliente === v.id_cliente);
        let fechaUltimaActividad = parseDate(v.fecha);

        if (abonosDelCliente.length > 0) {
            fechaUltimaActividad = abonosDelCliente.reduce((max, abono) => new Date(abono.fecha) > max ? new Date(abono.fecha) : max, new Date(0));
        }

        if (fechaUltimaActividad && (ahora - fechaUltimaActividad > unaSemanaEnMilisegundos)) {
            alertaAbono = '<i class="fas fa-exclamation-triangle warning-icon" title="Más de 7 días sin abonar"></i>';
        }

        let accionesHtml = '-';
        if ((parseFloat(v.saldo_pendiente) || 0) > 0) {
          accionesHtml = `
            <div class="action-buttons">
              <button class="btn-accion btn-details" data-venta-id="${v.id}" title="Ver Detalles Completos">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-accion btn-abono" data-id="${v.id}" data-cliente="${v.nombre_cliente}" data-saldo="${v.saldo_pendiente}" title="Registrar Abono">
                <i class="fas fa-money-bill-wave"></i>
              </button>
            </div>
          `;
        }

        row.innerHTML = `
          <td>${formatDate(v.fecha)}</td>
          <td>${v.nombre_cliente || "Cliente General"} ${alertaAbono}</td>
          <td>${v.cedula_cliente || "N/A"}</td>
          <td class="saldo-pendiente">${formatCurrency(v.saldo_pendiente)}</td>
          <td><span class="status ${String(v.estado_pedido).toLowerCase()}">${v.estado_pedido || "N/A"}</span></td>
          <td class="actions">${accionesHtml}</td>
        `;
        ventasTableBody.appendChild(row);
      });
    }
    if (summaryVentas) summaryVentas.textContent = `Total por Cobrar: ${formatCurrency(totalPeriodo)}`;

    addEventListenersToButtons();
  };
  
  const addEventListenersToButtons = () => {
      document.querySelectorAll(".btn-abono").forEach((button) => {
        button.addEventListener("click", openAbonoModal);
      });

      document.querySelectorAll(".btn-details").forEach((button) => {
        button.addEventListener("click", openDetallesModal);
      });
  }

  // --- LÓGICA DE MODALES ---
  const openAbonoModal = (event) => {
    const button = event.currentTarget;
    abonoTransaccionIdInput.value = button.dataset.id;
    abonoDetails.innerHTML = `<strong>Cliente:</strong> ${button.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${formatCurrency(button.dataset.saldo)}`;
    montoAbonoInput.value = "";
    montoAbonoInput.max = button.dataset.saldo;
    abonoModal.style.display = "flex";
  };

  const closeAbonoModal = () => {
    abonoModal.style.display = "none";
  };
  
  const openDetallesModal = async (event) => {
      const button = event.currentTarget;
      const ventaId = button.dataset.ventaId;
      
      const ventaData = originalVentas.find(v => v.id === ventaId);
      
      if (!ventaData) {
          alert("No se encontraron los detalles para esta venta.");
          return;
      }
      
      const clienteId = ventaData.id_cliente;

      // FIX: Calcular cantidad de items de forma segura
      let totalItems = 0;
      if (ventaData.items && Array.isArray(ventaData.items)) {
          totalItems = ventaData.items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
      }

      // 1. Popular la sección de detalles de la venta
      detallesVentaInfo.innerHTML = `
        <p><strong>Cliente:</strong> ${ventaData.nombre_cliente || "N/A"}</p>
        <p><strong>Fecha de Venta:</strong> ${formatDate(ventaData.fecha)}</p>
        <p><strong>Monto Total:</strong> ${formatCurrency(ventaData.monto_total)}</p>
        <p><strong>Cantidad de Items:</strong> ${totalItems}</p>
        <p><strong>Detalles del Pedido:</strong><br>${ventaData.detalles_pedido || "Sin detalles adicionales."}</p>
      `;
      
      // 2. Popular la sección de abonos
      detallesAbonosList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Cargando abonos...</p>';
      detallesModal.style.display = "flex";

      try {
        const abonosDelCliente = todosLosAbonos.filter(abono => abono.id_cliente === clienteId);
        
        if (abonosDelCliente.length > 0) {
            abonosDelCliente.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            
            detallesAbonosList.innerHTML = `
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>ID Venta</th>
                    <th style="text-align: right;">Monto Abonado</th>
                  </tr>
                </thead>
                <tbody>
                  ${abonosDelCliente.map(abono => `
                    <tr>
                      <td>${new Date(abono.fecha).toLocaleString('es-VE')}</td>
                      <td><small>${abono.id_venta || 'N/A'}</small></td>
                      <td style="text-align: right;">${formatCurrency(abono.monto)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `;
        } else {
            detallesAbonosList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No se han registrado abonos para este cliente.</p>';
        }

      } catch (error) {
          console.error("Error al cargar historial de abonos:", error);
          detallesAbonosList.innerHTML = `<p style="text-align: center; color: var(--error-color);">Error al cargar el historial: ${error.message}</p>`;
      }
  };

  const closeDetallesModal = () => {
      detallesModal.style.display = "none";
  }

  const handleAbonoSubmit = async (event) => {
    event.preventDefault();
    const id_transaccion = abonoTransaccionIdInput.value;
    const monto_abono = parseFloat(montoAbonoInput.value);

    if (!monto_abono || monto_abono <= 0) {
      alert("Por favor, introduce un monto de abono válido.");
      return;
    }

    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/ventas/${id_transaccion}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monto_abono: monto_abono }),
      });
      const result = await response.json();
      if (result.status === "success") {
        alert(result.message);
        closeAbonoModal();
        loadReportData(); // Recarga todo para ver los cambios
      } else {
        throw new Error(result.message || "Error al procesar el abono.");
      }
    } catch (error) {
      console.error("Error al registrar abono:", error);
      alert(`Error: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  // --- LÓGICA DE FILTRADO Y CARGA ---
  const applyAndRenderFilters = () => {
    const searchTerm = cedulaSearchInput ? cedulaSearchInput.value.trim().toLowerCase() : "";

    let filteredVentas = originalVentas.filter((v) => (parseFloat(v.saldo_pendiente) || 0) > 0.01);

    if (searchTerm) {
      filteredVentas = filteredVentas.filter((v) => v.cedula_cliente && String(v.cedula_cliente).toLowerCase().includes(searchTerm));
    }

    filteredVentas.sort((a, b) => parseDate(b.fecha) - parseDate(a.fecha));

    if (ventasTableTitle) ventasTableTitle.textContent = "Lista de Clientes con Deuda";

    currentVentas = filteredVentas;
    renderVentasTable(currentVentas);
  };

  const loadReportData = async () => {
    showLoading(true, loadingOverlay);
    try {
      const [ventasResponse, abonosResponse] = await Promise.all([
        fetch(`${API_URL}/ventas`),
        fetch(`${API_URL}/abonos`)
      ]);

      if (!ventasResponse.ok) throw new Error(`Error de red en ventas: ${ventasResponse.statusText}`);
      if (!abonosResponse.ok) throw new Error(`Error de red en abonos: ${abonosResponse.statusText}`);

      const ventasResult = await ventasResponse.json();
      const abonosResult = await abonosResponse.json();

      if (ventasResult.status === "success" && ventasResult.data) {
        originalVentas = ventasResult.data || [];
      } else {
        throw new Error(ventasResult.message || "La respuesta de ventas no contiene datos.");
      }
      
      if (abonosResult.status === "success" && abonosResult.data) {
        todosLosAbonos = abonosResult.data || [];
      } else {
        console.warn(abonosResult.message || "La respuesta de abonos no contiene datos, se continuará sin historial de abonos.");
        todosLosAbonos = []; // Asegurarse de que sea un array vacío si falla
      }

      applyAndRenderFilters();

    } catch (error) {
      console.error("Error fatal al cargar los reportes:", error);
      alert(`No se pudieron cargar los datos de los reportes: ${error.message}`);
      if (ventasTableBody) ventasTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error al cargar datos.</td></tr>';
    } finally {
      showLoading(false, loadingOverlay);
    }
  };

  // --- ASIGNACIÓN DE EVENTOS ---
  if (cedulaSearchInput) cedulaSearchInput.addEventListener("input", applyAndRenderFilters);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeAbonoModal);
  if (closeDetallesModalBtn) closeDetallesModalBtn.addEventListener("click", closeDetallesModal);
  if (abonoForm) abonoForm.addEventListener("submit", handleAbonoSubmit);

  // --- INICIALIZACIÓN ---
  if (ventasTableBody) {
    loadReportData();
  } else {
    console.error("El cuerpo de la tabla de deudores no se encontró en el DOM.");
  }
});
