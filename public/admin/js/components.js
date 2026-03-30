document.addEventListener('DOMContentLoaded', function () {
  // Usar una ruta absoluta desde la raíz del sitio para asegurar que funcione en todas partes
  const headerUrl = '/admin/components/header.html';

  // Cargar el encabezado del admin
  fetch(headerUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - URL: ${response.url}`);
      }
      return response.text();
    })
    .then((data) => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = data;
        
        // Activar el enlace de navegación correcto
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        
        navLinks.forEach(link => {
          const linkPath = new URL(link.href).pathname;
          // Comprobar si la ruta actual es exactamente la del enlace
          if (linkPath === currentPage) {
            link.parentElement.classList.add('active');
          } else {
            link.parentElement.classList.remove('active');
          }
        });

        // Añadir funcionalidad al botón de cerrar sesión (si existe)
        const logoutButton = document.getElementById('btnCerrarSesionSidebar');
        if (logoutButton && typeof auth !== 'undefined' && typeof auth.signOut === 'function') {
          logoutButton.addEventListener('click', () => {
            auth.signOut().then(() => {
              window.location.href = '/'; // Redirigir a la página de inicio o login
            }).catch(error => console.error('Error al cerrar sesión:', error));
          });
        }
      }
    })
    .catch(error => console.error('Error crítico al cargar el header:', error));
});
