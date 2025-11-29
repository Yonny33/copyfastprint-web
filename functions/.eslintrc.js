module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    // Especifica la versión de JavaScript que vamos a usar.
    "ecmaVersion": 2020,
  },
  rules: {
    // Reglas que hemos ajustado:
    "quotes": ["error", "double"],
    "max-len": "off", // Desactiva la regla de longitud máxima de línea.
    "quote-props": "off", // Desactiva la regla sobre comillas en propiedades.
  },
};
