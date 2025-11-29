const SCRIPT_URL_GASTOS =
  "https://script.google.com/macros/s/AKfycbwvlvXmJd6xprAs3jSn8YuURliNLoH4TThLh5UuKNzcEZZXrcNO_UA9MG5oyA8iuZ-kyA/exec";

document.addEventListener("DOMContentLoaded", cargarGastosData);

async function cargarGastosData() {
  const loadingOverlay = document.getElementById("loading-overlay");
  const errorContainer = document.getElementById("error-container");
  const gastosListBody = document.getElementById("gastos-list");

  loadingOverlay.style.display = "flex";
  errorContainer.textContent = "";
  gastosListBody.innerHTML = ""; // Limpiar la tabla antes de cargar nuevos datos

  try {
    // Añadimos un parámetro a la URL para indicar que queremos obtener los gastos
    const url = `${SCRIPT_URL_GASTOS}?action=getGastos`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error de red o servidor: ${response.status} ${response.statusText}`
      );
    }

    const resultText = await response.text();
    let result;
    try {
      result = JSON.parse(resultText);
    } catch (e) {
      console.error(
        "La respuesta del servidor no es un JSON válido:",
        resultText
      );
      throw new Error("El formato de la respuesta del servidor es incorrecto.");
    }

    if (result.status === "success") {
      mostrarGastosEnTabla(result.data);
    } else {
      throw new Error(result.message || "No se pudieron cargar los gastos.");
    }
  } catch (error) {
    console.error("Error al cargar la data de gastos:", error);
    errorContainer.textContent = `Error: ${error.message}`;
  } finally {
    loadingOverlay.style.display = "none";
  }
}

function mostrarGastosEnTabla(gastos) {
  const tbody = document.getElementById("gastos-list");
  tbody.innerHTML = ""; // Limpiar antes de llenar

  if (gastos.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5">No hay gastos registrados.</td></tr>';
    return;
  }

  gastos.forEach((gasto) => {
    const tr = document.createElement("tr");

    const fecha = new Date(gasto.fecha).toLocaleDateString("es-VE");
    const monto = parseFloat(gasto.monto).toFixed(2);

    tr.innerHTML = `
            <td>${fecha}</td>
            <td>Bs. ${monto}</td>
            <td>${gasto.categoria}</td>
            <td>${gasto.descripcion}</td>
            <td>${gasto.metodoPago}</td>
        `;
    tbody.appendChild(tr);
  });
}
