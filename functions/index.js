const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// Tu clave de API de exchangerate-api.com
const API_KEY = process.env.EXCHANGERATE_KEY;
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

/**
 * Obtiene las tasas de cambio más recientes desde una API externa.
 * Esta función actúa como un proxy seguro para no exponer la API Key en el frontend.
 */
exports.getExchangeRates = functions.https.onRequest((request, response) => {
  // Usa el middleware de CORS para permitir peticiones desde tu web.
  cors(request, response, async () => {
    logger.info("Iniciando petición para obtener tasas de cambio...");

    try {
      const apiResponse = await axios.get(API_URL);

      // Si la API externa responde con éxito...
      if (apiResponse.data && apiResponse.data.result === "success") {
        logger.info("Tasas obtenidas con éxito de la API externa.");
        // Enviamos de vuelta solo el objeto con las tasas de conversión.
        response.status(200).json(apiResponse.data.conversion_rates);
      } else {
        // Si la API externa devuelve un error conocido.
        logger.error("La API externa devolvió un error:", apiResponse.data);
        response
          .status(500)
          .send("Error al obtener las tasas de la API externa.");
      }
    } catch (error) {
      // Si hay un error de red o en nuestra función.
      logger.error("Error crítico al llamar a la API de cambio:", error);
      response.status(500).send("Error interno del servidor.");
    }
  });
});
