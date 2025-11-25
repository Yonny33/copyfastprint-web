// netlify/functions/registrar-venta.js
const { google } = require("googleapis");
// ... (lógica de authorizeAndGetSheets idéntica, pero con scope de ESCRITURA) ...

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const VENTAS_SHEET_NAME = "Ventas";

// Se omite la función authorizeAndGetSheets por brevedad, es la misma que obtener-data-admin.js
// pero con scopes: ["https://www.googleapis.com/auth/spreadsheets"]

exports.handler = async function (event, context) {
  // ... (código de validación HTTP/CORS)
  try {
    const sheets = await authorizeAndGetSheets(); // Asegúrate de re-incluir la función authorizeAndGetSheets

    // 1. Validaciones y cálculo de montoPendiente (manteniendo la lógica original)
    const data = JSON.parse(event.body);
    const montoTotal = parseFloat(data.montoTotal);
    const montoPagado = parseFloat(data.montoPagado);
    // ... (validaciones)
    const montoPendiente = montoTotal - montoPagado;
    let estadoCredito = montoPendiente > 0 ? "Crédito" : "Completada";

    // 2. Preparar los datos en el orden de las columnas de la hoja 'Ventas'
    const newRow = [
      `VENTA-${Date.now()}`,
      new Date().toISOString().split("T")[0],
      data.cedula || "",
      data.nombre,
      data.telefono || "",
      data.descripcion,
      montoTotal.toFixed(2),
      montoPagado.toFixed(2),
      montoPendiente.toFixed(2),
      estadoCredito,
      data.metodoPago,
      data.usuario || "admin",
    ];

    // 3. Insertar en Google Sheets
    const insertResult = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${VENTAS_SHEET_NAME}!A:Z`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newRow],
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Venta registrada exitosamente en Google Sheets",
        insertCount: insertResult.data.updates.updatedCells,
      }),
    };
  } catch (error) {
    // ... (manejo de errores)
  }
};
