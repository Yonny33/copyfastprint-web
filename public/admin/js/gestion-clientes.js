document.addEventListener("DOMContentLoaded", () => {
  // --- URLs Y CONSTANTES ---
  const API_URL = "/api";

  // --- ELEMENTOS DEL DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");
  const clientesTableBody = document.querySelector("#clientes-table tbody");
  const searchInput = document.getElementById("search-input");

  // Formulario de Registro
  const registroForm = document.getElementById("registro-clientes-form");

  // Modal de Edición
  const editModal = document.getElementById("edit-client-modal");
  const editForm = document.getElementById("edit-client-form");
  const closeModalBtn = document.getElementById("modal-close-btn");
  const editClientId = document.getElementById("edit-client-id");

  // --- ESTADO DE LA APLICACIÓN ---
  let allClients = []; // Caché local para los clientes

  // --- FUNCIONES AUXILIARES ---
  const showLoading = (show) => {
    loadingOverlay.style.display = show ? "flex" : "none";
  };

  const showModal = (show) => {
    editModal.style.display = show ? "flex" : "none";
  };

  // --- FUNCIONES PRINCIPALES ---

  /**
   * Carga todos los clientes desde la API y los guarda en el estado local.
   */
  const fetchClients = async () => {
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/clientes`);
      if (!response.ok) throw new Error("Error al cargar clientes.");
      const result = await response.json();
      if (result.status === "success") {
        allClients = result.data;
        renderTable(allClients);
      } else {
        throw new Error(result.message || "No se pudieron cargar los clientes.");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert(`Error: ${error.message}`);
      clientesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--error-color);">Error al cargar datos.</td></tr>`;
    } finally {
      showLoading(false);
    }
  };

  /**
   * Renderiza las filas de la tabla de clientes.
   * @param {Array} clients - El array de clientes a mostrar.
   */
  const renderTable = (clients) => {
    clientesTableBody.innerHTML = ""; // Limpiar tabla
    if (clients.length === 0) {
      clientesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay clientes registrados.</td></tr>`;
      return;
    }

    clients.forEach((client) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="Nombre">${client.nombre || "N/A"}</td>
        <td data-label="Cédula/RIF">${client.cedula || "N/A"}</td>
        <td data-label="Teléfono">${client.telefono || "N/A"}</td>
        <td data-label="Email">${client.email || "N/A"}</td>
        <td data-label="Acciones">
          <button class="btn-action btn-edit" data-id="${client.id_cliente}" title="Editar Cliente">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action btn-delete" data-id="${client.id_cliente}" title="Eliminar Cliente">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      clientesTableBody.appendChild(tr);
    });
  };

  /**
   * Filtra la tabla de clientes basado en el texto de búsqueda.
   */
  const handleSearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredClients = allClients.filter(client => {
      return (
        client.nombre?.toLowerCase().includes(searchTerm) ||
        client.cedula?.toLowerCase().includes(searchTerm) ||
        client.telefono?.toLowerCase().includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm)
      );
    });
    renderTable(filteredClients);
  };

  /**
   * Maneja el clic en los botones de la tabla (Editar, Eliminar).
   * @param {Event} e - El objeto del evento.
   */
  const handleTableClick = (e) => {
    const target = e.target;
    const editBtn = target.closest(".btn-edit");
    const deleteBtn = target.closest(".btn-delete");

    if (editBtn) {
      const clientId = editBtn.dataset.id;
      const client = allClients.find(c => c.id_cliente === clientId);
      if (client) {
        // Poblar el formulario del modal
        editClientId.value = client.id_cliente;
        editForm.querySelector("#edit-nombre").value = client.nombre || "";
        editForm.querySelector("#edit-cedula").value = client.cedula || "";
        editForm.querySelector("#edit-telefono").value = client.telefono || "";
        editForm.querySelector("#edit-email").value = client.email || "";
        showModal(true);
      }
    } else if (deleteBtn) {
      const clientId = deleteBtn.dataset.id;
      handleDeleteClient(clientId);
    }
  };

  /**
   * Envía la petición para registrar un nuevo cliente.
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);
    const formData = new FormData(registroForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === "success") {
        alert("Cliente registrado con éxito.");
        registroForm.reset();
        fetchClients(); // Recargar la tabla
      } else {
        throw new Error(result.message || "Error desconocido al registrar.");
      }
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      alert(`Error: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  /**
   * Envía la petición para actualizar un cliente existente.
   */
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const clientId = editClientId.value;
    if (!clientId) return;

    showLoading(true);
    const formData = new FormData(editForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_URL}/clientes/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === "success") {
        alert("Cliente actualizado con éxito.");
        showModal(false);
        fetchClients(); // Recargar la tabla
      } else {
        throw new Error(result.message || "Error desconocido al actualizar.");
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert(`Error: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  /**
   * Envía la petición para eliminar un cliente.
   */
  const handleDeleteClient = async (clientId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.")) {
      return;
    }

    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/clientes/${clientId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.status === "success") {
        alert("Cliente eliminado con éxito.");
        fetchClients(); // Recargar la tabla
      } else {
        throw new Error(result.message || "Error desconocido al eliminar.");
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert(`Error: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };


  // --- INICIALIZACIÓN Y EVENT LISTENERS ---
  searchInput.addEventListener("input", handleSearch);
  clientesTableBody.addEventListener("click", handleTableClick);
  registroForm.addEventListener("submit", handleRegisterSubmit);
  editForm.addEventListener("submit", handleEditSubmit);
  closeModalBtn.addEventListener("click", () => showModal(false));
  editModal.addEventListener("click", (e) => { // Cerrar si se hace clic fuera del contenido
    if (e.target === editModal) {
      showModal(false);
    }
  });

  // Carga inicial de datos
  fetchClients();
});
