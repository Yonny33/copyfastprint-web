// netlify/functions/registrar-venta.js

exports.handler = async function (event, context) {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Manejar preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Solo aceptar POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    // 1. Parsear el body
    const data = JSON.parse(event.body);

    // 2. Validar datos requeridos
    const requiredFields = [
      "cedula",
      "nombre",
      "telefono",
      "descripcion",
      "montoTotal",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Faltan campos requeridos: ${missingFields.join(", ")}`,
        }),
      };
    }

    // 3. Validar montos
    const montoTotal = parseFloat(data.montoTotal);
    const montoPagado = parseFloat(data.montoPagado) || 0;

    if (isNaN(montoTotal) || montoTotal <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El monto total debe ser un número positivo",
        }),
      };
    }

    if (montoPagado > montoTotal) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El monto pagado no puede ser mayor al monto total",
        }),
      };
    }

    // 4. Preparar datos para almacenar
    const venta = {
      id: `VENTA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fechaRegistro: new Date().toISOString(),
      cliente: {
        cedula: data.cedula,
        nombre: data.nombre,
        telefono: data.telefono,
      },
      venta: {
        descripcion: data.descripcion,
        montoTotal: montoTotal.toFixed(2),
        montoPagado: montoPagado.toFixed(2),
        montoPendiente: data.montoPendiente,
        estadoCredito: data.estadoCredito,
      },
    };

    // 5. AQUÍ DEBERÍAS GUARDAR EN UNA BASE DE DATOS
    // Opciones:
    // - Airtable (fácil, sin backend)
    // - Google Sheets (con API)
    // - Firebase Firestore
    // - Supabase
    // - FaunaDB

    console.log("📝 Venta registrada:", venta);

    // EJEMPLO: Enviar a Google Sheets (necesitarías configurar la API)
    // await guardarEnGoogleSheets(venta);

    // EJEMPLO: Enviar notificación por email (usando Sendgrid/Mailgun)
    // await enviarNotificacionEmail(venta);

    // Por ahora, simulamos éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Venta registrada exitosamente",
        ventaId: venta.id,
        estadoCredito: data.estadoCredito,
        montoPendiente: data.montoPendiente,
      }),
    };
  } catch (error) {
    console.error("❌ Error procesando venta:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor",
        details: error.message,
      }),
    };
  }
};

// ==========================================================================
// FUNCIÓN AUXILIAR: Guardar en Google Sheets (EJEMPLO)
// ==========================================================================
async function guardarEnGoogleSheets(venta) {
  // Necesitas configurar Google Sheets API y obtener credenciales
  // https://developers.google.com/sheets/api/quickstart/nodejs
  // const { google } = require('googleapis');
  // const sheets = google.sheets('v4');
  // const auth = new google.auth.GoogleAuth({
  //   credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  // });
  // const authClient = await auth.getClient();
  // await sheets.spreadsheets.values.append({
  //   auth: authClient,
  //   spreadsheetId: process.env.GOOGLE_SHEET_ID,
  //   range: 'Ventas!A:K',
  //   valueInputOption: 'USER_ENTERED',
  //   resource: {
  //     values: [[
  //       venta.id,
  //       venta.fechaRegistro,
  //       venta.cliente.cedula,
  //       venta.cliente.nombre,
  //       venta.cliente.telefono,
  //       venta.venta.descripcion,
  //       venta.venta.montoTotal,
  //       venta.venta.montoPagado,
  //       venta.venta.montoPendiente,
  //       venta.venta.estadoCredito,
  //     ]],
  //   },
  // });
}
