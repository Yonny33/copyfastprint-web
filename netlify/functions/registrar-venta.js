// ...existing code...
const { verifyAuth } = require("./_utils");
const { appendRow } = require("./_google-sheets");

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN || "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Credentials": "true",
      },
      body: "",
    };
  }

  // Autenticación
  const auth = verifyAuth(event);
  if (!auth.ok) {
    return {
      statusCode: auth.statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: auth.message }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    // Campos esperados mínimos
    if (
      !payload.cliente ||
      payload.cantidad == null ||
      payload.precio_unitario == null
    ) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            "Faltan campos requeridos: cliente, cantidad, precio_unitario",
        }),
      };
    }

    // Parseo y validaciones numéricas
    const cantidad = Number(payload.cantidad);
    const precio = Number(payload.precio_unitario);
    if (isNaN(cantidad) || isNaN(precio) || cantidad < 0 || precio < 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Cantidad o precio inválido" }),
      };
    }

    const ventaBruta = Number((cantidad * precio).toFixed(2));
    const abono = Number(payload.abono ?? 0);
    if (isNaN(abono) || abono < 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Abono inválido" }),
      };
    }
    const saldo = Number((ventaBruta - abono).toFixed(2));
    const iva = Number((ventaBruta * 0.16).toFixed(2));

    // Fecha: usar la proporcionada o la fecha ISO actual (solo fecha)
    const fecha = payload.fecha || new Date().toISOString().split("T")[0];

    // ID único
    const id = `VENTA-${Date.now()}`;

    // Orden de columnas debe coincidir EXACTAMENTE con la hoja "ventas":
    // Fecha | ID | Cliente | Cantidad (Suéteres) | Precio (Unitario) |
    // Descripción | Venta Bruta (VES) | Abono Recibido (VES) | Saldo Pendiente (VES) | IVA Débito Fiscal 16% (VES)
    const row = [
      fecha, // Fecha
      id, // ID
      payload.cliente, // Cliente
      cantidad, // Cantidad (Suéteres)
      precio, // Precio (Unitario)
      payload.descripcion || "", // Descripción
      ventaBruta, // Venta Bruta (VES)
      abono, // Abono Recibido (VES)
      saldo, // Saldo Pendiente (VES)
      iva, // IVA Débito Fiscal 16% (VES)
    ];

    const sheet = process.env.SALES_SHEET_NAME || "ventas";
    await appendRow(sheet, row);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Venta registrada",
        data: {
          id,
          fecha,
          cliente: payload.cliente,
          ventaBruta,
          abono,
          saldo,
          iva,
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error interno", error: err.message }),
    };
  }
};
// ...existing code...
