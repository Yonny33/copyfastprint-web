document.addEventListener("DOMContentLoaded", function () {
    // --- ELEMENTOS DEL DOM ---
    const canvas = document.getElementById("c-borders");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const placeholder = document.getElementById("placeholder-text");
    const canvasWrapper = document.getElementById("canvas-wrapper");

    const uploadInput = document.getElementById("img-upload-borders");
    const featherSlider = document.getElementById("feather-strength");
    const featherValue = document.getElementById("feather-strength-val");
    const downloadBtn = document.getElementById("btn-download-borders");
    const deleteBtn = document.getElementById("btn-delete-borders");
    const fixHaloBtn = document.getElementById("btn-fix-halo");
    const haloContainer = document.getElementById("halo-warning-container");
    const zoomInBtn = document.getElementById("btn-zoom-in");
    const zoomOutBtn = document.getElementById("btn-zoom-out");

    // --- ESTADO DE LA APLICACIÓN ---
    let originalImage = null;
    let currentZoom = 1.0;

    // --- EVENT LISTENERS ---

    // Actualizar valor del slider y reprocesar la imagen
    featherSlider.addEventListener("input", () => {
        if (featherValue) featherValue.textContent = featherSlider.value;
        if (originalImage) {
            processImage();
        }
    });

    // Subir imagen
    uploadInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                originalImage = img;
                placeholder.style.display = "none";
                canvas.style.display = "block";
                resetZoom(); // Reiniciar zoom al cargar nueva imagen
                processImage(); // Procesar la imagen por primera vez
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // Permitir subir el mismo archivo de nuevo
    });

    // Botones de Zoom
    zoomInBtn.addEventListener("click", () => {
        updateZoom(0.1);
    });

    zoomOutBtn.addEventListener("click", () => {
        updateZoom(-0.1);
    });

    // Botón Eliminar
    deleteBtn.addEventListener("click", function () {
        originalImage = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
        placeholder.style.display = "block";
        // Restaurar estilos del canvas
        canvas.style.filter = "none"; // Quitar filtro de silueta
        resetZoom();
        haloContainer.style.display = "none";
        uploadInput.value = "";
    });

    // Botón Corregir Halo
    fixHaloBtn.addEventListener("click", function () {
        if (!originalImage) return;
        cleanHalo();
        // Actualizar UI a verde
        updateHaloUI(false);
    });

    // Botón Descargar
    downloadBtn.addEventListener("click", function () {
        if (!originalImage) return;
        const link = document.createElement("a");
        link.download = "imagen-bordes-suaves.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });

    // --- FUNCIONES PRINCIPALES ---

    function processImage() {
        if (!originalImage) return;

        const featherAmount = parseInt(featherSlider.value, 10);

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);

        if (featherAmount > 0) {
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            imageData = applyFeather(imageData, featherAmount);
            ctx.putImageData(imageData, 0, 0);
        }

        // Detectar Halo después del procesamiento
        const hasHalo = detectHalo();
        updateHaloUI(hasHalo);
    }

    function applyFeather(imageData, featherAmount) {
        const { width, height, data } = imageData;
        const alphaChannel = new Uint8ClampedArray(width * height);
        for (let i = 0; i < alphaChannel.length; i++) {
            alphaChannel[i] = data[i * 4 + 3];
        }

        const tempAlpha = new Uint8ClampedArray(alphaChannel.length);

        // Pasada Horizontal (Box Blur)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let total = 0, count = 0;
                for (let i = -featherAmount; i <= featherAmount; i++) {
                    const xi = x + i;
                    if (xi >= 0 && xi < width) {
                        total += alphaChannel[y * width + xi];
                        count++;
                    }
                }
                tempAlpha[y * width + x] = total / count;
            }
        }

        // Pasada Vertical (Box Blur) y aplicar al imageData original
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let total = 0, count = 0;
                for (let i = -featherAmount; i <= featherAmount; i++) {
                    const yi = y + i;
                    if (yi >= 0 && yi < height) {
                        total += tempAlpha[yi * width + x];
                        count++;
                    }
                }
                data[(y * width + x) * 4 + 3] = total / count;
            }
        }
        return imageData;
    }

    // --- FUNCIONES DE DETECCIÓN Y LIMPIEZA ---

    function detectHalo() {
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let semiTransparentCount = 0;

        // Contar píxeles semitransparentes (Alpha entre 10 y 250)
        // Estos son los que causan el borde blanco sucio en DTF
        for (let i = 3; i < data.length; i += 4) {
            const alpha = data[i];
            if (alpha > 10 && alpha < 250) {
                semiTransparentCount++;
            }
        }

        // Si hay más de un 0.05% de píxeles sucios, se considera Halo
        return semiTransparentCount > (width * height * 0.0005);
    }

    function updateHaloUI(hasHalo) {
        if (hasHalo) {
            // Aplicar borde y resplandor directamente al canvas (objeto)
            // Usamos drop-shadow para que el borde siga la silueta de la imagen (transparencia)
            canvas.style.filter = "drop-shadow(0 0 2px #8b0000) drop-shadow(0 0 4px #8b0000)"; 
            haloContainer.style.display = "block";
        } else {
            // Borde verde al objeto
            canvas.style.filter = "drop-shadow(0 0 2px #28a745) drop-shadow(0 0 4px #28a745)";
            haloContainer.style.display = "none";
        }
    }

    function cleanHalo() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 3; i < data.length; i += 4) {
            // Limpieza agresiva: Si no es casi opaco (>250), se vuelve transparente (0)
            if (data[i] < 250) {
                data[i] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        
        // Actualizar la imagen original para que futuros ajustes de slider partan de la imagen limpia
        const newImg = new Image();
        newImg.onload = function() {
            originalImage = newImg;
        };
        newImg.src = canvas.toDataURL();
    }

    // --- FUNCIONES DE ZOOM ---
    function updateZoom(change) {
        if (!originalImage) return;
        currentZoom = Math.max(0.1, Math.min(5.0, currentZoom + change)); // Limitar entre 0.1x y 5x
        // Cambiamos el tamaño visual (CSS) manteniendo la resolución interna
        canvas.style.width = (canvas.width * currentZoom) + "px";
    }

    function resetZoom() {
        currentZoom = 1.0;
        canvas.style.width = "auto"; // Restaurar tamaño natural
    }
});