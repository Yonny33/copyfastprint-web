
document.addEventListener("DOMContentLoaded", () => {
    // Si ya hay una sesión, redirigir al panel de administración
    if (sessionStorage.getItem("sesionActiva") === "true") {
        window.location.href = "admin.html";
        return; // Detener la ejecución para evitar que el resto del código se corra innecesariamente
    }

    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const loginError = document.getElementById("login-error");

    // URL del Web App de Google Apps Script para la autenticación
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        loginButton.disabled = true;
        loginError.style.display = "none";

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validar que los campos no estén vacíos
        if (!username || !password) {
            loginError.textContent = "Por favor, ingresa tu usuario y contraseña.";
            loginError.style.display = "block";
            loginButton.innerHTML = 'Entrar';
            loginButton.disabled = false;
            return;
        }

        const payload = {
            action: "loginUser",
            data: {
                username: username,
                password: password
            }
        };

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                redirect: "follow",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === "success") {
                // Guardar estado de la sesión y redirigir
                sessionStorage.setItem("sesionActiva", "true");
                sessionStorage.setItem("usuario", result.user);
                window.location.href = "admin.html";
            } else {
                throw new Error(result.message || "Usuario o contraseña incorrectos.");
            }
        } catch (error) {
            // Mostrar mensaje de error
            loginError.textContent = error.message;
            loginError.style.display = "block";
            loginButton.innerHTML = 'Entrar';
            loginButton.disabled = false;
        }
    });
});
