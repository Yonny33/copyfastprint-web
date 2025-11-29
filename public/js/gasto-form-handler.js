
const PROXY_URL_GASTOS = 'https://us-central1-copyfast-control.cloudfunctions.net/proxyGoogleScript';

document.getElementById('registro-gasto-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Añadimos la acción para que el script de Google sepa qué hacer
    data.action = 'registrarGasto'; 

    if (!data.fecha || !data.monto || !data.categoria) {
        alert('Por favor, completa todos los campos obligatorios: Fecha, Monto y Categoría.');
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

    try {
        const response = await fetch(PROXY_URL_GASTOS, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === "success") {
            alert('¡Gasto registrado con éxito!');
            form.reset();
            // Si la función para recargar la tabla existe, la llamamos
            if (typeof cargarGastosData === 'function') {
                cargarGastosData(); 
            } else {
                window.location.reload(); // Como alternativa, recargamos la página
            }
        } else {
            throw new Error(result.message || 'Ocurrió un error desconocido en el servidor.');
        }

    } catch (error) {
        console.error('Error al registrar el gasto:', error);
        alert(`Error al enviar los datos: ${error.message}. Revisa la consola para más detalles.`);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-plus-circle"></i> Registrar Gasto';
    }
});
