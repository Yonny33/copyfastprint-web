const { google } = require("googleapis");

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId =
    process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      "Missing Google Sheets env vars: GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY / GOOGLE_SHEET_ID"
    );
  }

  // Convert literal '\n' to newlines if key was pasted escaped
  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

async function appendRow(sheetName, values) {
  const sheets = getSheetsClient();
  const spreadsheetId =
    process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID;
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
  const spreadsheetId =
    process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return res.data.values || [];
}

module.exports = { appendRow, readRange };
