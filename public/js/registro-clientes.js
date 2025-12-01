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
    const data = Object.fromEntries(formData.entries());

    data.action = "registrarCliente";
    data.sheetName = "Clientes";

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec",
        {
          method: "POST",
          body: JSON.stringify(data),
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
