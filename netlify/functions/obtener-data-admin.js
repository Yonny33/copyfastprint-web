// netlify/functions/obtener-data-admin.js
const fetch = require("node-fetch");

const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// Definición de tablas y campos para un fetch limpio
const TABLES_CONFIG = {
  // Limitar a 500 ventas y gastos (las más recientes) es una práctica de rendimiento
  ventas: {
    name: "Ventas",
    sort: '[{field: "fechaRegistro", direction: "desc"}]',
    maxRecords: 500,
  },
  gastos: {
    name: "Gastos",
    sort: '[{field: "fechaRegistro", direction: "desc"}]',
    maxRecords: 500,
  },
  // Traer todo el inventario
  inventario: {
    name: process.env.AIRTABLE_TABLE_INVENTARIOS || "Inventario",
    sort: '[{field: "material", direction: "asc"}]',
    maxRecords: 9999,
  },
};

/**
 * Función que maneja la paginación de Airtable para traer todos los registros.
 */
async function fetchAllRecords(tableConfig) {
  const { name, sort, maxRecords } = tableConfig;
  const allRecords = [];
  let offset = null; // Token de paginación de AirTable

  while (true) {
    // Construye la URL con paginación y ordenamiento
    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      name
    )}?pageSize=100&maxRecords=${maxRecords}&sort=${encodeURIComponent(sort)}`;
    if (offset) {
      url += `&offset=${offset}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error de Airtable al obtener ${name}: ${
          data.error?.message || "Error desconocido"
        }`
      );
    }

    // Mapear los registros para extraer el id de Airtable (record.id) y los fields
    const mappedRecords = data.records.map((record) => ({
      airtableId: record.id, // ¡CRÍTICO! Este es el ID que usarás para editar/eliminar.
      ...record.fields,
    }));

    allRecords.push(...mappedRecords);

    // Revisar si hay más páginas (offset)
    offset = data.offset;
    if (!offset || allRecords.length >= maxRecords) {
      break;
    }
  }

  return allRecords;
}

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  if (!AIRTABLE_API_TOKEN || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          "Error de configuración: Variables de entorno de Airtable faltantes.",
      }),
    };
  }

  try {
    // Ejecutar las tres peticiones de AirTable de forma concurrente
    const [ventasData, gastosData, inventarioData] = await Promise.all([
      fetchAllRecords(TABLES_CONFIG.ventas),
      fetchAllRecords(TABLES_CONFIG.gastos),
      fetchAllRecords(TABLES_CONFIG.inventario),
    ]);

    // Devolver los datos consolidados
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          ventas: ventasData,
          gastos: gastosData,
          inventario: inventarioData,
        },
      }),
    };
  } catch (error) {
    console.error("❌ Error en obtener-data-admin (AirTable):", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Error interno del servidor al consultar Airtable: ${error.message}`,
      }),
    };
  }
};
