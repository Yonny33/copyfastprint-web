const { verifyAuth } = require("./_utils");
const { appendRow } = require("./_google-sheets");

exports.handler = async (event) => {
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

  const auth = verifyAuth(event);
  if (!auth.ok)
    return {
      statusCode: auth.statusCode,
      body: JSON.stringify({ message: auth.message }),
    };

  try {
    const payload = JSON.parse(event.body || "{}");
    if (
      !payload.cliente ||
      payload.cantidad == null ||
      payload.precio_unitario == null
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Faltan campos requeridos: cliente, cantidad, precio_unitario",
        }),
      };
    }

    const cantidad = Number(payload.cantidad);
    const precio = Number(payload.precio_unitario);
    if (isNaN(cantidad) || isNaN(precio) || cantidad < 0 || precio < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Cantidad o precio inválido" }),
      };
    }

    const ventaBruta = Number((cantidad * precio).toFixed(2));
    const abono = Number(payload.abono ?? 0);
    if (isNaN(abono) || abono < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Abono inválido" }),
      };
    }
    const saldo = Number((ventaBruta - abono).toFixed(2));
    const iva = Number((ventaBruta * 0.16).toFixed(2));
    const fecha = payload.fecha || new Date().toISOString().split("T")[0];
    const id = `VENTA-${Date.now()}`;

    // Orden exacto en la hoja "ventas":
    const row = [
      fecha,
      id,
      payload.cliente,
      cantidad,
      precio,
      payload.descripcion || "",
      ventaBruta,
      abono,
      saldo,
      iva,
    ];
    const sheet = process.env.SALES_SHEET_NAME || "ventas";
    await appendRow(sheet, row);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Venta registrada",
        data: { id, fecha },
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
