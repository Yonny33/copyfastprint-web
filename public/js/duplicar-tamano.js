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
    let isProcessing = false; // Para evitar ejecuciones simultáneas

    // --- EVENT LISTENERS ---
    uploadInput.addEventListener("change", handleImageUpload);
    scaleFactorSelect.addEventListener("change", () => {
        if (originalImage) {
            runScale();
        }
    });
    downloadBtn.addEventListener("click", handleDownload);
    resetBtn.addEventListener("click", handleReset);
    deleteBtn.addEventListener("click", handleDelete);

    // --- FUNCIONES PRINCIPALES ---

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                originalImage = img;
                placeholder.style.display = "none";
                canvas.style.display = "block";
                runScale(); // Ejecutar el primer escalado al subir
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // Permitir subir el mismo archivo de nuevo
    }

    function runScale() {
        if (!originalImage || isProcessing) return;

        isProcessing = true;
        showLoading("Procesando imagen...");

        // Usamos un setTimeout para que el navegador muestre el "cargando"
        // antes de hacer el trabajo pesado de dibujar en el canvas.
        setTimeout(() => {
            try {
                const scale = parseInt(scaleFactorSelect.value, 10);
                const newWidth = originalImage.width * scale;
                const newHeight = originalImage.height * scale;

                // Ajustar el tamaño del canvas a la nueva resolución
                canvas.width = newWidth;
                canvas.height = newHeight;

                // Activar el suavizado de imagen del navegador para mejor calidad
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Dibujar la imagen original estirada en el canvas más grande
                ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

                updateDimensionsInfo(newWidth, newHeight);

            } catch (error) {
                console.error("Error durante el escalado:", error);
                alert("Ocurrió un error al procesar la imagen.");
            } finally {
                isProcessing = false;
                hideLoading();
            }
        }, 50); // Pequeña demora para mejorar la experiencia de usuario
    }

    function handleDownload() {
        if (!originalImage) {
            alert("No hay imagen para descargar.");
            return;
        }
        const link = document.createElement("a");
        link.download = `imagen-ampliada-${Date.now()}.png`;
        // toDataURL() exportará el contenido actual del canvas
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    function handleReset() {
        if (!originalImage) return;
        // Restaura al valor por defecto (2x) y re-ejecuta
        scaleFactorSelect.value = "2";
        runScale();
    }

    function handleDelete() {
        originalImage = null;
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