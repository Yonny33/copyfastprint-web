document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-ventas-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    }

    const fd = new FormData(form);
    fd.append("action", "registrarVenta");
    fd.append("sheetName", "Ventas");

    // Asegurarse de que la fecha no esté vacía
    if (!fd.get("fecha")) {
      fd.set("fecha", new Date().toLocaleDateString('en-CA'));
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec",
        {
          method: "POST",
          body: fd, // Enviar FormData directamente
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("¡Venta registrada con éxito!");
        form.reset();
        window.location.reload(); // Recargar para ver la tabla actualizada
      } else {
        throw new Error(result.message || "No se pudo registrar la venta.");
      }
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert(`Error al registrar la venta: ${error.message}`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Registrar Venta';
      }
    }
  });
});
