// netlify/functions/registrar-venta.js (VERSION SUPABASE)
const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  // Configuración CORS
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

  // 💡 Inicializar Cliente Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          "Error de configuración: Variables de entorno de Supabase faltantes.",
      }),
    };
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const data = JSON.parse(event.body);
    // ... (Validaciones: Asumimos que la validación del formulario en el frontend es suficiente) ...

    const montoTotal = parseFloat(data.montoTotal) || 0;
    const montoPagado = parseFloat(data.montoPagado) || 0;
    const montoPendiente = montoTotal - montoPagado;
    const estadoCredito = montoPendiente > 0.01 ? "Crédito" : "Pagado";

    // Preparar datos para Supabase (usando snake_case según la tabla)
    const ventaData = {
      fecha_registro: new Date().toISOString(),
      cedula: data.cedula || null,
      nombre_cliente: data.nombre,
      telefono: data.telefono || null,
      descripcion_trabajo: data.descripcion,
      monto_total_ves: montoTotal.toFixed(2),
      monto_pagado_ves: montoPagado.toFixed(2),
      saldo_pendiente: montoPendiente.toFixed(2),
      estado_credito: estadoCredito,
      usuario: data.usuario || "admin",
    };

    // ==========================================================
    // 💡 REGISTRO REAL EN SUPABASE
    // ==========================================================
    const { data: insertedData, error } = await supabase
      .from("ventas") // Nombre de tu tabla: ventas
      .insert([ventaData])
      .select("id") // Selecciona el ID generado
      .single();

    if (error) {
      console.error("Error Supabase al insertar venta:", error);
      throw new Error(`DB Error: ${error.message}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Venta registrada con éxito en Supabase.",
        id: insertedData.id,
        montoTotal,
        montoPagado,
        montoPendiente,
        estadoCredito,
      }),
    };
  } catch (error) {
    console.error("❌ Error al registrar venta:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor.",
        details: error.message,
      }),
    };
  }
};
