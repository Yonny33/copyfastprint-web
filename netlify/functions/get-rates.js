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

  // 👇 Configuración de la API: Usa la variable de entorno de Netlify
  const API_KEY = process.env.EXCHANGERATE_API_KEY;
  const API_URL = "https://v6.exchangerate-api.com/v6/";
  const BASE_CURRENCY = "USD";
  const currencies = "COP,VES,EUR"; // Las monedas que necesitas

  if (!API_KEY) {
    console.error("❌ EXCHANGERATE_API_KEY no está configurada en Netlify.");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Server configuration error: API Key missing.",
      }),
    };
  }

  try {
    // 1. Construir la URL para el endpoint 'latest'
    const url = `${API_URL}${API_KEY}/latest/${BASE_CURRENCY}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // 2. Manejar respuesta de error de la API
    if (data.result !== "success" || !data.conversion_rates) {
      throw new Error(
        `ExchangeRate-API response failed: ${
          data.error_type || "Unknown error"
        }`
      );
    }

    // 3. Transformar datos (filtrar solo las monedas requeridas)
    const rates = {};
    currencies.split(",").forEach((currency) => {
      if (data.conversion_rates[currency]) {
        rates[currency] = data.conversion_rates[currency];
      }
    });

    // 4. Devolver la respuesta al frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        base: data.base_code,
        date: new Date().toISOString().split("T")[0],
        rates: rates,
      }),
    };
  } catch (error) {
    console.error("🚨 Error in Netlify Function:", error.message);
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
