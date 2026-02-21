document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api';
    const tableBody = document.querySelector('#costos-table tbody');
    const searchInput = document.getElementById('search-input');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // KPIs
    const avgMarginEl = document.getElementById('avg-margin');
    const productsAnalyzedEl = document.getElementById('products-analyzed');
    const potentialProfitEl = document.getElementById('potential-profit');

    // Modal y Elementos de Calculadora
    const calcModal = document.getElementById('cost-calculator-modal');
    const closeCalcBtn = document.getElementById('close-calc-modal');
    const btnApplyCalc = document.getElementById('btn-apply-calc');
    const calcResultDisplay = document.getElementById('calc-result-display');
    
    // Referencias a Inputs organizadas por grupo
    const inputs = {
        lote: {
            total: document.getElementById('calc-total-cost'),
            qty: document.getElementById('calc-quantity'),
            extra: document.getElementById('calc-extra')
        },
        prod: {
            base: document.getElementById('prod-base'),
            materials: document.getElementById('prod-materials'),
            labor: document.getElementById('prod-labor'),
            overhead: document.getElementById('prod-overhead')
        },
        price: {
            baseDisplay: document.getElementById('display-base-cost'),
            margin: document.getElementById('calc-margin-percent'),
            final: document.getElementById('calc-final-price')
        }
    };

    let currentProductId = null;
    let calculatedCost = 0;
    let activeTab = 'tab-lote';
    let allProducts = [];

    // --- INICIALIZACIÓN ---
    loadData();

    function showLoading(show) {
        if(loadingOverlay) loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    async function loadData() {
        showLoading(true);
        try {
            const res = await fetch(`${API_URL}/inventario`);
            const data = await res.json();
            if(data.status === 'success') {
                allProducts = data.data || [];
                renderTable(allProducts);
                calculateKPIs(allProducts);
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión al cargar datos.');
        } finally {
            showLoading(false);
        }
    }

    function renderTable(products) {
        tableBody.innerHTML = '';
        products.forEach(prod => {
            const precio = parseFloat(prod.precio) || 0;
            const costo = parseFloat(prod.costo) || 0;
            const margen = precio - costo;
            const margenPorcentaje = precio > 0 ? ((margen / precio) * 100) : 0;
            
            let marginClass = 'text-secondary';
            if (precio > 0) {
                if (margenPorcentaje >= 50) marginClass = 'text-success';
                else if (margenPorcentaje >= 30) marginClass = 'text-warning';
                else marginClass = 'text-danger';
            } else if (costo > 0) {
                marginClass = 'text-danger'; // Costo sin precio = Pérdida
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight:bold; color: var(--text-primary);">${prod.nombre}</div>
                    <div style="font-size:0.85rem; color: var(--text-secondary);">${prod.categoria || 'General'}</div>
                </td>
                <td>Bs. ${precio.toFixed(2)}</td>
                <td>
                    <div class="input-group-cost" style="display: flex; gap: 5px; align-items: center;">
                        <input type="number" step="0.01" min="0" class="cost-input" 
                               data-id="${prod.id_producto}" value="${costo > 0 ? costo : ''}" placeholder="0.00">
                        <button class="btn-open-calc" data-id="${prod.id_producto}" title="Calculadora" 
                                style="background: #333; border: 1px solid #555; color: #ccc; border-radius: 4px; cursor: pointer; padding: 5px 8px;">
                            <i class="fas fa-calculator"></i>
                        </button>
                    </div>
                </td>
                <td class="${marginClass}" style="font-weight:bold;">Bs. ${margen.toFixed(2)}</td>
                <td class="${marginClass}" style="font-weight:bold;">${margenPorcentaje.toFixed(1)}%</td>
                <td>
                    <button class="btn-save-cost" data-id="${prod.id_producto}" title="Guardar">
                        <i class="fas fa-save"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        attachEvents();
    }

    function attachEvents() {
        // Botón Guardar Fila
        document.querySelectorAll('.btn-save-cost').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const row = btn.closest('tr');
                const input = row.querySelector('.cost-input');
                saveProduct(id, { costo: parseFloat(input.value) || 0 }, btn);
            });
        });

        // Enter en Input
        document.querySelectorAll('.cost-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const btn = input.closest('tr').querySelector('.btn-save-cost');
                    btn.click();
                }
            });
        });

        // Abrir Calculadora
        document.querySelectorAll('.btn-open-calc').forEach(btn => {
            btn.addEventListener('click', () => openCalculator(btn.dataset.id));
        });
    }

    function openCalculator(id) {
        currentProductId = id;
        const product = allProducts.find(p => p.id_producto === id);
        if (!product) return;

        // Limpiar inputs
        Object.values(inputs).forEach(group => {
            Object.values(group).forEach(input => {
                if(input.tagName === 'INPUT') input.value = '';
            });
        });
        inputs.lote.extra.value = '0';

        // Precargar datos existentes
        const currentPrice = parseFloat(product.precio) || 0;
        const currentCost = parseFloat(product.costo) || 0;
        
        calculatedCost = currentCost;
        inputs.price.baseDisplay.textContent = `Bs. ${calculatedCost.toFixed(2)}`;
        
        if (currentPrice > 0) {
            inputs.price.final.value = currentPrice.toFixed(2);
            if (calculatedCost > 0) {
                const margin = ((currentPrice - calculatedCost) / calculatedCost) * 100;
                inputs.price.margin.value = margin.toFixed(0);
            }
        }

        // Resetear a pestaña 1
        switchTab('tab-lote');
        calcResultDisplay.textContent = `Bs. ${calculatedCost.toFixed(2)}`;
        
        calcModal.style.display = 'block';
        inputs.lote.total.focus();
    }

    // --- LÓGICA DE PESTAÑAS ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    function switchTab(tabId) {
        activeTab = tabId;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).style.display = 'block';

        // Actualizar texto del botón según la etapa
        if (tabId === 'tab-precio') {
            btnApplyCalc.innerHTML = '<i class="fas fa-save"></i> Guardar y Finalizar';
        } else {
            btnApplyCalc.innerHTML = '<i class="fas fa-arrow-right"></i> Siguiente Paso';
        }

        if (tabId === 'tab-precio') {
            inputs.price.baseDisplay.textContent = `Bs. ${calculatedCost.toFixed(2)}`;
            updatePriceTab(); // Recalcular margen si ya hay precio
        }
        updateCalculation();
    }

    // --- LÓGICA DE CÁLCULO ---
    function updateCalculation() {
        let cost = 0;

        if (activeTab === 'tab-lote') {
            const total = parseFloat(inputs.lote.total.value) || 0;
            const qty = parseFloat(inputs.lote.qty.value) || 1;
            const extra = parseFloat(inputs.lote.extra.value) || 0;
            if (qty > 0) cost = (total + extra) / qty;
        } else if (activeTab === 'tab-prod') {
            const base = parseFloat(inputs.prod.base.value) || 0;
            const mat = parseFloat(inputs.prod.materials.value) || 0;
            const lab = parseFloat(inputs.prod.labor.value) || 0;
            const over = parseFloat(inputs.prod.overhead.value) || 0;
            cost = base + mat + lab + over;
        } else {
            cost = calculatedCost; // En pestaña precio mantenemos el costo calculado
        }

        if (activeTab !== 'tab-precio') {
            calculatedCost = cost;
        }

        calcResultDisplay.textContent = `Bs. ${calculatedCost.toFixed(2)}`;
    }

    function updatePriceTab() {
        const margin = parseFloat(inputs.price.margin.value) || 0;
        const price = parseFloat(inputs.price.final.value) || 0;

        // Si el usuario escribe margen -> calculamos precio
        if (document.activeElement === inputs.price.margin) {
            const newPrice = calculatedCost * (1 + (margin / 100));
            inputs.price.final.value = newPrice.toFixed(2);
        } 
        // Si el usuario escribe precio -> calculamos margen
        else if (document.activeElement === inputs.price.final && calculatedCost > 0) {
            const newMargin = ((price - calculatedCost) / calculatedCost) * 100;
            inputs.price.margin.value = newMargin.toFixed(0);
        }
    }

    // Listeners en todos los inputs
    Object.values(inputs).forEach(group => {
        Object.values(group).forEach(el => {
            if(el.tagName === 'INPUT') {
                el.addEventListener('input', () => {
                    if (activeTab === 'tab-precio') updatePriceTab();
                    else updateCalculation();
                });
            }
        });
    });

    // --- APLICAR Y GUARDAR ---
    btnApplyCalc.addEventListener('click', () => {
        if (!currentProductId) return;

        // Lógica de Pasos (Wizard)
        if (activeTab === 'tab-lote') {
            // Paso 1: De Lote a Producción
            // Si hay un costo calculado, lo pasamos como "Costo Base" a la siguiente pestaña
            if (calculatedCost > 0) {
                inputs.prod.base.value = calculatedCost.toFixed(2);
            }
            switchTab('tab-prod');
            return;
        }

        if (activeTab === 'tab-prod') {
            // Paso 2: De Producción a Precio
            switchTab('tab-precio');
            // Enfocar el campo de margen automáticamente
            setTimeout(() => { if(inputs.price.margin) inputs.price.margin.focus(); }, 100);
            return;
        }

        // Paso 3: Guardar (Solo si estamos en la última pestaña)
        const data = { costo: calculatedCost };
        
        const priceVal = parseFloat(inputs.price.final.value);
        if (priceVal > 0) {
            data.precio = priceVal;
        }

        // Buscar el botón de la fila para mostrar spinner
        const btnSave = document.querySelector(`.btn-save-cost[data-id="${currentProductId}"]`);
        saveProduct(currentProductId, data, btnSave);
        calcModal.style.display = 'none';
    });

    async function saveProduct(id, data, btnElement) {
        if(btnElement) {
            btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btnElement.disabled = true;
        }

        try {
            const res = await fetch(`${API_URL}/inventario/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if(result.status === 'success') {
                // Actualizar datos locales
                const idx = allProducts.findIndex(p => p.id_producto === id);
                if(idx !== -1) {
                    if (data.costo !== undefined) allProducts[idx].costo = data.costo;
                    if (data.precio !== undefined) allProducts[idx].precio = data.precio;
                    renderTable(allProducts);
                    calculateKPIs(allProducts);
                }
            } else {
                alert('Error: ' + result.message);
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión');
        } finally {
            if(btnElement) {
                btnElement.innerHTML = '<i class="fas fa-save"></i>';
                btnElement.disabled = false;
            }
        }
    }

    // --- CÁLCULO DE KPIs ---
    function calculateKPIs(products) {
        let totalMarginPct = 0;
        let count = 0;
        let potential = 0;

        products.forEach(p => {
            const price = parseFloat(p.precio) || 0;
            const cost = parseFloat(p.costo) || 0;
            const stock = parseFloat(p.stock_actual) || 0;

            if (cost > 0 && price > 0) {
                const margin = price - cost;
                totalMarginPct += (margin / price) * 100;
                count++;
                if (stock > 0) potential += (margin * stock);
            }
        });

        const avg = count > 0 ? (totalMarginPct / count) : 0;
        avgMarginEl.textContent = `${avg.toFixed(1)}%`;
        avgMarginEl.className = avg >= 50 ? 'text-success' : (avg >= 30 ? 'text-warning' : 'text-danger');
        
        productsAnalyzedEl.textContent = `${count}/${products.length}`;
        potentialProfitEl.textContent = `Bs. ${potential.toLocaleString('es-VE', {minimumFractionDigits: 2})}`;
    }

    // Buscador
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => 
            (p.nombre || '').toLowerCase().includes(term) || 
            (p.categoria || '').toLowerCase().includes(term)
        );
        renderTable(filtered);
    });

    // Cerrar Modal
    closeCalcBtn.addEventListener('click', () => calcModal.style.display = 'none');
    window.addEventListener('click', (e) => { if(e.target === calcModal) calcModal.style.display = 'none'; });
});
