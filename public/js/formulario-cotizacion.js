document.addEventListener('DOMContentLoaded', () => {
    // === MANEJO DEL FORMULARIO DE COTIZACIÓN ===
    const form = document.getElementById('cotizacion-form');
    if (form) {
        // Script para el nombre del archivo
        const fileInput = form.querySelector('#archivo');
        const fileNameSpan = form.querySelector('.file-name');
        if (fileInput && fileNameSpan) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    fileNameSpan.textContent = e.target.files[0].name;
                } else {
                    fileNameSpan.textContent = '';
                }
            });
        }

        // Script para el envío del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Deshabilitar botón y mostrar spinner
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Simulación de envío (reemplazar con fetch real)
            setTimeout(() => {
                // Simular éxito
                alert('¡Cotización enviada con éxito! Nos pondremos en contacto contigo pronto.');
                form.reset(); // Limpiar el formulario
                if (fileNameSpan) fileNameSpan.textContent = ''; // Limpiar nombre de archivo

                // Restaurar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;

            }, 2000); // Simular una demora de red de 2 segundos
        });
    }
});
