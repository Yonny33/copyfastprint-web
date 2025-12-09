
document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("sesionActiva") === "true") {
        window.location.href = "admin.html";
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const loginError = document.getElementById("login-error");

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec";

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        loginButton.disabled = true;
        loginError.style.display = "none";

        const usernameValue = document.getElementById("username").value.trim();
        const passwordValue = document.getElementById("password").value.trim();

        if (!usernameValue || !passwordValue) {
            loginError.textContent = "Por favor, ingresa tu usuario y contraseña.";
            loginError.style.display = "block";
            loginButton.innerHTML = 'Entrar';
            loginButton.disabled = false;
            return;
        }

        // --- CORRECCIÓN FINAL: Alineado con el script de Google ---
        const payload = {
            action: "loginUser",
            username: usernameValue,
            password: passwordValue
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
            
            console.log("Respuesta completa del servidor:", result);

            if (result.status === "success") {
                sessionStorage.setItem("sesionActiva", "true");
                if (result.user) {
                    sessionStorage.setItem("usuario", result.user);
                }
                window.location.href = "admin.html";
            } else {
                throw new Error(result.message || "Usuario o contraseña incorrectos.");
            }
        } catch (error) {
            console.error("Error detallado en el proceso de login:", error);
            
            loginError.textContent = error.message;
            loginError.style.display = "block";
            loginButton.innerHTML = 'Entrar';
            loginButton.disabled = false;
        }
    });
});
