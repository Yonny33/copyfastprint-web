// netlify/functions/eliminar-registro.js
const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "DELETE") {
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
    const { tabla, id } = JSON.parse(event.body);

    // 1. Validar campos
    if (!tabla || !id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Faltan parámetros: 'tabla' e 'id' son requeridos.",
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
          error: "Operación de eliminación no permitida para esta tabla.",
        }),
      };
    }

    // 3. Ejecutar la eliminación en Supabase
    const { error } = await supabase.from(tabla).delete().eq("id", id); // Condición: donde la columna 'id' sea igual al ID proporcionado

    if (error) {
      console.error(`Error Supabase al eliminar en ${tabla}:`, error);
      throw new Error(`DB Error: ${error.message}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (ID: ${id}) eliminado exitosamente de ${tabla}.`,
      }),
    };
  } catch (error) {
    console.error("❌ Error al eliminar registro:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor al eliminar.",
        details: error.message,
      }),
    };
  }
};
