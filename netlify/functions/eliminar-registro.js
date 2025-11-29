const { verifyAuth } = require("./_utils");
const { findRowNumberById, deleteRow } = require("./_google-sheets");

const SHEET_CONFIG = {
    ventas: { name: "ventas", keyColumn: "B" },
    gastos: { name: "gastos", keyColumn: "B" },
    clientes: { name: "clientes", keyColumn: "A" },
    inventario: { name: "inventario", keyColumn: "A" },
};

exports.handler = async function (event) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-control-allow-methods": "POST, OPTIONS",
    };
    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    const auth = verifyAuth(event);
    if (!auth.ok) return { statusCode: 401, body: JSON.stringify({ message: auth.message }) };

    try {
        const { tabla, id } = JSON.parse(event.body);
        if (!tabla || !id || !SHEET_CONFIG[tabla]) {
            return { statusCode: 400, body: JSON.stringify({ message: "Parámetros inválidos o tabla no reconocida." }) };
        }

        const { name: sheetName, keyColumn } = SHEET_CONFIG[tabla];
        const rowNumber = await findRowNumberById(sheetName, id, keyColumn);

        if (rowNumber === -1) {
            return { statusCode: 404, body: JSON.stringify({ message: `Registro con ID '${id}' no encontrado.` }) };
        }

        await deleteRow(sheetName, rowNumber);

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                success: true, 
                message: `Registro '${id}' eliminado exitosamente de '${tabla}'.`
            }) 
        };

    } catch (error) {
        console.error("Error en eliminar-registro.js:", error);
        return { statusCode: 500, headers, body: JSON.stringify({ message: "Error interno del servidor", error: error.message }) };
    }
};