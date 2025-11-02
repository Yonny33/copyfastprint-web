// En js/gastos.js
async function cargarGastosData() {
  showLoading("Cargando Gastos...");
  const gastosBody = document.getElementById("gastos-body");
  gastosBody.innerHTML =
    '<tr><td colspan="6" style="text-align: center;">Obteniendo datos de AirTable...</td></tr>';

  try {
    // 1. Llama al endpoint único (NO requiere ?type=...)
    const response = await fetch("/.netlify/functions/obtener-data-admin");
    const result = await response.json();

    if (!result.success || !result.data || !result.data.gastos) {
      throw new Error(
        result.error || "No se pudieron obtener los datos de gastos."
      );
    }

    const gastos = result.data.gastos; // <-- Acceder a .data.gastos
    mostrarGastos(gastos); // Función que se encarga de pintar la tabla
    setupEditAndDeleteListeners(gastos); // Configurar listeners con los datos
  } catch (error) {
    console.error("Error al cargar los gastos:", error);
    gastosBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #c60e0f;">
        ⚠️ Error al cargar los gastos: ${error.message}
        </td></tr>`;
  } finally {
    hideLoading();
  }
}
// En js/gastos.js

// Almacena los datos en una variable global para acceso rápido (opcional, pero útil)
let datosGastos = [];

function setupEditAndDeleteListeners(gastos) {
  datosGastos = gastos; // Almacena los datos con el airtableId

  // --- Lógica para el botón de Edición ---
  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.onclick = function () {
      // El ID es el 'airtableId' ahora
      const id = this.getAttribute("data-id");
      const gasto = datosGastos.find((g) => g.airtableId === id);

      if (gasto) {
        // Rellenar el modal de edición
        document.getElementById("edit-id").value = gasto.airtableId; // Guardar el airtableId
        document.getElementById("edit-fecha").value = gasto.fecha;
        document.getElementById("edit-monto").value = parseFloat(gasto.monto);
        document.getElementById("edit-categoria").value = gasto.categoria || "";
        document.getElementById("edit-descripcion").value = gasto.descripcion;
        document.getElementById("edit-metodo_pago").value =
          gasto.metodoPago || "";
        document.getElementById("edit-proveedor").value = gasto.proveedor || "";
        openModal("edit-modal");
      } else {
        alert("Error: Gasto no encontrado.");
      }
    };
  });

  // --- Lógica para el botón de Eliminación ---
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.onclick = async function () {
      // El ID es el 'airtableId'
      const id = this.getAttribute("data-id");
      if (
        confirm(`¿Estás seguro de que quieres eliminar el gasto (ID: ${id})?`)
      ) {
        showLoading("Eliminando gasto...");
        try {
          const response = await fetch(
            "/.netlify/functions/eliminar-registro",
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                tabla: "gastos",
                id: id, // Usamos el airtableId
              }),
            }
          );

          const result = await response.json();
          if (result.success) {
            alert("✅ Gasto eliminado con éxito.");
            cargarGastosData();
          } else {
            throw new Error(
              result.error || "Error al eliminar en el servidor."
            );
          }
        } catch (error) {
          console.error("❌ Error en la eliminación:", error);
          alert(`⚠️ Error al eliminar el gasto: ${error.message}`);
        } finally {
          hideLoading();
        }
      }
    };
  });
}
