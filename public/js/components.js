document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = async (id, url) => {
    const element = document.getElementById(id);
    if (!element) {
      // Si el placeholder no existe en la página, no hacer nada.
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`No se pudo cargar el componente: ${url} (Estado: ${response.status})`);
      }
      const text = await response.text();
      element.innerHTML = text;
    } catch (error) {
      console.error("Error al cargar componente:", error);
      element.innerHTML = `<p style="color: red; text-align: center;">Error al cargar ${id}.</p>`;
    }
  };

  const setActiveLink = () => {
    // Asegurarnos de que el header se haya cargado antes de manipular sus links
    const navLinks = document.querySelectorAll(".nav-links a");
    if (navLinks.length === 0) {
        // Si los links no estan, reintentar en un momento. 
        // Esto puede pasar si el fetch del header es mas lento que la ejecucion inicial
        setTimeout(setActiveLink, 100); 
        return;
    }

    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
      const linkPage = link.getAttribute("href").split("/").pop();

      // Quitar la clase 'active' de todos los links primero
      link.classList.remove("active");

      // Comparar la pagina actual con el link
      if (currentPage === linkPage || (currentPage === '' && (linkPage === 'index.html' || linkPage === ''))) {
        link.classList.add("active");
        
        // Manejo especial para el dropdown de 'Herramientas'
        const parentDropdown = link.closest('.dropdown-menu');
        if (parentDropdown) {
            const toolsLink = document.querySelector('a[href="/herramientas.html"], a[href="herramientas.html"]');
            if(toolsLink) {
               toolsLink.classList.add('active');
            }
        }
      }
    });
  };

  const init = async () => {
    // Cargar header y footer en paralelo
    await Promise.all([
      loadComponent("header-placeholder", "/components/header.html"),
      loadComponent("footer-placeholder", "/components/footer.html")
    ]);

    // Una vez que los componentes (especialmente el header) están cargados, 
    // podemos ejecutar la lógica que depende de ellos.
    setActiveLink();
    
    // Re-inicializar cualquier script global que dependa de elementos en el header/footer
    // Por ejemplo, si el menu movil esta en scripts.js
    if(typeof globalScripts === 'function') {
      globalScripts();
    }
  };

  init();
});
