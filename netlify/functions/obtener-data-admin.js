// netlify/functions/obtener-data-admin.js

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
const MAX_ROWS_TO_FETCH = 1000;

/**
 * Función auxiliar para obtener datos de una pestaña y convertirlos a un array de objetos.
 * Utiliza la primera fila como encabezados para las claves JSON.
 * @param {object} sheets - Cliente de Google Sheets API.
 * @param {string} sheetName - Nombre de la pestaña (ej: 'ventas', 'gastos', 'inventario').
 * @param {string} range - Rango de la hoja (ej: 'A1:K').
 * @returns {Promise<Array<object>>} Array de objetos.
 */
async function fetchSheetData(sheets, sheetName, range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEETS_ID,
    range: `${sheetName}!${range}`,
  });

  const values = response.data.values;
  if (!values || values.length < 2) {
    // Necesita al menos encabezado y una fila de datos
    return [];
  }

  // 1. Normalizar Encabezados (usar la primera fila)
  const headers = values[0].map((header) =>
    // Normalización: quitar caracteres no alfanuméricos, reemplazar espacios por _, minúsculas
    header
      ? header
          .replace(/[^a-zA-Z0-9\sÁÉÍÓÚáéíóúüñÑ]/g, "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
      : null
  );

  const data = [];
  // 2. Iterar desde la segunda fila (índice 1) para obtener los datos
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    let isValidRow = false; // Solo añade filas que tengan al menos un valor.

    headers.forEach((header, index) => {
      // Asignar solo si el encabezado es válido
      if (header) {
        obj[header] = row[index] || "";
        if (obj[header] !== "") {
          isValidRow = true;
        }
      }
    });

    if (isValidRow) {
      // Agregar el número de fila (basado en 1 de Google Sheets) para la edición/eliminación
      obj.sheet_row_number = i + 1;
      data.push(obj);
    }
  }
  return data;
}

// ==========================================================================
// 💾 FUNCIÓN PRINCIPAL: Obtener datos de Google Sheets
// ==========================================================================
exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "GET") {
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
    const auth = new GoogleAuth({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // Obtener datos de las tres pestañas de forma concurrente
    // Los rangos se ajustan para incluir el máximo de columnas con datos.
    const [ventasData, gastosData, inventarioData] = await Promise.all([
      fetchSheetData(sheets, "ventas", `A1:K${MAX_ROWS_TO_FETCH + 1}`),
      fetchSheetData(sheets, "gastos", `A1:J${MAX_ROWS_TO_FETCH + 1}`),
      fetchSheetData(sheets, "inventario", `A1:F${MAX_ROWS_TO_FETCH + 1}`),
    ]);

    const data = {
      ventas: ventasData,
      gastos: gastosData,
      inventario: inventarioData,
    };

    // Devolver los datos crudos, el frontend se encargará de los cálculos.
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: data,
        // Mantener 'reporteMensual' para evitar romper el reportes.js existente
        reporteMensual: { sales: [], expenses: [] },
      }),
    };
  } catch (error) {
    console.error("❌ Error en la función obtener-data-admin:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Error interno del servidor al obtener datos: ${error.message}`,
      }),
    };
  }
};
