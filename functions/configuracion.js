document.addEventListener("DOMContentLoaded", function () {
  const btnMigrarVentas = document.getElementById("btn-migrar-ventas");
  const loadingOverlay = document.getElementById("loading-overlay");

  const showLoading = (show) => {
    if (loadingOverlay) loadingOverlay.style.display = show ? "flex" : "none";
  };

  if (btnMigrarVentas) {
    btnMigrarVentas.addEventListener("click", async () => {
      if (!confirm("¿Estás seguro de que deseas ejecutar la corrección de datos de ventas? Este proceso puede tardar unos segundos.")) {
        return;
      }

      showLoading(true);
      try {
        const response = await fetch('/api/admin/migrar-ventas-numeros', { method: 'POST' });
        const data = await response.json();

        if (response.ok && data.status === 'success') {
          alert(data.message || "Proceso completado con éxito.");
        } else {
          throw new Error(data.message || "Ocurrió un error en el servidor.");
        }
      } catch (error) {
        console.error("Error al ejecutar la migración:", error);
        alert("Error al ejecutar la migración: " + error.message);
      } finally {
        showLoading(false);
      }
    });
  }
});
