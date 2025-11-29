
// URL de nuestra nueva función de Firebase que actúa como proxy
const PROXY_URL_GASTOS = 'https://us-central1-copyfast-control.cloudfunctions.net/proxyGoogleScript';

document.addEventListener('DOMContentLoaded', cargarGastosData);

async function cargarGastosData() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorContainer = document.getElementById('error-container');
    const gastosListBody = document.getElementById('gastos-list');

    loadingOverlay.style.display = 'flex';
    errorContainer.textContent = '';
    gastosListBody.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos

    try {
        // Preparamos los datos que enviaremos en el cuerpo de la petición POST
        const postData = {
            action: 'getGastos'
        };

        // Realizamos la petición POST a nuestra función de Firebase
        const response = await fetch(PROXY_URL_GASTOS, {
            method: 'POST',
            mode: 'cors', // Habilitar CORS para la petición
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error(`Error de red o servidor: ${response.status} ${response.statusText}`);
        }

        const result = await response.json(); // La respuesta ya debería ser JSON

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

    if (gastos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay gastos registrados.</td></tr>';
        return;
    }

    gastos.forEach(gasto => {
        const tr = document.createElement('tr');

        // Asegurarnos de que la fecha es válida antes de formatearla
        const fecha = gasto.fecha ? new Date(gasto.fecha).toLocaleDateString('es-VE') : 'Fecha inválida';
        const monto = parseFloat(gasto.monto).toFixed(2);

        tr.innerHTML = `
            <td>${fecha}</td>
            <td>Bs. ${monto}</td>
            <td>${gasto.categoria}</td>
            <td>${gasto.descripcion}</td>
            <td>${gasto.metodoPago}</td>
        `;
        tbody.appendChild(tr);
    });
}
