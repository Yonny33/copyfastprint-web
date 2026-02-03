document.addEventListener("DOMContentLoaded", function () {
    // --- ELEMENTOS DEL DOM ---
    const canvas = document.getElementById("c-upscale");
    const ctx = canvas.getContext("2d");
    const placeholder = document.getElementById("placeholder-text");
    const dimensionsInfo = document.getElementById("dimensions-info");

    const uploadInput = document.getElementById("img-upload-upscale");
    const scaleSelect = document.getElementById("scale-factor");
    const downloadBtn = document.getElementById("btn-download-upscale");
    const deleteBtn = document.getElementById("btn-delete-upscale");
    const resetBtn = document.getElementById("btn-reset-upscale");

    // --- ESTADO DE LA APLICACIÓN ---
    let originalImage = null;

    // --- EVENT LISTENERS ---

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
                processImage(); // Procesar la imagen al cargarla
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // Permitir subir el mismo archivo de nuevo
    });

    // Cambiar el factor de escala
    scaleSelect.addEventListener("change", function() {
        if (originalImage) {
            processImageWithLoading();
        }
    });

    // Botón Restaurar
    resetBtn.addEventListener("click", function () {
        if (originalImage) {
            scaleSelect.value = "2"; // Volver al valor por defecto
            processImageWithLoading();
        }
    });

    // Botón Eliminar
    deleteBtn.addEventListener("click", function () {
        originalImage = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
        placeholder.style.display = "block";
        dimensionsInfo.style.display = "none";
        uploadInput.value = "";
    });

    // Botón Descargar
    downloadBtn.addEventListener("click", function () {
        if (!originalImage) return;
        const scaleFactor = parseInt(scaleSelect.value, 10);
        const link = document.createElement("a");
        link.download = `imagen-escalada-${scaleFactor}x.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });

    // --- FUNCIÓN PRINCIPAL ---

    function processImageWithLoading() {
        showLoading("Escalando Imagen...");
        setTimeout(() => {
            processImage();
            hideLoading();
        }, 50);
    }

    function processImage() {
        if (!originalImage) return;

        const scaleFactor = parseInt(scaleSelect.value, 10);
        const newWidth = originalImage.width * scaleFactor;
        const newHeight = originalImage.height * scaleFactor;

        // Ajustar el tamaño del canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Configurar la calidad del re-muestreo para un mejor resultado
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Dibujar la imagen escalada en el canvas
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

        // Actualizar información de dimensiones
        dimensionsInfo.style.display = "inline-block";
        dimensionsInfo.innerHTML = `Original: <strong>${originalImage.width} x ${originalImage.height}px</strong> <i class="fas fa-arrow-right" style="margin:0 5px; font-size:0.8em;"></i> Nuevo: <strong>${newWidth} x ${newHeight}px</strong>`;
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