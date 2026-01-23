
document.addEventListener("DOMContentLoaded", () => {
    //
    // --- IMPORTANTE ---
    // Asegúrate de que tu archivo HTML (login-registro.html) incluye los SDK de Firebase
    // y el objeto de configuración de Firebase (firebaseConfig) antes de que se cargue este script.
    //
    // Ejemplo:
    // <script src="/__/firebase/8.x.x/firebase-app.js"></script>
    // <script src="/__/firebase/8.x.x/firebase-auth.js"></script>
    // <script src="/__/firebase/init.js"></script>
    //

    // Si un usuario ya está logueado, Firebase lo redirigirá automáticamente
    // (manejaremos esa lógica en auth.js)
    
    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const loginError = document.getElementById("login-error");

    // Reemplaza "username" por "email" si tu campo de formulario es para el correo electrónico
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
            loginButton.innerHTML = 'Entrar';
            loginButton.disabled = false;
            return;
        }

        // --- Lógica de Autenticación con Firebase ---
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // ¡Autenticación exitosa!
                // Firebase ahora manejará la sesión.
                // Redirigimos al panel de administración.
                window.location.href = "admin.html";
            })
            .catch((error) => {
                // Manejo de errores de Firebase
                let errorMessage = "Ocurrió un error. Inténtalo de nuevo.";
                switch (error.code) {
                    case "auth/user-not-found":
                        errorMessage = "No se encontró ningún usuario con ese correo.";
                        break;
                    case "auth/wrong-password":
                        errorMessage = "La contraseña es incorrecta.";
                        break;
                    case "auth/invalid-email":
                        errorMessage = "El formato del correo electrónico no es válido.";
                        break;
                    default:
                        errorMessage = "Usuario o contraseña incorrectos.";
                        break;
                }
                
                console.error("Error de autenticación de Firebase:", error);
                loginError.textContent = errorMessage;
                loginError.style.display = "block";
                loginButton.innerHTML = 'Entrar';
                loginButton.disabled = false;
            });
    });
});
