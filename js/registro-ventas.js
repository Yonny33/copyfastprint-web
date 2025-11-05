// netlify/functions/registrar-venta.js
const fetch = require("node-fetch");

// ==========================================================================
// 🔑 CONFIGURACIÓN DE AIRTABLE
// ==========================================================================
// Estas variables deben estar configuradas en la sección Environment de Netlify.
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
// Usamos el nombre de tabla que nos indicaste: "Ventas"
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
            ID_VENTA: venta.id,
            Fecha_Registro: venta.fechaRegistro,
            Cédula_Cliente: venta.cliente.cedula || "N/A",
            Nombre_Cliente: venta.cliente.nombre,
            Teléfono_Cliente: venta.cliente.telefono || "N/A",
            Descripción_Venta: venta.descripcion,
            Monto_Total: parseFloat(venta.montoTotal),
            Monto_Pagado: parseFloat(venta.montoPagado),
            Monto_Pendiente: parseFloat(venta.montoPendiente),
            Estado_Crédito: venta.estadoCredito,
            Método_Pago: venta.metodoPago,
            Usuario_Registro: venta.usuario,
          },
        },
      ],
    }),
  });

  const airtableResult = await response.json();

  if (!response.ok) {
    console.error("❌ Error de Airtable:", airtableResult);
    throw new Error(
      airtableResult.error?.message || "Error al guardar en Airtable"
    );
  }

  return airtableResult;
}

// ==========================================================================
// 🚀 MANEJADOR PRINCIPAL DE NETLIFY FUNCTION
// ==========================================================================
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Manejar preflight request (necesario para CORS)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Solo acepta peticiones POST
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
      "nombre",
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

    // 2. Convertir y validar montos
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

    // 3. Determinar el saldo pendiente y estado de crédito
    const montoPendiente = montoTotal - montoPagado;
    let estadoCredito = "Completada";

    if (montoPendiente > 0) {
      estadoCredito = "Crédito";
    }

    // 4. Preparar el objeto de la venta para la base de datos
    const venta = {
      id: `VENTA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fechaRegistro: new Date().toISOString(),
      cliente: {
        cedula: data.cedula || null, // Permitir null
        nombre: data.nombre,
        telefono: data.telefono || null, // Permitir null
      },
      descripcion: data.descripcion,
      montoTotal: montoTotal.toFixed(2),
      montoPagado: montoPagado.toFixed(2),
      montoPendiente: montoPendiente.toFixed(2),
      estadoCredito: estadoCredito,
      metodoPago: data.metodoPago,
      usuario: data.usuario || "admin",
    };

    console.log("💰 Venta a registrar:", venta);

    // 5. Guardar en Airtable
    await guardarEnAirtable(venta);

    // 6. Respuesta de éxito
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
    console.error("❌ Error en registrar-venta:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor. Verifique logs.",
        details: error.message,
      }),
    };
  }
};
