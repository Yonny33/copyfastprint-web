
import { auth } from '@/firebase-config.js';
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
        
        // 1. Limpiar estados activos previos
        const allNavItems = document.querySelectorAll('.sidebar-nav li');
        allNavItems.forEach(li => li.classList.remove('active'));

        // Activar el enlace de navegación correcto
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        
        navLinks.forEach(link => {
          const linkPath = new URL(link.href).pathname;
          // Coincidencia exacta o manejo de "/" para admin.html
          if (linkPath === currentPage || (linkPath === '/admin/admin.html' && currentPage === '/admin/')) {
            link.parentElement.classList.add('active');
          }
        });

        // 2. Inyectar Botones Flotantes Automáticamente
        if (!document.getElementById('admin-floating-container')) {
          const floatingContainer = document.createElement('div');
          floatingContainer.id = 'admin-floating-container';
          floatingContainer.innerHTML = `
            <div class="floating-buttons-container">
              <button class="btn-flotante btn-flotante-top" id="admin-scroll-top" title="Ir Arriba">
                <i class="fas fa-arrow-up"></i>
              </button>
              <button class="btn-flotante btn-flotante-logout" id="btnCerrarSesionSidebar" title="Cerrar Sesión">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          `;
          document.body.appendChild(floatingContainer);

          // Lógica de visibilidad del botón "Ir Arriba"
          const scrollTopBtn = document.getElementById('admin-scroll-top');
          window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
              scrollTopBtn.classList.add('visible');
            } else {
              scrollTopBtn.classList.remove('visible');
            }
          });
          scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }

        // Añadir funcionalidad al botón de cerrar sesión
        document.addEventListener('click', (e) => {
          if (e.target.closest('#btnCerrarSesionSidebar') || e.target.closest('.btn-flotante-logout')) {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
              signOut(auth).catch(error => console.error('Error al cerrar sesión:', error));
            }
          }
        });
      }
    })
    .catch(error => console.error('Error crítico al cargar el header:', error));
});
