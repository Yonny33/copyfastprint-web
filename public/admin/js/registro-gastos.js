document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "/api";

  // --- ELEMENTOS DEL DOM ---
  const form = document.getElementById("registro-gastos-form");
  const loadingOverlay = document.getElementById("loading-overlay");

  // Campos del formulario
  const editGastoIdInput = document.getElementById("edit-gasto-id");
  const fechaInput = document.getElementById("fecha");
  const proveedorInput = document.getElementById("proveedor");
  const tipoDocumentoSelect = document.getElementById("tipo_documento");
  const rifInput = document.getElementById("rif");
  const montoInput = document.getElementById("monto");
  const descripcionInput = document.getElementById("descripcion");
  const categoriaSelect = document.getElementById("categoria");
  const metodoPagoSelect = document.getElementById("metodo_pago");

  // Botones
  const submitButton = document.getElementById("submit-button");
  const cancelEditButton = document.getElementById("cancel-edit-button");

  // Tabla
  const gastosTableBody = document.getElementById("gastos-tbody");
  const searchGastosInput = document.getElementById("search-gastos-input");

  // --- ALMACÉN DE DATOS ---
  let todosLosGastos = [];

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

  // --- LÓGICA DE EDICIÓN Y FORMULARIO ---
  const resetFormToRegisterMode = () => {
      form.reset();
      editGastoIdInput.value = "";
      submitButton.innerHTML = '<i class="fas fa-save"></i> Registrar Gasto';
      cancelEditButton.style.display = 'none';
      setFechaActual();
  };

  const populateFormForEdit = (gastoId) => {
      const gasto = todosLosGastos.find(g => g.id == gastoId);
      if (!gasto) {
          alert("Error: No se encontró el gasto para editar.");
          return;
      }
      editGastoIdInput.value = gasto.id;
      fechaInput.value = formatDateForInput(gasto.fecha);
      proveedorInput.value = gasto.proveedor || '';
      montoInput.value = gasto.monto;
      descripcionInput.value = gasto.descripcion || '';
      categoriaSelect.value = gasto.categoria;
      metodoPagoSelect.value = gasto.metodo_pago;

      if (gasto.rif) {
        const rifRegex = /^([VEJPvejp])(.*)$/;
        const match = gasto.rif.match(rifRegex);
        if (match) {
          tipoDocumentoSelect.value = match[1].toUpperCase();
          rifInput.value = match[2];
        } else {
          tipoDocumentoSelect.value = 'J';
          rifInput.value = gasto.rif;
        }
      } else {
        tipoDocumentoSelect.value = 'J';
        rifInput.value = '';
      }

      submitButton.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Gasto';
      cancelEditButton.style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- LÓGICA DE LA TABLA Y DATOS ---
  const renderGastosTable = (gastos) => {
    gastosTableBody.innerHTML = "";
    if (gastos.length === 0) {
      gastosTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron gastos.</td></tr>';
      return;
    }
    gastos.forEach(gasto => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatDate(gasto.fecha)}</td>
        <td>${gasto.proveedor || 'N/A'}</td>
        <td>${gasto.rif || 'N/A'}</td>
        <td>${formatCurrency(gasto.monto)}</td>
        <td>${gasto.categoria || 'N/A'}</td>
        <td class="actions">
            <button class="btn-accion btn-edit" data-id="${gasto.id}" title="Editar Gasto"><i class="fas fa-edit"></i></button>
            <button class="btn-accion btn-delete" data-id="${gasto.id}" title="Eliminar Gasto"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      gastosTableBody.appendChild(row);
    });
  };

  const loadAndRenderGastos = async () => {
    if (!gastosTableBody) return;
    gastosTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/gastos`);
        const result = await response.json();
        if(result.status === 'success' && result.data) {
            // CORRECCIÓN: Mapear 'rit' a 'rif' si existe.
            const gastosMapeados = result.data.map(gasto => {
                if (gasto.rit && !gasto.rif) {
                    gasto.rif = gasto.rit;
                }
                return gasto;
            });
            todosLosGastos = gastosMapeados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            renderGastosTable(todosLosGastos);
        } else throw new Error(result.message);
    } catch (error) {
        gastosTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--error-color);">Error: ${error.message}</td></tr>`;
    }
  };

  const handleDeleteGasto = async (gastoId) => {
      if (!confirm("¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer.")) return;
      showLoading(true);
      try {
          const response = await fetch(`${API_URL}/gastos/${gastoId}`, { method: 'DELETE' });
          const result = await response.json();
          if (result.status === 'success') {
              alert("Gasto eliminado con éxito.");
              loadAndRenderGastos();
          } else throw new Error(result.message);
      } catch (error) {
          alert(`Error al eliminar el gasto: ${error.message}`);
      } finally {
          showLoading(false);
      }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);

    const gastoId = editGastoIdInput.value;
    const isEditing = !!gastoId;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (data.tipo_documento && data.rif) {
      data.rif = `${data.tipo_documento}${data.rif}`;
    } else {
      data.rif = 'N/A';
    }
    delete data.tipo_documento;

    data.monto = parseFloat(data.monto) || 0;

    // Al enviar, nos aseguramos de usar 'rit' si la API lo requiere.
    data.rit = data.rif; 

    const url = isEditing ? `${API_URL}/gastos/${gastoId}` : `${API_URL}/gastos`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert(`¡Gasto ${isEditing ? 'actualizado' : 'registrado'} con éxito!`);
        resetFormToRegisterMode();
        loadAndRenderGastos();
      } else throw new Error(result.message || "Error al guardar.");
    } catch (error) {
      alert(`Error al guardar el gasto: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  // --- INICIALIZACIÓN Y EVENTOS ---
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
    cancelEditButton.addEventListener("click", resetFormToRegisterMode);
    setFechaActual();
    loadAndRenderGastos();

    searchGastosInput?.addEventListener('input', () => {
      const searchTerm = searchGastosInput.value.toLowerCase().trim();
      const gastosFiltrados = todosLosGastos.filter(g => 
          g.proveedor?.toLowerCase().includes(searchTerm) || 
          g.rif?.toLowerCase().includes(searchTerm)
      );
      renderGastosTable(gastosFiltrados);
    });

    gastosTableBody?.addEventListener("click", (event) => {
        const target = event.target.closest("button.btn-accion");
        if (!target) return;
        const id = target.dataset.id;
        if (target.classList.contains('btn-edit')) populateFormForEdit(id);
        if (target.classList.contains('btn-delete')) handleDeleteGasto(id);
    });
  } 
});
