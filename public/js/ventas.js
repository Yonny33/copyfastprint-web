
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registro-ventas-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    if(submitButton){
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    }

    const fd = new FormData(form);
    
    const payload = {
      action: "registrarVenta",
      sheetName: "Ventas",
      data: {
          cliente: fd.get("cliente"),
          cantidad: fd.get("cantidad"),
          precio_unitario: fd.get("precio_unitario"),
          descripcion: fd.get("descripcion"),
          abono: fd.get("abono"),
          fecha: fd.get("fecha") || new Date().toLocaleDateString('en-CA'),
      }
    };

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbwqkpIrmwD4SDeOda5ttFAqM_MPrlnqX_Ij6l51iGH88313xNoYpI4lQzsNou20-1MY/exec", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
        redirect: "follow"
      });
      
      const body = await res.json();
      
      if (body.status === "success") {
        alert("Venta registrada con éxito!");
        form.reset();
      } else {
        alert("Error al registrar la venta: " + (body.message || "Respuesta desconocida del servidor."));
      }
    } catch (err) {
        console.error("Error al registrar la venta:", err);
        alert("Ocurrió un error. El registro podría no haberse completado. Revisa la consola para más detalles.");
    } finally {
        if(submitButton){
            submitButton.disabled = false;
            submitButton.innerHTML = 'Registrar Venta';
        }
    }
  });
});
