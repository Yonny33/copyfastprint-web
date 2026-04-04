import { API_BASE_URL } from '/firebase-config.js';

document.addEventListener("DOMContentLoaded", function () {
  const API_URL = API_BASE_URL;

  // --- Elementos del DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");
  const inventarioForm = document.getElementById("inventario-form");
  const tablaInventarioBody = document.getElementById("inventario-tbody");
  const searchInput = document.getElementById("search-inventario-input");
  const cancelEditButton = document.getElementById("cancel-edit-button");
  const stockChartCanvas = document.getElementById("stock-chart");
  
  let allProducts = [];
  let stockChart = null;

  const showLoading = (show) => {
    if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none";
  };

  const fetchInventoryData = async () => {
    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/inventario`);
      if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
      const data = await response.json();

      if (data.status === "success") {
        allProducts = data.data ? data.data.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "")) : [];
        renderInventoryTable(allProducts);
        renderStockChart(allProducts); // Renderizar el gráfico con los datos iniciales
      } else {
        throw new Error(data.message || "Error al obtener los datos del inventario.");
      }
    } catch (error) {
      console.error("Error en fetchInventoryData:", error);
      if (tablaInventarioBody) {
        tablaInventarioBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--error-color);">Error al cargar el inventario: ${error.message}</td></tr>`;
      }
    } finally {
      showLoading(false);
    }
  };

  const renderInventoryTable = (products) => {
    if (!tablaInventarioBody) return;
    tablaInventarioBody.innerHTML = "";
    if (!products || products.length === 0) {
      tablaInventarioBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron productos.</td></tr>`;
      return;
    }

    products.forEach((product) => {
        const stock = parseFloat(product.stock_actual) || 0;
        const minStock = parseFloat(product.stock_minimo) || 0;
        let estado = '<span class="status status-ok">OK</span>';
        if (product.tipo !== 'servicio' && stock <= minStock) {
            estado = stock === 0 
                ? '<span class="status status-error">Agotado</span>' 
                : '<span class="status status-warn">Bajo Stock</span>';
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.nombre_producto || product.nombre || "N/A"}</td>
            <td>${product.categoria || "N/A"}</td>
            <td>${product.tipo === "servicio" ? "N/A" : stock}</td>
            <td>${estado}</td>
            <td class="actions">
                <button class="btn-edit" data-id="${product.id_producto}" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" data-id="${product.id_producto}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tablaInventarioBody.appendChild(row);
    });

    tablaInventarioBody.querySelectorAll(".btn-edit").forEach((btn) => btn.addEventListener("click", handleEditClick));
    tablaInventarioBody.querySelectorAll(".btn-delete").forEach((btn) => btn.addEventListener("click", handleDeleteClick));
  };

  const renderStockChart = (products) => {
    if (!stockChartCanvas || !products) return;

    const productsForChart = products
      .filter(p => p.tipo !== 'servicio' && p.stock_actual > 0)
      .sort((a, b) => (b.stock_actual || 0) - (a.stock_actual || 0))
      .slice(0, 15);

    const labels = productsForChart.map(p => p.nombre_producto || p.nombre || 'Sin Nombre');
    const data = productsForChart.map(p => parseFloat(p.stock_actual) || 0);

    if (stockChart) stockChart.destroy();

    stockChart = new Chart(stockChartCanvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Stock Actual",
          data: data,
          backgroundColor: 'rgba(139, 0, 0, 0.6)', // Rojo corporativo con transparencia
          borderColor: 'rgba(139, 0, 0, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true, grid: { color: "rgba(255, 255, 255, 0.1)" } },
          y: { grid: { color: "rgba(255, 255, 255, 0.05)" } }
        },
        plugins: { legend: { display: false } },
      },
    });
  }
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    showLoading(true);
    
    const formData = new FormData(inventarioForm);
    const productData = Object.fromEntries(formData.entries());
    const idProducto = productData.editProductId;

    delete productData.editProductId;
    if (productData.tipo === 'servicio') {
      delete productData.stock_actual;
      delete productData.stock_minimo;
    }

    const url = idProducto ? `${API_URL}/inventario/${idProducto}` : `${API_URL}/inventario`;
    const method = idProducto ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(productData) });
      const result = await response.json();
      if (!response.ok || result.status !== 'success') throw new Error(result.message || "Error en la respuesta");
      alert(result.message || "Producto guardado.");
      resetForm();
      fetchInventoryData();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar: " + error.message);
    } finally {
      showLoading(false);
    }
  };

  const handleEditClick = (event) => {
    const id = event.currentTarget.dataset.id;
    const product = allProducts.find((p) => String(p.id_producto) === String(id));
    if (!product) return;

    Object.keys(product).forEach((key) => {
      const fieldName = (key === 'nombre') ? 'nombre_producto' : key;
      const field = inventarioForm.elements[fieldName];
      if (field) field.value = product[key] === null ? '' : product[key];
    });
    if (inventarioForm.elements.editProductId) inventarioForm.elements.editProductId.value = product.id_producto;
    
    const submitButton = document.getElementById('submit-button');
    if (submitButton) submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto';
    if (cancelEditButton) cancelEditButton.style.display = 'inline-block';

    inventarioForm.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteClick = async (event) => {
    const id = event.currentTarget.dataset.id;
    const product = allProducts.find((p) => String(p.id_producto) === String(id));
    if (!product || !confirm(`¿Seguro que quieres eliminar "${product.nombre || product.nombre_producto}"?`)) return;

    showLoading(true);
    try {
      const response = await fetch(`${API_URL}/inventario/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || result.status !== 'success') throw new Error(result.message || "Error al eliminar");
      alert(result.message || "Producto eliminado.");
      fetchInventoryData();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar: " + error.message);
    } finally {
      showLoading(false);
    }
  };
  
  const resetForm = () => {
    inventarioForm.reset();
    if (inventarioForm.elements.editProductId) inventarioForm.elements.editProductId.value = '';
    const submitButton = document.getElementById('submit-button');
    if (submitButton) submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
    if (cancelEditButton) cancelEditButton.style.display = 'none';
  };

  const handleSearch = () => {
    if (!allProducts) return;
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = allProducts.filter(p =>
        (p.nombre_producto || p.nombre || "").toLowerCase().includes(searchTerm) ||
        (p.codigo_sku || "").toLowerCase().includes(searchTerm)
    );
    renderInventoryTable(filteredProducts);
    renderStockChart(filteredProducts); // Actualizar gráfico con el resultado de la búsqueda
  };

  // --- INICIALIZACIÓN ---
  fetchInventoryData();
  
  if (inventarioForm) inventarioForm.addEventListener("submit", handleFormSubmit);
  if (searchInput) searchInput.addEventListener("input", handleSearch);
  if (cancelEditButton) cancelEditButton.addEventListener("click", resetForm);
});
