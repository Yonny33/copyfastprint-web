// netlify/functions/editar-registro.js

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

/**
 * Mapea los campos de datos (del frontend) a la posición de la columna en Google Sheets.
 * @param {string} tabla - Nombre de la hoja (ventas, gastos, inventario).
 * @param {object} data - Datos a actualizar.
 * @returns {Array<string>} Los valores ordenados como aparecerán en la fila.
 */
function mapDataToRow(tabla, data) {
  // Las columnas se definen por el orden en tu CSV/Hoja de Cálculo.
  // Asumimos un máximo de 10 columnas (A:J)

  // NOTA IMPORTANTE: Si un campo no se pasa en 'data', se usa el valor actual (data.currentValue).
  // Si no tenemos el valor actual, se usará 'N/A' o '0', lo cual puede ser un problema si no se pasan todos los campos.

  // **ESTE MAPEADO DEBE COINCIDIR EXACTAMENTE CON EL ORDEN DE TU HOJA**

  if (tabla === "ventas") {
    // Columnas: Fecha (A), ID (B), Cliente (C), Cantidad (D), Precio Unitario (E), Descripción (F), Venta Bruta (G), Abono (H), Saldo (I), IVA (J)
    return [
      data.fechaRegistro || data.currentFecha || "",
      data.recordId || data.currentID || "", // ID único (Columna B)
      data.nombreCliente || data.currentCliente || "",
      data.cantidad || data.currentCantidad || 1, // ASUMIDO
      data.precioUnitario || data.currentPrecio || data.montoTotal, // ASUMIDO
      data.descripcion || data.currentDescripcion || "",
      data.montoTotal || data.currentVentaBruta || 0,
      data.montoPagado || data.currentAbono || 0,
      data.montoPendiente || data.currentSaldo || 0,
      data.iva || data.currentIVA || 0, // ASUMIDO
    ];
  } else if (tabla === "gastos") {
    // Columnas: Fecha (A), N° Factura (B), RIF Proveedor (C), Razon Social (D), Concepto (E), Cant (F), Descripción (G), Precio Unitario (H), Monto Total (I), Crédito Fiscal (J)
    return [
      data.fecha || data.currentFecha || "",
      data.nFactura || data.currentNFactura || "", // ID único (Columna B)
      data.rifProveedor || data.currentRIF || "",
      data.proveedor || data.currentRazonSocial || "",
      data.categoria || data.currentConcepto || "",
      data.cantidad || data.currentCant || 1, // ASUMIDO
      data.descripcion || data.currentDescripcion || "",
      data.monto || data.currentPrecio || 0,
      data.monto || data.currentMontoTotal || 0,
      data.creditoFiscal || data.currentCreditoFiscal || 0, // ASUMIDO
    ];
  }

  // Implementar Inventario si es necesario
  throw new Error(`Mapeo de datos no implementado para la tabla: ${tabla}`);
}

// ==========================================================================
// 💾 FUNCIÓN PRINCIPAL: Editar en Google Sheets
// ==========================================================================
exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "PUT") {
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
    const { tabla, recordId, data } = JSON.parse(event.body);

    if (!tabla || !recordId || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Faltan parámetros: tabla, recordId o data.",
        }),
      };
    }

    const auth = new GoogleAuth({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // 1. BUSCAR EL ÍNDICE DE LA FILA POR EL ID (Columna B)
    const rangeToSearch = `${tabla}!B2:B`; // Empezamos en la segunda fila (después del encabezado)

    const searchResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: rangeToSearch,
    });

    const idValues = searchResponse.data.values || [];
    // El row index es el índice del array + 2 (porque empezamos en la fila 2 de Sheets)
    const rowIndex = idValues.findIndex((row) => row[0] === recordId);

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
    const sheetRowNumber = rowIndex + 2;

    // 2. OBTENER LOS DATOS ACTUALES DE LA FILA COMPLETA
    // Esto es crucial porque el frontend solo envía los campos editados, no toda la fila.
    const currentRowRange = `${tabla}!A${sheetRowNumber}:J${sheetRowNumber}`;
    const currentRowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEETS_ID,
      range: currentRowRange,
    });

    const currentData = currentRowResponse.data.values
      ? currentRowResponse.data.values[0]
      : [];

    // Mapear los datos actuales a claves para facilitar la fusión (Asumimos el mismo orden de columnas que en mapDataToRow)
    // Columna 1: Fecha (A), Columna 2: ID (B), etc.
    const headers = [
      "currentFecha",
      "currentID",
      "currentCliente",
      "currentCantidad",
      "currentPrecio",
      "currentDescripcion",
      "currentVentaBruta",
      "currentAbono",
      "currentSaldo",
      "currentIVA",
    ];
    const currentObject = {};
    headers.forEach((key, i) => {
      currentObject[key] = currentData[i];
    });

    // 3. COMBINAR DATOS (Nuevos datos sobrescriben los actuales)
    const mergedData = { ...currentObject, ...data, recordId: recordId };

    // 4. Mapear el objeto fusionado a la matriz de filas para la actualización
    const rowToUpdate = mapDataToRow(tabla, mergedData);

    // 5. ACTUALIZAR LA FILA
    const rangeToUpdate = `${tabla}!A${sheetRowNumber}:J${sheetRowNumber}`;
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SHEETS_ID,
      range: rangeToUpdate,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [rowToUpdate],
      },
    });

    if (updateResponse.status !== 200) {
      throw new Error(
        `Error al actualizar en Google Sheets: ${updateResponse.statusText}`
      );
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro ${recordId} en ${tabla} actualizado exitosamente.`,
      }),
    };
  } catch (error) {
    console.error("❌ Error en la función editar-registro:", error);
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
