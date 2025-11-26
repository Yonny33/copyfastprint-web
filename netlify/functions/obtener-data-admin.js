// ...existing code...
const { verifyAuth } = require("./_utils");
const { readRange } = require("./_google-sheets");

exports.handler = async (event) => {
  const auth = verifyAuth(event);
  if (!auth.ok) {
    return {
      statusCode: auth.statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: auth.message }),
    };
  }

  try {
    const salesSheet = process.env.SALES_SHEET_NAME || "ventas";
    const expensesSheet = process.env.EXPENSES_SHEET_NAME || "gastos";
    const clientsSheet = process.env.CLIENTS_SHEET_NAME || "clientes";

    const ventasRows = await readRange(`${salesSheet}!A:E`);
    const gastosRows = await readRange(`${expensesSheet}!A:E`);
    const clientesRows = await readRange(`${clientsSheet}!A:E`);

    const mapRows = (rows, fields) =>
      (rows || []).map((r) => {
        const obj = {};
        fields.forEach((f, i) => {
          obj[f] = r[i] || null;
        });
        return obj;
      });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ventas: mapRows(ventasRows, [
          "id",
          "clienteId",
          "monto",
          "notas",
          "createdAt",
        ]),
        gastos: mapRows(gastosRows, [
          "id",
          "descripcion",
          "monto",
          "categoria",
          "createdAt",
        ]),
        clientes: mapRows(clientesRows, [
          "id",
          "nombre",
          "telefono",
          "email",
          "createdAt",
        ]),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
};
// ...existing code...
