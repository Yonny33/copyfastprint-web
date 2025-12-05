
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-gastos-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    // URL de tu Web App de Google Apps Script
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxchdGk6s_IEi9y-kPG7y_2pY-Yv2QkI2yv62a_25D9l9dM4dO7L9sYvG-Jv2c_8KjW/exec';

    // Asignar la fecha actual al campo de fecha por defecto
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('fecha').value = `${yyyy}-${mm}-${dd}`;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuario = sessionStorage.getItem('usuario');
        if (!usuario) {
            alert('Error: No se ha encontrado información del usuario. Por favor, inicie sesión de nuevo.');
            return;
        }

        // Mostrar overlay de carga
        if(loadingOverlay) loadingOverlay.style.display = 'flex';

        // Construir el objeto de datos del formulario
        const formData = {
            action: 'registrarGasto',
            fecha: document.getElementById('fecha').value,
            proveedor: document.getElementById('proveedor').value,
            rit: document.getElementById('rit').value,
            monto: document.getElementById('monto').value,
            descripcion: document.getElementById('descripcion').value,
            categoria: document.getElementById('categoria').value,
            metodo_pago: document.getElementById('metodo_pago').value,
            usuario: usuario
        };

        // Enviar los datos a Google Apps Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', 
            credentials: 'omit', 
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Ocultar overlay de carga
            if(loadingOverlay) loadingOverlay.style.display = 'none';

            if (data.status === 'success') {
                alert('¡Gasto registrado con éxito!');
                form.reset();
                // Re-asignar la fecha actual después de limpiar el formulario
                document.getElementById('fecha').value = `${yyyy}-${mm}-${dd}`;
            } else {
                throw new Error(data.message || 'Ocurrió un error desconocido.');
            }
        })
        .catch(error => {
            if(loadingOverlay) loadingOverlay.style.display = 'none';
            console.error('Error al registrar el gasto:', error);
            alert(`Error al registrar el gasto: ${error.message}`);
        });
    });
});
