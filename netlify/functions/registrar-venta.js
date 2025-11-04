// netlify/functions/registrar-venta.js
const { createClient } = require("@supabase/supabase-js");

// 💡 Inicializar Cliente Supabase (Service Role Key para inserción/modificación)
// Asegúrate de que estas variables de entorno están configuradas en Netlify
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  // 0. Verificar configuración de Supabase
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "Error de configuración: Variables de entorno de Supabase faltantes.",
      }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // 1. Validar campos requeridos
    const requiredFields = [
      "cedula",
      "nombre",
      "telefono",
      "descripcion",
      "montoTotal",
      "montoPagado",
      "metodoPago",
      "usuario",
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

    const montoTotal = parseFloat(data.montoTotal);
    const montoPagado = parseFloat(data.montoPagado);

    if (
      isNaN(montoTotal) ||
      montoTotal <= 0 ||
      isNaN(montoPagado) ||
      montoPagado < 0
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Los montos deben ser números válidos. Monto Total debe ser positivo.",
        }),
      };
    }

    if (montoPagado > montoTotal) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El monto pagado no puede ser mayor al monto total.",
        }),
      };
    }

    // Determinar estado de crédito (para la DB)
    const montoPendiente = montoTotal - montoPagado;
    let estadoCredito = montoPendiente > 0 ? "Crédito" : "Completada";

    // 2. Preparar el objeto de la venta para Supabase (Mapeo a la tabla 'ventas')
    const ventaSupabase = {
      // Usar un ID único generado en el código para mantener el formato VENTA-...
      id: `VENTA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      // fecha_registro se establece automáticamente por el DEFAULT now() de la DB
      cedula_cliente: data.cedula,
      nombre_cliente: data.nombre,
      telefono_cliente: data.telefono,
      descripcion: data.descripcion,
      monto_total: montoTotal.toFixed(2),
      monto_pagado: montoPagado.toFixed(2),
      // monto_pendiente es GENERATED ALWAYS, NO se envía.
      estado_credito: estadoCredito,
      metodo_pago: data.metodoPago,
      usuario: data.usuario || "admin",
    };

    console.log("💰 Venta a Supabase:", ventaSupabase);

    // 3. Insertar en Supabase
    const { data: insertedData, error } = await supabase
      .from("ventas") // Nombre de la tabla
      .insert([ventaSupabase])
      .select() // Para obtener el registro completo (incluyendo monto_pendiente generado)
      .single();

    if (error) {
      console.error("❌ Error de Supabase al registrar la venta:", error);
      throw new Error(`DB Error: ${error.message}`);
    }

    // 4. Respuesta de éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Venta registrada exitosamente en Supabase",
        venta: insertedData,
      }),
    };
  } catch (error) {
    console.error("❌ Error en registrar-venta.js:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "Error interno del servidor al registrar la venta: " + error.message,
      }),
    };
  }
};
