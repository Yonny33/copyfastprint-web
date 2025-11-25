// js/gastos.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mover la obtención de elementos dentro de DOMContentLoaded
  const loadingOverlay = document.getElementById("loading-overlay");
  const tablaGastosBody = document.getElementById("tabla-gastos-body");
  const totalGastosSpan = document.getElementById("total-gastos-ves");

  // Funciones de utilidad
  function showLoading() {
    if (loadingOverlay) loadingOverlay.style.display = "flex";
  }

  function hideLoading() {
    if (loadingOverlay) loadingOverlay.style.display = "none";
  }

  function formatVES(numeroStr) {
    const numero = parseFloat(numeroStr);
    if (isNaN(numero)) return "Bs. 0.00";
    return `Bs. ${numero.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // 2. Función para cargar datos de Gastos
  async function cargarGastosData() {
    showLoading();
    try {
      // Llama a la Netlify Function que ahora usa Google Sheets
      const response = await fetch("/.netlify/functions/obtener-data-admin");

      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && result.data.gastos) {
        // Filtramos los gastos. El backend retorna 'ventas', 'gastos', 'inventario'.
        const gastos = result.data.gastos;
        actualizarTablaGastos(gastos);
      } else {
        alert("No se pudieron cargar los datos de gastos.");
        console.error("Respuesta del servidor no exitosa:", result.error);
      }
    } catch (error) {
      console.error("Error de red o servidor:", error);
      alert(`Error al cargar datos de gastos: ${error.message}`);
    } finally {
      hideLoading();
    }
  }

  // 3. Función para actualizar la tabla con los nuevos nombres de columnas de Sheets
  function actualizarTablaGastos(gastos) {
    tablaGastosBody.innerHTML = "";
    let totalGastos = 0;

    // Aseguramos que los gastos sean los más recientes primero
    const gastosOrdenados = [...gastos].reverse();

    gastosOrdenados.forEach((gasto, index) => {
      // **Mapeo de Campos de Google Sheets (se usan las claves normalizadas)**
      // NOTA: 'descripción' viene sin acento y sin espacio.
      const fecha = gasto.fecha || "N/A";
      const concepto = gasto.concepto || "N/A";
      const descripcion = gasto.descripción || "Sin detalles";
      const proveedor = gasto.razon_social || "N/A";
      const montoStr = gasto.monto_total_ves || "0";

      const monto = parseFloat(montoStr) || 0;
      totalGastos += monto;

      const row = tablaGastosBody.insertRow();

      // Columna 1: Fecha
      row.insertCell().textContent = fecha;
      // Columna 2: Concepto
      row.insertCell().textContent = concepto;
      // Columna 3: Descripción
      row.insertCell().textContent = descripcion;
      // Columna 4: Proveedor
      row.insertCell().textContent = proveedor;
      // Columna 5: Monto
      row.insertCell().textContent = formatVES(monto);

      // Columna 6: Acciones (Botones de Editar/Eliminar)
      const accionesCell = row.insertCell();
      accionesCell.innerHTML = `
                <button onclick="editarGasto(${index})" class="btn-sm btn-editar" title="Editar Gasto">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="eliminarGasto(${index})" class="btn-sm btn-eliminar" title="Eliminar Gasto">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
    });

    // Actualizar el total
    if (totalGastosSpan) {
      totalGastosSpan.textContent = formatVES(totalGastos);
    }
  }

  // Ejecutar la carga de datos al iniciar la página
  cargarGastosData();

  // Las funciones globales para los botones (Editar/Eliminar)
  // Deberán ser implementadas en el futuro con la lógica de Google Sheets
  window.editarGasto = (index) => {
    alert(
      "Función de Editar (Google Sheets) no implementada aún. Necesitamos actualizar editar-registro.js."
    );
  };

  window.eliminarGasto = (index) => {
    alert(
      "Función de Eliminar (Google Sheets) no implementada aún. Necesitamos actualizar eliminar-registro.js."
    );
  };
});
