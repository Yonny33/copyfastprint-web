// netlify/functions/registrar-venta.js
// Sistema de Registro de Ventas - COPYFAST&PRINT (Venezuela)
// Divisa: Bolívares Venezolanos (VES) 🇻🇪

const fetch = require("node-fetch"); // Requerido para hacer la petición a la API de Airtable

// ==========================================================================
// 🔑 CONFIGURACIÓN DE AIRTABLE
// ==========================================================================
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
// ❗ Asegúrate de que el nombre de tu tabla sea exactamente este:
const AIRTABLE_TABLE_NAME = "Ventas";

// ==========================================================================
// 💾 FUNCIÓN AUXILIAR: Guardar en Airtable
// ==========================================================================
async function guardarEnAirtable(venta) {
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
            // Mapeo de campos de 'venta' a los campos de la tabla 'Ventas' en Airtable
            "ID Venta": venta.id, // Campo de texto/ID en Airtable
            "Fecha Registro": venta.fechaRegistro, // Campo de fecha/DateTime
            "Cédula Cliente": venta.cliente.cedula,
            "Nombre Cliente": venta.cliente.nombre,
            "Teléfono Cliente": venta.cliente.telefono,
            Descripción: venta.descripcion,
            "Monto Total": venta.montoTotal, // Campo de número/moneda
            "Monto Pagado": venta.montoPagado, // Campo de número/moneda
            "Monto Pendiente": venta.montoPendiente, // Campo de número/moneda
            "Estado Crédito": venta.estadoCredito, // Campo de selección simple (o fórmula)
            "Método Pago": venta.metodoPago, // Campo de selección simple
            Usuario: venta.usuario,
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
      "montoPagado",
      "metodoPago",
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

    // 3. Procesar datos numéricos
    const montoTotal = parseFloat(data.montoTotal);
    const montoPagado = parseFloat(data.montoPagado);

    if (isNaN(montoTotal) || montoTotal <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El Monto Total debe ser un número positivo",
        }),
      };
    }
    if (isNaN(montoPagado) || montoPagado < 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El Monto Pagado debe ser un número no negativo",
        }),
      };
    }
    if (montoPagado > montoTotal) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El Monto Pagado no puede ser mayor que el Monto Total",
        }),
      };
    }

    // 4. Calcular el saldo pendiente y estado de crédito
    const montoPendiente = montoTotal - montoPagado;
    let estadoCredito = "Completada";

    if (montoPendiente > 0) {
      estadoCredito = "Crédito";
    }

    // 5. Preparar el objeto de la venta para la base de datos
    const venta = {
      id: `VENTA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fechaRegistro: new Date().toISOString(),
      cliente: {
        cedula: data.cedula,
        nombre: data.nombre,
        telefono: data.telefono,
      },
      descripcion: data.descripcion,
      montoTotal: montoTotal.toFixed(2),
      montoPagado: montoPagado.toFixed(2),
      montoPendiente: montoPendiente.toFixed(2),
      estadoCredito: estadoCredito,
      metodoPago: data.metodoPago,
      usuario: data.usuario || "admin", // Asignar un usuario por defecto si no viene
    };

    console.log("💰 Venta registrada:", venta);

    // 6. Guardar en Airtable
    await guardarEnAirtable(venta);

    // 7. Respuesta de éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Venta registrada exitosamente",
        venta: venta,
      }),
    };
  } catch (error) {
    console.error("❌ Error en la función registrar-venta:", error);
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
