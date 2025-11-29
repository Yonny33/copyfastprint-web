const { google } = require("googleapis");

let sheetsClient;

// Función de inicialización para el cliente de Google Sheets.
function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  // --- INICIO DE CÓDIGO DE DIAGNÓSTICO ---
  console.log("==> Iniciando cliente de Google Sheets...");
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail) {
    console.error("ERROR: La variable GOOGLE_CLIENT_EMAIL no está definida.");
  }
  if (!privateKey) {
    console.error("ERROR: La variable GOOGLE_PRIVATE_KEY no está definida.");
  } else {
    console.log(
      "OK: GOOGLE_PRIVATE_KEY ha sido cargada. Comienza con:",
      privateKey.substring(0, 40)
    );
  }
  if (!spreadsheetId) {
    console.error("ERROR: La variable GOOGLE_SHEET_ID no está definida.");
  } else {
    console.log("OK: GOOGLE_SHEET_ID es:", spreadsheetId);
  }
  // --- FIN DE CÓDIGO DE DIAGNÓSTICO ---

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      "Faltan variables de entorno de Google. Revisa los logs de la función en Netlify para más detalles."
    );
  }

  // Reemplaza los caracteres \n con saltos de línea reales.
  privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheetsClient = google.sheets({ version: "v4", auth });
    console.log("==> Cliente de Google Sheets inicializado con ÉXITO.");
    return sheetsClient;
  } catch (e) {
    console.error("!!!!!! FALLO CRÍTICO AL CREAR LA AUTENTICACIÓN JWT !!!!!!");
    console.error(
      "Este error suele ocurrir si el formato de la GOOGLE_PRIVATE_KEY es incorrecto."
    );
    console.error("Mensaje de error original:", e.message);
    throw e; // Lanzar el error para que la función principal falle
  }
}

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

async function readRange(range) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return res.data.values || [];
}

module.exports = {
  appendRow,
  readRange,
};
