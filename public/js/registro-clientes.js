document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-clientes-form');
    if (!form) return;

    const loadingOverlay = document.getElementById('loading-overlay');
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";

    const showLoading = () => loadingOverlay.style.display = 'flex';
    const hideLoading = () => loadingOverlay.style.display = 'none';

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const usuario = sessionStorage.getItem('usuario');
        if (!usuario) {
            alert('Error: Sesión no válida. Por favor, inicie sesión de nuevo.');
            window.location.href = "login.html";
            return;
        }

        showLoading();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // SOLUCIÓN DEFINITIVA: La acción debe coincidir con el nombre de la función en Apps Script.
        const payload = {
            action: 'saveClient',
            usuario: usuario, // El backend podría usarlo para logs o auditoría.
            ...data
        };

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert(result.message || '¡Cliente registrado con éxito!');
                form.reset();
            } else {
                throw new Error(result.message || 'Ocurrió un error desconocido al registrar el cliente.');
            }
        } catch (error) {
            console.error('Error al registrar el cliente:', error);
            alert(`Error: ${error.message}`);
        } finally {
            hideLoading();
        }
    };

    form.addEventListener('submit', handleFormSubmit);
});