// netlify/functions/obtener-data-admin.js
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

  try {
    const { type } = event.queryStringParameters;

    if (!type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Falta el parámetro 'type' (reporte o inventario)",
        }),
      };
    }

    let data = {};

    // ==========================================================
    // SIMULACIÓN DE DATOS DE REPORTE
    // ==========================================================
    if (type === "reporte") {
      data = {
        success: true,
        reporteMensual: {
          labels: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"],
          ventas: [8500, 12000, 15500, 14000, 18200, 20100],
          gastos: [3500, 4100, 5800, 4900, 6100, 7500],
        },
        gastosCategoria: [
          { categoria: "Materiales", monto: 4500 },
          { categoria: "Nómina", monto: 2500 },
          { categoria: "Servicios", monto: 1200 },
          { categoria: "Mantenimiento", monto: 900 },
          { categoria: "Marketing", monto: 500 },
        ],
        creditosPendientes: 8930.0, // De admin.html
        ventasPorServicio: {
          labels: ["DTF", "Sublimación", "Copias/Impresión"],
          valores: [40, 35, 25], // Porcentaje de ventas
        },
      };
    }

    // ==========================================================
    // SIMULACIÓN DE DATOS DE INVENTARIO
    // ==========================================================
    else if (type === "inventario") {
      data = {
        success: true,
        items: [
          {
            codigo: "MAT-001",
            material: "Tinta de Sublimación (Litro)",
            tipo: "Insumo",
            stock: 15,
            unidad: "Litros",
            stockMinimo: 5,
          },
          {
            codigo: "MAT-002",
            material: "Papel DTF (Metro)",
            tipo: "Insumo",
            stock: 2,
            unidad: "Metros",
            stockMinimo: 10,
          },
          {
            codigo: "PROD-010",
            material: "Taza Blanca 11oz",
            tipo: "Producto",
            stock: 120,
            unidad: "Unidades",
            stockMinimo: 50,
          },
          {
            codigo: "PROD-011",
            material: "Camiseta Poliéster S",
            tipo: "Producto",
            stock: 5,
            unidad: "Unidades",
            stockMinimo: 20,
          },
          {
            codigo: "MAT-003",
            material: "Filamento PLA Negro",
            tipo: "Insumo",
            stock: 30,
            unidad: "Metros",
            stockMinimo: 15,
          },
        ],
      };
    }

    // AQUÍ: Conexión real a la base de datos (Google Sheets, Airtable, etc.)
    // La función que uses debe filtrar y devolver solo los datos pedidos por 'type'.

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error en la función Netlify:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor al obtener datos.",
      }),
    };
  }
};
