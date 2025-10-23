const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // Headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Manejar preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // API Configuration
const API_KEY = process.env.FASTFOREX_API_KEY;
  const API_URL = "https://api.fastforex.io/fetch-multi";

  try {
    console.log("🔄 Iniciando petición a FastForex API...");

    const currencies = "COP,VES,EUR";
    const url = `${API_URL}?from=USD&to=${currencies}&api_key=${API_KEY}`;

    console.log("📡 URL:", url.replace(API_KEY, "HIDDEN"));

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("📊 Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Data received:", JSON.stringify(data));

    if (!data.results) {
      throw new Error("No results in API response");
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rates: data.results,
        updated: new Date().toISOString(),
        base: "USD",
      }),
    };
  } catch (error) {
    console.error("💥 Error completo:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
