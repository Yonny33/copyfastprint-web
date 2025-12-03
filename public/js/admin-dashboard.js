// js/admin-dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  // --- VERIFICACIÓN DE SESIÓN ---
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  if (window.location.pathname.includes("admin.html") && !sesionActiva) {
    sessionStorage.setItem("redirectedFrom", window.location.pathname);
  }

  // --- CERRAR SESIÓN ---
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "login-registro.html";
    });
  }

  // --- CARGAR DATOS DEL DASHBOARD ---
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";
  const loadingOverlay = document.getElementById("loading-overlay");

  function loadDashboardData() {
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    fetch(`${googleScriptURL}?action=getDashboardData`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "success" && data.dashboard) {
          // Si la API responde con éxito, actualizamos los valores en el HTML
          document.getElementById("ventas-dia").textContent = data.dashboard.ventasDia;
          document.getElementById("ingresos-mes").textContent = data.dashboard.ingresosMes;
          document.getElementById("creditos-pendientes").textContent = data.dashboard.creditosPendientes;
          document.getElementById("gastos-dia").textContent = data.dashboard.gastosDia;
          document.getElementById("clientes-pendientes").textContent = data.dashboard.clientesPendientes;
        } else {
          // Si la API devuelve un error controlado o una respuesta inesperada
          throw new Error(data.message || "La respuesta de la API no tuvo el formato esperado.");
        }
      })
      .catch(error => {
        console.error("Error al cargar datos del dashboard:", error);
        // === CORRECCIÓN CLAVE ===
        // Ahora, si hay un error, lo mostramos en las tarjetas correctas.
        const card_ids = ["ventas-dia", "ingresos-mes", "creditos-pendientes", "gastos-dia", "clientes-pendientes"];
        card_ids.forEach(id => {
          const p = document.getElementById(id);
          if (p) {
            p.textContent = "Error";
            p.style.color = "#c60e0f";
          }
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
