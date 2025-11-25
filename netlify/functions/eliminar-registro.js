// netlify/functions/eliminar-registro.js

const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

// ==========================================================================
// 🔑 CONFIGURACIÓN DE GOOGLE SHEETS
// ==========================================================================
const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : null;

// ==========================================================================
// 💾 FUNCIÓN PRINCIPAL: Eliminar en Google Sheets
// ==========================================================================
exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  if (!SHEETS_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Error de configuración de Google Sheets.",
      }),
    };
  }

  try {
    const { tabla, recordId } = JSON.parse(event.body);

    if (!tabla || !recordId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Faltan parámetros: tabla o recordId." }),
      };
    }

    // 🚨 Seguridad: solo permitir las tablas que deben ser eliminables.
    const tablasPermitidas = ["ventas", "gastos", "inventario"];
    if (!tablasPermitidas.includes(tabla)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: "Eliminación no permitida para esta tabla.",
        }),
      };
    }

    const auth = new GoogleAuth({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // 1. BUSCAR EL ÍNDICE DE LA FILA POR EL ID (Columna B)
    // Buscamos en la columna B (que asumimos contiene el ID o N° Factura) a partir de la Fila 2.
    const rangeToSearch = `${tabla}!B2:B`;

    const searchResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: rangeToSearch,
    });

    const idValues = searchResponse.data.values || [];
    // El rowIndex es el índice del array (0-basado)
    const rowIndex = idValues.findIndex((row) => row && row[0] === recordId);

    if (rowIndex === -1) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: `Registro no encontrado con ID: ${recordId} en la hoja ${tabla}.`,
        }),
      };
    }

    // Fila real de Google Sheets (1-basada)
    // rowIndex + 1 (por ser 0-basado) + 1 (porque empezamos a buscar desde la fila 2 de Sheets)
    const sheetRowNumber = rowIndex + 2;

    // 2. EJECUTAR LA ELIMINACIÓN DE LA FILA
    const deleteRequest = {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: await getSheetIdByName(sheets, SHEETS_ID, tabla),
              dimension: "ROWS",
              startIndex: sheetRowNumber - 1, // Sheets API usa índice 0-basado
              endIndex: sheetRowNumber, // endIndex es exclusivo
            },
          },
        },
      ],
    };

    const deleteResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEETS_ID,
      resource: deleteRequest,
    });

    if (deleteResponse.status !== 200) {
      throw new Error(
        `Error al eliminar en Google Sheets: ${deleteResponse.statusText}`
      );
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro ${recordId} en ${tabla} eliminado exitosamente.`,
      }),
    };
  } catch (error) {
    console.error("❌ Error en la función eliminar-registro:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Error interno del servidor: ${error.message}`,
      }),
    };
  }
};

/**
 * Función auxiliar para obtener el sheetId (necesario para deleteDimension).
 * @param {object} sheets - Cliente de Google Sheets API.
 * @param {string} spreadsheetId - ID del libro de Google Sheets.
 * @param {string} sheetName - Nombre de la pestaña.
 * @returns {number} El sheetId (GID).
 */
async function getSheetIdByName(sheets, spreadsheetId, sheetName) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  });
  const sheet = response.data.sheets.find(
    (s) => s.properties.title.toLowerCase() === sheetName.toLowerCase()
  );

  if (!sheet) {
    throw new Error(`La pestaña con nombre '${sheetName}' no fue encontrada.`);
  }
  return sheet.properties.sheetId;
}
