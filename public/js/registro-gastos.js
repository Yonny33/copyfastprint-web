
document.addEventListener("DOMContentLoaded", () => {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tablaGastosBody = document.getElementById("tabla-gastos-body");
  const totalGastosSpan = document.getElementById("total-gastos-ves");

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

  async function cargarGastosData() {
    showLoading();
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec?action=obtenerDatos&sheetName=Gastos");

      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        actualizarTablaGastos(result.data);
      } else {
        alert("No se pudieron cargar los datos de gastos.");
        console.error("Respuesta del servidor no exitosa:", result.message);
      }
    } catch (error) {
      console.error("Error de red o servidor:", error);
      alert(`Error al cargar datos de gastos: ${error.message}`);
    } finally {
      hideLoading();
    }
  }

  function actualizarTablaGastos(gastos) {
    if(!tablaGastosBody) return;
    tablaGastosBody.innerHTML = "";
    let totalGastos = 0;

    const gastosOrdenados = [...gastos].reverse();

    gastosOrdenados.forEach((gasto, index) => {
      const fecha = gasto.fecha || "N/A";
      const concepto = gasto.concepto || "N/A";
      const descripcion = gasto.descripción || "Sin detalles";
      const proveedor = gasto.razon_social || "N/A";
      const montoStr = gasto.monto_total_ves || "0";

      const monto = parseFloat(montoStr) || 0;
      totalGastos += monto;

      const row = tablaGastosBody.insertRow();

      row.insertCell().textContent = fecha;
      row.insertCell().textContent = concepto;
      row.insertCell().textContent = descripcion;
      row.insertCell().textContent = proveedor;
      row.insertCell().textContent = formatVES(monto);

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

    if (totalGastosSpan) {
      totalGastosSpan.textContent = formatVES(totalGastos);
    }
  }

  cargarGastosData();

  window.editarGasto = (index) => {
    alert("La función de editar aún no está implementada.");
  };

  window.eliminarGasto = (index) => {
    alert("La función de eliminar aún no está implementada.");
  };
});
