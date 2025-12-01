// js/admin-dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  // --- VERIFICACIÓN DE SESIÓN ---
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  if (!sesionActiva) {
    // Si no hay sesión, redirigir al login
    window.location.href = "login-registro.html";
    return; // Detener la ejecución del script
  }

  // --- CERRAR SESIÓN ---
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.clear(); // Limpiar todos los datos de la sesión
      window.location.href = "login-registro.html";
    });
  }

  // --- CARGAR DATOS DEL DASHBOARD ---
  const googleScriptURL =
    "https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec";

  // Hacemos la petición a la API para obtener los datos del dashboard
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
        document.getElementById("ventasDia").textContent = data.ventasDia;
        document.getElementById("ingresosMes").textContent = data.ingresosMes;
        document.getElementById("creditosPendientes").textContent =
          data.creditosPendientes;
        document.getElementById("gastosDia").textContent = data.gastosDia;
        document.getElementById("clientesPendientes").textContent =
          data.clientesPendientes;
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
    });
});
