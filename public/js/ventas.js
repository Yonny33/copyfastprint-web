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

    const payload = {
      action: "registrarVenta",
      sheetName: "Ventas",
      data: {
        cliente: fd.get("cliente"),
        cantidad: fd.get("cantidad"),
        precio_unitario: fd.get("precio_unitario"),
        descripcion: fd.get("descripcion"),
        abono: fd.get("abono"),
        fecha: fd.get("fecha") || new Date().toLocaleDateString('en-CA'),
      },
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
          redirect: "follow",
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("¡Venta registrada con éxito!");
        form.reset();
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
