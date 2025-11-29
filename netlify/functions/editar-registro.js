const { verifyAuth } = require("./_utils");
const { findRowNumberById, updateRow, readRange } = require("./_google-sheets");

const SHEET_CONFIG = {
    ventas: { name: "ventas", keyColumn: "B" },
    gastos: { name: "gastos", keyColumn: "B" },
    clientes: { name: "clientes", keyColumn: "A" },
    inventario: { name: "inventario", keyColumn: "A" },
};

// --- Lógica de negocio para actualizar cada tipo de tabla ---

async function handleVentasUpdate(rowNumber, data) {
    const currentRow = (await readRange(`ventas!${rowNumber}:${rowNumber}`))[0] || [];
    const ventaBruta = data.venta_bruta !== undefined ? parseFloat(data.venta_bruta) : parseFloat(currentRow[6] || 0);
    const abono = data.abono !== undefined ? parseFloat(data.abono) : parseFloat(currentRow[7] || 0);
    
    const updatedRow = [
        data.fecha || currentRow[0],
        currentRow[1], // ID no cambia
        data.cliente || currentRow[2],
        data.cantidad || currentRow[3],
        data.precio_unitario || currentRow[4],
        data.descripcion || currentRow[5],
        ventaBruta.toFixed(2),
        abono.toFixed(2),
        (ventaBruta - abono).toFixed(2), // Saldo recalculado
        data.iva_fiscal || currentRow[9],
    ];
    return updateRow("ventas", rowNumber, updatedRow);
}

async function handleGastosUpdate(rowNumber, data) {
    const currentRow = (await readRange(`gastos!${rowNumber}:${rowNumber}`))[0] || [];
    const updatedRow = [
        data.fecha || currentRow[0],
        currentRow[1], // ID no cambia
        data.rif || currentRow[2],
        data.razon_social || currentRow[3],
        data.concepto || currentRow[4],
        data.cantidad || currentRow[5],
        data.descripcion || currentRow[6],
        data.precio_unitario || currentRow[7],
        data.monto_total || currentRow[8],
        data.iva_fiscal || currentRow[9],
        currentRow[10], // createdAt no cambia
    ];
    return updateRow("gastos", rowNumber, updatedRow);
}

async function handleClientesUpdate(rowNumber, data) {
    const currentRow = (await readRange(`clientes!${rowNumber}:${rowNumber}`))[0] || [];
    const updatedRow = [
        currentRow[0], // ID no cambia
        data.nombre || currentRow[1],
        data.telefono || currentRow[2],
        data.email || currentRow[3],
        currentRow[4], // createdAt no cambia
    ];
    return updateRow("clientes", rowNumber, updatedRow);
}

async function handleInventarioUpdate(rowNumber, data) {
    const currentRow = (await readRange(`inventario!${rowNumber}:${rowNumber}`))[0] || [];
    const updatedRow = [
        currentRow[0], // Código no cambia
        data.nombre || currentRow[1],
        data.tipo || currentRow[2],
        data.stock_actual || currentRow[3],
        data.u_medida || currentRow[4],
        data.stock_minimo || currentRow[5],
        data.usuario || currentRow[6],
    ];
    return updateRow("inventario", rowNumber, updatedRow);
}

// --- Función principal del endpoint ---

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
        const { tabla, id, data } = JSON.parse(event.body);
        if (!tabla || !id || !data || !SHEET_CONFIG[tabla]) {
            return { statusCode: 400, body: JSON.stringify({ message: "Parámetros inválidos o tabla no reconocida." }) };
        }

        const { name: sheetName, keyColumn } = SHEET_CONFIG[tabla];
        const rowNumber = await findRowNumberById(sheetName, id, keyColumn);

        if (rowNumber === -1) {
            return { statusCode: 404, body: JSON.stringify({ message: `Registro con ID '${id}' no encontrado.` }) };
        }

        let result;
        switch (tabla) {
            case "ventas": result = await handleVentasUpdate(rowNumber, data); break;
            case "gastos": result = await handleGastosUpdate(rowNumber, data); break;
            case "clientes": result = await handleClientesUpdate(rowNumber, data); break;
            case "inventario": result = await handleInventarioUpdate(rowNumber, data); break;
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                success: true, 
                message: `Registro '${id}' actualizado exitosamente en '${tabla}'.`,
                updatedRange: result.updatedRange 
            }) 
        };

    } catch (error) {
        console.error("Error en editar-registro.js:", error);
        return { statusCode: 500, headers, body: JSON.stringify({ message: "Error interno del servidor", error: error.message }) };
    }
};