document.addEventListener('DOMContentLoaded', function() {
    const sesionActiva = sessionStorage.getItem('sesionActiva');
    const usuario = sessionStorage.getItem('usuario');
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login-registro.html');

    const logout = () => {
        sessionStorage.removeItem('sesionActiva');
        sessionStorage.removeItem('usuario');
        window.location.href = '/admin/login-registro.html';
    };

    if (currentPath.includes('/admin/') && !isLoginPage) {
        if (sesionActiva !== 'true') {
            window.location.href = '/admin/login-registro.html';
            return;
        }

        const body = document.body;
        const floatingButtonsContainer = document.createElement('div');
        floatingButtonsContainer.className = 'floating-buttons-container';
        floatingButtonsContainer.innerHTML = `
            <button id="btn-logout-floating" class="btn-flotante btn-flotante-logout" title="Cerrar Sesión">
                <i class="fas fa-sign-out-alt"></i>
            </button>
            <button id="btn-go-top" class="btn-flotante btn-flotante-top" title="Ir arriba">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;
        body.appendChild(floatingButtonsContainer);

        // --- LÓGICA UNIVERSAL PARA EL BOTÓN "IR ARRIBA" ---
        const goTopBtn = document.getElementById('btn-go-top');
        const mainContent = document.querySelector('.admin-main-content');

        if (goTopBtn) {
            const handleScroll = () => {
                let show = (window.scrollY > 100) || (mainContent && mainContent.scrollTop > 100);
                goTopBtn.style.display = show ? "flex" : "none";
            };

            window.addEventListener('scroll', handleScroll);
            if (mainContent) {
                mainContent.addEventListener('scroll', handleScroll);
            }

            goTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (mainContent) {
                    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        const logoutFloatingBtn = document.getElementById('btn-logout-floating');
        if (logoutFloatingBtn) {
            logoutFloatingBtn.addEventListener('click', logout);
        }

        const originalLogoutButton = document.getElementById('btnCerrarSesion');
        if (originalLogoutButton) {
            originalLogoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }

    if (isLoginPage && sesionActiva === 'true') {
        window.location.href = '/admin/admin.html';
    }
});
