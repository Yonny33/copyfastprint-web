const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvlvXmJd6xprAs3jSn8YuURliNLoH4TThLh5UuKNzcEZZXrcNO_UA9MG5oyA8iuZ-kyA/exec';

document.getElementById('registro-gasto-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.fecha || !data.monto || !data.categoria) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

    try {
        // La petición a Google Apps Script no necesita ser un POST complejo.
        // Lo envolvemos en una función de redirección para evitar problemas de CORS.
        // NOTA: Esta es una solución alternativa común para Google Apps Script.
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            // Cambiamos el Content-Type para evitar el preflight de CORS que causa "Failed to fetch"
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(data)
        });

        const resultText = await response.text();
        const result = JSON.parse(resultText);

        if (result.status === "success") {
            alert('¡Gasto registrado con éxito!');
            form.reset();
            if (typeof cargarGastosData === 'function') {
                cargarGastosData(); 
            }
        } else {
            throw new Error(result.message || 'Ocurrió un error desconocido en el script.');
        }

    } catch (error) {
        console.error('Error al registrar el gasto:', error);
        // El error "Failed to fetch" suele ser un problema de red o CORS.
        alert(`Error al enviar los datos: ${error.message}. Revisa la consola para más detalles.`);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-plus-circle"></i> Registrar Gasto';
    }
});
