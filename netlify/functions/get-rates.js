const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const API_KEY = process.env.FASTFOREX_API_KEY; // Cambiar a fetch-all que está disponible en plan gratuito
  const API_URL = "https://api.fastforex.io/fetch-all";

  try {
    console.log("🔄 Obteniendo todas las tasas...");

    const url = `${API_URL}?api_key=${API_KEY}`;
    console.log("📡 Consultando FastForex...");

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    console.log("📊 Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error:", errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Tasas obtenidas exitosamente");

    // Extraer solo las monedas que necesitamos
    const rates = data.results;
    const selectedRates = {
      COP: rates.COP || 3950,
      VES: rates.VES || 46.5,
      EUR: rates.EUR || 0.92,
    };

    console.log("💱 Tasas seleccionadas:", selectedRates);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rates: selectedRates,
        updated: data.updated || new Date().toISOString(),
        base: data.base || "USD",
      }),
    };
  } catch (error) {
    console.error("💥 Error:", error.message);

    // Retornar tasas de respaldo en caso de error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rates: {
          COP: 3950,
          VES: 46.5,
          EUR: 0.92,
        },
        updated: new Date().toISOString(),
        base: "USD",
        fallback: true,
      }),
    };
  }
};
