// netlify/functions/eliminar-registro.js
const fetch = require("node-fetch");

// ==========================================================================
// 🔑 CONFIGURACIÓN DE AIRTABLE
// ==========================================================================
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// Mapeo de nombres de tablas internas a nombres reales de tablas en AirTable
const TABLE_MAP = {
  ventas: "Ventas", // Ajusta si tu tabla de ventas se llama diferente
  gastos: "Gastos", // Ajusta si tu tabla de gastos se llama diferente
  // Usa la variable de entorno para Inventario, como en 'registrar-inventario.js'
  inventario: process.env.AIRTABLE_TABLE_INVENTARIOS || "Inventario",
};

// ==========================================================================
// 💾 FUNCIÓN AUXILIAR: Eliminar en AirTable (DELETE)
// ==========================================================================
async function deleteAirtableRecord(tableName, recordId) {
  if (!AIRTABLE_API_TOKEN || !AIRTABLE_BASE_ID) {
    throw new Error(
      "Error de configuración: Las claves de AirTable no están configuradas."
    );
  }

  const airtableTableName = TABLE_MAP[tableName];
  if (!airtableTableName) {
    throw new Error(`Tabla no mapeada: ${tableName}`);
  }

  // La eliminación en AirTable requiere que el ID se pase como parámetro de consulta
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    airtableTableName
  )}?records[]=${recordId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
    },
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("❌ Error de AirTable (Eliminación):", result);
    throw new Error(
      result.error?.message ||
        `Error ${response.status} al eliminar en AirTable`
    );
  }

  return result;
}

// ==========================================================================
// 🚀 MANEJADOR DE NETLIFY FUNCTION
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

  try {
    const { tabla, id } = JSON.parse(event.body);

    // 1. Validar campos
    if (!tabla || !id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Faltan parámetros: 'tabla' (ej. ventas) e 'id' (ID de AirTable) son requeridos.",
        }),
      };
    }

    // 2. Seguridad: asegurar que la tabla sea una de las permitidas
    const tablasPermitidas = Object.keys(TABLE_MAP);
    if (!tablasPermitidas.includes(tabla)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Operación de eliminación no permitida para esta tabla. Tablas permitidas: ${tablasPermitidas.join(
            ", "
          )}`,
        }),
      };
    }

    // 3. Ejecutar la eliminación en AirTable
    await deleteAirtableRecord(tabla, id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (ID: ${id}) eliminado exitosamente de AirTable.`,
      }),
    };
  } catch (error) {
    console.error("❌ Error al eliminar registro:", error);
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
