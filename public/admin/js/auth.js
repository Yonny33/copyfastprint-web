
// Importa el objeto auth de nuestro archivo de configuración central
import { auth } from '@/firebase-config.js';
// Importa las funciones que necesitamos de la librería de autenticación de Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";

// Ocultamos la página al inicio para evitar "parpadeos" y redirecciones incorrectas.
document.documentElement.style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.toLowerCase();
  const isLoginPage = currentPath.includes("login-registro.html");

  // onAuthStateChanged es la única fuente de verdad. Se ejecuta solo cuando Firebase
  // ha determinado con certeza el estado de autenticación del usuario.
  onAuthStateChanged(auth, (user) => {
    // Una vez que tenemos la respuesta, hacemos visible la página.
    document.documentElement.style.visibility = "visible";

    if (user) {
      // --- El usuario ESTÁ autenticado ---
      console.log("Estado de autenticación: Conectado como", user.email);

      // Si el usuario está en la página de login, lo redirigimos al panel.
      if (isLoginPage) {
        window.location.replace("/admin/admin.html");
        return; // Detenemos la ejecución.
      }

      // Si el usuario está en una página de admin, agregamos los controles.
      iniciarDetectorInactividad();
    } else {
      // --- El usuario NO está autenticado ---
      console.log("Estado de autenticación: Desconectado");

      // Si intenta acceder a una página protegida, lo enviamos al login.
      if (currentPath.includes("/admin/") && !isLoginPage) {
        window.location.replace("/admin/login-registro.html");
      }
    }
  });

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
    // onAuthStateChanged se encargará de la redirección automáticamente.
  };

  // Función para detectar inactividad y cerrar sesión automáticamente
  const iniciarDetectorInactividad = () => {
    let timeout;
    const TIEMPO_LIMITE = 30 * 60 * 1000; // 30 minutos

    const reiniciarTemporizador = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Tu sesión se ha cerrado automáticamente por inactividad.");
        handleLogout();
      }, TIEMPO_LIMITE);
    };

    const eventos = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    eventos.forEach(evento => {
      document.addEventListener(evento, reiniciarTemporizador, { passive: true });
    });
    reiniciarTemporizador(); // Iniciar
  };
});
