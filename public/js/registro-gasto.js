const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhh5ZWD2dsFPvfWe6V_sp7RG2zFLE2y7DbO_HGqyJGYfVUJjzyozZlTXFq2ntlf1hjsw/exec';

document.addEventListener("DOMContentLoaded", () => {
  cargarGastosData();
});

async function cargarGastosData() {
  const tableBody = document.querySelector("#tabla-gastos tbody");
  const statusMessage = document.getElementById("status-message");
  tableBody.innerHTML = '<tr><td colspan="4">Cargando gastos...</td></tr>';

  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.message);
    }

    // Limpiamos la tabla antes de añadir nuevas filas
    tableBody.innerHTML = "";

    if (result.data && result.data.length > 0) {
      result.data.forEach((gasto) => {
        const row = document.createElement("tr");
        
        const fecha = gasto.fecha ? new Date(gasto.fecha).toLocaleDateString('es-ES') : 'N/A';

        row.innerHTML = `
          <td>${fecha}</td>
          <td>${gasto.categoria || 'N/A'}</td>
          <td>${gasto.descripcion || 'N/A'}</td>
          <td>${gasto.monto ? `$${parseFloat(gasto.monto).toFixed(2)}` : 'N/A'}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="4">No hay gastos registrados.</td></tr>';
    }
    
    if(statusMessage) statusMessage.style.display = 'none';

  } catch (error) {
    console.error("Error de red o servidor:", error);
    tableBody.innerHTML = `<tr><td colspan="4" class="error-message">Error al cargar los datos. Revisa la consola para más detalles.</td></tr>`;
    if(statusMessage) {
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.className = 'status-error';
        statusMessage.style.display = 'block';
    }
  }
}
