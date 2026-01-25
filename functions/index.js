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

    // Validar si ya existe un cliente con esa cédula
    if (clienteData.cedula) {
      const existingClient = await db
        .collection("clientes")
        .where("cedula", "==", clienteData.cedula)
        .get();

      if (!existingClient.empty) {
        return res.status(409).json({
          status: "error",
          message: `El cliente con Cédula/RIF ${clienteData.cedula} ya está registrado.`,
        });
      }
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

// Endpoint para OBTENER todas las ventas (para Reportes)
app.get("/api/ventas", async (req, res) => {
  try {
    // Obtenemos ventas y clientes en paralelo para cruzar la Cédula
    const [ventasSnapshot, clientesSnapshot] = await Promise.all([
      db.collection("ventas").get(),
      db.collection("clientes").get(),
    ]);

    const clientesMap = {};
    clientesSnapshot.docs.forEach((doc) => {
      clientesMap[doc.id] = doc.data();
    });

    const ventas = ventasSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        const cliente = clientesMap[data.id_cliente] || {};
        return {
          id: doc.id,
          ...data,
          nombre_cliente:
            data.nombre_cliente || cliente.nombre || "Cliente General",
          cedula_cliente: cliente.cedula || cliente.rif || "N/A", // Agregamos la cédula
        };
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar por fecha descendente
    res.status(200).json({ status: "success", data: ventas });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener ventas." });
  }
});

// Endpoint para AÑADIR una nueva venta
app.post("/api/ventas", async (req, res) => {
  try {
    const ventaData = req.body;

    // Si no hay ID de producto (ej. venta manual sin item), guardamos normal
    if (!ventaData.id_producto) {
      const docRef = await db.collection("ventas").add(ventaData);
      return res.status(201).json({
        status: "success",
        message: "Venta añadida con éxito",
        id: docRef.id,
      });
    }

    const idProducto = ventaData.id_producto;
    const cantidad = parseFloat(ventaData.cantidad) || 0;
    const saldoPendienteInput = parseFloat(ventaData.saldo_pendiente) || 0;
    const idCliente = ventaData.id_cliente;

    // Asegurar que el estado del pedido esté definido antes de procesar
    if (!ventaData.estado_pedido) {
      ventaData.estado_pedido =
        saldoPendienteInput > 0.01 ? "Pendiente" : "Pagado";
    }

    // Transacción: Descontar stock y registrar venta simultáneamente
    let ventaId; // Variable para capturar el ID generado
    await db.runTransaction(async (t) => {
      // --- FASE 1: LECTURAS (READS) ---
      // Primero leemos TODO lo necesario antes de escribir nada.

      // 1. Leer Producto
      const productoRef = db.collection("inventario").doc(idProducto);
      const productoDoc = await t.get(productoRef);

      // 2. Leer Deuda Existente (si aplica)
      let querySnapshot = null;
      if (saldoPendienteInput > 0 && idCliente) {
        const query = db
          .collection("ventas")
          .where("id_cliente", "==", idCliente)
          .where("estado_pedido", "==", "Pendiente")
          .limit(1);
        querySnapshot = await t.get(query);
      }

      // --- FASE 2: LÓGICA Y CÁLCULOS ---
      if (!productoDoc.exists) {
        throw new Error("El producto no existe en el inventario.");
      }

      const stockActual = parseFloat(productoDoc.data().stock_actual || 0);
      const nuevoStock = stockActual - cantidad;

      let existingDoc = null;
      if (querySnapshot && !querySnapshot.empty) {
        existingDoc = querySnapshot.docs[0];
      }

      // --- FASE 3: ESCRITURAS (WRITES) ---
      // Ahora sí, aplicamos todos los cambios.

      // 1. Actualizar Stock
      t.update(productoRef, { stock_actual: nuevoStock });

      // 2. Actualizar o Crear Venta
      if (existingDoc) {
        // --- CASO A: CLIENTE YA TIENE DEUDA -> SUMAR A LA EXISTENTE ---
        const oldData = existingDoc.data();
        const nuevoSaldo =
          (parseFloat(oldData.saldo_pendiente) || 0) + saldoPendienteInput;
        const nuevaVentaBruta =
          (parseFloat(oldData.venta_bruta) || 0) +
          (parseFloat(ventaData.venta_bruta) || 0);
        const nuevoAbono =
          (parseFloat(oldData.abono_recibido) || 0) +
          (parseFloat(ventaData.abono_recibido) || 0);
        // Concatenamos la descripción para saber qué productos conforman la deuda total
        const nuevaDescripcion = `${oldData.descripcion || "Deuda previa"} + ${ventaData.descripcion || "Item"}`;

        t.update(existingDoc.ref, {
          saldo_pendiente: nuevoSaldo,
          venta_bruta: nuevaVentaBruta,
          abono_recibido: nuevoAbono,
          descripcion: nuevaDescripcion,
          fecha: ventaData.fecha, // Actualizamos la fecha a la última interacción
        });
        ventaId = existingDoc.id; // Mantenemos el mismo ID único del cliente
      } else {
        // --- CASO B: VENTA NUEVA (Contado o Primera deuda) ---
        const nuevaVentaRef = db.collection("ventas").doc();
        ventaId = nuevaVentaRef.id;
        t.set(nuevaVentaRef, ventaData);
      }
    });

    res.status(201).json({
      status: "success",
      message: "Venta registrada y stock descontado",
      id: ventaId, // Devolvemos el ID al frontend
    });
  } catch (error) {
    console.error("Error al añadir venta:", error);
    res.status(500).json({
      status: "error",
      message: "Error al añadir la venta: " + error.message,
    });
  }
});

// Endpoint para ACTUALIZAR una venta (ej. registrar abono)
app.put("/api/ventas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_abono } = req.body; // Esperamos que envíen el monto a abonar

    if (monto_abono) {
      // Transacción para asegurar consistencia matemática
      await db.runTransaction(async (t) => {
        const ventaRef = db.collection("ventas").doc(id);
        const doc = await t.get(ventaRef);
        if (!doc.exists) {
          throw new Error("Venta no encontrada");
        }
        const venta = doc.data();

        const nuevoAbono =
          (parseFloat(venta.abono_recibido) || 0) + parseFloat(monto_abono);
        const nuevoSaldo = (parseFloat(venta.venta_bruta) || 0) - nuevoAbono;
        // Si el saldo es 0 o menor (por decimales), marcar como Pagado
        const nuevoEstado = nuevoSaldo <= 0.01 ? "Pagado" : "Pendiente";

        t.update(ventaRef, {
          abono_recibido: nuevoAbono,
          saldo_pendiente: nuevoSaldo,
          estado_pedido: nuevoEstado,
        });
      });
      res
        .status(200)
        .json({ status: "success", message: "Abono registrado con éxito" });
    } else {
      // Actualización genérica si no es abono
      await db.collection("ventas").doc(id).update(req.body);
      res.status(200).json({ status: "success", message: "Venta actualizada" });
    }
  } catch (error) {
    console.error("Error al actualizar venta:", error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar venta: " + error.message,
    });
  }
});

