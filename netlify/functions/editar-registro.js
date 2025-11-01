// netlify/functions/editar-registro.js
const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "PUT, OPTIONS", // Usamos PUT para actualizar
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  // 💡 Inicializar Cliente Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { tabla, id, data } = JSON.parse(event.body);

    // 1. Validar campos
    if (!tabla || !id || !data || Object.keys(data).length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Faltan parámetros: 'tabla', 'id' y 'data' (con campos a actualizar) son requeridos.",
        }),
      };
    }

    // 2. Seguridad: asegurar que la tabla sea una de las permitidas
    const tablasPermitidas = ["ventas", "gastos", "inventario"];
    if (!tablasPermitidas.includes(tabla)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Operación de actualización no permitida para esta tabla.",
        }),
      };
    }

    // 3. Ejecutar la actualización en Supabase
    const { error } = await supabase
      .from(tabla)
      .update(data) // Actualizar los campos dentro del objeto 'data'
      .eq("id", id); // Condición: solo para el registro con este ID

    if (error) {
      console.error(`Error Supabase al actualizar en ${tabla}:`, error);
      throw new Error(`DB Error: ${error.message}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (ID: ${id}) actualizado exitosamente en ${tabla}.`,
        campos_actualizados: Object.keys(data),
      }),
    };
  } catch (error) {
    console.error("❌ Error al actualizar registro:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor al actualizar.",
        details: error.message,
      }),
    };
  }
};
