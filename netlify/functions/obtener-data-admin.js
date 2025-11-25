// netlify/functions/obtener-data-admin.js
const { google } = require("googleapis");

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

async function authorizeAndGetSheets() {
  if (
    !process.env.GOOGLE_CLIENT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !SHEET_ID
  ) {
    throw new Error(
      "Variables de entorno de Google Sheets (EMAIL, KEY, ID) no configuradas."
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: "v4", auth: authClient });
}

exports.handler = async function (event, context) {
  // ... (código de validación HTTP/CORS)

  try {
    const sheets = await authorizeAndGetSheets();

    // Rangos de las hojas de cálculo (adaptar a la estructura real de su Sheet)
    const ranges = {
      ventas: "Ventas!A2:Z",
      gastos: "Gastos!A2:Z",
      inventario: "Inventario!A2:Z",
    };

    // 1. Obtener datos de Google Sheets
    const [ventasResponse, gastosResponse, inventarioResponse] =
      await Promise.all([
        sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: ranges.ventas,
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: ranges.gastos,
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: ranges.inventario,
        }),
      ]);

    const responseData = {
      ventas: ventasResponse.data.values || [],
      gastos: gastosResponse.data.values || [],
      inventario: inventarioResponse.data.values || [],
    };

    // Si se pide 'reporte', se añade un placeholder.
    // ** La lógica de procesamiento de reportes debe ser implementada por el usuario **
    const query = event.queryStringParameters || {};
    if (query.type === "reporte") {
      responseData.reporteMensual = [];
      responseData.gastosPorCategoria = [];
      responseData.creditos = [];
      responseData.servicios = [];
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: responseData,
      }),
    };
  } catch (error) {
    console.error("❌ Error al obtener datos de Google Sheets:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Error al obtener datos: ${error.message}`,
      }),
    };
  }
};
