// netlify/functions/editar-registro.js
const { google } = require("googleapis");

// ⚠️ IMPORTANTE: Estas variables deben estar configuradas en Netlify
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Mapas de configuración para la lógica de búsqueda y mapeo de datos
const SHEET_CONFIG = {
  ventas: {
    name: "Ventas",
    keyColumn: "A",
    keyIndex: 0,
    // Orden de columnas esperado (0-based):
    // 0: ID, 1: Fecha, 2: Cedula, 3: Nombre, 4: Telefono, 5: Descripcion,
    // 6: Monto Total, 7: Monto Pagado, 8: Monto Pendiente, 9: Estado Crédito,
    // 10: Metodo Pago, 11: Usuario
  },
  gastos: {
    name: "Gastos",
    keyColumn: "A",
    keyIndex: 0,
    // Orden de columnas esperado (0-based):
    // 0: ID, 1: Fecha, 2: Categoria, 3: Descripcion, 4: Monto,
    // 5: Metodo Pago, 6: Proveedor, 7: Recurrente, 8: Divisa, 9: Usuario
  },
  inventario: {
    name: "Inventario",
    keyColumn: "A",
    keyIndex: 0,
    // Orden de columnas esperado (0-based):
    // 0: Codigo, 1: Nombre, 2: Tipo, 3: Stock Actual, 4: U. Medida,
    // 5: Stock Mínimo, 6: Usuario
  },
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

  // Se requiere el scope de escritura para actualizar datos
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
 * 🔄 Busca el registro por ID/Código y actualiza la fila correspondiente.
 * @param {object} sheets Cliente de Google Sheets API
 * @param {string} tabla Nombre de la tabla ('ventas', 'gastos', 'inventario')
 * @param {string} id Valor único de la clave (ID o Código)
 * @param {object} data Datos a actualizar
 */
async function findAndUpdateSheet(sheets, tabla, id, data) {
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

  // Buscar el índice de la fila que coincide con el ID.
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

  // 2. Obtener la fila actual para preservar los campos no modificados
  const currentRowResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    // Leer toda la fila a actualizar
    range: `${sheetName}!${sheetRowNumber}:${sheetRowNumber}`,
  });
  const currentRow = currentRowResponse.data.values
    ? currentRowResponse.data.values[0]
    : [];

  // 3. Mapear los datos de entrada a la estructura de la fila completa
  let updatedRow = [];

  // Lógica para 'ventas': Recalcular montos pendientes y estado de crédito
  if (tabla === "ventas") {
    const currentMontoTotal = parseFloat(currentRow[6] || 0);
    const currentMontoPagado = parseFloat(currentRow[7] || 0);

    const montoTotal = data.montoTotal
      ? parseFloat(data.montoTotal)
      : currentMontoTotal;
    const montoPagado = data.montoPagado
      ? parseFloat(data.montoPagado)
      : currentMontoPagado;

    // Recalcular
    const montoPendiente = montoTotal - montoPagado;
    let estadoCredito = montoPendiente > 0 ? "Crédito" : "Completada";

    updatedRow = [
      currentRow[0], // 0: ID (No se toca)
      data.fechaRegistro || currentRow[1], // 1: Fecha
      data.cedula || currentRow[2], // 2: Cedula
      data.nombre || currentRow[3], // 3: Nombre
      data.telefono || currentRow[4], // 4: Telefono
      data.descripcion || currentRow[5], // 5: Descripcion
      montoTotal.toFixed(2), // 6: Monto Total (Recalculado)
      montoPagado.toFixed(2), // 7: Monto Pagado (Recalculado)
      montoPendiente.toFixed(2), // 8: Monto Pendiente (Recalculado)
      estadoCredito, // 9: Estado Credito (Recalculado)
      data.metodoPago || currentRow[10], // 10: Metodo Pago
      data.usuario || currentRow[11] || "admin", // 11: Usuario
    ];
  }
  // Lógica para 'gastos'
  else if (tabla === "gastos") {
    const monto = data.monto
      ? parseFloat(data.monto)
      : parseFloat(currentRow[4] || 0);
    updatedRow = [
      currentRow[0], // 0: ID (No se toca)
      data.fecha || currentRow[1], // 1: Fecha
      data.categoria || currentRow[2], // 2: Categoria
      data.descripcion || currentRow[3], // 3: Descripcion
      monto.toFixed(2), // 4: Monto
      data.metodoPago || currentRow[5], // 5: Metodo Pago
      data.proveedor || currentRow[6], // 6: Proveedor
      data.recurrente || currentRow[7], // 7: Recurrente
      data.divisa || currentRow[8], // 8: Divisa
      data.usuario || currentRow[9] || "admin", // 9: Usuario
    ];
  }
  // Lógica para 'inventario'
  else if (tabla === "inventario") {
    // En inventario, el campo de actualización puede ser 'cantidad' o 'stockActual'
    const newStock = data.cantidad || data.stockActual;
    const cantidad = newStock
      ? parseFloat(newStock)
      : parseFloat(currentRow[3] || 0);

    updatedRow = [
      currentRow[0], // 0: Codigo (No se toca)
      data.nombreProducto || currentRow[1], // 1: Nombre
      data.tipoMovimiento || currentRow[2], // 2: Tipo
      cantidad, // 3: Stock Actual
      data.unidadMedida || currentRow[4], // 4: U. Medida
      data.stockMinimo || currentRow[5], // 5: Stock Minimo
      data.usuario || currentRow[6] || "admin", // 6: Usuario
    ];
  }

  // 4. Asegurar que la fila de actualización tenga al menos la longitud de la fila actual
  while (updatedRow.length < currentRow.length) {
    updatedRow.push("");
  }

  // 5. Actualizar la fila específica en Google Sheets
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A${sheetRowNumber}`, // Apunta a la fila exacta desde la columna A
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [updatedRow],
    },
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
    const { tabla, id, data } = JSON.parse(event.body);

    // 1. Validar campos
    if (!tabla || !id || !data || Object.keys(data).length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Faltan parámetros: 'tabla', 'id' y 'data' (con campos a actualizar) son requeridos.",
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
          error: "Operación de actualización no permitida para esta tabla.",
        }),
      };
    }

    // 3. Ejecutar la autorización y la actualización
    const sheets = await authorizeAndGetSheets();
    const updateResult = await findAndUpdateSheet(sheets, tabla, id, data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (${id}) actualizado exitosamente en Google Sheets.`,
        updatedCells: updateResult.data.updatedCells,
      }),
    };
  } catch (error) {
    console.error("❌ Error en editar-registro.js:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Error al actualizar el registro: ${error.message}`,
      }),
    };
  }
};
