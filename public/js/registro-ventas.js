document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-ventas-form");
  if (!form) return;

  const clienteSelect = document.getElementById("cliente");
  const idClienteInput = document.getElementById("id_cliente");
  const cantidadInput = document.getElementById("cantidad");
  const precioUnitarioInput = document.getElementById("precio_unitario");
  const ventaBrutaInput = document.getElementById("venta_bruta");
  const abonoRecibidoInput = document.getElementById("abono_recibido");
  const saldoPendienteInput = document.getElementById("saldo_pendiente");
  const fechaInput = document.getElementById("fecha");

  // 1. Asignar fecha actual por defecto
  fechaInput.value = new Date().toISOString().split('T')[0];

  // 2. Función para calcular totales
  function calcularTotales() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const precioUnitario = parseFloat(precioUnitarioInput.value) || 0;
    const abonoRecibido = parseFloat(abonoRecibidoInput.value) || 0;

    const ventaBruta = cantidad * precioUnitario;
    const saldoPendiente = ventaBruta - abonoRecibido;

    ventaBrutaInput.value = ventaBruta.toFixed(2);
    saldoPendienteInput.value = saldoPendiente.toFixed(2);
  }

  // 3. Agregar listeners para cálculos automáticos
  cantidadInput.addEventListener("input", calcularTotales);
  precioUnitarioInput.addEventListener("input", calcularTotales);
  abonoRecibidoInput.addEventListener("input", calcularTotales);

  // 4. Función para cargar clientes y manejar selección
  async function cargarClientes() {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec?action=getClientes"
      );
      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        clienteSelect.innerHTML = '<option value="">Selecciona un cliente</option>';
        result.data.forEach((cliente) => {
          const option = document.createElement("option");
          // Guardamos el nombre y la cédula en el texto
          option.textContent = `${cliente.nombre} (${cliente.cedula || 'N/A'})`;
          // Guardamos el ID del cliente en un data attribute
          option.dataset.idCliente = cliente.id_cliente;
          // Usamos la cédula o el id como valor del option
          option.value = cliente.cedula || cliente.id_cliente;
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

  if (clienteSelect) {
    cargarClientes();
    // Listener para cuando se selecciona un cliente
    clienteSelect.addEventListener("change", () => {
        const selectedOption = clienteSelect.options[clienteSelect.selectedIndex];
        // Asignar el id_cliente al campo oculto
        idClienteInput.value = selectedOption.dataset.idCliente || '';
    });
  }

  // 5. Manejo del envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const overlay = document.getElementById('loading-overlay');
    
    submitButton.disabled = true;
    overlay.style.display = 'flex';
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Preparar el payload para el backend
    const payload = {
        action: "registrarVenta",
        sheetName: "Ventas", // Opcional si ya está definido en el backend
        ...data // Incluir todos los campos del formulario
    };
    
    // Asegurar que los campos calculados se envíen correctamente
    payload.venta_bruta = ventaBrutaInput.value;
    payload.saldo_pendiente = saldoPendienteInput.value;

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwRB-KdZegxFuQjJ6K9DziWaooVXYTNCTyc158hsb-4Ts6TK2b6SXBkFXZZuegCxXJZ/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("¡Venta registrada con éxito!");
        form.reset();
        fechaInput.value = new Date().toISOString().split('T')[0]; // Resetear fecha
        calcularTotales(); // Resetear cálculos
      } else {
        throw new Error(result.message || "No se pudo registrar la venta.");
      }
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert(`Error al registrar la venta: ${error.message}`);
    } finally {
      submitButton.disabled = false;
      overlay.style.display = 'none';
      submitButton.innerHTML = '<i class="fas fa-save"></i> Registrar Venta';
    }
  });
});
