document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-ventas-form");
  const clienteSelect = document.getElementById("cliente");

  if (!form) return;

  // Función para cargar clientes en el select
  async function cargarClientes() {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec?action=getClientes"
      );
      const result = await response.json();

      if (result.status === "success" && result.customers) {
        clienteSelect.innerHTML = '<option value="">Selecciona un cliente</option>';
        result.customers.forEach((cliente) => {
          const option = document.createElement("option");
          option.value = cliente.cedula;
          option.textContent = `${cliente.nombre} (${cliente.cedula})`;
          clienteSelect.appendChild(option);
        });
      } else {
        throw new Error(result.message || "No se pudieron cargar los clientes.");
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      clienteSelect.innerHTML = '<option value="">Error al cargar clientes</option>';
    }
  }

  // Cargar clientes al iniciar la página
  if (clienteSelect) {
    cargarClientes();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.action = "registrarVenta";
    data.sheetName = "Ventas";

    if (!data.fecha) {
      data.fecha = new Date().toLocaleDateString('en-CA');
    }

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
