const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhh5ZWD2dsFPvfWe6V_sp7RG2zFLE2y7DbO_HGqyJGYfVUJjzyozZlTXFq2ntlf1hjsw/exec';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gasto-form");
  const statusMessage = document.getElementById("status-message");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        fecha: formData.get("fecha"),
        categoria: formData.get("categoria"),
        descripcion: formData.get("descripcion"),
        monto: parseFloat(formData.get("monto"))
      };

      if(statusMessage) {
        statusMessage.textContent = "Registrando gasto...";
        statusMessage.className = 'status-pending';
        statusMessage.style.display = 'block';
      }

      try {
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'cors', // Importante para peticiones a dominios diferentes
          redirect: 'follow', // Sigue redirecciones
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(data)
        });

        // Apps Script responde con una redirección. La respuesta final la parseamos.
        const result = await response.json();

        if (result.status === "success") {
            if(statusMessage) {
                statusMessage.textContent = "¡Gasto registrado con éxito!";
                statusMessage.className = 'status-success';
            }
            form.reset();
            // Opcional: Recargar la tabla de gastos si está en la misma página
            if (typeof cargarGastosData === 'function') {
                cargarGastosData(); 
            }
        } else {
          throw new Error(result.message || "Ocurrió un error desconocido.");
        }

      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        if(statusMessage) {
            statusMessage.textContent = `Error al registrar: ${error.message}`;
            statusMessage.className = 'status-error';
        }
      } finally {
        setTimeout(() => {
            if(statusMessage) statusMessage.style.display = 'none';
        }, 5000);
      }
    });
  }
});
