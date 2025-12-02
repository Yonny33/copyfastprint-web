document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DEL DOM ---
  const loadingOverlay = document.getElementById("loading-overlay");
  const inventoryBody = document.getElementById("inventory-body");
  const searchInput = document.getElementById("searchInput");
  const btnAddProduct = document.getElementById("btnAddProduct");
  const productModal = document.getElementById("productModal");
  const closeModal = document.getElementById("closeModal");
  const productForm = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalTitle");

  // --- URL DEL BACKEND ---
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";
  let allProducts = [];

  // --- FUNCIONES DE UTILIDAD ---
  const showLoading = () => loadingOverlay.style.display = "flex";
  const hideLoading = () => loadingOverlay.style.display = "none";
  const showModal = () => productModal.style.display = "block";
  const hideModal = () => productModal.style.display = "none";

  // --- LÓGICA DE RENDERIZADO ---
  const renderTable = (products) => {
    inventoryBody.innerHTML = "";
    if (products.length === 0) {
      inventoryBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2em;">No se encontraron productos en el inventario.</td></tr>';
      return;
    }

    products.forEach(p => {
      const stockClass = (p.stock_actual <= p.stock_minimo) ? 'stock-bajo' : 'stock-optimo';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.codigo || ''}</td>
        <td>${p.nombre || ''}</td>
        <td><span class="${stockClass}">${p.stock_actual || 0}</span></td>
        <td>${p.unidad_medida || ''}</td>
        <td>${p.stock_minimo || 0}</td>
        <td>${p.proveedor || ''}</td>
        <td>
          <button class="action-btn edit" data-id="${p.id_producto}"><i class="fas fa-edit"></i></button>
        </td>
      `;
      inventoryBody.appendChild(row);
    });
  };

  // --- LÓGICA DE DATOS ---
  const fetchInventory = async () => {
    showLoading();
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getInventory`);
      const result = await response.json();
      if (result.status === "success") {
        allProducts = result.data;
        renderTable(allProducts);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      inventoryBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error al cargar el inventario: ${error.message}</td></tr>`;
    } finally {
      hideLoading();
    }
  };

  // --- MANEJO DE EVENTOS ---
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(p => 
        (p.nombre || '').toLowerCase().includes(searchTerm) || 
        (p.codigo || '').toLowerCase().includes(searchTerm)
    );
    renderTable(filteredProducts);
  });

  btnAddProduct.addEventListener("click", () => {
    productForm.reset();
    modalTitle.textContent = "Agregar Producto";
    document.getElementById("id_producto").value = "";
    showModal();
  });

  closeModal.addEventListener("click", hideModal);
  window.addEventListener("click", (e) => {
    if (e.target === productModal) hideModal();
  });

  inventoryBody.addEventListener("click", (e) => {
    const editButton = e.target.closest('.edit');
    if (editButton) {
      const productId = editButton.dataset.id;
      const product = allProducts.find(p => p.id_producto == productId);
      if (product) {
        for (const key in product) {
            if (productForm.elements[key]) {
                productForm.elements[key].value = product[key];
            }
        }
        modalTitle.textContent = "Editar Producto";
        showModal();
      }
    }
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoading();

    const formData = new FormData(productForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "saveProduct", data: data })
      });

      const result = await response.json();

      if (result.status === "success") {
        hideModal();
        await fetchInventory(); // Recargar la tabla
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(`Error al guardar el producto: ${error.message}`);
    } finally {
      hideLoading();
    }
  });

  // --- INICIALIZACIÓN ---
  if (sessionStorage.getItem("sesionActiva") === "true") {
    fetchInventory();
  } else {
    window.location.href = "login-registro.html";
  }
   // --- CERRAR SESIÓN (copiado de otros scripts) ---
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "login-registro.html";
    });
  }
});