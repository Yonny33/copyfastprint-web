document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registro-gastos-form");
  if (!form) return;

  const loadingOverlay = document.getElementById("loading-overlay");
  const API_URL = "/api";

  const showLoading = () => (loadingOverlay.style.display = "flex");
  const hideLoading = () => (loadingOverlay.style.display = "none");

  const setInitialDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const dateInput = document.getElementById("fecha");
    if (dateInput) {
      dateInput.value = formattedToday;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("La sesión ha caducado. Por favor, inicie sesión de nuevo.");
      window.location.href = "login-registro.html";
      hideLoading();
      return;
    }
    const usuario = user.email;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      usuario: usuario,
      ...data, // Utilizar el spread operator para incluir todos los campos del formulario
    };

    try {
      const response = await fetch(`${API_URL}/gastos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Primero, verificar si la respuesta es OK. Si no, algo falló a nivel de red o servidor.
      if (!response.ok) {
        throw new Error(
          `Error de red o servidor: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();

      if (result.status === "success") {
        alert("¡Gasto registrado con éxito!");
        form.reset();
        setInitialDate();
      } else {
        throw new Error(
          result.message ||
            "Ocurrió un error desconocido al procesar el gasto.",
        );
      }
    } catch (error) {
      console.error("Error detallado al registrar el gasto:", error);
      alert(
        `Se produjo un error crítico. Por favor, revisa la consola para más detalles. Mensaje: ${error.message}`,
      );
    } finally {
      hideLoading();
    }
  };

  setInitialDate();
  form.addEventListener("submit", handleFormSubmit);
});
