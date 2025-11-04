// netlify/functions/editar-registro.js - MODIFICADO para usar 'codigo' en inventario

const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  // ... (código de inicio y validación de método sin cambios)

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

    // 💡 Lógica de adaptación: Usar 'codigo' para la tabla 'inventario'
    const keyColumn = tabla === "inventario" ? "codigo" : "id";

    // Es buena práctica no permitir que el cliente cambie la clave de búsqueda que acaba de usar
    if (tabla === "inventario" && data.codigo) {
      delete data.codigo;
      console.warn(
        "Se eliminó 'codigo' del payload de actualización para evitar cambiar la clave de búsqueda."
      );
    }

    // 3. Ejecutar la actualización en Supabase
    // .eq(keyColumn, id) usa 'id' para ventas/gastos, y 'codigo' para inventario
    const { error } = await supabase
      .from(tabla)
      .update(data) // Actualizar los campos dentro del objeto 'data'
      .eq(keyColumn, id); // Condición: solo para el registro con este ID/Código

    if (error) {
      console.error(`Error Supabase al actualizar en ${tabla}:`, error);
      throw new Error(`DB Error: ${error.message}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Registro (${keyColumn.toUpperCase()}: ${id}) actualizado exitosamente en ${tabla}.`,
        campos_actualizados: Object.keys(data),
      }),
    };
  } catch (error) {
    // ... (código de manejo de errores sin cambios)
  }
};
