document.addEventListener('DOMContentLoaded', function() {
    // El chequeo de autenticación ya no se hace aquí, se delega a auth.js

    // --- URL DEL SCRIPT ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsmEVpWCCNBW0N-52h2eHx42YJ9qj7cOT2ktyyQpBY5qgGgCq_wAYd2oW_R7R0j0vV/exec';

    // --- ELEMENTOS DEL DOM ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const btnAddProducto = document.getElementById('btn-add-producto');
    const productModal = document.getElementById('product-modal');
    const closeModalButtons = document.querySelectorAll('.close-button');
    const inventarioForm = document.getElementById('inventario-form');
    const formTitle = document.getElementById('form-title');
    const tablaInventarioBody = document.querySelector('#tabla-inventario tbody');
    const searchInput = document.getElementById('search-input');
    const stockChartCanvas = document.getElementById('stock-chart');

    let allProducts = []; // Almacenar todos los productos para filtrar
    let stockChart = null; // Variable para la instancia del gráfico

    // --- INICIALIZACIÓN ---
    fetchInventoryData(); // Cargar datos al iniciar

    // --- MANEJADORES DE EVENTOS ---

    // Abrir modal para añadir producto
    btnAddProducto.addEventListener('click', () => openModal());

    // Cerrar modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => closeModal());
    });

    // Cierre de modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target == productModal) {
            closeModal();
        }
    });

    // Envío del formulario (añadir/editar)
    inventarioForm.addEventListener('submit', handleFormSubmit);

    // Búsqueda en tiempo real
    searchInput.addEventListener('input', handleSearch);

    // --- FUNCIONES PRINCIPALES ---

    /**
     * Obtiene los datos del inventario del backend y renderiza la tabla y el gráfico.
     */
    function fetchInventoryData() {
        showLoading(true);
        fetch(`${SCRIPT_URL}?action=getInventory`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    allProducts = data.data.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente por nombre
                    renderInventoryTable(allProducts);
                    renderStockChart(allProducts);
                } else {
                    throw new Error(data.message || 'Error al obtener los datos del inventario.');
                }
            })
            .catch(error => {
                console.error('Error en fetchInventoryData:', error);
                alert('Error al cargar el inventario: ' + error.message);
            })
            .finally(() => showLoading(false));
    }

    /**
     * Renderiza la tabla de productos.
     * @param {Array} products - El array de productos a mostrar.
     */
    function renderInventoryTable(products) {
        tablaInventarioBody.innerHTML = ''; // Limpiar tabla
        if (products.length === 0) {
            tablaInventarioBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No se encontraron productos.</td></tr>';
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
                <td class="actions">
                    <button class="btn-edit" data-id="${product.id_producto}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${product.id_producto}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tablaInventarioBody.appendChild(row);
        });

        // Añadir listeners a los nuevos botones
        document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', handleEditClick));
        document.querySelectorAll('.btn-delete').forEach(btn => btn.addEventListener('click', handleDeleteClick));
    }

    /**
     * Renderiza el gráfico de barras de stock.
     * @param {Array} products - El array de productos para el gráfico.
     */
    function renderStockChart(products) {
        const productsToShow = products.slice(0, 20); // Limitar a los primeros 20 para legibilidad

        const labels = productsToShow.map(p => p.nombre);
        const data = productsToShow.map(p => parseFloat(p.stock_actual) || 0);
        const stockMinimo = productsToShow.map(p => parseFloat(p.stock_minimo) || 0);

        const backgroundColors = data.map((stock, index) => {
            return stock <= stockMinimo[index] ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)';
        });

        const borderColors = data.map((stock, index) => {
            return stock <= stockMinimo[index] ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
        });

        if (stockChart) {
            stockChart.destroy(); // Destruir gráfico antiguo si existe
        }

        stockChart = new Chart(stockChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stock Actual',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y + ' | Mínimo: ' + (stockMinimo[context.dataIndex] || 0);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Maneja el envío del formulario para crear o actualizar un producto.
     * @param {Event} event - El evento de envío del formulario.
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        showLoading(true);

        const formData = new FormData(inventarioForm);
        const productData = Object.fromEntries(formData.entries());

        // Llamada al backend
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'saveProduct', data: productData }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                alert(result.message);
                closeModal();
                fetchInventoryData(); // Recargar datos
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            console.error('Error al guardar producto:', error);
            alert('Error al guardar: ' + error.message);
        })
        .finally(() => showLoading(false));
    }

    /**
     * Maneja el clic en el botón de editar.
     */
    function handleEditClick(event) {
        const id = event.currentTarget.dataset.id;
        const product = allProducts.find(p => p.id_producto === id);
        if (product) {
            openModal(true, product);
        }
    }

    /**
     * Maneja el clic en el botón de eliminar.
     */
    function handleDeleteClick(event) {
        const id = event.currentTarget.dataset.id;
        const product = allProducts.find(p => p.id_producto === id);
        if (!product) return;

        if (confirm(`¿Estás seguro de que quieres eliminar el producto "${product.nombre}"?`)) {
            showLoading(true);
            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'deleteProduct', data: { id_producto: id } }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    alert(result.message);
                    fetchInventoryData(); // Recargar
                } else {
                    throw new Error(result.message);
                }
            })
            .catch(error => {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar: ' + error.message);
            })
            .finally(() => showLoading(false));
        }
    }

    /**
     * Filtra la tabla y el gráfico según el término de búsqueda.
     */
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => {
            const name = (product.nombre || '').toLowerCase();
            const code = (product.codigo || '').toLowerCase();
            const category = (product.categoria || '').toLowerCase();
            return name.includes(searchTerm) || code.includes(searchTerm) || category.includes(searchTerm);
        });
        renderInventoryTable(filteredProducts);
        renderStockChart(filteredProducts);
    }

    // --- FUNCIONES UTILITARIAS ---

    /**
     * Abre el modal, opcionalmente rellenándolo para edición.
     * @param {boolean} isEdit - True si es para editar, false para añadir.
     * @param {Object|null} product - El objeto de producto para rellenar el formulario.
     */
    function openModal(isEdit = false, product = null) {
        inventarioForm.reset();
        if (isEdit && product) {
            formTitle.textContent = 'Editar Producto';
            // Rellenar el formulario
            Object.keys(product).forEach(key => {
                const field = inventarioForm.elements[key];
                if (field) {
                    field.value = product[key];
                }
            });
        } else {
            formTitle.textContent = 'Añadir Nuevo Producto';
            inventarioForm.elements['id_producto'].value = ''; // Asegurar que el ID esté vacío
        }
        productModal.style.display = 'block';
    }

    /**
     * Cierra el modal de producto.
     */
    function closeModal() {
        productModal.style.display = 'none';
        inventarioForm.reset();
    }

    /**
     * Muestra u oculta la capa de carga.
     * @param {boolean} show - True para mostrar, false para ocultar.
     */
    function showLoading(show) {
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }
});
