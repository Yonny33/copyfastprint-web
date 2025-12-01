document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-gasto-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

      // 1. Recolectar datos del formulario
      const data = {
        fecha: form.fecha.value,
        monto: form.monto.value,
        categoria: form.categoria.value,
        metodoPago: form.metodoPago.value,
        proveedor: form.proveedor.value,
        descripcion: form.descripcion.value,
      };

      try {
        // 2. Enviar datos a la Netlify Function
        const response = await fetch("/.netlify/functions/registrar-gasto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert("¡Gasto registrado con éxito!");
          form.reset(); // Limpiar el formulario
          // Recargar la página para ver el nuevo gasto en la tabla
          window.location.reload(); 
        } else {
          throw new Error(result.message || "No se pudo registrar el gasto.");
        }
      } catch (error) {
        console.error("Error al registrar el gasto:", error);
        alert(`Error: ${error.message}`);
      } finally {
        // Reactivar el botón
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-plus-circle"></i> Registrar Gasto';
      }
    });
  }
});