// netlify/functions/registrar-inventario.js
const fetch = require("node-fetch");

// Variables de entorno
const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_INVENTARIOS; // << USAMOS LA TABLA INVENTARIOS
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

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

  // 0. Verificar la configuración de Airtable
  if (!API_KEY || !BASE_ID || !TABLE_NAME) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "Error de configuración: Faltan variables de entorno de Airtable.",
      }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // 1. Validaciones
    const requiredFields = [
      "tipoMovimiento",
      "codigoProducto",
      "nombreProducto",
      "cantidad",
      "costoUnitario",
      "unidadMedida",
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

    const cantidad = parseInt(data.cantidad);
    const costoUnitario = parseFloat(data.costoUnitario);

    if (
      isNaN(cantidad) ||
      cantidad === 0 ||
      isNaN(costoUnitario) ||
      costoUnitario < 0
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "La cantidad debe ser un número entero y el costo unitario debe ser positivo o cero.",
        }),
      };
    }

    // 2. Preparar datos para Airtable
    const costoTotal = cantidad * costoUnitario;

    const movimiento = {
      id: `INV-TRANS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fechaRegistro: new Date().toISOString(),
      tipoMovimiento: data.tipoMovimiento,
      codigoProducto: data.codigoProducto,
      nombreProducto: data.nombreProducto,
      cantidad: cantidad,
      unidadMedida: data.unidadMedida,
      costoUnitario: costoUnitario,
      costoTotal: costoTotal,
      notas: data.notas || "",
      usuario: data.usuario || "admin",
    };

    // 3. 🎯 Guardar en Airtable
    const airtableResponse = await fetch(AIRTABLE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              id: movimiento.id,
              fechaRegistro: movimiento.fechaRegistro,
              tipoMovimiento: movimiento.tipoMovimiento,
              codigoProducto: movimiento.codigoProducto,
              nombreProducto: movimiento.nombreProducto,
              cantidad: movimiento.cantidad,
              unidadMedida: movimiento.unidadMedida,
              costoUnitario: movimiento.costoUnitario,
              costoTotal: movimiento.costoTotal,
              notas: movimiento.notas,
              usuario: movimiento.usuario,
            },
          },
        ],
      }),
    });

    const airtableResult = await airtableResponse.json();

    if (!airtableResponse.ok) {
      console.error("❌ Error de Airtable:", airtableResult);
      throw new Error(
        airtableResult.error?.message || "Error al guardar en Airtable"
      );
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Movimiento de inventario registrado exitosamente en Airtable",
        movimientoId: movimiento.id,
        airtableRecordId: airtableResult.records[0]?.id,
      }),
    };
  } catch (error) {
    console.error("❌ Error en registrar-inventario:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "Error interno del servidor al intentar guardar el movimiento de inventario.",
        details: error.message,
      }),
    };
  }
};
