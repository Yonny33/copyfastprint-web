
import { auth } from '/firebase-config.js';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");
  const loginError = document.getElementById("login-error");
  const emailInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    loginButton.disabled = true;
    loginError.style.display = "none";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      loginError.textContent = "Por favor, ingresa tu correo y contraseña.";
      loginError.style.display = "block";
      loginButton.innerHTML = "Entrar";
      loginButton.disabled = false;
      return;
    }

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        window.location.href = "admin.html";
      })
      .catch((error) => {
        let errorMessage = "Ocurrió un error. Inténtalo de nuevo.";
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMessage = "Usuario o contraseña incorrectos.";
            break;
          case "auth/invalid-email":
            errorMessage = "El formato del correo electrónico no es válido.";
            break;
          default:
            errorMessage = "Error de autenticación. Por favor, revisa tus credenciales.";
            break;
        }
        console.error("Error de autenticación de Firebase:", error);
        loginError.textContent = errorMessage;
        loginError.style.display = "block";
        loginButton.innerHTML = "Entrar";
        loginButton.disabled = false;
      });
  });
});