// Endpoint para OBTENER todos los gastos (para Reportes)
app.get("/api/gastos", async (req, res) => {
  try {
    const snapshot = await db.collection("gastos").get();
    const gastos = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar por fecha descendente
    res.status(200).json({ status: "success", data: gastos });
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener gastos." });
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
    // Consultamos todas las colecciones necesarias en paralelo
    const [
      ventasSnapshot,
      gastosSnapshot,
      clientesSnapshot,
      inventarioSnapshot,
    ] = await Promise.all([
      db.collection("ventas").get(),
      db.collection("gastos").get(),
      db.collection("clientes").get(),
      db.collection("inventario").get(),
    ]);

    // Crear mapa de clientes para búsqueda rápida (ID -> Nombre)
    const clientesMap = {};
    clientesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      clientesMap[doc.id] = data.nombre || "Sin Nombre";
    });

    const ultimasVentas = ventasSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Si la venta no tiene nombre guardado, lo buscamos en el mapa de clientes usando el ID
          nombre_cliente:
            data.nombre_cliente ||
            clientesMap[data.id_cliente] ||
            "Cliente General",
        };
      })
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

    // --- Cálculos adicionales de KPIs ---

    // 1. Total de Clientes
    const totalClientes = clientesSnapshot.size;

    // 2. Alertas de Inventario (Stock bajo) y Valor del Inventario
    let alertasInventario = 0;
    let totalItemsStock = 0;

    inventarioSnapshot.docs.forEach((doc) => {
      const prod = doc.data();
      const stock = parseFloat(prod.stock_actual || 0);
      const min = parseFloat(prod.stock_minimo || 0);

      totalItemsStock += stock;
      if (stock <= min) {
        alertasInventario++;
      }
    });

    // 3. Cálculo de Deudas y Saldo Pendiente
    let totalSaldoPendiente = 0;
    const clientesDeudores = new Set();

    ventasSnapshot.docs.forEach((doc) => {
      const venta = doc.data();
      const saldo = parseFloat(venta.saldo_pendiente || 0);

      if (saldo > 0.01) {
        totalSaldoPendiente += saldo;
        if (venta.id_cliente) clientesDeudores.add(venta.id_cliente);
      }
    });

    // 4. Datos para el Gráfico (Últimos 6 meses)
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const today = new Date();
    const chartLabels = [];
    const chartIngresos = [];
    const chartGastos = [];

    // Iterar los últimos 6 meses (incluyendo el actual)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthIndex = d.getMonth();
      const year = d.getFullYear();

      chartLabels.push(`${months[monthIndex]} ${year}`);

      const startOfMonth = new Date(year, monthIndex, 1);
      const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59);

      // Sumar ventas del mes
      const ingresosEsteMes = ventasSnapshot.docs.reduce((acc, doc) => {
        const v = doc.data();
        const fecha = new Date(v.fecha);
        return fecha >= startOfMonth && fecha <= endOfMonth
          ? acc + (parseFloat(v.venta_bruta) || 0)
          : acc;
      }, 0);
      chartIngresos.push(ingresosEsteMes);

      // Sumar gastos del mes
      const gastosEsteMes = gastosSnapshot.docs.reduce((acc, doc) => {
        const g = doc.data();
        const fecha = new Date(g.fecha);
        return fecha >= startOfMonth && fecha <= endOfMonth
          ? acc + (parseFloat(g.monto) || 0)
          : acc;
      }, 0);
      chartGastos.push(gastosEsteMes);
    }

    const response = {
      status: "success",
      data: {
        kpis: {
          ingresosMes: ingresosMes,
          gastosMes: gastosMes,
          balanceNeto: balanceNeto,
          clientesNuevos: totalClientes, // Por ahora mostramos total, idealmente filtrar por fecha registro
          alertasInventario: alertasInventario,
          totalItemsStock: totalItemsStock,
          clientesConDeuda: clientesDeudores.size,
          balanceGeneral: balanceNeto, // Simplificado
          totalSaldoPendiente: totalSaldoPendiente,
        },
        chartData: {
          labels: chartLabels,
          ingresos: chartIngresos,
          gastos: chartGastos,
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

// Endpoint para OBTENER tasas de cambio (Conectado a API externa via .env)
app.get("/api/exchange-rates", async (req, res) => {
  try {
    // 1. Intentar usar variables de entorno (.env)
    // El sistema buscará EXCHANGE_API_URL (url completa) o EXCHANGE_API_KEY (para construirla)
    const apiUrl = process.env.EXCHANGE_API_URL;
    const apiKey = process.env.EXCHANGE_API_KEY;

    let rates = {};

    if (apiUrl || apiKey) {
      // Si tienes la URL completa en .env, la usa. Si solo tienes la KEY, asume un servicio estándar (ej. ExchangeRate-API)
      const urlToFetch =
        apiUrl || `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

      const response = await fetch(urlToFetch);
      if (!response.ok) {
        throw new Error(
          `Error al consultar API externa: ${response.statusText}`,
        );
      }
      const data = await response.json();

      // --- MEJORA: Validar si la API externa devolvió un error ---
      // Si la respuesta no es 'success', lanzamos un error para que sea capturado por el catch.
      if (data.result !== "success") {
        throw new Error(
          `Error de la API externa: ${data["error-type"] || "Respuesta inválida"}`,
        );
      }

      // Adaptador: Normalizamos la respuesta (algunas APIs usan 'conversion_rates', otras 'rates')
      // Y pasamos la fecha de actualización si existe
      const responsePayload = {
        rates: data.conversion_rates || data.rates || {},
        last_updated: data.time_last_update_utc || new Date().toUTCString(),
      };
      return res.status(200).json(responsePayload);
    } else {
      // 2. Fallback: Si no se lee el .env, usamos valores de referencia para no romper la UI
      console.warn(
        "No se detectó configuración de API en .env. Usando tasas de referencia.",
      );
      const responsePayload = {
        rates: { USD: 1.0, EUR: 0.93, VES: 45.0, COP: 3900.0, BRL: 5.1 },
        last_updated: "Valores de Respaldo",
      };
      return res.status(200).json(responsePayload);
    }
  } catch (error) {
    console.error("Error al obtener tasas de cambio:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error al obtener tasas.",
    });
  }
});

// --- Exportar la API de Express como una Cloud Function ---
// Cada vez que se llame a esta función HTTPS, se ejecutará nuestra app de Express.
exports.api = onRequest(
  {
    region: "us-central1",
    maxInstances: 10, // Límite de seguridad: Máximo 10 copias simultáneas (evita facturas gigantes por errores)
    memory: "256MiB", // Memoria mínima: Suficiente para tu API y la más barata
    timeoutSeconds: 60, // Si tarda más de 60s, se corta (evita procesos colgados cobrando tiempo)
    concurrency: 80, // Cloud Functions v2 permite recibir hasta 80 peticiones por instancia
  },
  app,
);
