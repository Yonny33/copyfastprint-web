// netlify/functions/eliminar-registro.js - MODIFICADO para usar 'codigo' en inventario

const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  // ... (código de inicio y validación de método sin cambios)

  // 💡 Inicializar Cliente Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { tabla, id } = JSON.parse(event.body);

    // 1. Validar campos
    // ... (validación sin cambios)

    // 2. Seguridad: asegurar que la tabla sea una de las permitidas
    // ... (seguridad sin cambios)

    // 💡 Lógica de adaptación: Usar 'codigo' para la tabla 'inventario'
    const keyColumn = tabla === "inventario" ? "codigo" : "id";

    // 3. Ejecutar la eliminación en Supabase
    // .eq(keyColumn, id) usa 'id' para ventas/gastos, y 'codigo' para inventario
    const { error } = await supabase.from(tabla).delete().eq(keyColumn, id);

    if (error) {
      // ... (código de manejo de errores sin cambios)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (${keyColumn.toUpperCase()}: ${id}) eliminado exitosamente de ${tabla}.`,
      }),
    };
  } catch (error) {
    // ... (código de manejo de errores sin cambios)
  }
};
