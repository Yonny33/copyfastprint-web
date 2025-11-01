// netlify/functions/registrar-gasto.js
const fetch = require("node-fetch");

// ==========================================================================
// 🔑 CONFIGURACIÓN DE AIRTABLE
// ==========================================================================
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
// Usamos el nombre de tabla que nos indicaste: "Gastos"
const AIRTABLE_TABLE_NAME = "Gastos";

// ==========================================================================
// 💾 FUNCIÓN AUXILIAR: Guardar en Airtable
// ==========================================================================
async function guardarEnAirtable(gasto) {
  if (!AIRTABLE_API_TOKEN || !AIRTABLE_BASE_ID) {
    throw new Error(
      "Error de configuración del servidor: Las claves de Airtable no están configuradas."
    );
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME
  )}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            // Mapeo de campos de 'gasto' a los campos de la tabla 'Gastos' en Airtable
            "ID Gasto": gasto.id,
            "Fecha Registro": gasto.fechaRegistro,
            Categoría: gasto.categoria,
            Descripción: gasto.descripcion,
            Monto: parseFloat(gasto.monto), // Aseguramos que es un número
            "Fecha del Gasto": gasto.fecha, // Fecha del formulario
            "Método Pago": gasto.metodoPago,
            Proveedor: gasto.proveedor,
            Recurrente: gasto.recurrente ? "Sí" : "No", // Convertir booleano a texto
            Divisa: gasto.divisa,
            Usuario: gasto.usuario,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => response.statusText);
    throw new Error(
      `Error al guardar en Airtable. Código: ${
        response.status
      }. Detalles: ${JSON.stringify(errorDetails)}`
    );
  }

  return await response.json();
}

// ==========================================================================
// 🚀 EXPORTACIÓN DEL HANDLER PRINCIPAL
// ==========================================================================

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
    const data = JSON.parse(event.body);

    // 1. Validaciones
    const requiredFields = [
      "categoria",
      "descripcion",
      "monto",
      "fecha",
      "metodoPago",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Faltan campos: ${missingFields.join(", ")}`,
        }),
      };
    }

    const monto = parseFloat(data.monto);
    if (isNaN(monto) || monto <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El monto debe ser un número positivo",
        }),
      };
    }

    // 2. Preparar datos para guardar
    const gasto = {
      id: `GASTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fechaRegistro: new Date().toISOString(),
      categoria: data.categoria,
      descripcion: data.descripcion,
      monto: monto.toFixed(2),
      fecha: data.fecha,
      metodoPago: data.metodoPago,
      proveedor: data.proveedor || null,
      recurrente: data.recurrente === "si",
      divisa: "VES",
      usuario: data.usuario || "admin",
    };

    console.log("💸 Gasto registrado:", gasto);

    // 3. Guardar en Airtable
    await guardarEnAirtable(gasto);

    // 4. Respuesta de éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Gasto registrado exitosamente",
        gasto: gasto,
      }),
    };
  } catch (error) {
    console.error("❌ Error en la función registrar-gasto:", error);
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
