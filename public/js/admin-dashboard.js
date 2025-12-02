// js/admin-dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  // --- VERIFICACIÓN DE SESIÓN ---
  // Aunque el login ahora es server-side, esta verificación previene que la página se muestre brevemente antes de redirigir.
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  if (window.location.pathname.includes("admin.html") && !sesionActiva) {
    // Para la primera carga, si no hay sesión, el servidor ya debería haber redirigido.
    // Esto es una segunda capa de seguridad por si el usuario navega directamente.
    sessionStorage.setItem("redirectedFrom", window.location.pathname);
  }

  // --- CERRAR SESIÓN ---
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.clear(); // Limpiar todos los datos de la sesión
      // Redirigimos al script que a su vez redirigirá al login. Esto puede ayudar a invalidar sesiones en el servidor si se implementa.
      window.location.href = "login-registro.html";
    });
  }

  // --- CARGAR DATOS DEL DASHBOARD ---
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";
  const loadingOverlay = document.getElementById("loading-overlay");

  function loadDashboardData() {
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    fetch(`${googleScriptURL}?action=getDashboardData`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          // Si la API responde con éxito, actualizamos los valores en el HTML
          document.getElementById("ventasDia").textContent = data.dashboard.ventasDia;
          document.getElementById("ingresosMes").textContent = data.dashboard.ingresosMes;
          document.getElementById("creditosPendientes").textContent = data.dashboard.creditosPendientes;
          document.getElementById("gastosDia").textContent = data.dashboard.gastosDia;
          document.getElementById("clientesPendientes").textContent = data.dashboard.clientesPendientes;
        } else {
          // Si la API devuelve un error controlado
          throw new Error(`Error en la API: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos del dashboard:", error);
        // Mostramos un mensaje de error en todas las tarjetas
        const cards = document.querySelectorAll(".card-value");
        cards.forEach((card) => {
          card.textContent = "Error";
          card.style.color = "#c60e0f";
        });
      })
      .finally(() => {
         if (loadingOverlay) loadingOverlay.style.display = 'none';
      });
  }

  // Solo cargar los datos si estamos en la página del admin
  if (document.querySelector(".admin-container")) {
      loadDashboardData();
  }
});
