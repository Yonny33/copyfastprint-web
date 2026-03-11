document.addEventListener('DOMContentLoaded', function () {
  // Cargar el encabezado del admin
  fetch('components/header.html')
    .then((response) => response.text())
    .then((data) => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = data;
        // Activar el enlace de navegación correcto
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === currentPage) {
            link.parentElement.classList.add('active');
          }
          else {
            link.parentElement.classList.remove('active');
          }
        });
      }
    })
    .catch(error => console.error('Error al cargar el header:', error));

  // Funcionalidad del botón "Ir Arriba"
  const fabContainer = document.createElement('div');
  fabContainer.className = 'fab-container-admin';

  const fabButton = document.createElement('button');
  fabButton.id = 'btn-ir-arriba';
  fabButton.className = 'fab-btn-up';
  fabButton.title = 'Ir Arriba';
  fabButton.innerHTML = '<i class="fas fa-arrow-up"></i>';

  fabContainer.appendChild(fabButton);
  document.body.appendChild(fabContainer);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Muestra el botón después de hacer scroll 300px
      fabContainer.style.display = 'block';
    } else {
      fabContainer.style.display = 'none';
    }
  });

  fabButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
