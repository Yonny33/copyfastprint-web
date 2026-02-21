document.addEventListener("DOMContentLoaded", function () {
  // --- CONSTANTES Y URL DE TU API FIREBASE ---
  // Usamos '/api' asumiendo que tienes configurado el rewrite en firebase.json. Si no, usa la URL completa de la función.
  const API_URL = "/api";

  // --- ELEMENTOS DEL DOM ---
  const form = document.getElementById("registro-ventas-form");
  const clienteSelect = document.getElementById("cliente");
  const productoSelect = document.getElementById("producto"); // <-- NUEVO: Selector de producto
  const loadingOverlay = document.getElementById("loading-overlay");

  // Campos del formulario
  const cantidadInput = document.getElementById("cantidad");
  const precioUnitarioInput = document.getElementById("precio_unitario");
  const ventaBrutaInput = document.getElementById("venta_bruta");
  const abonoRecibidoInput = document.getElementById("abono_recibido");
  const saldoPendienteInput = document.getElementById("saldo_pendiente");
  const fechaInput = document.getElementById("fecha");
  const metodoPagoSelect = document.getElementById("metodo_pago");

  // --- FUNCIONES ---

  // Muestra u oculta el overlay de "Procesando..."
  const showLoading = (show) => {
    if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none";
  };

  // Realiza los cálculos de Venta Bruta y Saldo Pendiente en tiempo real
  const actualizarCalculos = () => {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const precioUnitario = parseFloat(precioUnitarioInput.value) || 0;
    const abonoRecibido = parseFloat(abonoRecibidoInput.value) || 0;

    const ventaBruta = cantidad * precioUnitario;
    const saldoPendiente = ventaBruta - abonoRecibido;

    ventaBrutaInput.value = ventaBruta.toFixed(2);
    saldoPendienteInput.value = saldoPendiente.toFixed(2);

    // Lógica inteligente: Si no hay abono, no hay pago que registrar
    if (abonoRecibido <= 0) {
      metodoPagoSelect.disabled = true;
      metodoPagoSelect.value = ""; // Limpiar selección
      metodoPagoSelect.required = false;
    } else {
      metodoPagoSelect.disabled = false;
      metodoPagoSelect.required = true;
    }
  };

  // Carga los clientes desde tu Google Sheet
  const cargarClientes = async () => {
    if (!clienteSelect) return;
    try {
      const response = await fetch(`${API_URL}/clientes`);
      if (!response.ok)
        throw new Error(
          "Error en la respuesta del servidor al cargar clientes.",
        );

      const result = await response.json();

      if (result.status === "success" && result.data) {
        clienteSelect.innerHTML =
          '<option value="">Seleccione un cliente</option>';
        result.data.forEach((cliente) => {
          if (cliente.id_cliente && cliente.nombre) {
            const option = new Option(cliente.nombre, cliente.id_cliente);
            clienteSelect.add(option);
          }
        });
      } else {
        throw new Error(
          result.message ||
            "El script no devolvió un listado de clientes válido.",
        );
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      clienteSelect.innerHTML = `<option value="">Error al cargar</option>`;
      alert(
        `Hubo un problema al cargar la lista de clientes: ${error.message}`,
      );
    }
  };

  // <-- NUEVA FUNCIÓN: Carga los productos desde el inventario -->
  const cargarProductos = async () => {
    if (!productoSelect) return;
    try {
      const response = await fetch(`${API_URL}/inventario`);
      if (!response.ok)
        throw new Error(
          "Error en la respuesta del servidor al cargar el inventario.",
        );

      const result = await response.json();

      if (result.status === "success" && result.data) {
        productoSelect.innerHTML =
          '<option value="">Seleccione un producto</option>';
        result.data.forEach((producto) => {
          // Usamos el `id_producto` como valor y el `nombre` como texto visible
          if (producto.id_producto && producto.nombre) {
            // Detectar si es servicio para mostrar (∞) o el stock real
            const esServicio =
              producto.tipo === "servicio" ||
              (producto.categoria &&
                producto.categoria.toLowerCase() === "servicios");
            const stockInfo = esServicio
              ? " (∞)"
              : ` (Stock: ${producto.stock_actual || 0})`;
            const option = new Option(
              `${producto.nombre}${stockInfo}`,
              producto.id_producto,
            );
            productoSelect.add(option);
          }
        });
      } else {
        throw new Error(
          result.message || "El script no devolvió un inventario válido.",
        );
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      productoSelect.innerHTML = `<option value="">Error al cargar</option>`;
      alert(
        `Hubo un problema al cargar la lista de productos: ${error.message}`,
      );
    }
  };

  // <-- FUNCIÓN MODIFICADA Y CORREGIDA: Envía el formulario para registrar la venta -->
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoading(true);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Aseguramos que los valores calculados se envíen
    data.venta_bruta = ventaBrutaInput.value;
    data.saldo_pendiente = saldoPendienteInput.value;

    // Si el abono es 0, el método de pago es "N/A" (porque el select estaba disabled)
    if ((parseFloat(data.abono_recibido) || 0) <= 0) {
      data.metodo_pago = "N/A";
    }

    // --- Información del Producto Seleccionado ---
    const selectedProduct =
      productoSelect.options[productoSelect.selectedIndex];
    // Enviamos tanto el ID del producto como su nombre (para la descripción)
    data.id_producto = selectedProduct.value;
    data.descripcion = selectedProduct.text;

    // --- Información del Cliente ---
    // IMPORTANTE: Forzamos la asignación de id_cliente para asegurar que llegue al backend
    const selectedClient = clienteSelect.options[clienteSelect.selectedIndex];
    if (selectedClient && selectedClient.value !== "") {
      data.id_cliente = selectedClient.value;
      data.nombre_cliente = selectedClient.text; // Enviamos el nombre también por seguridad
    }

    // --- Estado del Pedido ---
    // Calculamos explícitamente el estado para que se guarde correctamente en la BD
    const saldo = parseFloat(data.saldo_pendiente) || 0;
    data.estado_pedido = saldo > 0.01 ? "Pendiente" : "Pagado";

    try {
      const response = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("¡Venta registrada con éxito!");
        form.reset();
        if (fechaInput) fechaInput.valueAsDate = new Date();
        actualizarCalculos();
      } else {
        throw new Error(
          result.message || "El servidor devolvió un error al guardar.",
        );
      }
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert(`Error al registrar la venta: ${error.message}`);
    } finally {
      showLoading(false);
    }
  };

  // --- INICIALIZACIÓN Y EVENTOS ---

  // Validar que todos los elementos del formulario existen
  if (
    form &&
    cantidadInput &&
    precioUnitarioInput &&
    abonoRecibidoInput &&
    clienteSelect &&
    productoSelect &&
    metodoPagoSelect
  ) {
    // Listeners para cálculos automáticos
    cantidadInput.addEventListener("input", actualizarCalculos);
    precioUnitarioInput.addEventListener("input", actualizarCalculos);
    abonoRecibidoInput.addEventListener("input", actualizarCalculos);

    // Listener para el envío del formulario
    form.addEventListener("submit", handleFormSubmit);

    // Carga inicial
    if (fechaInput) fechaInput.valueAsDate = new Date();
    cargarClientes();
    cargarProductos(); // <-- NUEVO: Cargar los productos al iniciar
    actualizarCalculos();
  } else {
    console.error(
      "Faltan elementos críticos del formulario de ventas. El script no se ejecutará.",
    );
  }
});
