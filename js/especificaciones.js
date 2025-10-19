// ========================================================================== 
// FUNCIONALIDAD DEL MENÚ RESPONSIVE
// ========================================================================== 

const menu = document.getElementById("menu");
const toggleOpen = document.getElementById("toggle_open");
const toggleClose = document.getElementById("toggle_close");

if (menu && toggleOpen && toggleClose) {
    toggleOpen.addEventListener("click", toggleMenu);
    toggleClose.addEventListener("click", toggleMenu);

    function toggleMenu() {
        menu.classList.toggle("show-menu");
        const isMenuOpen = menu.classList.contains("show-menu");
        toggleOpen.style.display = isMenuOpen ? "none" : "block";
        toggleClose.style.display = isMenuOpen ? "block" : "none";
        toggleOpen.setAttribute("aria-expanded", isMenuOpen);
        toggleClose.setAttribute("aria-expanded", isMenuOpen);
    }
}

// Cerrar menú al hacer click en un enlace
const menuLinks = document.querySelectorAll(".menu li a");
menuLinks.forEach(link => {
    link.addEventListener("click", function() {
        if (menu && menu.classList.contains("show-menu")) {
            menu.classList.remove("show-menu");
            if (toggleOpen) toggleOpen.style.display = "block";
            if (toggleClose) toggleClose.style.display = "none";
        }
    });
});

// ========================================================================== 
// FUNCIONALIDAD DE TABS
// ========================================================================== 

document.addEventListener("DOMContentLoaded", function() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    // Verificar que existan elementos
    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.warn("No se encontraron elementos de tabs");
        return;
    }

    // Agregar evento a cada botón de tab
    tabButtons.forEach(button => {
        button.addEventListener("click", function() {
            const tabName = this.getAttribute("data-tab");

            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Agregar clase active al botón y contenido seleccionado
            this.classList.add("active");
            const activeTab = document.getElementById(tabName);
            if (activeTab) {
                activeTab.classList.add("active");
                // Smooth scroll para pantallas más pequeñas
                if (window.innerWidth < 768) {
                    activeTab.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    // Hacer clic en el primer tab por defecto
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
});

// ========================================================================== 
// SCROLL SMOOTH
// ========================================================================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});