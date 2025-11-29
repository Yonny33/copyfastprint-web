// netlify/functions/registrar-inventario.js
const { appendRow } = require("./_google-sheets");

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    const data = JSON.parse(event.body);

    // 1. Validar campos requeridos
    const requiredFields = [
      "codigo",
      "material",
      "tipo",
      "stock",
      "unidad_medida",
      "stock_minimo",
    ];

    const missingFields = requiredFields.filter(
      (field) => !data[field] && data[field] !== 0
    );

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Faltan campos obligatorios: ${missingFields.join(", ")}`,
        }),
      };
    }

    const stock = parseFloat(data.stock);
    const stockMinimo = parseFloat(data.stock_minimo);

    if (isNaN(stock) || isNaN(stockMinimo) || stock < 0 || stockMinimo < 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Stock y Stock Mínimo deben ser números válidos.",
        }),
      };
    }

    // 2. Preparar la fila para Google Sheets en el orden correcto
    // Columnas esperadas: Codigo, Nombre, Tipo, Stock Actual, U. Medida, Stock Mínimo, Usuario
    const newRow = [
      data.codigo,
      data.material, // Corresponde a 'Nombre'
      data.tipo,
      stock.toFixed(2), // Corresponde a 'Stock Actual'
      data.unidad_medida, // Corresponde a 'U. Medida'
      stockMinimo.toFixed(2), // Corresponde a 'Stock Mínimo'
      data.usuario || "", // Corresponde a 'Usuario', se deja vacío si no se proporciona
    ];

    const inventorySheetName = process.env.INVENTORY_SHEET_NAME || "inventario";

    // 3. Añadir la fila a Google Sheets
    await appendRow(inventorySheetName, newRow);

    // 4. Respuesta de éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message:
          "Material de inventario registrado exitosamente en Google Sheets",
        material: data,
      }),
    };
  } catch (error) {
    console.error("❌ Error en registrar-inventario.js:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "Error interno del servidor al registrar el material: " +
          error.message,
      }),
    };
  }
};
