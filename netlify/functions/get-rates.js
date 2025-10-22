// netlify/functions/get-rates.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Manejar preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Tu API Key de FastForex (oculta en el servidor)
  // Tu API Key de FastForex (oculta en el servidor)
  const API_KEY = process.env.FASTFOREX_API_KEY;
  const API_URL = "https://api.fastforex.io/fetch-multi";
  // ... (continúa el resto del código)
  try {
    // Obtener tasas de cambio
    const currencies = "COP,VES,USD,EUR";
    const response = await fetch(
      `${API_URL}?from=USD&to=${currencies}&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Devolver las tasas al frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rates: data.results,
        updated: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("Error fetching rates:", error);

    // Devolver error al frontend
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
