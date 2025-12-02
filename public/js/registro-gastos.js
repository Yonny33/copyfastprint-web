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

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.action = "registrarGasto";
    data.sheetName = "Gastos";

    if (!data.fecha) {
      data.fecha = new Date().toLocaleDateString('en-CA');
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec",
        {
          method: "POST",
          body: JSON.stringify(data),
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
