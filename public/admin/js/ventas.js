document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "/api";

  // --- ELEMENTOS DEL DOM ---
  const form = document.getElementById("registro-ventas-form");
  const loadingOverlay = document.getElementById("loading-overlay");

  // Campos del formulario
  const editVentaIdInput = document.getElementById("edit-venta-id");
  const clienteSelect = document.getElementById("cliente");
  const productoSelect = document.getElementById("producto");
  const metodoPagoSelect = document.getElementById("metodo_pago");
  const cantidadInput = document.getElementById("cantidad");
  const precioUnitarioInput = document.getElementById("precio_unitario");
  const ventaBrutaInput = document.getElementById("venta_bruta");
  const abonoRecibidoInput = document.getElementById("abono_recibido");
  const saldoPendienteInput = document.getElementById("saldo_pendiente");
  const fechaInput = document.getElementById("fecha");
  const detallesPedidoInput = document.getElementById("detalles_pedido");

  // Botones
  const submitButton = document.getElementById("submit-button");
  const cancelEditButton = document.getElementById("cancel-edit-button");

  // Tabla y Modal
  const ventasTableBody = document.getElementById("ventas-tbody");
  const searchVentasInput = document.getElementById("search-ventas-input");
  const modal = document.getElementById("venta-details-modal");
  const modalContent = document.getElementById("venta-details-content");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  // --- ALMACÉN DE DATOS ---
  let todasLasVentas = [];

  // --- FUNCIONES AUXILIARES ---
  const showLoading = (show) => { if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none"; };
  const formatCurrency = (amount) => `Bs. ${Number(amount).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString.split(" ")[0] + "T00:00:00");
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("es-VE");
  };
  const formatDateForInput = (dateString) => {
      if (!dateString) return new Date().toISOString().split('T')[0];
      return new Date(dateString).toISOString().split('T')[0];
  }
  const setFechaActual = () => { if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0]; };

  // --- LÓGICA DEL MODAL ---
  const openModalWithDetails = (ventaId) => {
    const venta = todasLasVentas.find(v => v.id === ventaId);
    if (venta) {
      const detailsHtml = `<dl class="details-list">
          <dt>ID Venta:</dt><dd>${venta.id || 'N/A'}</dd>
          <dt>Fecha:</dt><dd>${formatDate(venta.fecha)}</dd>
          <dt>Cliente:</dt><dd>${venta.nombre_cliente || 'N/A'}</dd>
          <dt>Cédula/RIF:</dt><dd>${venta.cedula_cliente || 'N/A'}</dd>
          <dt>Producto/Descripción:</dt><dd>${venta.descripcion || venta.producto || 'N/A'}</dd>
          <dt>ID Producto:</dt><dd>${venta.id_producto || 'N/A'}</dd>
          <dt>Cantidad:</dt><dd>${venta.cantidad || 'N/A'}</dd>
          <dt>Precio Unitario:</dt><dd>${formatCurrency(venta.precio_unitario)}</dd>
          <dt>Venta Bruta:</dt><dd>${formatCurrency(parseFloat(venta.monto_total) || parseFloat(venta.venta_bruta) || 0)}</dd>
          <dt>Abono Recibido:</dt><dd>${formatCurrency(venta.abono_recibido)}</dd>
          <dt>Saldo Pendiente:</dt><dd>${formatCurrency(venta.saldo_pendiente)}</dd>
          <dt>Estado:</dt><dd>${venta.estado_pedido || 'N/A'}</dd>
          <dt>Método de Pago:</dt><dd>${venta.metodo_pago || 'N/A'}</dd>
        </dl>`;
      modalContent.innerHTML = detailsHtml;
    }
    modal.style.display = "block";
  };
  const closeModal = () => { modal.style.display = "none"; };

  // --- LÓGICA DE EDICIÓN Y FORMULARIO ---
  const resetFormToRegisterMode = () => {
      form.reset();
      editVentaIdInput.value = "";
      submitButton.innerHTML = '<i class="fas fa-save"></i> Registrar Venta';
      cancelEditButton.style.display = 'none';
      setFechaActual();
      actualizarCalculos();
  };

  const populateFormForEdit = (ventaId) => {
      const venta = todasLasVentas.find(v => v.id === ventaId);
      if (!venta) {
          alert("Error: No se encontró la venta para editar.");
          return;
      }
      editVentaIdInput.value = venta.id;
      fechaInput.value = formatDateForInput(venta.fecha);
      clienteSelect.value = venta.id_cliente;
      productoSelect.value = venta.id_producto;
      detallesPedidoInput.value = venta.detalles_pedido || '';
      cantidadInput.value = venta.cantidad;
      precioUnitarioInput.value = venta.precio_unitario;
      abonoRecibidoInput.value = venta.abono_recibido;
      metodoPagoSelect.value = venta.metodo_pago;
      
      actualizarCalculos();

      submitButton.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Venta';
      cancelEditButton.style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actualizarCalculos = () => {
      const cantidad = parseFloat(cantidadInput.value) || 0;
      const precioUnitario = parseFloat(precioUnitarioInput.value) || 0;
      const abonoRecibido = parseFloat(abonoRecibidoInput.value) || 0;
      const ventaBruta = cantidad * precioUnitario;
      const saldoPendiente = ventaBruta - abonoRecibido;
      ventaBrutaInput.value = ventaBruta.toFixed(2);
      saldoPendienteInput.value = saldoPendiente.toFixed(2);
      metodoPagoSelect.disabled = abonoRecibido <= 0;
      metodoPagoSelect.required = abonoRecibido > 0;
      if (abonoRecibido <= 0) metodoPagoSelect.value = "";
  };

  const cargarSelects = async (url, selectElement, textField, valueField) => {
      try {
          const response = await fetch(url);
          const result = await response.json();
          if (result.status === "success" && result.data) {
              selectElement.innerHTML = `<option value="" disabled selected>Seleccione</option>`;
              result.data.forEach(item => selectElement.add(new Option(item[textField], item[valueField])));
          } else throw new Error(result.message);
      } catch (error) { selectElement.innerHTML = `<option value="">Error</option>`; }
  };

  // --- LÓGICA DE LA TABLA Y DATOS ---
  const renderVentasTable = (ventas) => {
    ventasTableBody.innerHTML = "";
    if (ventas.length === 0) {
      ventasTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron ventas.</td></tr>';
      return;
    }
    ventas.forEach(venta => {
      const row = document.createElement('tr');
      const montoTotal = parseFloat(venta.monto_total) || parseFloat(venta.venta_bruta) || 0;
      const saldoPendiente = parseFloat(venta.saldo_pendiente) || 0;
      row.innerHTML = `
        <td>${formatDate(venta.fecha)}</td>
        <td>${venta.nombre_cliente || 'N/A'}</td>
        <td>${venta.cedula_cliente || 'N/A'}</td>
        <td>${formatCurrency(montoTotal)}</td>
        <td>${formatCurrency(saldoPendiente)}</td>
        <td><span>${venta.estado_pedido || 'N/A'}</span></td>
        <td class="actions">
            <button class="btn-accion btn-details" data-id="${venta.id}" title="Ver Detalles"><i class="fas fa-eye"></i></button>
            <button class="btn-accion btn-edit" data-id="${venta.id}" title="Editar Venta"><i class="fas fa-edit"></i></button>
            <button class="btn-accion btn-delete" data-id="${venta.id}" title="Eliminar Venta"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      ventasTableBody.appendChild(row);
    });
  };

  const loadAndRenderVentas = async () => {
    ventasTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/ventas`);
        const result = await response.json();
        if(result.status === 'success' && result.data) {
            todasLasVentas = result.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            renderVentasTable(todasLasVentas.slice(0, 20));
        } else throw new Error(result.message);
    } catch (error) {
        ventasTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--error-color);">Error: ${error.message}</td></tr>`;
    }
  };

  const handleDeleteVenta = async (ventaId) => {
      if (!confirm("¿Estás seguro de que quieres eliminar esta venta? Esta acción no se puede deshacer.")) return;
      showLoading(true);
      try {
          const response = await fetch(`${API_URL}/ventas/${ventaId}`, { method: 'DELETE' });
          const result = await response.json();
          if (result.status === 'success') {
              alert("Venta eliminada con éxito.");
              loadAndRenderVentas();
          } else throw new Error(result.message);
      } catch (error) {
          alert(`Error al eliminar la venta: ${error.message}`);
      } finally {
          showLoading(false);
      }
  };
  
  // --- MANEJADOR PRINCIPAL DEL FORMULARIO ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);

    const ventaId = editVentaIdInput.value;
    const isEditing = !!ventaId;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // --- FIX: Re-agregar la lógica de cálculo y población de datos ---
    data.venta_bruta = ventaBrutaInput.value;
    data.saldo_pendiente = saldoPendienteInput.value;
    data.metodo_pago = (parseFloat(data.abono_recibido) || 0) <= 0 ? "N/A" : data.metodo_pago;
    data.estado_pedido = (parseFloat(data.saldo_pendiente) || 0) > 0.01 ? "Pendiente" : "Pagado";

    const selectedProduct = productoSelect.options[productoSelect.selectedIndex];
    data.id_producto = selectedProduct.value;
    data.descripcion = selectedProduct.text; // Usar 'descripcion' para ser consistente

    const selectedClient = clienteSelect.options[clienteSelect.selectedIndex];
    if (selectedClient && selectedClient.value) {
      data.id_cliente = selectedClient.value;
      data.nombre_cliente = selectedClient.text;
    }
    // --- FIN DEL FIX ---

    const url = isEditing ? `${API_URL}/ventas/${ventaId}` : `${API_URL}/ventas`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert(`¡Venta ${isEditing ? 'actualizada' : 'registrada'} con éxito!`);
        resetFormToRegisterMode();
        loadAndRenderVentas();
      } else throw new Error(result.message || "Error al guardar.");
    } catch (error) {
      alert(`Error al guardar la venta: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  // --- INICIALIZACIÓN Y EVENTOS ---
  if (form) {
    [cantidadInput, precioUnitarioInput, abonoRecibidoInput].forEach(input => input?.addEventListener("input", actualizarCalculos));
    form.addEventListener("submit", handleFormSubmit);
    cancelEditButton.addEventListener("click", resetFormToRegisterMode);
    
    setFechaActual();
    cargarSelects(`${API_URL}/clientes`, clienteSelect, 'nombre', 'id_cliente');
    cargarSelects(`${API_URL}/inventario`, productoSelect, 'nombre', 'id_producto');
    actualizarCalculos();
    loadAndRenderVentas();

    searchVentasInput?.addEventListener('input', () => {
      const searchTerm = searchVentasInput.value.toLowerCase().trim();
      const ventasFiltradas = todasLasVentas.filter(v => 
          v.nombre_cliente?.toLowerCase().includes(searchTerm) || 
          v.cedula_cliente?.toLowerCase().includes(searchTerm)
      );
      renderVentasTable(searchTerm ? ventasFiltradas : todasLasVentas.slice(0, 20));
    });
    modalCloseBtn?.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => { if (event.target == modal) closeModal(); });
    ventasTableBody?.addEventListener("click", (event) => {
        const target = event.target.closest("button.btn-accion");
        if (!target) return;
        const id = target.dataset.id;
        if (target.classList.contains('btn-details')) openModalWithDetails(id);
        if (target.classList.contains('btn-edit')) populateFormForEdit(id);
        if (target.classList.contains('btn-delete')) handleDeleteVenta(id);
    });
  } 
});
