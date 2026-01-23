document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registro-clientes-form");
  if (!form) return;

  const loadingOverlay = document.getElementById("loading-overlay");
  const API_URL = "/api";

  const showLoading = () => (loadingOverlay.style.display = "flex");
  const hideLoading = () => (loadingOverlay.style.display = "none");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("Error: Sesión no válida. Por favor, inicie sesión de nuevo.");
      window.location.href = "login-registro.html";
      return;
    }
    const usuario = user.email;

    showLoading();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      usuario: usuario, // El backend podría usarlo para logs o auditoría.
      ...data,
    };

    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message || "¡Cliente registrado con éxito!");
        form.reset();
      } else {
        throw new Error(
          result.message ||
            "Ocurrió un error desconocido al registrar el cliente.",
        );
      }
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
      alert(`Error: ${error.message}`);
    } finally {
      hideLoading();
    }
  };

  form.addEventListener("submit", handleFormSubmit);
});
