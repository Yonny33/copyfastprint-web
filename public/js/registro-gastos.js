// La URL del proxy ya está definida en gasto-form-handler.js, que se carga primero.

document.addEventListener('DOMContentLoaded', cargarGastosData);

async function cargarGastosData() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorContainer = document.getElementById('error-container');
    const gastosListBody = document.getElementById('gastos-list');

    // Asegurarnos de que la URL del proxy esté disponible
    if (typeof PROXY_URL_GASTOS === 'undefined') {
        console.error('La variable PROXY_URL_GASTOS no está definida. Asegúrate de que gasto-form-handler.js se cargue primero.');
        errorContainer.textContent = 'Error de configuración: La URL del servidor no está definida.';
        return;
    }

    loadingOverlay.style.display = 'flex';
    errorContainer.textContent = '';
    gastosListBody.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos

    try {
        const postData = {
            action: 'getGastos'
        };

        const response = await fetch(PROXY_URL_GASTOS, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            // Intentamos leer el texto del error para dar más contexto
            const errorText = await response.text();
            throw new Error(`Error de red o servidor: ${response.status}. ${errorText}`);
        }

        const result = await response.json();

        if (result.status === "success") {
            mostrarGastosEnTabla(result.data);
        } else {
            throw new Error(result.message || 'No se pudieron cargar los gastos.');
        }

    } catch (error) {
        console.error('Error al cargar la data de gastos:', error);
        errorContainer.textContent = `Error: ${error.message}`;
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

function mostrarGastosEnTabla(gastos) {
    const tbody = document.getElementById('gastos-list');
    tbody.innerHTML = ''; // Limpiar antes de llenar

    if (!gastos || gastos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay gastos registrados.</td></tr>';
        return;
    }

    gastos.forEach(gasto => {
        const tr = document.createElement('tr');

        const fecha = gasto.fecha ? new Date(gasto.fecha).toLocaleDateString('es-VE') : 'Fecha inválida';
        const monto = !isNaN(parseFloat(gasto.monto)) ? parseFloat(gasto.monto).toFixed(2) : '0.00';

        tr.innerHTML = `
            <td>${fecha}</td>
            <td>Bs. ${monto}</td>
            <td>${gasto.categoria || 'N/A'}</td>
            <td>${gasto.descripcion || ''}</td>
            <td>${gasto.metodoPago || 'N/A'}</td>
        `;
        tbody.appendChild(tr);
    });
}
