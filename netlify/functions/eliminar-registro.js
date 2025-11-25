// netlify/functions/eliminar-registro.js
const { google } = require("googleapis");

// ⚠️ IMPORTANTE: Estas variables deben estar configuradas en Netlify
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Mapas de configuración para la lógica de búsqueda
const SHEET_CONFIG = {
  ventas: { name: "Ventas", keyColumn: "A", keyIndex: 0 },
  gastos: { name: "Gastos", keyColumn: "A", keyIndex: 0 },
  inventario: { name: "Inventario", keyColumn: "A", keyIndex: 0 },
};

/**
 * 🔑 Autoriza el acceso a Google Sheets API
 */
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

  // Se requiere el scope de escritura para eliminar filas
  const scope = "https://www.googleapis.com/auth/spreadsheets";

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      // Reemplaza los caracteres de salto de línea codificados en la variable de entorno
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: [scope],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: "v4", auth: authClient });
}

/**
 * 🗑️ Busca el registro por ID/Código y elimina la fila correspondiente.
 * @param {object} sheets Cliente de Google Sheets API
 * @param {string} tabla Nombre de la tabla ('ventas', 'gastos', 'inventario')
 * @param {string} id Valor único de la clave (ID o Código)
 */
async function deleteSheetRow(sheets, tabla, id) {
  const config = SHEET_CONFIG[tabla];
  if (!config) throw new Error(`Tabla no reconocida: ${tabla}`);

  const sheetName = config.name;
  const keyColumnLetter = config.keyColumn;
  const keyColumnIndex = config.keyIndex;

  // 1. Obtener todos los IDs/Códigos de la columna clave
  const allIdsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!${keyColumnLetter}:${keyColumnLetter}`,
  });

  const idList = allIdsResponse.data.values || [];

  // Buscar el índice de la fila que coincide con el ID/Código.
  // Empezamos a buscar desde el índice 1 del array (Row 2 de la hoja) para saltar el encabezado.
  let rowIndex = -1;
  for (let i = 1; i < idList.length; i++) {
    // La columna clave está en el índice 0 del array interno
    if (idList[i] && idList[i][keyColumnIndex] === id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error(
      `Registro con ID/Código '${id}' no encontrado en la hoja '${sheetName}'.`
    );
  }

  // El número de fila en Google Sheets (1-based) es el índice del array (0-based desde Row 1) + 1
  const sheetRowNumber = rowIndex + 1;

  // 2. Obtener el Sheet ID (gid) de la hoja para la solicitud batchUpdate
  const spreadsheetDetails = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
    fields: "sheets.properties.sheetId,sheets.properties.title",
  });

  const sheetInfo = spreadsheetDetails.data.sheets.find(
    (s) => s.properties.title === sheetName
  );
  if (!sheetInfo) {
    throw new Error(
      `No se encontró la hoja con el nombre '${sheetName}'. Asegúrese de que el nombre de la pestaña es correcto.`
    );
  }
  const sheetId = sheetInfo.properties.sheetId;

  // 3. Realizar la Actualización por Lotes (Delete Dimension)
  const request = {
    requests: [
      {
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: "ROWS",
            // Sheets API usa 0-based index para la solicitud
            startIndex: sheetRowNumber - 1,
            // endIndex es exclusivo, por lo que startIndex + 1 borra solo una fila.
            endIndex: sheetRowNumber,
          },
        },
      },
    ],
  };

  const result = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: request,
  });

  return result;
}

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const { tabla, id } = JSON.parse(event.body);

    // 1. Validar campos
    if (!tabla || !id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Faltan parámetros: 'tabla' e 'id' son requeridos.",
        }),
      };
    }

    // 2. Seguridad: asegurar que la tabla sea una de las permitidas
    const tablasPermitidas = Object.keys(SHEET_CONFIG);
    if (!tablasPermitidas.includes(tabla)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Operación de eliminación no permitida para esta tabla.",
        }),
      };
    }

    // 3. Ejecutar la autorización y la eliminación
    const sheets = await authorizeAndGetSheets();
    await deleteSheetRow(sheets, tabla, id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (${id}) eliminado exitosamente de Google Sheets.`,
      }),
    };
  } catch (error) {
    console.error("❌ Error en eliminar-registro.js:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Error al eliminar el registro: ${error.message}`,
      }),
    };
  }
};
