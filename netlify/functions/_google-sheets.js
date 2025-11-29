const { google } = require("googleapis");

let sheetsClient;

// Función de inicialización para el cliente de Google Sheets.
function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      "Faltan variables de entorno de Google: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, o GOOGLE_SHEET_ID"
    );
  }

  // Reemplaza los caracteres \n con saltos de línea reales si la clave fue copiada incorrectamente.
  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

/**
 * Añade una nueva fila a una hoja.
 * @param {string} sheetName - El nombre de la hoja (ej. "ventas").
 * @param {Array<string|number>} values - Un array de valores para la nueva fila.
 */
async function appendRow(sheetName, values) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = `${sheetName}!A:Z`;
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
  return res.data;
}

/**
 * Lee un rango de celdas de una hoja.
 * @param {string} range - El rango a leer en formato A1 (ej. "clientes!A1:E").
 */
async function readRange(range) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return res.data.values || [];
}

/**
 * Busca una fila por ID y devuelve su número de fila (1-based).
 * @param {string} sheetName - Nombre de la hoja.
 * @param {string} id - El ID a buscar.
 * @param {string} idColumn - La letra de la columna donde está el ID (ej. "B").
 * @returns {Promise<number>} - El número de la fila (1-based) o -1 si no se encuentra.
 */
async function findRowNumberById(sheetName, id, idColumn) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const columnData = await readRange(`${sheetName}!${idColumn}:${idColumn}`);
  const rowIndex = columnData.findIndex(
    (row, index) => index > 0 && row[0] === id
  );

  return rowIndex !== -1 ? rowIndex + 1 : -1;
}

/**
 * Actualiza una fila específica en una hoja.
 * @param {string} sheetName - Nombre de la hoja.
 * @param {number} rowNumber - El número de la fila a actualizar (1-based).
 * @param {Array<string|number>} updatedData - El array con los nuevos datos para la fila.
 */
async function updateRow(sheetName, rowNumber, updatedData) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A${rowNumber}`, // Asume que siempre se actualiza desde la columna A
    valueInputOption: "USER_ENTERED",
    resource: { values: [updatedData] },
  });
  return response.data;
}

/**
 * Elimina una fila de una hoja.
 * @param {string} sheetName - Nombre de la hoja.
 * @param {number} rowNumber - El número de la fila a eliminar (1-based).
 */
async function deleteRow(sheetName, rowNumber) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const sheetId = await getSheetId(sheetName);
  if (sheetId === null) {
    throw new Error(`No se pudo encontrar el ID de la hoja: ${sheetName}`);
  }

  const request = {
    spreadsheetId,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  };

  const response = await sheets.spreadsheets.batchUpdate(request);
  return response.data;
}

/**
 * Helper para obtener el ID numérico de una hoja a partir de su nombre.
 */
let sheetIdCache = {};
async function getSheetId(sheetName) {
  if (sheetIdCache[sheetName]) return sheetIdCache[sheetName];

  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const response = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = response.data.sheets.find(
    (s) => s.properties.title === sheetName
  );

  if (sheet) {
    sheetIdCache[sheetName] = sheet.properties.sheetId;
    return sheet.properties.sheetId;
  }
  return null;
}

module.exports = {
  appendRow,
  readRange,
  findRowNumberById,
  updateRow,
  deleteRow,
};
