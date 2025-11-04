// netlify/functions/registrar-gasto.js
const { createClient } = require("@supabase/supabase-js");

// 💡 Inicializar Cliente Supabase (Service Role Key)
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
      "fecha",
      "categoria",
      "descripcion",
      "monto",
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

    // 2. Preparar datos para guardar (Mapeo a la tabla 'gastos')
    const gastoSupabase = {
      id: `GASTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      // fecha_registro se establece automáticamente por el DEFAULT now() de la DB
      fecha: data.fecha,
      categoria: data.categoria,
      descripcion: data.descripcion,
      monto: monto.toFixed(2),
      metodo_pago: data.metodoPago,
      proveedor: data.proveedor || null,
      recurrente: data.recurrente === "si" || data.recurrente === true,
      divisa: data.divisa || "VES",
      usuario: data.usuario || "admin",
    };

    console.log("💸 Gasto a Supabase:", gastoSupabase);

    // 3. Insertar en Supabase
    const { data: insertedData, error } = await supabase
      .from("gastos") // Nombre de la tabla
      .insert([gastoSupabase])
      .select()
      .single();

    if (error) {
      console.error("❌ Error de Supabase al registrar el gasto:", error);
      throw new Error(`DB Error: ${error.message}`);
    }

    // 4. Respuesta de éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Gasto registrado exitosamente en Supabase",
        gasto: insertedData,
      }),
    };
  } catch (error) {
    console.error("❌ Error en registrar-gasto.js:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "Error interno del servidor al registrar el gasto: " + error.message,
      }),
    };
  }
};
