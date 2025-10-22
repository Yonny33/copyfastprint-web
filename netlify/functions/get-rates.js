// netlify/functions/get-rates.js
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

  const API_KEY = "3a8ce0acef-aaeef20681-t3vl30";
  const API_URL = "https://api.fastforex.io/fetch-multi";

  try {
    const currencies = "COP,VES,EUR";
    const response = await fetch(
      `${API_URL}?from=USD&to=${currencies}&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

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
