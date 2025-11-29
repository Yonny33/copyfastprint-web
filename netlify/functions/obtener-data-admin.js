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
    const inventorySheet = process.env.INVENTORY_SHEET_NAME || "inventario";

    // Ajustamos los rangos y obtenemos todos los datos en paralelo
    const [ventasRows, gastosRows, clientesRows, inventarioRows] =
      await Promise.all([
        readRange(`${salesSheet}!A:J`), // 10 columnas
        readRange(`${expensesSheet}!A:K`), // 11 columnas
        readRange(`${clientsSheet}!A:E`), // 5 columnas (actualizado)
        readRange(`${inventorySheet}!A:G`), // 7 columnas
      ]);

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
          "venta_bruta",
          "abono",
          "saldo_pendiente",
          "iva_fiscal",
        ]),
        gastos: mapRows(gastosRows, [
          "fecha",
          "id",
          "rif",
          "razon_social",
          "concepto",
          "cantidad",
          "descripcion",
          "precio_unitario",
          "monto_total",
          "iva_fiscal",
          "createdAt",
        ]),
        clientes: mapRows(clientesRows, [
          "id",
          "nombre",
          "telefono",
          "email", // Corregido (añadido de nuevo)
          "createdAt",
        ]),
        inventario: mapRows(inventarioRows, [
          "codigo",
          "nombre",
          "tipo",
          "stock_actual",
          "u_medida",
          "stock_minimo",
          "usuario",
        ]),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message:
          "Error interno del servidor al leer los datos de Google Sheets: " +
          err.message,
      }),
    };
  }
};
