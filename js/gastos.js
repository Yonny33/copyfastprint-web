// ==========================================================================
// ===  LÓGICA DEL PANEL DE GASTOS: CRUD (CREAR, LEER, ACTUALIZAR, ELIMINAR) ===
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. FUNCIONES DE UTILIDAD ---

  // Función para formatear Bolívares (VES)
  function formatVES(numero) {
    if (typeof numero === "string") {
      numero = parseFloat(numero);
    }
    return `Bs. ${numero.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Función para obtener icono según categoría
  function getCategoriaIcon(categoria) {
    const iconos = {
      materiales: "📦",
      servicios: "💡",
      mantenimiento: "🔧",
      transporte: "🚗",
      nomina: "👥",
      alquiler: "🏠",
      marketing: "📢",
      otros: "📝",
    };
    // Usamos .toLowerCase() y el nombre de la categoría o 'otros' como fallback
    return iconos[categoria ? categoria.toLowerCase() : "otros"] || "📝";
  }

  // Función para obtener etiqueta de método de pago
  function getMetodoPagoLabel(metodo) {
    const labels = {
      efectivo: "💵 Efectivo",
      transferencia: "🏦 Transferencia",
      "pago-movil": "📱 Pago Móvil",
      tarjeta: "💳 Tarjeta",
      otro: "🔄 Otro",
    };
    return (
      labels[metodo ? metodo.toLowerCase().replace("-", "") : "otro"] || metodo
    );
  }

  // Funciones para manejar el Loading (Asume que existe un elemento con id 'loading-overlay')
  const loadingOverlay = document.getElementById("loading-overlay");
  function showLoading() {
    if (loadingOverlay) loadingOverlay.style.display = "flex";
  }
  function hideLoading() {
    if (loadingOverlay) loadingOverlay.style.display = "none";
  }

  // Funciones para manejar el Modal de Edición (Asume que has añadido el modal a gastos.html)
  window.openModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
  };
  window.closeModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  };

  // ==========================================================
  // 💡 2. FUNCIÓN DE ELIMINACIÓN (llama a netlify/functions/eliminar-registro.js)
  // ==========================================================
  window.eliminarGasto = async function (id) {
    if (
      !confirm(
        "¿Estás seguro de ELIMINAR este gasto? Esta acción es permanente."
      )
    ) {
      return;
    }

    showLoading();

    try {
      const response = await fetch("/.netlify/functions/eliminar-registro", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tabla: "gastos", // Tabla a eliminar
          id: id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Gasto eliminado con éxito.");
        // Recargar los datos después de la eliminación
        cargarGastosData();
      } else {
        throw new Error(
          result.error || result.details || "Error al eliminar en el servidor."
        );
      }
    } catch (error) {
      console.error("❌ Error en la eliminación:", error);
      alert(`⚠️ Error al eliminar el gasto: ${error.message}`);
    } finally {
      hideLoading();
    }
  };

  // ==========================================================
  // 💡 3. FUNCIÓN DE EDICIÓN (Pre-llena el modal y lo abre)
  // ==========================================================
  window.editarGasto = function (gasto) {
    // Rellenar el formulario del modal con los datos del gasto seleccionado
    document.getElementById("edit-gasto-id").value = gasto.id;
    // Asumiendo que el campo de fecha en Supabase es 'fecha_gasto'
    document.getElementById("edit-fecha").value = gasto.fecha_gasto;
    document.getElementById("edit-monto").value = parseFloat(
      gasto.monto
    ).toFixed(2);
    document.getElementById("edit-categoria").value = gasto.categoria;
    document.getElementById("edit-descripcion").value = gasto.descripcion;
    document.getElementById("edit-metodoPago").value = gasto.metodo_pago;
    document.getElementById("edit-proveedor").value = gasto.proveedor || "";

    // Mostrar el modal
    openModal("edit-modal");
  };

  // ==========================================================
  // 💡 4. FUNCIÓN DE CARGA DE DATOS (llama a netlify/functions/obtener-data-admin.js)
  // ==========================================================
  async function cargarGastosData() {
    showLoading();
    const gastosList = document.getElementById("gastos-list");
    if (!gastosList) return hideLoading(); // Evitar error si el elemento no existe

    gastosList.innerHTML = ""; // Limpiar la tabla

    try {
      const response = await fetch("/.netlify/functions/obtener-data-admin");
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error || "No se pudieron obtener los datos de gastos."
        );
      }

      const gastos = data.data.gastos || [];

      // Lógica para filtrar gastos del día actual (ajusta según tu necesidad)
      const hoy = new Date().toISOString().split("T")[0];
      const gastosDelDia = gastos.filter(
        (g) => g.fecha_gasto && g.fecha_gasto === hoy
      );

      let totalDia = 0;

      gastosDelDia.forEach((gasto) => {
        totalDia += parseFloat(gasto.monto);

        const row = gastosList.insertRow();

        // Celdas de datos
        row.insertCell().textContent = gasto.fecha_gasto;
        row.insertCell().textContent = formatVES(gasto.monto);
        row.insertCell().innerHTML = `${getCategoriaIcon(gasto.categoria)} ${
          gasto.categoria
        }`;
        row.insertCell().textContent = gasto.descripcion;
        row.insertCell().innerHTML = getMetodoPagoLabel(gasto.metodo_pago);
        row.insertCell().textContent = gasto.proveedor || "N/A";

        // CELDA DE ACCIONES (Botones)
        const actionsCell = row.insertCell();
        actionsCell.className = "actions-cell";

        // Botón de EDITAR
        const editBtn = document.createElement("button");
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.className = "btn-icon edit-btn";
        // Pasa el objeto completo para pre-llenar el modal
        editBtn.onclick = () => window.editarGasto(gasto);

        // Botón de ELIMINAR
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.className = "btn-icon delete-btn";
        deleteBtn.onclick = () => window.eliminarGasto(gasto.id);

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
      });

      // Actualizar resumen del día
      const totalGastosDiaElement = document.getElementById("totalGastosDia");
      if (totalGastosDiaElement)
        totalGastosDiaElement.textContent = formatVES(totalDia);

      const cantidadGastosElement = document.getElementById("cantidadGastos");
      if (cantidadGastosElement)
        cantidadGastosElement.textContent = gastosDelDia.length;
    } catch (error) {
      console.error("❌ Error al cargar datos de gastos:", error);
      alert(`No se pudieron cargar los datos: ${error.message}`);
    } finally {
      hideLoading();
    }
  }

  // ==========================================================
  // 💡 5. ENVÍO DEL FORMULARIO DE EDICIÓN (llama a netlify/functions/editar-registro.js)
  // ==========================================================
  const editForm = document.getElementById("edit-gasto-form");
  if (editForm) {
    editForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      showLoading(); // Mostrar loader

      const id = document.getElementById("edit-gasto-id").value;

      // Recoger los datos del formulario
      const formData = new FormData(editForm);

      // Objeto solo con los campos que deben actualizarse en Supabase
      const dataToUpdate = {
        fecha_gasto: formData.get("fecha"), // Asumiendo que el campo en Supabase es 'fecha_gasto'
        monto: parseFloat(formData.get("monto")).toFixed(2),
        categoria: formData.get("categoria"),
        descripcion: formData.get("descripcion"),
        metodo_pago: formData.get("metodo_pago"),
        proveedor: formData.get("proveedor") || null, // Guardar null si está vacío
      };

      try {
        const response = await fetch("/.netlify/functions/editar-registro", {
          method: "PUT", // Método para actualizar
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tabla: "gastos",
            id: id,
            data: dataToUpdate,
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert("✅ Gasto actualizado con éxito.");
          closeModal("edit-modal"); // Cerrar modal
          cargarGastosData(); // Recargar la tabla
        } else {
          throw new Error(
            result.error ||
              result.details ||
              "Error al actualizar en el servidor."
          );
        }
      } catch (error) {
        console.error("❌ Error en la actualización:", error);
        alert(`⚠️ Error al actualizar el gasto: ${error.message}`);
      } finally {
        hideLoading(); // Ocultar loader
      }
    });
  }

  // ==========================================================
  // 💡 6. INICIO AL CARGAR LA PÁGINA
  // ==========================================================
  cargarGastosData();
});
