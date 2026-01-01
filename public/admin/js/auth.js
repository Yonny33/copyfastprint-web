document.addEventListener('DOMContentLoaded', function() {
    const sesionActiva = sessionStorage.getItem('sesionActiva');
    const usuario = sessionStorage.getItem('usuario');
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login-registro.html');

    // --- PROTECCIÓN DE PÁGINAS DE ADMINISTRACIÓN ---
    // Si estamos dentro de la carpeta /admin/ y no hemos iniciado sesión...
    if (currentPath.includes('/admin/') && !isLoginPage && sesionActiva !== 'true') {
        // Redirigir a la página de login.
        // Usamos una ruta absoluta para asegurar que siempre funcione.
        window.location.href = '/admin/login-registro.html';
        return; // Detener ejecución para evitar errores.
    }

    // Si no estamos en una página de admin, no hacemos nada de protección.

    // --- CÓDIGO QUE SOLO SE EJECUTA SI LA SESIÓN ESTÁ ACTIVA (en cualquier página) ---
    // Esto es útil para mostrar el nombre de usuario o el botón de cerrar sesión
    // si el usuario navega a una página pública mientras tiene la sesión activa.

    if (sesionActiva === 'true') {
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
                sessionStorage.removeItem('sesionActiva');
                sessionStorage.removeItem('usuario');
                // Al cerrar sesión, siempre redirigir al login.
                window.location.href = '/admin/login-registro.html';
            });
        }
    }
});
