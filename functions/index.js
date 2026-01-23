const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Inicializar Firebase Admin SDK para que las funciones puedan acceder a los servicios de Firebase
admin.initializeApp();
const db = admin.firestore();

const app = express();

// Middlewares
app.use(cors({ origin: true })); // Permite peticiones desde tu frontend
app.use(express.json()); // Permite al servidor entender JSON en las peticiones

// --- RUTAS DE LA API REALES ---

// Endpoint para OBTENER clientes (para el select de ventas)
app.get("/api/clientes", async (req, res) => {
  try {
    const snapshot = await db.collection("clientes").get();
    const clientes = snapshot.docs.map((doc) => ({
      id_cliente: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({ status: "success", data: clientes });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener clientes." });
  }
});

// Endpoint para AÑADIR un nuevo cliente
app.post("/api/clientes", async (req, res) => {
  try {
    // LOGGING: Ver qué datos llegan para depurar
    console.log(
      "Petición recibida en /api/clientes. Body:",
      JSON.stringify(req.body),
    );

    const clienteData = req.body;

    if (!clienteData || Object.keys(clienteData).length === 0) {
      console.error("Error: El cuerpo de la petición está vacío.");
      return res
        .status(400)
        .json({ status: "error", message: "No se enviaron datos válidos." });
    }

    const docRef = await db.collection("clientes").add(clienteData);
    console.log("Cliente creado exitosamente con ID:", docRef.id);

    res.status(201).json({
      status: "success",
      message: "Cliente añadido con éxito",
      id: docRef.id,
    });
  } catch (error) {
    // LOGGING: Imprimir el error real para verlo en los logs de Firebase
    console.error("ERROR CRÍTICO al guardar cliente en Firestore:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor: " + error.message,
    });
  }
});

// Endpoint para OBTENER inventario (para el select de productos)
app.get("/api/inventario", async (req, res) => {
  try {
    const snapshot = await db.collection("inventario").get();
    const productos = snapshot.docs.map((doc) => ({
      id_producto: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({ status: "success", data: productos });
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener inventario." });
  }
});

// Endpoint para AÑADIR un nuevo producto al inventario
app.post("/api/inventario", async (req, res) => {
  try {
    const productoData = req.body;
    // Eliminar id_producto del cuerpo si viene vacío para que Firestore genere uno
    delete productoData.id_producto;

    const docRef = await db.collection("inventario").add(productoData);
    res.status(201).json({
      status: "success",
      message: "Producto añadido con éxito",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error al añadir producto:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al añadir producto." });
  }
});

// Endpoint para ACTUALIZAR un producto existente
app.put("/api/inventario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    // No queremos guardar el ID dentro del documento como un campo duplicado
    delete data.id_producto;

    await db.collection("inventario").doc(id).update(data);
    res
      .status(200)
      .json({ status: "success", message: "Producto actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar producto." });
  }
});

// Endpoint para ELIMINAR un producto
app.delete("/api/inventario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("inventario").doc(id).delete();
    res
      .status(200)
      .json({ status: "success", message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar producto." });
  }
});

// Endpoint para AÑADIR una nueva venta
app.post("/api/ventas", async (req, res) => {
  try {
    const ventaData = req.body;
    // Validar datos aquí si es necesario
    const docRef = await db.collection("ventas").add(ventaData);
    res.status(201).json({
      status: "success",
      message: "Venta añadida con éxito",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error al añadir venta:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al añadir la venta." });
  }
});

// Endpoint para AÑADIR un nuevo gasto
app.post("/api/gastos", async (req, res) => {
  try {
    const gastoData = req.body;
    // Validar datos aquí si es necesario
    const docRef = await db.collection("gastos").add(gastoData);
    res.status(201).json({
      status: "success",
      message: "Gasto añadido con éxito",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error al añadir gasto:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al añadir el gasto." });
  }
});

// Endpoint para OBTENER los datos del dashboard (KPIs, gráficos, etc.)
app.get("/api/dashboard", async (req, res) => {
  try {
    const ventasSnapshot = await db.collection("ventas").get();
    const gastosSnapshot = await db.collection("gastos").get();

    const ultimasVentas = ventasSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 10);
    const ultimosGastos = gastosSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 10);

    // Lógica de KPIs (esto es un cálculo real basado en los datos de Firestore)
    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    let ingresosMes = 0;
    ventasSnapshot.docs.forEach((doc) => {
      const venta = doc.data();
      const fechaVenta = new Date(venta.fecha);
      if (fechaVenta >= primerDiaMes) {
        ingresosMes += parseFloat(venta.venta_bruta || 0);
      }
    });

    let gastosMes = 0;
    gastosSnapshot.docs.forEach((doc) => {
      const gasto = doc.data();
      const fechaGasto = new Date(gasto.fecha);
      if (fechaGasto >= primerDiaMes) {
        gastosMes += parseFloat(gasto.monto || 0);
      }
    });

    const balanceNeto = ingresosMes - gastosMes;

    // Puedes añadir más cálculos de KPIs aquí (balanceGeneral, clientesNuevos, etc.)
    // Por ahora, nos centramos en los KPIs principales.

    const response = {
      status: "success",
      data: {
        kpis: {
          ingresosMes: ingresosMes,
          gastosMes: gastosMes,
          balanceNeto: balanceNeto,
          // Rellenar otros KPIs con lógica real
          clientesNuevos: 0,
          clientesConDeuda: 0,
          alertasInventario: 0,
          balanceGeneral: 0,
          totalItemsStock: 0,
          totalSaldoPendiente: 0,
        },
        chartData: {
          /* Lógica para datos de gráfico se puede añadir aquí */
        },
        ultimasVentas: ultimasVentas,
        ultimosGastos: ultimosGastos,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor." });
  }
});

// --- Exportar la API de Express como una Cloud Function ---
// Cada vez que se llame a esta función HTTPS, se ejecutará nuestra app de Express.
exports.api = onRequest({ region: "us-central1" }, app);
