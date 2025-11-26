const { verifyAuth } = require("./_utils");
const { readRange } = require("./_google-sheets");

exports.handler = async (event) => {
  const auth = verifyAuth(event);
  if (!auth.ok)
    return {
      statusCode: auth.statusCode,
      body: JSON.stringify({ message: auth.message }),
    };

  try {
    const salesSheet = process.env.SALES_SHEET_NAME || "ventas";
    const expensesSheet = process.env.EXPENSES_SHEET_NAME || "gastos";
    const clientsSheet = process.env.CLIENTS_SHEET_NAME || "clientes";

    const ventasRows = await readRange(`${salesSheet}!A:J`);
    const gastosRows = await readRange(`${expensesSheet}!A:K`);
    const clientesRows = await readRange(`${clientsSheet}!A:E`);

    const mapRows = (rows, fields) =>
      (rows || []).map((r) => {
        const obj = {};
        fields.forEach((f, i) => {
          obj[f] = r[i] ?? null;
        });
        return obj;
      });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ventas: mapRows(ventasRows, [
          "fecha",
          "id",
          "cliente",
          "cantidad",
          "precio_unitario",
          "descripcion",
          "ventaBruta",
          "abono",
          "saldo",
          "iva",
        ]),
        gastos: mapRows(gastosRows, [
          "fecha",
          "id",
          "rif",
          "razon",
          "concepto",
          "cant",
          "descripcion",
          "precio_unitario",
          "monto_total",
          "credito_fiscal",
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
