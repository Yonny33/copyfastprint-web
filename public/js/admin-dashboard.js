const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhh5ZWD2dsFPvfWe6V_sp7RG2zFLE2y7DbO_HGqyJGYfVUJjzyozZlTXFq2ntlf1hjsw/exec';

document.addEventListener("DOMContentLoaded", () => {
  cargarYMostrarData();
});

async function cargarYMostrarData() {
  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`Error en la respuesta de la red: ${response.statusText}`);
    }
    
    // Google Apps Script a veces envuelve la respuesta, intentamos parsearla
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        // Si falla el parseo, puede ser que la respuesta no sea JSON válido.
        // Esto puede pasar si el script de Google devuelve un error HTML.
        console.error("La respuesta no es un JSON válido:", text);
        throw new Error("La respuesta del servidor no tiene el formato esperado.");
    }

    actualizarTarjetas(data);
    // Si tienes gráficos, aquí iría la lógica para actualizarlos con `data`

  } catch (error) {
    console.error("Error al cargar los datos del dashboard:", error);
    // Opcional: Mostrar un mensaje de error en la interfaz
    const errorDisplay = document.getElementById('error-container');
    if (errorDisplay) {
        errorDisplay.textContent = `No se pudieron cargar los datos: ${error.message}`;
        errorDisplay.style.display = 'block';
    }
  }
}

function actualizarTarjetas(data) {
  // Actualizar ventas del día
  const ventasDiaEl = document.getElementById("ventas-dia");
  if (ventasDiaEl) ventasDiaEl.textContent = `$${data.ventasHoy.toFixed(2)}`;

  // Actualizar gastos del día
  const gastosDiaEl = document.getElementById("gastos-dia");
  if (gastosDiaEl) gastosDiaEl.textContent = `$${data.gastosHoy.toFixed(2)}`;

  // Actualizar balance del día
  const balanceDiaEl = document.getElementById("balance-dia");
  const balanceHoy = data.ventasHoy - data.gastosHoy;
  if (balanceDiaEl) balanceDiaEl.textContent = `$${balanceHoy.toFixed(2)}`;
}

// Aquí podrías añadir funciones para crear/actualizar gráficos con Chart.js
// Por ejemplo: renderizarGraficoVentas(data.ventasPorCategoria);
