// netlify/functions/registrar-gasto.js (VERSION SUPABASE)
const { createClient } = require("@supabase/supabase-js");

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
    // ... (Validaciones: Se asume que se mantienen las validaciones del archivo original) ...
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

    // Preparar datos para Supabase (usando snake_case según la tabla)
    const gastoData = {
      fecha_registro: new Date().toISOString(),
      fecha_gasto: data.fecha,
      categoria: data.categoria,
      descripcion: data.descripcion,
      monto: monto.toFixed(2),
      metodo_pago: data.metodoPago,
      proveedor: data.proveedor || null,
      usuario: data.usuario || "admin",
    };

    // ==========================================================
    // 💡 REGISTRO REAL EN SUPABASE
    // ==========================================================
    const { error } = await supabase
      .from("gastos") // Nombre de tu tabla: gastos
      .insert([gastoData]);

    if (error) {
      console.error("Error Supabase al insertar gasto:", error);
      throw new Error(`DB Error: ${error.message}`);
    }

    console.log("💸 Gasto registrado en Supabase:", gastoData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Gasto registrado exitosamente en Supabase.",
      }),
    };
  } catch (error) {
    console.error("❌ Error al registrar gasto:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error de conexión con la base de datos (Supabase).",
        details: error.message,
      }),
    };
  }
};
