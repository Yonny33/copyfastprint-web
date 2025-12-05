
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-clientes-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    // URL de tu Web App de Google Apps Script (URL UNIFICADA)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxchdGk6s_IEi9y-kPG7y_2pY-Yv2QkI2yv62a_25D9l9dM4dO7L9sYvG-Jv2c_8KjW/exec';

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if(loadingOverlay) loadingOverlay.style.display = 'flex';

        const clientData = {
            id_cliente: document.getElementById('id_cliente').value,
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
        };

        const payload = {
            action: 'saveClient',
            data: clientData
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(result => {
            if(loadingOverlay) loadingOverlay.style.display = 'none';

            if (result.status === 'success') {
                alert(result.message || '¡Cliente guardado con éxito!');
                form.reset();
            } else {
                throw new Error(result.message || 'No se pudo guardar el cliente.');
            }
        })
        .catch(error => {
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            console.error('Error al guardar el cliente:', error);
            alert(`Error: ${error.message}`);
        });
    });
});
