// netlify/functions/obtener-data-admin.js
const { createClient } = require("@supabase/supabase-js");

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
  // Usamos la Service Key para que pueda leer, filtrar y ordenar sin problemas
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Ejecutar las tres consultas en paralelo para mayor velocidad
    const [
      { data: ventas, error: errorVentas },
      { data: gastos, error: errorGastos },
      { data: inventario, error: errorInventario },
    ] = await Promise.all([
      // 1. Obtener ventas del último año (o las 500 más recientes)
      supabase
        .from("ventas")
        .select("*")
        .order("fecha_registro", { ascending: false })
        .limit(500),
      // 2. Obtener gastos del último año (o los 500 más recientes)
      supabase
        .from("gastos")
        .select("*")
        .order("fecha_registro", { ascending: false })
        .limit(500),
      // 3. Obtener todo el inventario
      supabase
        .from("inventario")
        .select("*")
        .order("material", { ascending: true }),
    ]);

    if (errorVentas) throw new Error(errorVentas.message);
    if (errorGastos) throw new Error(errorGastos.message);
    if (errorInventario) throw new Error(errorInventario.message);

    // Devolver los datos consolidados
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          ventas: ventas,
          gastos: gastos,
          inventario: inventario,
        },
      }),
    };
  } catch (error) {
    console.error("❌ Error al obtener datos de Supabase:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor al obtener datos.",
        details: error.message,
      }),
    };
  }
};
