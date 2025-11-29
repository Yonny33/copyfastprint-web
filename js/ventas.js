document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registro-ventas-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      cliente: fd.get("cliente"),
      cantidad: fd.get("cantidad"),
      precio_unitario: fd.get("precio_unitario"),
      descripcion: fd.get("descripcion"),
      abono: fd.get("abono"),
      fecha: fd.get("fecha") || undefined,
    };

    try {
      const res = await fetch("/.netlify/functions/registrar-venta", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        alert("Venta registrada: " + (body.data?.id || "OK"));
        form.reset();
      } else {
        alert("Error: " + (body.message || res.status));
      }
    } catch (err) {
      alert("Error de red");
    }
  });
});
