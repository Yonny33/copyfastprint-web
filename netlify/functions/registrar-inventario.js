// netlify/functions/registrar-inventario.js
const { createClient } = require("@supabase/supabase-js");

// 💡 Inicializar Cliente Supabase (Service Role Key)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  // 0. Verificar la configuración de Supabase
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

    // 1. Validar campos requeridos para el nuevo material
    const requiredFields = [
      "codigo",
      "material",
      "tipo",
      "stock",
      "unidad_medida",
      "stock_minimo",
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
          error: `Faltan campos obligatorios para registrar el material: ${missingFields.join(
            ", "
          )}`,
        }),
      };
    }

    const stock = parseFloat(data.stock);
    const stockMinimo = parseFloat(data.stock_minimo);

    if (isNaN(stock) || isNaN(stockMinimo) || stock < 0 || stockMinimo < 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Stock y Stock Mínimo deben ser números válidos y no negativos.",
        }),
      };
    }

    // 2. Preparar el objeto para Supabase (Mapeo a la tabla 'inventario')
    const materialSupabase = {
      codigo: data.codigo,
      material: data.material,
      tipo: data.tipo,
      stock: stock.toFixed(2),
      unidad_medida: data.unidad_medida,
      stock_minimo: stockMinimo.toFixed(2),
    };

    console.log("📦 Material a Supabase:", materialSupabase);

    // 3. Insertar en Supabase (manejar el error de código único)
    const { data: insertedData, error } = await supabase
      .from("inventario") // Nombre de la tabla
      .insert([materialSupabase])
      .select()
      .single();

    if (error) {
      console.error("❌ Error de Supabase al registrar el material:", error);

      // Manejar error de UNIQUE constraint (código duplicado: código de error '23505')
      if (error.code === "23505" && error.message.includes("codigo")) {
        return {
          statusCode: 409, // Conflict
          headers,
          body: JSON.stringify({
            success: false,
            error: `El código de material '${data.codigo}' ya existe. Los códigos deben ser únicos.`,
          }),
        };
      }

      throw new Error(`DB Error: ${error.message}`);
    }

    // 4. Respuesta de éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Material de inventario registrado exitosamente en Supabase",
        material: insertedData,
      }),
    };
  } catch (error) {
    console.error("❌ Error en registrar-inventario.js:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          "Error interno del servidor al registrar el material: " +
          error.message,
      }),
    };
  }
};
