document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-clientes-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    }

    const formData = new FormData(form);
    const clientData = Object.fromEntries(formData.entries());

    // Payload corregido para que coincida con el backend
    const payload = {
      action: "saveClient", // 1. Nombre de la acción corregido
      data: clientData      // 2. Datos anidados en la estructura correcta
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec",
        {
          method: "POST",
          body: JSON.stringify(payload), // Enviar el payload corregido
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("¡Cliente registrado con éxito!");
        form.reset();
      } else {
        throw new Error(result.message || "No se pudo registrar el cliente.");
      }
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
      alert(`Error al registrar el cliente: ${error.message}`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Registrar Cliente';
      }
    }
  });
});
