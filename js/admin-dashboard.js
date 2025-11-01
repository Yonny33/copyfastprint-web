// ==========================================================================
// ===  LÓGICA DEL PANEL ADMINISTRATIVO (admin.html)  ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Elemento para la animación de carga
  const loadingOverlay = document.getElementById("loading-overlay");

  // 1. VERIFICACIÓN DE SESIÓN (Redirige si no hay sesión)
  if (sessionStorage.getItem("sesionActiva") !== "true") {
    // Si no hay sesión, redirigir inmediatamente.
    window.location.href = "login-registro.html";
    return; // Detener la ejecución del resto del script
  }

  // 2. FUNCIÓN PARA FORMATEAR MONEDA (Bolívares)
  function formatVES(numero) {
    return `Bs. ${parseFloat(numero).toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // 3. MOSTRAR INFORMACIÓN DEL USUARIO
  const usuario = sessionStorage.getItem("usuario");
  if (usuario) {
    const ultimoAcceso = sessionStorage.getItem("ultimoAcceso");
    const userInfo = document.createElement("div");

    // NOTA: La clase 'user-info-status' está definida en el bloque <style> de admin.html
    userInfo.className = "user-info-status";
    userInfo.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5em;">
        <i class="fas fa-user-circle" style="font-size: 1.5em; color: #c60e0f;"></i>
        <div>
          <strong style="display: block; color: #222;">Bienvenido, ${usuario}</strong>
          <small style="color: #666;">Último acceso: ${ultimoAcceso}</small>
        </div>
      </div>
    `;
    document.body.appendChild(userInfo);
  }

  // 4. EVENTO DE CERRAR SESIÓN
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        sessionStorage.clear();
        window.location.href = "login-registro.html";
      }
    });
  }

  // 5. CARGAR DATOS DEL DASHBOARD
  async function cargarDashboard() {
    // Mostrar animación de carga
    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }

    try {
      // ⚠️ ATENCIÓN: Esta sección está comentada y usa datos de ejemplo (simulación).
      // Descomenta y adapta la lógica 'fetch' cuando implementes tu función de Netlify para obtener datos reales.

      /*
      const response = await fetch('/.netlify/functions/obtener-dashboard');
      if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
      }
      const datos = await response.json();
      */

      // Datos de ejemplo (Simulación - ELIMINAR CUANDO SE USE BACKEND)
      const datos = {
        ventasDia: 2450.5,
        ingresosMes: 45780.0,
        creditosPendientes: 8930.0,
        gastosDia: 650.0,
        clientesPendientes: 12,
      };

      // Simular un tiempo de carga de red
      await new Promise(resolve => setTimeout(resolve, 500));

      // Inyectar datos en el DOM
      document.getElementById("ventasDia").textContent = formatVES(
        datos.ventasDia
      );
      document.getElementById("ingresosMes").textContent = formatVES(
        datos.ingresosMes
      );
      document.getElementById("creditosPendientes").textContent = formatVES(
        datos.creditosPendientes
      );
      document.getElementById("gastosDia").textContent = formatVES(
        datos.gastosDia
      );
      document.getElementById("clientesPendientes").textContent =
        datos.clientesPendientes;
    } catch (error) {
      console.error("Error al cargar el dashboard:", error);
      // Opcional: Mostrar un mensaje de error visible al usuario
    } finally {
      // Ocultar animación de carga
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }
    }
  }

  // Iniciar carga del dashboard al cargar el DOM
  cargarDashboard();
});// ==========================================================================
// ===  LÓGICA DEL PANEL ADMINISTRATIVO (admin.html)  ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Elemento para la animación de carga
  const loadingOverlay = document.getElementById("loading-overlay");

  // 1. VERIFICACIÓN DE SESIÓN (Redirige si no hay sesión)
  if (sessionStorage.getItem("sesionActiva") !== "true") {
    // Si no hay sesión, redirigir inmediatamente.
    window.location.href = "login-registro.html";
    return; // Detener la ejecución del resto del script
  }

  // 2. FUNCIÓN PARA FORMATEAR MONEDA (Bolívares)
  function formatVES(numero) {
    return `Bs. ${parseFloat(numero).toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // 3. MOSTRAR INFORMACIÓN DEL USUARIO
  const usuario = sessionStorage.getItem("usuario");
  if (usuario) {
    const ultimoAcceso = sessionStorage.getItem("ultimoAcceso");
    const userInfo = document.createElement("div");

    // NOTA: La clase 'user-info-status' está definida en el bloque <style> de admin.html
    userInfo.className = "user-info-status";
    userInfo.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5em;">
        <i class="fas fa-user-circle" style="font-size: 1.5em; color: #c60e0f;"></i>
        <div>
          <strong style="display: block; color: #222;">Bienvenido, ${usuario}</strong>
          <small style="color: #666;">Último acceso: ${ultimoAcceso}</small>
        </div>
      </div>
    `;
    document.body.appendChild(userInfo);
  }

  // 4. EVENTO DE CERRAR SESIÓN
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        sessionStorage.clear();
        window.location.href = "login-registro.html";
      }
    });
  }

  // 5. CARGAR DATOS DEL DASHBOARD
  async function cargarDashboard() {
    // Mostrar animación de carga
    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }

    try {
      // ⚠️ ATENCIÓN: Esta sección está comentada y usa datos de ejemplo (simulación).
      // Descomenta y adapta la lógica 'fetch' cuando implementes tu función de Netlify para obtener datos reales.

      /*
      const response = await fetch('/.netlify/functions/obtener-dashboard');
      if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
      }
      const datos = await response.json();
      */

      // Datos de ejemplo (Simulación - ELIMINAR CUANDO SE USE BACKEND)
      const datos = {
        ventasDia: 2450.5,
        ingresosMes: 45780.0,
        creditosPendientes: 8930.0,
        gastosDia: 650.0,
        clientesPendientes: 12,
      };

      // Simular un tiempo de carga de red
      await new Promise(resolve => setTimeout(resolve, 500));

      // Inyectar datos en el DOM
      document.getElementById("ventasDia").textContent = formatVES(
        datos.ventasDia
      );
      document.getElementById("ingresosMes").textContent = formatVES(
        datos.ingresosMes
      );
      document.getElementById("creditosPendientes").textContent = formatVES(
        datos.creditosPendientes
      );
      document.getElementById("gastosDia").textContent = formatVES(
        datos.gastosDia
      );
      document.getElementById("clientesPendientes").textContent =
        datos.clientesPendientes;
    } catch (error) {
      console.error("Error al cargar el dashboard:", error);
      // Opcional: Mostrar un mensaje de error visible al usuario
    } finally {
      // Ocultar animación de carga
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }
    }
  }

  // Iniciar carga del dashboard al cargar el DOM
  cargarDashboard();
});