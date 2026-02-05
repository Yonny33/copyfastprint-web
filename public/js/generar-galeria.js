const fs = require("fs");
const path = require("path");

// --- CONFIGURACIÓN ---
// Ajusta esta ruta si es necesario.
// Si el script está en public/js/, subimos un nivel para llegar a public/
const PUBLIC_DIR = path.join(__dirname, "..");
const IMG_BASE_DIR = "img/sueteres";
const FULL_IMG_DIR = path.join(PUBLIC_DIR, IMG_BASE_DIR);

// Mapeo de carpetas a categorías del HTML (data-category)
const CATEGORY_MAP = {
  "diseños-jesus": "camisetas",
  "diseños-leon": "camisetas",
  "diseño-mujeres": "camisetas",
};

function generateHTML() {
  console.log(`🔍 Escaneando imágenes en: ${FULL_IMG_DIR}\n`);

  if (!fs.existsSync(FULL_IMG_DIR)) {
    console.error(`❌ Error: No se encuentra la carpeta ${FULL_IMG_DIR}`);
    return;
  }

  let htmlOutput = "";

  // 1. Leer carpetas principales (diseños-jesus, diseños-leon, etc.)
  const mainFolders = fs
    .readdirSync(FULL_IMG_DIR)
    .filter((f) => fs.statSync(path.join(FULL_IMG_DIR, f)).isDirectory());

  mainFolders.forEach((folder) => {
    const folderPath = path.join(FULL_IMG_DIR, folder);
    const category = CATEGORY_MAP[folder] || "varios";

    // 2. Leer subcarpetas de productos (ej: alas-refugio-cruz)
    const productFolders = fs
      .readdirSync(folderPath)
      .filter((f) => fs.statSync(path.join(folderPath, f)).isDirectory());

    // También buscar imágenes sueltas en la carpeta principal (caso diseño-mujeres)
    const looseImages = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

    // A. Procesar imágenes sueltas
    looseImages.forEach((img) => {
      const imgPath = path.join(IMG_BASE_DIR, folder, img).replace(/\\/g, "/");
      const title = formatTitle(img);
      htmlOutput += createCard(category, imgPath, title, "Diseño exclusivo.");
    });

    // B. Procesar carpetas de productos (con 3 imágenes dentro)
    productFolders.forEach((prodFolder) => {
      const prodPath = path.join(folderPath, prodFolder);
      const imageFiles = fs
        .readdirSync(prodPath)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort(); // Ordenar para consistencia

      if (imageFiles.length > 0) {
        const imagePaths = imageFiles.map((img) =>
          path.join(IMG_BASE_DIR, folder, prodFolder, img).replace(/\\/g, "/"),
        );
        const title = formatTitle(prodFolder);
        htmlOutput += createSliderCard(
          category,
          imagePaths,
          title,
          "Haz clic para ver todas las vistas disponibles.",
        );
      }
    });
  });

  console.log(htmlOutput);
  console.log(
    "\n✅ ¡Listo! Copia el código HTML de arriba y pégalo en public/diseño.html dentro de <div class='gallery-grid'>",
  );
}

function createCard(category, src, title, desc) {
  // Tarjeta simple para imágenes sin variaciones
  return `            <div class="design-card" data-category="${category}">
                <div class="card-image-wrapper">
                    <img src="/${src}" alt="${title}" class="card-image" loading="lazy">
                </div>
                <div class="card-info-overlay">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                </div>
            </div>\n`;
}

function createSliderCard(category, images, title, desc) {
  // Tarjeta interactiva para productos con múltiples imágenes
  const firstImage = images[0];
  const allImagesJson = JSON.stringify(images.map((img) => `/${img}`));

  return `            <div class="design-card" data-category="${category}" data-images='${allImagesJson}'>
                <div class="card-image-wrapper">
                    <img src="/${firstImage}" alt="${title}" class="card-image" loading="lazy">
                </div>
                <div class="card-info-overlay">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                </div>
            </div>\n`;
}

function formatTitle(filename) {
  // Eliminar extensión y guiones
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

generateHTML();
