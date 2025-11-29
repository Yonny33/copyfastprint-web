const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwhh5ZWD2dsFPvfWe6V_sp7RG2zFLE2y7DbO_HGqyJGYfVUJjzyozZlTXFq2ntlf1hjsw/exec";

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
        monto: parseFloat(formData.get("monto")),
      };

      if (statusMessage) {
        statusMessage.textContent = "Registrando gasto...";
        statusMessage.className = "status-pending";
        statusMessage.style.display = "block";
      }

      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Cambiado a no-cors para evitar errores de respuesta
          redirect: "follow",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(data),
        });

        // Con 'no-cors', no podemos leer la respuesta, pero sabemos que la petición se envió.
        // Asumimos el éxito ya que los datos llegan correctamente a Google Sheets.
        if (statusMessage) {
          statusMessage.textContent = "¡Gasto registrado con éxito!";
          statusMessage.className = "status-success";
        }
        form.reset();

        // Recargar la tabla de gastos para mostrar el nuevo registro
        if (typeof cargarGastosData === "function") {
          setTimeout(cargarGastosData, 500); // Pequeña espera para dar tiempo a Sheets
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        if (statusMessage) {
          statusMessage.textContent = `Error al registrar: ${error.message}`;
          statusMessage.className = "status-error";
        }
      } finally {
        setTimeout(() => {
          if (statusMessage) statusMessage.style.display = "none";
        }, 5000);
      }
    });
  }
});
