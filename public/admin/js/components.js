
import { auth } from '/firebase-config.js';
import { signOut } from 'firebase/auth';

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
          // Usamos new URL para obtener la ruta de forma segura, incluso con URL completas
          const linkPath = new URL(link.href).pathname;
          if (linkPath === currentPage) {
            link.parentElement.classList.add('active');
          }
        });

        // Añadir funcionalidad al botón de cerrar sesión
        const logoutButton = document.getElementById('btnCerrarSesionSidebar');
        if (logoutButton) {
          logoutButton.addEventListener('click', () => {
            signOut(auth).catch(error => console.error('Error al cerrar sesión:', error));
            // No es necesario redirigir aquí. El script 'auth.js' detectará el cambio
            // de estado y redirigirá a la página de login automáticamente.
          });
        }
      }
    })
    .catch(error => console.error('Error crítico al cargar el header:', error));
});
