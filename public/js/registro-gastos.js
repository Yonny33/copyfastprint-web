document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-gastos-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    }

    const fd = new FormData(form);
    fd.append("action", "registrarGasto");
    fd.append("sheetName", "Gastos");

    if (!fd.get("fecha")) {
      fd.set("fecha", new Date().toLocaleDateString('en-CA'));
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec",
        {
          method: "POST",
          body: fd,
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("¡Gasto registrado con éxito!");
        form.reset();
        window.location.reload();
      } else {
        throw new Error(result.message || "No se pudo registrar el gasto.");
      }
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
      alert(`Error al registrar el gasto: ${error.message}`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Registrar Gasto';
      }
    }
  });
});
