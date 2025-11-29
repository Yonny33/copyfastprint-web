// Forzando el redespliegue para aplicar la configuración
const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({origin: true});

exports.proxyGoogleScript = functions.https.onRequest((req, res) => {
  // Habilitar CORS para permitir solicitudes desde cualquier origen
  cors(req, res, async () => {
    // Obtener la URL de Google Apps Script desde la configuración de Firebase
    const GOOGLE_SCRIPT_URL = functions.config().google.script_url;

    // Si la URL no está configurada, devuelve un error claro
    if (!GOOGLE_SCRIPT_URL) {
      functions.logger.error("La URL del script de Google no está configurada. Ejecuta firebase functions:config:set google.script_url=\"URL_AQUI\"");
      return res.status(500).send({
        success: false,
        message: "Error de configuración del servidor.",
      });
    }

    // Solo permitir solicitudes POST
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      // Registrar en los logs de Firebase que la función fue invocada
      functions.logger.info("Proxying request to Google Script:", {
        url: GOOGLE_SCRIPT_URL,
        body: req.body,
      });

      // Reenviar la solicitud al Google Apps Script usando axios
      const googleScriptResponse = await axios.post(
          GOOGLE_SCRIPT_URL,
          req.body,
          {
            headers: {"Content-Type": "application/json"},
          },
      );

      // Registrar la respuesta recibida de Google
      functions.logger.info("Received response from Google Script:", {
        status: googleScriptResponse.status,
        data: googleScriptResponse.data,
      });

      // Enviar la respuesta de Google de vuelta al cliente original
      res.status(200).send(googleScriptResponse.data);
    } catch (error) {
      // Manejar errores
      functions.logger.error("Error proxying request to Google Script:", {
        errorMessage: error.message,
        errorStack: error.stack,
        response: error.response ? error.response.data : "No response data",
      });

      // Enviar un mensaje de error genérico al cliente
      res.status(500).send({
        success: false,
        message: "Error al contactar el servicio de Google.",
      });
    }
  });
});
