document.addEventListener('DOMContentLoaded', function() {
    // --- AUTENTICACIÓN GLOBAL Y CONFIGURACIÓN DEL PANEL ---

    const sesionActiva = sessionStorage.getItem('sesionActiva');
    const usuario = sessionStorage.getItem('usuario');

    // Si la sesión no está marcada como 'true', redirigir a la página de login correcta.
    // Se exceptúa a la propia página de login y al index público para no crear un bucle.
    if (sesionActiva !== 'true') {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'login-registro.html' && currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'login-registro.html';
            return; // Detener la ejecución del script para evitar más errores
        }
        return; // Si estamos en una página pública, no hacer nada más.
    }

    // --- CÓDIGO QUE SOLO SE EJECUTA SI LA SESIÓN ESTÁ ACTIVA ---

    // Configurar el nombre de usuario en la interfaz (si aplica)
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay && usuario) {
        usernameDisplay.textContent = usuario;
    }

    // Configurar el botón de cerrar sesión
    const logoutButton = document.getElementById('btnCerrarSesion');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Limpiar AMBAS claves de sesión para un cierre completo
            sessionStorage.removeItem('sesionActiva');
            sessionStorage.removeItem('usuario');
            window.location.href = 'login-registro.html';
        });
    }
});
