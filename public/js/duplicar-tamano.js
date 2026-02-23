document.addEventListener("DOMContentLoaded", function () {
    // --- ELEMENTOS DEL DOM ---
    const canvas = document.getElementById("c-upscale");
    const ctx = canvas.getContext("2d");
    const placeholder = document.getElementById("placeholder-text");

    const uploadInput = document.getElementById("img-upload-upscale");
    const scaleFactorSelect = document.getElementById("scale-factor");
    const dimensionsInfo = document.getElementById("dimensions-info");
    
    const downloadBtn = document.getElementById("btn-download-upscale");
    const resetBtn = document.getElementById("btn-reset-upscale");
    const deleteBtn = document.getElementById("btn-delete-upscale");

    // --- ESTADO DE LA APLICACIÓN ---
    let originalImage = null;
    let upscaledImageSrc = null;
    let upscaler = null;
    let isProcessing = false;

    // --- INICIALIZACIÓN ---
    // Inicializar el upscaler de forma perezosa la primera vez que se necesite
    function getUpscaler() {
        if (!upscaler) {
            // Usamos un modelo por defecto que es bueno para arte general y fotos.
            // Los modelos se descargan automáticamente la primera vez.
            upscaler = new Upscaler({ model: 'esrgan-thick' });
        }
        return upscaler;
    }

    // --- EVENT LISTENERS ---
    uploadInput.addEventListener("change", handleImageUpload);
    scaleFactorSelect.addEventListener("change", () => {
        if (originalImage) {
            runUpscale();
        }
    });
    downloadBtn.addEventListener("click", handleDownload);
    resetBtn.addEventListener("click", handleReset);
    deleteBtn.addEventListener("click", handleDelete);

    // --- FUNCIONES PRINCIPALES ---

    // Nueva función para cargar y pre-procesar la imagen de forma segura
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const MAX_DIMENSION = 1500; // Límite de píxeles (ancho o alto)
                // Si la imagen es más grande que el límite, la reducimos para evitar errores de memoria.
                if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
                    console.warn(`Imagen grande detectada (${img.width}x${img.height}). Reduciendo tamaño para estabilidad.`);
                    
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    let newWidth, newHeight;
                    if (img.width > img.height) {
                        newWidth = MAX_DIMENSION;
                        newHeight = (img.height * MAX_DIMENSION) / img.width;
                    } else {
                        newHeight = MAX_DIMENSION;
                        newWidth = (img.width * MAX_DIMENSION) / img.height;
                    }
                    
                    tempCanvas.width = newWidth;
                    tempCanvas.height = newHeight;
                    tempCtx.drawImage(img, 0, 0, newWidth, newHeight);
                    
                    // Creamos una nueva imagen a partir del canvas reducido
                    const downscaledImg = new Image();
                    downscaledImg.onload = () => resolve(downscaledImg);
                    downscaledImg.onerror = reject;
                    downscaledImg.src = tempCanvas.toDataURL();
                } else {
                    // La imagen tiene un tamaño aceptable, la usamos directamente
                    resolve(img);
                }
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function (event) {
            try {
                showLoading("Cargando imagen...");
                originalImage = await loadImage(event.target.result);
                placeholder.style.display = "none";
                canvas.style.display = "block";
                runUpscale(); // Ejecutar el primer upscale al subir
            } catch (error) {
                console.error("Error al cargar la imagen:", error);
                alert("Hubo un problema al cargar el archivo de imagen. Intenta con otra imagen.");
                hideLoading();
            }
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // Permitir subir el mismo archivo de nuevo
    }

    async function runUpscale() {
        if (!originalImage || isProcessing) return;

        isProcessing = true;
        showLoading("Ampliando con IA...");

        try {
            const upscalerInstance = getUpscaler();
            const scale = parseInt(scaleFactorSelect.value, 10);
            
            const progressCallback = (progress) => {
                showLoading(`Ampliando con IA... ${Math.round(progress * 100)}%`);
            };

            upscaledImageSrc = await upscalerInstance.upscale(originalImage, {
                output: 'src',
                patchSize: 64, // Ajustes para mejor rendimiento
                padding: 2,
                scale: scale, // Pasar el factor de escala
                progress: progressCallback
            });

            drawImageToCanvas(upscaledImageSrc);

        } catch (error) {
            console.error("Error durante el upscale:", error);
            alert("Ocurrió un error al ampliar la imagen. Puede que sea demasiado grande para la memoria del navegador.");
        } finally {
            isProcessing = false;
            hideLoading();
        }
    }

    function drawImageToCanvas(src) {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            updateDimensionsInfo(img.width, img.height);
        };
        img.src = src;
    }

    function handleDownload() {
        if (!upscaledImageSrc) {
            alert("No hay imagen ampliada para descargar.");
            return;
        }
        const link = document.createElement("a");
        link.download = `imagen-ampliada-${Date.now()}.png`;
        link.href = upscaledImageSrc;
        link.click();
    }

    function handleReset() {
        if (!originalImage) return;
        // Restaura al valor por defecto (2x) y re-ejecuta
        scaleFactorSelect.value = "2";
        runUpscale();
    }

    function handleDelete() {
        originalImage = null;
        upscaledImageSrc = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
        placeholder.style.display = "block";
        dimensionsInfo.style.display = "none";
        uploadInput.value = "";
    }

    function updateDimensionsInfo(width, height) {
        dimensionsInfo.textContent = `Nuevo tamaño: ${width} x ${height} px`;
        dimensionsInfo.style.display = "inline-block";
    }

    // --- FUNCIONES DE UI (CARGA) ---
    // (Asumimos que estas funciones existen en un script global o las defines aquí)
    function showLoading(text) {
        let overlay = document.getElementById('tool-loader');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tool-loader';
            overlay.className = 'tool-loading-overlay';
            overlay.innerHTML = `
                <div class="tool-spinner"></div>
                <div class="tool-loading-text">${text}</div>
            `;
            document.body.appendChild(overlay);
        } else {
            overlay.querySelector('.tool-loading-text').textContent = text;
            overlay.style.display = 'flex';
        }
    }

    function hideLoading() {
        const overlay = document.getElementById('tool-loader');
        if (overlay) overlay.style.display = 'none';
    }
});