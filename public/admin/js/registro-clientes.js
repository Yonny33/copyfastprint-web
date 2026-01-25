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

    // --- NUEVO: COMBINAR TIPO Y NÚMERO (Si se usa el select) ---
    if (data.tipo_documento) {
      // Buscamos el campo que contiene el número (cedula, rif, etc.)
      const numeroKey = Object.keys(data).find(
        (key) =>
          key !== "tipo_documento" &&
          (key.toLowerCase().includes("cedula") ||
            key.toLowerCase().includes("rif")),
      );
      if (numeroKey && data[numeroKey]) {
        data[numeroKey] = `${data.tipo_documento}-${data[numeroKey]}`;
        delete data.tipo_documento; // No enviamos el campo auxiliar al backend
      }
    }

    // --- VALIDACIÓN Y FORMATO DE CÉDULA ---
    // Buscamos el campo cédula o rif (ajusta el nombre según tu HTML: name="cedula" o name="rif")
    let cedulaKey = Object.keys(data).find(
      (key) =>
        key.toLowerCase().includes("cedula") ||
        key.toLowerCase().includes("rif"),
    );

    if (cedulaKey && data[cedulaKey]) {
      let valorCedula = data[cedulaKey].trim().toUpperCase();

      // Si el usuario escribió solo números (ej: 123456), agregamos V- por defecto
      if (/^\d+$/.test(valorCedula)) {
        valorCedula = `V-${valorCedula}`;
      }
      // Si no empieza con V-, E-, J- o P-, mostramos error
      else if (!/^[VEJP]-/.test(valorCedula)) {
        alert(
          "La Cédula/RIF debe comenzar con V-, E-, J- o P- (Ejemplo: V-12345678)",
        );
        hideLoading();
        return; // Detenemos el envío
      }
      data[cedulaKey] = valorCedula; // Actualizamos el dato formateado
    }

    const payload = {
      usuario: usuario, // El backend podría usarlo para logs o auditoría.
      ...data,
    };

    console.log("Enviando datos al servidor:", payload); // Depuración

    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          (result && result.message) ||
            `Error del servidor: ${response.status} ${response.statusText}`,
        );
      }

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
