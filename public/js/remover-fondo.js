document.addEventListener("DOMContentLoaded", function () {
    // --- ELEMENTOS DEL DOM ---
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const placeholder = document.getElementById("placeholder-text");

    const uploadInput = document.getElementById("img-upload");
    const toleranceSlider = document.getElementById("tolerance");
    const toleranceValue = document.getElementById("tolerance-val");
    const featherSlider = document.getElementById("feather"); // NUEVO
    const featherValue = document.getElementById("feather-val"); // NUEVO
    const contiguousCheckbox = document.getElementById("contiguous");
    
    // Nuevos controles
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
    let originalFile = null; // Guardamos el archivo original para la IA
    let history = [];
    const MAX_HISTORY = 10;
    let currentTool = 'wand'; // 'wand', 'eraser'
    let isDrawing = false;
    let brushSize = 20;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // --- EVENT LISTENERS ---

    // Actualizar valor de los sliders
    toleranceSlider.addEventListener("input", () => (toleranceValue.textContent = toleranceSlider.value));
    featherSlider.addEventListener("input", () => (featherValue.textContent = featherSlider.value)); // NUEVO
    brushSizeSlider.addEventListener("input", () => {
        brushSize = parseInt(brushSizeSlider.value, 10);
        brushSizeVal.textContent = brushSize + "px";
        if (currentTool === 'eraser') {
            updateBrushCursor({ clientX: lastMouseX, clientY: lastMouseY });
        }
    });

    // Selector de Herramientas
    toolBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Si es el botón de IA, ejecutar acción directa
            if (btn.id === "btn-ai") {
                if (!originalImage) {
                    alert("Por favor, sube una imagen primero para usar la IA.");
                    return;
                }
                runAI();
                return;
            }

            // Actualizar UI activa
            toolBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Cambiar herramienta
            if (btn.id === "tool-wand") {
                currentTool = 'wand';
                canvas.style.cursor = "crosshair";
                brushCursor.style.display = "none";
                wandControls.forEach(el => el.style.display = "flex");
                brushControls.forEach(el => el.style.display = "none");
            } else {
                currentTool = 'eraser';
                canvas.style.cursor = "none"; // Ocultamos el puntero normal
                wandControls.forEach(el => el.style.display = "none");
                brushControls.forEach(el => el.style.display = "flex");
            }
        });
    });

    // Selector de Fondo
    bgBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.id === "btn-add-color") return; // El botón + se maneja aparte
            bgBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const bg = btn.dataset.bg;
            if (bg === "checker") {
                canvas.style.backgroundImage = ""; // Volver al CSS por defecto
                canvas.style.backgroundColor = "";
            } else {
                canvas.style.backgroundImage = "none";
                canvas.style.backgroundColor = bg;
            }
        });
    });

    // Botón "+" para más colores
    if (btnAddColor && customColorInput) {
        btnAddColor.addEventListener("click", () => {
            customColorInput.click(); // Abrir selector nativo
        });

        customColorInput.addEventListener("input", (e) => {
            const color = e.target.value;
            canvas.style.backgroundImage = "none";
            canvas.style.backgroundColor = color;
            
            // Marcar el botón + como activo y pintarlo del color seleccionado
            bgBtns.forEach(b => b.classList.remove("active"));
            btnAddColor.classList.add("active");
            btnAddColor.style.backgroundColor = color;
        });
    }

    // Subir imagen
    uploadInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        originalFile = file; // Guardar referencia al archivo para la IA

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

    // --- MANEJO DEL CANVAS (DIBUJO Y CLIC) ---
    
    canvas.addEventListener("mousedown", function(e) {
        if (!originalImage) return;
        isDrawing = true;
        saveState(); // Guardar estado antes de modificar

        if (currentTool === 'wand') {
            // La varita mágica actúa al hacer clic (mousedown)
            performWandAction(e);
            isDrawing = false; // La varita es instantánea, no arrastrable
        } else {
            // Borrador o Restaurar
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

    canvas.addEventListener("mouseup", function() {
        isDrawing = false;
    });
    
    canvas.addEventListener("mouseleave", function() {
        isDrawing = false;
        brushCursor.style.display = "none";
    });

    // --- FUNCIONES DE CURSOR ---
    function updateBrushCursor(e) {
        if (currentTool !== 'eraser' || !originalImage) {
            brushCursor.style.display = "none";
            return;
        }

        const rect = canvas.getBoundingClientRect();
        // Factor de escala visual (si la imagen se ve más pequeña que su tamaño real)
        const scaleX = canvas.width / rect.width;
        
        // El tamaño visual del cursor debe ser el tamaño real dividido por la escala
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

    // Botón Deshacer
    undoBtn.addEventListener("click", function () {
        if (history.length > 0) {
            const lastState = history.pop();
            ctx.putImageData(lastState, 0, 0);
        }
        undoBtn.disabled = history.length === 0;
    });

    // Botón Reset
    resetBtn.addEventListener("click", resetCanvas);

    // Botón Descargar
    downloadBtn.addEventListener("click", function () {
        if (!originalImage) return;
        const link = document.createElement("a");
        link.download = "imagen-sin-fondo.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });

    // --- FUNCIONES PRINCIPALES ---

    // 1. Acción de Varita Mágica
    function performWandAction(e) {
        const tolerance = parseInt(toleranceSlider.value, 10);
        const contiguous = contiguousCheckbox.checked;
        const feather = parseInt(featherSlider.value, 10);

        const rect = canvas.getBoundingClientRect();
        // Calcular escala por si el canvas está redimensionado por CSS
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);
        
        // Obtener datos actuales
        const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const targetColor = ctx.getImageData(x, y, 1, 1).data;

        // Clonar para procesar
        let workingImageData = new ImageData(
            new Uint8ClampedArray(currentImageData.data),
            currentImageData.width,
            currentImageData.height
        );

        // Algoritmo Flood Fill
        workingImageData = floodFill(workingImageData, x, y, targetColor, tolerance, contiguous);
        
        if (feather > 0) {
            workingImageData = applyFeather(workingImageData, feather);
        }

        ctx.putImageData(workingImageData, 0, 0);
    }

    // 2. Acción de Pincel (Borrador / Restaurar)
    function performBrushAction(e) {
        const rect = canvas.getBoundingClientRect();
        // Calcular escala por si el canvas está redimensionado por CSS
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

    // 3. Acción de IA Automática
    async function runAI() {
        if (!originalImage) {
            alert("Por favor, sube una imagen primero para usar la IA.");
            return;
        }
        
        // Verificar si la librería cargó
        if (typeof imglyRemoveBackground === 'undefined') {
            alert("La librería de IA no se pudo cargar. Verifica tu conexión a internet o intenta recargar la página.");
            return;
        }

        saveState();
        showLoading("IA Analizando Imagen...");

        try {
            // Configuración necesaria para que la IA encuentre sus modelos en la nube
            const config = {
                publicPath: "https://unpkg.com/@imgly/background-removal-data@1.5.5/dist/",
                debug: true // Ayuda a ver errores en consola si los hay
            };

            // Usamos originalFile si existe (más rápido/eficiente), si no, el src
            const source = originalFile || originalImage.src;
            const blob = await imglyRemoveBackground(source, config);
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url);
                hideLoading();
            };
            img.src = url;
        } catch (error) {
            console.error("Error IA:", error);
            alert("Error al procesar con IA: " + error.message + "\nIntenta con la varita mágica.");
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
        const diff = Math.sqrt(
            Math.pow(c1[0] - c2[0], 2) +
            Math.pow(c1[1] - c2[1], 2) +
            Math.pow(c1[2] - c2[2], 2)
        );
        return diff <= (tolerance / 100) * 441.67; // Escalar tolerancia a rango RGB
    }

    function floodFill(imageData, x, y, targetColor, tolerance, contiguous) {
        const { width, height, data } = imageData;
        const visited = new Uint8Array(width * height);
        const stack = [[x, y]];

        const startPos = (y * width + x) * 4;
        const startColor = [data[startPos], data[startPos + 1], data[startPos + 2]];

        if (!contiguous) {
            for (let i = 0; i < data.length; i += 4) {
                const currentColor = [data[i], data[i + 1], data[i + 2]];
                if (colorMatch(startColor, currentColor, tolerance)) {
                    data[i + 3] = 0; // Hacer transparente
                }
            }
            return imageData;
        }

        while (stack.length) {
            const [curX, curY] = stack.pop();
            const pos = (curY * width + curX);
            if (visited[pos] || curX < 0 || curX >= width || curY < 0 || curY >= height) continue;

            const pixelPos = pos * 4;
            const currentColor = [data[pixelPos], data[pixelPos + 1], data[pixelPos + 2]];

            if (colorMatch(startColor, currentColor, tolerance)) {
                data[pixelPos + 3] = 0; // Hacer transparente
                visited[pos] = 1;

                stack.push([curX - 1, curY]);
                stack.push([curX + 1, curY]);
                stack.push([curX, curY - 1]);
                stack.push([curX, curY + 1]);
            }
        }
        return imageData;
    }

    // --- NUEVA FUNCIÓN DE SUAVIZADO DE BORDES ---
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

        // Pasada Vertical (Box Blur)
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