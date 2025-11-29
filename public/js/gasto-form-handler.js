const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwvlvXmJd6xprAs3jSn8YuURliNLoH4TThLh5UuKNzcEZZXrcNO_UA9MG5oyA8iuZ-kyA/exec";

document
  .getElementById("registro-gasto-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Pequeña validación en el cliente
    if (!data.fecha || !data.monto || !data.categoria) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Registrando...';

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // El cuerpo de la respuesta de un script de Google en modo 'cors' suele ser texto plano.
      const resultText = await response.text();
      const result = JSON.parse(resultText);

      if (result.status === "success") {
        alert("¡Gasto registrado con éxito!");
        form.reset();
        // Si la función para recargar la tabla de gastos existe, la llamamos.
        if (typeof cargarGastosData === "function") {
          cargarGastosData();
        }
      } else {
        throw new Error(result.message || "Ocurrió un error desconocido.");
      }
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
      alert(`Error al registrar el gasto: ${error.message}`);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML =
        '<i class="fas fa-plus-circle"></i> Registrar Gasto';
    }
  });
