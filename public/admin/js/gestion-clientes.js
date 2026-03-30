document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/api";

  // --- ELEMENTOS DEL DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");
  const searchInput = document.getElementById("search-input");

  // Formulario Unificado
  const form = document.getElementById("gestion-clientes-form");
  const editClientIdInput = document.getElementById("edit-client-id");
  const submitButton = document.getElementById("submit-button");
  const cancelEditButton = document.getElementById("cancel-edit-button");
  
  // Campos del formulario
  const tipoDocumentoSelect = document.getElementById("tipo_documento");
  const cedulaInput = document.getElementById("cedula");
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const emailInput = document.getElementById("email");

  // Tabla
  const clientesTableBody = document.getElementById("clientes-tbody");

  // --- ESTADO DE LA APLICACIÓN ---
  let allClients = [];

  // --- FUNCIONES AUXILIARES ---
  const showLoading = (show) => { loadingOverlay.style.display = show ? "flex" : "none"; };

  const splitCedula = (fullCedula) => {
      if (!fullCedula) return { tipo: 'V', numero: '' };
      const match = fullCedula.match(/^([VEJPvejp])(.*)$/);
      if (match) return { tipo: match[1].toUpperCase(), numero: match[2] };
      return { tipo: 'V', numero: fullCedula }; // Si no tiene prefijo, asume V
  };

  // --- LÓGICA DE FORMULARIO ---
  const resetFormToRegisterMode = () => {
      form.reset();
      editClientIdInput.value = "";
      submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Cliente';
      cancelEditButton.style.display = 'none';
      tipoDocumentoSelect.value = 'V';
  };

  const populateFormForEdit = (clientId) => {
      const client = allClients.find(c => c.id_cliente == clientId);
      if (!client) {
          alert("Error: No se encontró el cliente para editar.");
          return;
      }

      const { tipo, numero } = splitCedula(client.cedula);

      editClientIdInput.value = client.id_cliente;
      tipoDocumentoSelect.value = tipo;
      cedulaInput.value = numero;
      nombreInput.value = client.nombre || '';
      telefonoInput.value = client.telefono || '';
      emailInput.value = client.email || '';

      submitButton.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Cliente';
      cancelEditButton.style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- LÓGICA DE DATOS Y TABLA ---
  const fetchClients = async () => {
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/clientes`);
      if (!response.ok) throw new Error("Error al cargar clientes.");
      const result = await response.json();
      if (result.status === "success") {
        allClients = result.data.map(client => {
            // Fix para inconsistencia de ID
            if (client.id && !client.id_cliente) client.id_cliente = client.id; 
            return client;
        });
        renderTable(allClients);
      } else {
        throw new Error(result.message || "No se pudieron cargar los clientes.");
      }
    } catch (error) {
      clientesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--error-color);">${error.message}</td></tr>`;
    } finally {
      showLoading(false);
    }
  };

  const renderTable = (clients) => {
    clientesTableBody.innerHTML = "";
    if (clients.length === 0) {
      clientesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay clientes registrados.</td></tr>`;
      return;
    }
    clients.forEach((client) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${client.nombre || "N/A"}</td>
        <td>${client.cedula || "N/A"}</td>
        <td>${client.telefono || "N/A"}</td>
        <td>${client.email || "N/A"}</td>
        <td class="actions">
          <button class="btn-accion btn-edit" data-id="${client.id_cliente}" title="Editar Cliente"><i class="fas fa-edit"></i></button>
          <button class="btn-accion btn-delete" data-id="${client.id_cliente}" title="Eliminar Cliente"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      clientesTableBody.appendChild(tr);
    });
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.")) return;
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/clientes/${clientId}`, { method: "DELETE" });
      const result = await response.json();
      if (result.status === "success") {
        alert("Cliente eliminado con éxito.");
        fetchClients();
      } else throw new Error(result.message);
    } catch (error) {
      alert(`Error al eliminar cliente: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  // --- MANEJADORES DE EVENTOS ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);

    const clientId = editClientIdInput.value;
    const isEditing = !!clientId;

    const formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());

    data.cedula = `${data.tipo_documento}${data.cedula}`;
    delete data.tipo_documento;

    const url = isEditing ? `${API_URL}/clientes/${clientId}` : `${API_URL}/clientes`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === "success") {
        alert(`Cliente ${isEditing ? 'actualizado' : 'registrado'} con éxito.`);
        resetFormToRegisterMode();
        fetchClients();
      } else throw new Error(result.message);
    } catch (error) {
      alert(`Error al guardar cliente: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  const handleSearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredClients = allClients.filter(client => 
      Object.values(client).some(val => 
        String(val).toLowerCase().includes(searchTerm)
      )
    );
    renderTable(filteredClients);
  };

  // --- INICIALIZACIÓN ---
  form.addEventListener("submit", handleFormSubmit);
  cancelEditButton.addEventListener("click", resetFormToRegisterMode);
  searchInput.addEventListener("input", handleSearch);
  clientesTableBody.addEventListener("click", (event) => {
      const target = event.target.closest("button.btn-accion");
      if (!target) return;
      const id = target.dataset.id;
      if (target.classList.contains('btn-edit')) populateFormForEdit(id);
      if (target.classList.contains('btn-delete')) handleDeleteClient(id);
  });

  fetchClients();
});
