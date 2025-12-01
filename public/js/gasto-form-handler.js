
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-gasto-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

      const payload = {
        action: "registrarGasto",
        sheetName: "Gastos",
        data: {
            fecha: form.fecha.value || new Date().toLocaleDateString('en-CA'),
            monto_total_ves: form.monto.value,
            concepto: form.categoria.value,
            metodo_pago: form.metodoPago.value,
            razon_social: form.proveedor.value,
            descripción: form.descripcion.value,
        }
      };

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
          redirect: "follow"
        });

        const result = await response.json();

        if (result.status === 'success') {
          alert("¡Gasto registrado con éxito!");
          form.reset();
          window.location.reload(); 
        } else {
          throw new Error(result.message || "No se pudo registrar el gasto.");
        }
      } catch (error) {
        console.error("Error al registrar el gasto:", error);
        alert(`Error: ${error.message}`);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-plus-circle"></i> Registrar Gasto';
      }
    });
  }
});
