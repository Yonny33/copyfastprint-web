// Ocultamos la página al inicio para evitar "parpadeos" y redirecciones incorrectas.
document.documentElement.style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", function () {
  const auth = firebase.auth();
  const currentPath = window.location.pathname.toLowerCase();
  const isLoginPage = currentPath.includes("login-registro.html");

  // onAuthStateChanged es la única fuente de verdad. Se ejecuta solo cuando Firebase
  // ha determinado con certeza el estado de autenticación del usuario.
  auth.onAuthStateChanged((user) => {
    // Una vez que tenemos la respuesta, hacemos visible la página.
    document.documentElement.style.visibility = "visible";

    if (user) {
      // --- El usuario ESTÁ autenticado ---
      console.log("Estado de autenticación: Conectado como", user.email);

      // Si el usuario está en la página de login, lo redirigimos al panel.
      // Usamos .replace() para que no pueda volver a la página de login con el botón "Atrás".
      if (isLoginPage) {
        window.location.replace("/admin/admin.html");
        return; // Detenemos la ejecución del script aquí.
      }

      // Si el usuario está en una página de admin (y no es la de login), todo está bien.
      // Agregamos los controles de la interfaz (logout, ir arriba, etc.).
      addAdminUIControls();
    } else {
      // --- El usuario NO está autenticado ---
      console.log("Estado de autenticación: Desconectado");

      // Si el usuario intenta acceder a una página de admin protegida, lo enviamos al login.
      if (currentPath.includes("/admin/") && !isLoginPage) {
        window.location.replace("/admin/login-registro.html");
      }
      // Si ya está en la página de login, no hacemos nada y dejamos que se muestre.
    }
  });

  // Función para manejar el cierre de sesión
  const logout = () => {
    auth.signOut().catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
    // onAuthStateChanged se encargará de la redirección automáticamente.
  };

  // Función para agregar los botones flotantes y otros elementos de la interfaz de admin
  const addAdminUIControls = () => {
    if (document.getElementById("btn-logout-floating")) return; // Evita duplicados

    const body = document.body;
    const floatingButtonsContainer = document.createElement("div");
    floatingButtonsContainer.className = "floating-buttons-container";
    floatingButtonsContainer.innerHTML = `
            <button id="btn-logout-floating" class="btn-flotante btn-flotante-logout" title="Cerrar Sesión">
                <i class="fas fa-sign-out-alt"></i>
            </button>
            <button id="btn-go-top" class="btn-flotante btn-flotante-top" title="Ir arriba">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;
    body.appendChild(floatingButtonsContainer);

    document
      .getElementById("btn-logout-floating")
      .addEventListener("click", logout);

    const goTopBtn = document.getElementById("btn-go-top");
    const mainContent = document.querySelector(".admin-main-content");

    if (goTopBtn) {
      const handleScroll = () => {
        let show =
          window.scrollY > 100 || (mainContent && mainContent.scrollTop > 100);
        goTopBtn.style.display = show ? "flex" : "none";
      };

      window.addEventListener("scroll", handleScroll);
      if (mainContent) mainContent.addEventListener("scroll", handleScroll);

      goTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (mainContent) mainContent.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };
});
