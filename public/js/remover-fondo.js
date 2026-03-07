document.addEventListener("DOMContentLoaded", function () {
    // --- ELEMENTOS DEL DOM ---
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const placeholder = document.getElementById("placeholder-text");

    const uploadInput = document.getElementById("img-upload");
    const toleranceSlider = document.getElementById("tolerance");
    const toleranceValue = document.getElementById("tolerance-val");
    const featherSlider = document.getElementById("feather");
    const featherValue = document.getElementById("feather-val");
    const contiguousCheckbox = document.getElementById("contiguous");
    
    const btnAI = document.getElementById("btn-ai");
    const toolBtns = document.querySelectorAll(".tool-btn");
    const brushSizeSlider = document.getElementById("brush-size");
    const brushSizeVal = document.getElementById("brush-size-val");
    const wandControls = document.querySelectorAll(".group-wand");
    const brushControls = document.querySelectorAll(".group-brush");
    const bgBtns = document.querySelectorAll(".bg-btn");
    const brushCursor = document.getElementById("brush-cursor");
    const btnAddColor = document.getElementById("btn-add-color");
    const customColorInput = document.getElementById("custom-bg-color");

    const undoBtn = document.getElementById("btn-undo");
    const resetBtn = document.getElementById("btn-reset");
    const downloadBtn = document.getElementById("btn-download");

    // --- ESTADO DE LA APLICACIÓN ---
    let originalImage = null;
    let originalFile = null;
    let history = [];
    const MAX_HISTORY = 10;
    let currentTool = 'wand';
    let isDrawing = false;
    let brushSize = 20;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // --- EVENT LISTENERS ---

    toleranceSlider.addEventListener("input", () => (toleranceValue.textContent = toleranceSlider.value));
    featherSlider.addEventListener("input", () => (featherValue.textContent = featherSlider.value));
    brushSizeSlider.addEventListener("input", () => {
        brushSize = parseInt(brushSizeSlider.value, 10);
        brushSizeVal.textContent = brushSize + "px";
        if (currentTool === 'eraser') {
            updateBrushCursor({ clientX: lastMouseX, clientY: lastMouseY });
        }
    });

    toolBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (btn.id === "btn-ai") {
                if (!originalImage) {
                    alert("Por favor, sube una imagen primero para usar la IA.");
                    return;
                }
                runAI();
                return;
            }

            toolBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (btn.id === "tool-wand") {
                currentTool = 'wand';
                canvas.style.cursor = "crosshair";
                brushCursor.style.display = "none";
                wandControls.forEach(el => el.style.display = "flex");
                brushControls.forEach(el => el.style.display = "none");
            } else {
                currentTool = 'eraser';
                canvas.style.cursor = "none";
                wandControls.forEach(el => el.style.display = "none");
                brushControls.forEach(el => el.style.display = "flex");
            }
        });
    });

    bgBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.id === "btn-add-color") return;
            bgBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const bg = btn.dataset.bg;
            if (bg === "checker") {
                canvas.style.backgroundImage = "";
                canvas.style.backgroundColor = "";
            } else {
                canvas.style.backgroundImage = "none";
                canvas.style.backgroundColor = bg;
            }
        });
    });

    if (btnAddColor && customColorInput) {
        btnAddColor.addEventListener("click", () => customColorInput.click());
        customColorInput.addEventListener("input", (e) => {
            const color = e.target.value;
            canvas.style.backgroundImage = "none";
            canvas.style.backgroundColor = color;
            bgBtns.forEach(b => b.classList.remove("active"));
            btnAddColor.classList.add("active");
            btnAddColor.style.backgroundColor = color;
        });
    }

    uploadInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        originalFile = file;

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                originalImage = img;
                resetCanvas();
                placeholder.style.display = "none";
                canvas.style.display = "block";
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    });

    // --- MANEJO DEL CANVAS ---
    canvas.addEventListener("mousedown", function(e) {
        if (!originalImage) return;
        isDrawing = true;
        saveState();

        if (currentTool === 'wand') {
            performWandAction(e);
            isDrawing = false;
        } else {
            performBrushAction(e);
        }
    });

    canvas.addEventListener("mousemove", function(e) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        updateBrushCursor(e);
        if (!isDrawing || !originalImage) return;
        if (currentTool !== 'wand') {
            performBrushAction(e);
        }
    });

    canvas.addEventListener("mouseup", () => { isDrawing = false; });
    canvas.addEventListener("mouseleave", () => { isDrawing = false; brushCursor.style.display = "none"; });

    function updateBrushCursor(e) {
        if (currentTool !== 'eraser' || !originalImage) {
            brushCursor.style.display = "none";
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const visualSize = brushSize / scaleX;
        brushCursor.style.width = visualSize + "px";
        brushCursor.style.height = visualSize + "px";
        brushCursor.style.left = e.clientX + "px";
        brushCursor.style.top = e.clientY + "px";
        brushCursor.style.display = "block";
    }

    function saveState() {
        const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        history.push(currentImageData);
        if (history.length > MAX_HISTORY) history.shift();
        undoBtn.disabled = false;
    }

    undoBtn.addEventListener("click", function () {
        if (history.length > 0) {
            const lastState = history.pop();
            ctx.putImageData(lastState, 0, 0);
        }
        undoBtn.disabled = history.length === 0;
    });

    resetBtn.addEventListener("click", resetCanvas);

    downloadBtn.addEventListener("click", function () {
        if (!originalImage) return;
        const link = document.createElement("a");
        link.download = "imagen-sin-fondo.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });

    // --- FUNCIONES PRINCIPALES ---

    function performWandAction(e) {
        const tolerance = parseInt(toleranceSlider.value, 10);
        const contiguous = contiguousCheckbox.checked;
        const feather = parseInt(featherSlider.value, 10);
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);
        
        let workingImageData = floodFill(ctx.getImageData(0, 0, canvas.width, canvas.height), x, y, tolerance, contiguous);
        if (feather > 0) workingImageData = applyFeather(workingImageData, feather);
        ctx.putImageData(workingImageData, 0, 0);
    }

    function performBrushAction(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.closePath();

        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    async function runAI() {
        if (!originalImage) return;
        
        // Comprobar si la librería ya está cargada globalmente
        if (typeof imglyRemoveBackground === 'undefined') {
            showLoading("Descargando motor de IA...");
            try {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    // URL ACTUALIZADA a la versión 1.6.0, que es más reciente y estable
                    script.src = "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.6.0/dist/imgly-background-removal.umd.js";
                    script.crossOrigin = "anonymous";
                    script.onload = resolve;
                    script.onerror = (err) => reject(new Error(`Error al cargar el script de la IA: ${err.message}`));
                    document.head.appendChild(script);
                });
            } catch (e) {
                console.error(e);
                hideLoading();
                alert(`La librería de IA no se pudo cargar. Verifica tu conexión a internet o intenta recargar la página.\nError: ${e.message}`);
                return;
            }
        }

        saveState();
        showLoading("IA Analizando Imagen...");

        try {
            // Configuración para que la IA encuentre sus modelos (apuntando a la v1.6.0)
            const config = {
                publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.6.0/dist/",
            };

            const source = originalFile || originalImage.src;
            const blob = await imglyRemoveBackground(source, config);
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url); // Liberar memoria
                hideLoading();
            };
            img.onerror = (err) => {
                 console.error("Error al cargar la imagen procesada por la IA:", err);
                 alert("Hubo un error al mostrar la imagen procesada.");
                 hideLoading();
            }
            img.src = url;

        } catch (error) {
            console.error("Error durante el procesamiento con IA:", error);
            alert(`Se produjo un error al procesar la imagen con la IA: ${error.message}\n\nRevisa la consola para más detalles.`);
            hideLoading();
        }
    }

    function resetCanvas() {
        if (!originalImage) return;
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);
        history = [];
        undoBtn.disabled = true;
    }

    function colorMatch(c1, c2, tolerance) {
        const diff = Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2));
        return diff <= (tolerance / 100) * 441.67;
    }

    function floodFill(imageData, x, y, tolerance, contiguous) {
        const { width, height, data } = imageData;
        const targetColor = [data[(y * width + x) * 4], data[(y * width + x) * 4 + 1], data[(y * width + x) * 4 + 2]];

        if (!contiguous) {
            for (let i = 0; i < data.length; i += 4) {
                if (colorMatch(targetColor, [data[i], data[i+1], data[i+2]], tolerance)) {
                    data[i + 3] = 0;
                }
            }
            return imageData;
        }

        const visited = new Uint8Array(width * height);
        const stack = [[x, y]];
        while (stack.length) {
            const [curX, curY] = stack.pop();
            const pos = (curY * width + curX);
            if (visited[pos] || curX < 0 || curX >= width || curY < 0 || curY >= height) continue;

            const pixelPos = pos * 4;
            if (colorMatch(targetColor, [data[pixelPos], data[pixelPos+1], data[pixelPos+2]], tolerance)) {
                data[pixelPos + 3] = 0;
                visited[pos] = 1;
                stack.push([curX - 1, curY], [curX + 1, curY], [curX, curY - 1], [curX, curY + 1]);
            }
        }
        return imageData;
    }

    function applyFeather(imageData, featherAmount) {
        const { width, height, data } = imageData;
        const alphaChannel = new Uint8ClampedArray(width * height);
        for (let i = 0; i < alphaChannel.length; i++) alphaChannel[i] = data[i * 4 + 3];

        const tempAlpha = new Uint8ClampedArray(alphaChannel.length);

        // Box Blur (Horizontal + Vertical)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let total = 0, count = 0;
                for (let i = -featherAmount; i <= featherAmount; i++) {
                    if (x + i >= 0 && x + i < width) { total += alphaChannel[y * width + x + i]; count++; }
                }
                tempAlpha[y * width + x] = total / count;
            }
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let total = 0, count = 0;
                for (let i = -featherAmount; i <= featherAmount; i++) {
                    if (y + i >= 0 && y + i < height) { total += tempAlpha[(y + i) * width + x]; count++; }
                }
                data[(y * width + x) * 4 + 3] = total / count;
            }
        }
        return imageData;
    }

    function showLoading(text) {
        let overlay = document.getElementById('tool-loader');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tool-loader';
            overlay.className = 'tool-loading-overlay';
            overlay.innerHTML = `<div class="tool-spinner"></div><div class="tool-loading-text">${text}</div>`;
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
