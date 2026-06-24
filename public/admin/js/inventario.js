import { API_BASE_URL } from '@/firebase-config.js';
import '@/admin/css/modules/_forms.css';
import '@/admin/css/modules/_tables.css';
import '@/admin/css/modules/_responsive.css';
import '@/admin/css/modules/_common_admin_ui.css'; // Para toolbar y search-bar

import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

document.addEventListener("DOMContentLoaded", function () {
  const API_URL = API_BASE_URL;

  // --- Elementos del DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");
  const inventarioForm = document.getElementById("inventario-form");
  const tablaInventarioBody = document.getElementById("inventario-tbody");
  const searchInput = document.getElementById("search-inventario-input");
  const cancelEditButton = document.getElementById("cancel-edit-button");
  const modeSelector = document.querySelectorAll('input[name="form-mode"]'); // Radio buttons: nuevo vs existente
  const productSelectContainer = document.getElementById("product-select-container");
  const existingProductSelect = document.getElementById("existing-product-select");
  const motivoAjusteContainer = document.getElementById("motivo-ajuste-container");
  const motivoAjusteSelect = document.getElementById("motivo_ajuste");
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
        populateProductSelect(allProducts); // Poblar el dropdown de carga de stock
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
            <td class="actions" style="display: flex; gap: 8px; justify-content: center; align-items: center; border-bottom: none;">
                <button class="btn-edit" data-id="${product.id_producto}" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" data-id="${product.id_producto}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tablaInventarioBody.appendChild(row);
    });

    tablaInventarioBody.querySelectorAll(".btn-edit").forEach((btn) => btn.addEventListener("click", handleEditClick));
    tablaInventarioBody.querySelectorAll(".btn-delete").forEach((btn) => btn.addEventListener("click", handleDeleteClick));
  };

  // --- POBLAR EL SELECT DE PRODUCTOS EXISTENTES ---
  const populateProductSelect = (products) => {
    if (!existingProductSelect) return;
    existingProductSelect.innerHTML = '<option value="" disabled selected>Selecciona un producto para cargar stock...</option>';
    products.forEach(product => {
      if (product.tipo !== 'servicio') {
        const option = document.createElement("option");
        option.value = product.id_producto;
        option.textContent = product.nombre_producto || product.nombre || "Sin Nombre";
        existingProductSelect.appendChild(option);
      }
    });
  };

  // --- LÓGICA DE CAMBIO DE MODO (NUEVO VS EXISTENTE) ---
  const handleModeChange = (mode) => {
    const isExisting = mode === 'existing';
    // Mostrar/ocultar el buscador de productos
    if (productSelectContainer) productSelectContainer.style.display = isExisting ? 'block' : 'none';
    if (motivoAjusteContainer) motivoAjusteContainer.style.display = isExisting ? 'block' : 'none';
    if (motivoAjusteSelect) motivoAjusteSelect.required = isExisting;
    if (existingProductSelect) existingProductSelect.required = isExisting;
    
    const stockActualInput = inventarioForm.elements['stock_actual'];

    // Campos que deben ocultarse y dejar de ser obligatorios en modo entrada
    const fieldsToHide = ['categoria', 'tipo', 'precio_costo', 'precio_venta', 'stock_minimo', 'nombre_producto'];
    fieldsToHide.forEach(name => {
      const field = inventarioForm.elements[name];
      if (field) {
        const group = field.closest('.form-group');
        if (group) group.style.display = isExisting ? 'none' : 'block';
        // IMPORTANTE: Quitar 'required' para que el navegador permita enviar el form
        if (['nombre_producto', 'categoria', 'tipo'].includes(name)) {
            field.required = !isExisting;
        }
      }
    });

    // Limpiar valores sin resetear los radio buttons
    inventarioForm.querySelectorAll('input:not([type="radio"]), select:not(#existing-product-select), textarea').forEach(i => i.value = '');

    // Ajustar el atributo 'min' del campo stock_actual
    if (stockActualInput) {
        if (isExisting) {
            stockActualInput.removeAttribute('min'); // Permitir valores negativos para ajustes
        } else {
            stockActualInput.setAttribute('min', '0'); // Volver a aplicar para nuevo producto/edición normal
        }
    }

    const stockLabel = inventarioForm.querySelector('label[for="stock_actual"]');
    if (stockLabel) stockLabel.textContent = isExisting ? 'Cantidad que Ingresa *' : 'Stock Actual *';
  };

  const renderStockChart = (products) => {
    if (!stockChartCanvas || !products) return;

    const productsForChart = products
      .filter(p => p.tipo !== 'servicio')
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
          backgroundColor: data.map(val => {
            if (val <= 0) return '#d97706'; // Naranja para stock agotado o negativo (Alerta)
            if (val <= 5) return '#eab308'; // Amarillo para stock crítico (<= 5)
            return 'rgba(70, 1, 1, 0.6)';  // Rojo oscuro para stock normal
          }),
          borderColor: 'rgba(255, 255, 255, 0.1)',
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
        plugins: { 
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 4,
            color: '#eaeaea',
            font: {
              weight: 'bold',
              size: 11
            },
            formatter: (value) => (value > 0 ? value : '0')
          }
        },
      },
    });
  }
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    showLoading(true);
    
    const formData = new FormData(inventarioForm);
    let rawData = Object.fromEntries(formData.entries());
    const idProducto = inventarioForm.elements.editProductId?.value;
    const isAdjustmentMode = document.querySelector('input[name="form-mode"]:checked')?.value === 'existing';

    // Convertir campos numéricos para evitar que se guarden como texto
    const productData = {
        ...rawData,
        stock_actual: parseFloat(rawData.stock_actual) || 0,
        stock_minimo: parseFloat(rawData.stock_minimo) || 0,
        precio_costo: parseFloat(rawData.precio_costo) || 0,
        precio_venta: parseFloat(rawData.precio_venta) || 0
    };

    delete productData.editProductId;
    delete productData['form-mode'];

    // MODO AJUSTE: Si el usuario quiere sumar stock a un producto existente
    if (isAdjustmentMode && idProducto) {
        const payloadAjuste = {
            cantidad_sumar: productData.stock_actual,
            // Ahora la descripción incluye el motivo del ajuste
            descripcion: `${rawData.motivo_ajuste || 'Ajuste'}: ${productData.descripcion || ''}`.trim()

        };
        
        try {
            const response = await fetch(`${API_URL}/inventario/${idProducto}`, { 
                method: "PUT", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(payloadAjuste) 
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            alert("Stock actualizado correctamente.");
            resetForm();
            fetchInventoryData();
            return; // Finalizar aquí
        } catch (error) {
            alert("Error al cargar stock: " + error.message);
            showLoading(false);
            return;
        }
    }

    const url = (idProducto || isAdjustmentMode) ? `${API_URL}/inventario/${idProducto}` : `${API_URL}/inventario`;
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

    // Asegurar que el atributo 'min' se restablezca correctamente según el modo actual
    const currentMode = document.querySelector('input[name="form-mode"]:checked')?.value;
    handleModeChange(currentMode); // Re-aplicar la lógica del modo después del reset
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

  // Escuchar cambios en el selector de productos existentes para asignar el ID oculto
  if (existingProductSelect) {
    existingProductSelect.addEventListener("change", (e) => {
      if (inventarioForm.elements.editProductId) {
        inventarioForm.elements.editProductId.value = e.target.value;
      }
    });
  }
  
  // Listener para los radio buttons de modo
  modeSelector.forEach(radio => {
    radio.addEventListener('change', (e) => handleModeChange(e.target.value));
  });
});
