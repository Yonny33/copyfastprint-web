// netlify/functions/editar-registro.js
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
// 💾 FUNCIÓN AUXILIAR: Actualizar en AirTable (PATCH)
// ==========================================================================
async function patchAirtableRecord(tableName, recordId, fieldsToUpdate) {
  if (!AIRTABLE_API_TOKEN || !AIRTABLE_BASE_ID) {
    throw new Error(
      "Error de configuración: Las claves de AirTable no están configuradas."
    );
  }

  const airtableTableName = TABLE_MAP[tableName];
  if (!airtableTableName) {
    throw new Error(`Tabla no mapeada: ${tableName}`);
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    airtableTableName
  )}`;

  const response = await fetch(url, {
    method: "PATCH", // Usamos PATCH para actualización
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          id: recordId,
          fields: fieldsToUpdate, // Objeto con los campos a modificar
        },
      ],
      typecast: true, // Recomendado para asegurar la correcta conversión de tipos
    }),
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("❌ Error de AirTable (Actualización):", result);
    throw new Error(
      result.error?.message ||
        `Error ${response.status} al actualizar en AirTable`
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
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "PUT") {
    // El cliente enviará PUT
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
            "Faltan parámetros: 'tabla' (ej. ventas), 'id' (ID de AirTable) y 'data' (campos a actualizar) son requeridos.",
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
          error: `Operación de actualización no permitida para esta tabla. Tablas permitidas: ${tablasPermitidas.join(
            ", "
          )}`,
        }),
      };
    }

    // 3. Ejecutar la actualización en AirTable
    await patchAirtableRecord(tabla, id, data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (ID: ${id}) actualizado exitosamente en AirTable.`,
        campos_actualizados: Object.keys(data),
      }),
    };
  } catch (error) {
    console.error("❌ Error al actualizar registro:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Error interno al procesar la solicitud: ${error.message}`,
      }),
    };
  }
};
