document.addEventListener('DOMContentLoaded', function() {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec';

    // --- Elementos del DOM ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const btnAddProducto = document.getElementById('btn-add-producto');
    const productModal = document.getElementById('product-modal');
    const closeModalButtons = document.querySelectorAll('.close-button');
    const inventarioForm = document.getElementById('inventario-form');
    const formTitle = document.getElementById('form-title');
    const tablaInventarioBody = document.querySelector('#tabla-inventario tbody');
    const searchInput = document.getElementById('search-input');
    const stockChartCanvas = document.getElementById('stock-chart');

    let allProducts = [];
    let stockChart = null;

    // --- HELPERS DE FORMATO ---
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    fetchInventoryData();

    // --- MANEJADORES DE EVENTOS ---
    btnAddProducto.addEventListener('click', () => openModal());
    closeModalButtons.forEach(button => button.addEventListener('click', () => closeModal()));
    window.addEventListener('click', (event) => {
        if (event.target == productModal) closeModal();
    });
    inventarioForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);

    // --- FUNCIONES PRINCIPALES ---

    function fetchInventoryData() {
        showLoading(true);
        fetch(`${SCRIPT_URL}?action=getInventory`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error de red: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    allProducts = data.data ? data.data.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '')) : [];
                    renderInventoryTable(allProducts);
                    renderStockChart(allProducts);
                } else {
                    throw new Error(data.message || 'Error al obtener los datos del inventario.');
                }
            })
            .catch(error => {
                console.error('Error en fetchInventoryData:', error);
                alert('Error al cargar el inventario: ' + error.message);
                 tablaInventarioBody.innerHTML = `<tr><td colspan="9" style="text-align:center;">Error al cargar el inventario. Revise la consola para más detalles.</td></tr>`;
            })
            .finally(() => showLoading(false));
    }

    function renderInventoryTable(products) {
        tablaInventarioBody.innerHTML = '';
        if (!products || products.length === 0) {
            tablaInventarioBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No se encontraron productos.</td></tr>';
            return;
        }
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.codigo || ''}</td>
                <td>${product.nombre || ''}</td>
                <td>${product.categoria || ''}</td>
                <td>${product.stock_actual !== null ? product.stock_actual : ''}</td>
                <td>${product.unidad_medida || ''}</td>
                <td>${product.stock_minimo !== null ? product.stock_minimo : ''}</td>
                <td>${product.proveedor || ''}</td>
                <td>${formatDateForDisplay(product.fecha_ingreso)}</td>
                <td class="actions">
                    <button class="btn-edit" data-id="${product.id_producto}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${product.id_producto}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tablaInventarioBody.appendChild(row);
        });
        document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', handleEditClick));
        document.querySelectorAll('.btn-delete').forEach(btn => btn.addEventListener('click', handleDeleteClick));
    }

    function renderStockChart(products) {
        if (!products) return;
        const productsToShow = products.slice(0, 20);
        const labels = productsToShow.map(p => p.nombre);
        const data = productsToShow.map(p => parseFloat(p.stock_actual) || 0);
        const stockMinimo = productsToShow.map(p => parseFloat(p.stock_minimo) || 0);
        const backgroundColors = data.map((stock, index) => stock <= stockMinimo[index] ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)');
        const borderColors = data.map((stock, index) => stock <= stockMinimo[index] ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)');

        if (stockChart) stockChart.destroy();
        
        stockChart = new Chart(stockChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{ label: 'Stock Actual', data: data, backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 1 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } }
            }
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        showLoading(true);
        const formData = new FormData(inventarioForm);
        const productData = Object.fromEntries(formData.entries());

        const payload = {
            action: 'saveProduct',
            data: productData
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error de red: ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.status === 'success') {
                alert(result.message || 'Producto guardado con éxito.');
                closeModal();
                fetchInventoryData();
            } else { 
                throw new Error(result.message || 'Error desconocido al guardar el producto.'); 
            }
        })
        .catch(error => {
            console.error('Error al guardar producto:', error);
            alert('Error al guardar: ' + error.message);
        })
        .finally(() => showLoading(false));
    }

    function handleEditClick(event) {
        const id = event.currentTarget.dataset.id;
        const product = allProducts.find(p => String(p.id_producto) === String(id));
        if (product) openModal(true, product);
    }

    function handleDeleteClick(event) {
        const id = event.currentTarget.dataset.id;
        const product = allProducts.find(p => String(p.id_producto) === String(id));
        if (!product) return;

        if (confirm(`¿Seguro que quieres eliminar "${product.nombre}"?`)) {
            showLoading(true);
            const payload = {
                action: 'deleteProduct',
                data: { id_producto: id }
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                 if (!response.ok) {
                    throw new Error(`Error de red: ${response.statusText}`);
                }
                return response.json();
            })
            .then(result => {
                if (result.status === 'success') {
                    alert(result.message || 'Producto eliminado con éxito.');
                    fetchInventoryData();
                } else { 
                    throw new Error(result.message || 'Error desconocido al eliminar.'); 
                }
            })
            .catch(error => {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar: ' + error.message);
            })
            .finally(() => showLoading(false));
        }
    }

    function handleSearch() {
        if (!allProducts) return;
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = allProducts.filter(p => 
            (p.nombre || '').toLowerCase().includes(searchTerm) || 
            (p.codigo || '').toLowerCase().includes(searchTerm) || 
            (p.categoria || '').toLowerCase().includes(searchTerm)
        );
        renderInventoryTable(filteredProducts);
        renderStockChart(filteredProducts);
    }

    // --- FUNCIONES UTILITARIAS ---

    function openModal(isEdit = false, product = null) {
        inventarioForm.reset();
        if (isEdit && product) {
            formTitle.textContent = 'Editar Producto';
            Object.keys(product).forEach(key => {
                const field = inventarioForm.elements[key];
                if (field) {
                    if (key === 'fecha_ingreso' && product[key]) {
                        const date = new Date(product[key]);
                        if (!isNaN(date)) {
                           field.value = date.toISOString().split('T')[0];
                        }
                    } else {
                        field.value = product[key];
                    }
                }
            });
            if (inventarioForm.elements['id_producto']) {
                inventarioForm.elements['id_producto'].value = product.id_producto || '';
            }
        } else {
            formTitle.textContent = 'Añadir Nuevo Producto';
            if (inventarioForm.elements['id_producto']) {
                inventarioForm.elements['id_producto'].value = '';
            }
            if (inventarioForm.elements['fecha_ingreso']) {
                inventarioForm.elements['fecha_ingreso'].value = new Date().toISOString().split('T')[0];
            }
        }
        productModal.style.display = 'block';
    }

    function closeModal() {
        productModal.style.display = 'none';
        inventarioForm.reset();
    }

    function showLoading(show) {
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }
});
