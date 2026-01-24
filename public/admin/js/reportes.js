document.addEventListener("DOMContentLoaded", function () {
  // --- CONSTANTES Y URL DE TU API FIREBASE ---
  const API_URL = "/api";

  // --- ELEMENTOS DEL DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");

  const ventasTableBody = document.querySelector("#ventas-table tbody");
  const ventasTableTitle = document.getElementById("ventas-table-title");
  const summaryVentas = document.getElementById("summary-ventas");

  const abonoModal = document.getElementById("abono-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const abonoForm = document.getElementById("abono-form");
  const abonoDetails = document.getElementById("abono-details");
  const abonoTransaccionIdInput = document.getElementById(
    "abono-transaccion-id",
  );
  const montoAbonoInput = document.getElementById("monto-abono");

  // --- ALMACÉN DE DATOS ---
  let originalVentas = [];
  let currentVentas = [];

  // Referencia directa al input que ahora está en el HTML
  const cedulaSearchInput = document.getElementById("cedula-search");

  // --- FUNCIONES AUXILIARES ---
  const showLoading = (show) => {
    if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none";
  };

  const formatCurrency = (amount) => {
    return `Bs. ${Number(amount).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString.split(" ")[0] + "T00:00:00");
    return isNaN(date.getTime()) ? null : date;
  };

  // --- RENDERIZADO DE LA TABLA DE VENTAS ---
  const renderVentasTable = (ventas) => {
    if (!ventasTableBody) return;
    ventasTableBody.innerHTML = "";
    let totalPeriodo = 0;

    if (!ventas || ventas.length === 0) {
      ventasTableBody.innerHTML =
        '<tr><td colspan="6" style="text-align: center;">No hay clientes con saldo pendiente.</td></tr>';
    } else {
      ventas.forEach((v) => {
        // Sumamos solo lo que deben (saldo pendiente)
        totalPeriodo += parseFloat(v.saldo_pendiente) || 0;
        const row = document.createElement("tr");

        let accionesHtml = "-";
        // Usamos v.id (Firebase). Filtramos visualmente si hay saldo > 0.
        if (v.id && (parseFloat(v.saldo_pendiente) || 0) > 0) {
          accionesHtml = `<button class="btn-abono" data-id="${v.id}" data-cliente="${v.nombre_cliente}" data-saldo="${v.saldo_pendiente}">Abonar</button>`;
        }

        row.innerHTML = `
                    <td>${v.fecha ? v.fecha.split(" ")[0] : "N/A"}</td>
                    <td>${v.nombre_cliente || "Cliente General"}</td>
                    <td>${v.cedula_cliente || "N/A"}</td>
                    <td style="color: #d9534f; font-weight: bold;">${formatCurrency(v.saldo_pendiente)}</td>
                    <td><span class="status ${String(v.estado_pedido).toLowerCase()}">${v.estado_pedido || "N/A"}</span></td>
                    <td>${accionesHtml}</td>
                `;
        ventasTableBody.appendChild(row);
      });
    }
    if (summaryVentas)
      summaryVentas.textContent = `Total por Cobrar: ${formatCurrency(totalPeriodo)}`;

    document.querySelectorAll(".btn-abono").forEach((button) => {
      button.addEventListener("click", openAbonoModal);
    });
  };

  // --- LÓGICA DEL MODAL DE ABONOS ---
  const openAbonoModal = (event) => {
    const button = event.target;
    abonoTransaccionIdInput.value = button.dataset.id;
    abonoDetails.innerHTML = `<strong>Cliente:</strong> ${button.dataset.cliente}<br><strong>Saldo Pendiente:</strong> ${formatCurrency(button.dataset.saldo)}`;
    montoAbonoInput.value = "";
    montoAbonoInput.max = button.dataset.saldo;
    abonoModal.style.display = "flex";
  };

  const closeAbonoModal = () => {
    abonoModal.style.display = "none";
  };

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
        loadReportData(); // Recargar datos
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
    const searchTerm = cedulaSearchInput
      ? cedulaSearchInput.value.trim().toLowerCase()
      : "";

    // FILTRO BASE: Solo mostrar deudores (Saldo > 0). Ignoramos el estado de texto para mayor seguridad.
    let filteredVentas = originalVentas.filter(
      (v) => (parseFloat(v.saldo_pendiente) || 0) > 0.01,
    );

    // Filtro por Cédula (Buscador)
    if (searchTerm) {
      filteredVentas = filteredVentas.filter(
        (v) =>
          v.cedula_cliente &&
          String(v.cedula_cliente).toLowerCase().includes(searchTerm),
      );
    }

    // Ordenar por fecha (más reciente primero)
    filteredVentas.sort((a, b) => parseDate(b.fecha) - parseDate(a.fecha));

    if (ventasTableTitle)
      ventasTableTitle.textContent = "Lista de Clientes con Deuda";

    currentVentas = filteredVentas;
    renderVentasTable(currentVentas);
  };

  const loadReportData = async () => {
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/ventas`);
      if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);

      const result = await response.json();
      if (result.status === "success" && result.data) {
        originalVentas = result.data || [];
        applyAndRenderFilters(); // Renderizar directamente la lista de deudores
      } else {
        throw new Error(
          result.message ||
            "La respuesta del servidor no contiene datos de ventas.",
        );
      }
    } catch (error) {
      console.error("Error fatal al cargar los reportes:", error);
      alert(
        `No se pudieron cargar los datos de los reportes: ${error.message}`,
      );
      if (ventasTableBody)
        ventasTableBody.innerHTML =
          '<tr><td colspan="5" style="text-align: center;">Error al cargar datos.</td></tr>';
    } finally {
      showLoading(false);
    }
  };

  // --- ASIGNACIÓN DE EVENTOS ---
  if (cedulaSearchInput)
    cedulaSearchInput.addEventListener("input", applyAndRenderFilters);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeAbonoModal);
  if (abonoForm) abonoForm.addEventListener("submit", handleAbonoSubmit);

  // --- INICIALIZACIÓN ---
  if (ventasTableBody) {
    loadReportData();
  } else {
    console.error("El cuerpo de la tabla de ventas no se encontró en el DOM.");
  }
});
