import '@/css/modules/_remove_bg.css';

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
    
    const bgBtns = document.querySelectorAll(".bg-btn");
    const btnAddColor = document.getElementById("btn-add-color");
    const customColorInput = document.getElementById("custom-bg-color");

    const undoBtn = document.getElementById("btn-undo");
    const resetBtn = document.getElementById("btn-reset");
    const downloadBtn = document.getElementById("btn-download");

    // --- CONFIGURACIÓN DE CURSORES PERSONALIZADOS ---
    // SVG de Varita Mágica en color rojo corporativo
    const wandCursor = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23460101' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m15 4 5 2'/%3E%3Cpath d='m17.7 11-5.3-5.3'/%3E%3Cpath d='m10.9 17.8-5.3-5.3'/%3E%3Cpath d='M7.2 21.4 2.1 16.3c-.6-.6-.6-1.6 0-2.2l2.8-2.8 5.3 5.3-2.8 2.8c-.6.6-1.6.6-2.2 0Z'/%3E%3Cpath d='M19 13l2 2'/%3E%3Cpath d='M10 2l2 2'/%3E%3Cpath d='M21 3l-2 2'/%3E%3Cpath d='M13 19l2 2'/%3E%3C/svg%3E\") 4 4, auto";

    // --- ESTADO DE LA APLICACIÓN ---
    let canvasZoom = 1.0;
    let originalImage = null;
    let originalFile = null;
    let history = [];
    const MAX_HISTORY = 10;
    let isWandActive = true;

    // --- EVENT LISTENERS ---
    initDraggableToolbar();

    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');

    if (btnZoomIn) btnZoomIn.addEventListener('click', () => updateCanvasZoom(0.1));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => updateCanvasZoom(-0.1));

    toleranceSlider.addEventListener("input", () => (toleranceValue.textContent = toleranceSlider.value));
    featherSlider.addEventListener("input", () => (featherValue.textContent = featherSlider.value));

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

    canvas.style.cursor = wandCursor;

    uploadInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        originalFile = file;

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                originalImage = img;
                canvasZoom = 1.0; // Reiniciar zoom al subir
                updateCanvasZoom(0);
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
        saveState();
        performWandAction(e);
    });

    // --- SOPORTE TÁCTIL (MÓVILES/TABLETS) ---
    canvas.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", { clientX: touch.clientX, clientY: touch.clientY });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener("mousemove", (e) => { /* No brush action needed */ });

    canvas.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", { clientX: touch.clientX, clientY: touch.clientY });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener("mouseup", () => {});
    canvas.addEventListener("mouseleave", () => {});

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

    function updateCanvasZoom(delta) {
        const canvasEl = document.getElementById('c');
        if (!canvasEl) return;

        canvasZoom = Math.max(0.2, Math.min(4, canvasZoom + delta));
        canvasEl.style.transform = `scale(${canvasZoom})`;
        canvasEl.style.transition = 'transform 0.2s ease-out';
    }

    // ==========================================================================
    // ===  LÓGICA DE TOOLBAR ARRASTRABLE  ===
    // ==========================================================================
    function initDraggableToolbar() {
        const toolbar = document.querySelector('.floating-toolbar');
        if (!toolbar) return;

        toolbar.style.top = '20%'; 
        toolbar.style.transform = 'none';

        if (!toolbar.querySelector('.toolbar-drag-handle')) {
            const handle = document.createElement('div');
            handle.className = 'toolbar-drag-handle';
            handle.innerHTML = '<i class="fas fa-grip-lines"></i>';
            toolbar.prepend(handle);

            let isDragging = false;
            let currentY;
            let initialY;
            let yOffset = 0;

            handle.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                initialY = e.clientY - yOffset;
                if (e.target === handle || handle.contains(e.target)) {
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentY = e.clientY - initialY;
                    yOffset = currentY;
                    toolbar.style.transform = `translateY(${currentY}px)`;
                }
            }

            function dragEnd() {
                isDragging = false;
            }
        }
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
