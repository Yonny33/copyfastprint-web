document.addEventListener("DOMContentLoaded", function () {
    // --- DOM ELEMENTS ---
    const uploadInput = document.getElementById("img-upload-split");
    const outputContainer = document.getElementById("output-container");
    const initialMessage = document.getElementById("initial-message");
    const splitInfo = document.getElementById("split-info");

    // Config Inputs
    const inputDesignWidth = document.getElementById("design-width-mm");
    const inputPaperWidth = document.getElementById("paper-width");
    const inputPaperHeight = document.getElementById("paper-height");
    const inputOverlap = document.getElementById("overlap");
    const chkAutoTrim = document.getElementById("auto-trim");
    const inputPrintMargin = document.getElementById("print-margin-mm");

    // Action Buttons
    const btnProcessAction = document.getElementById("btn-process-action");
    const btnRotate = document.getElementById("btn-rotate");
    const btnClear = document.getElementById("btn-clear-split");
    const btnDownloadAll = document.getElementById("btn-download-all");

    // --- STATE ---
    let sourceImg = null;
    let workingImg = null;
    let rotation = 0;
    let hiresDownloads = [];
    let currentMode = null; // 'SPLIT' or 'FIT'
    let splitLayout = {};
    let REAL_PX_PER_MM = 0;

    // --- EVENT LISTENERS ---
    uploadInput.addEventListener("change", handleImageUpload);
    inputDesignWidth.addEventListener("input", calculateLayout);
    inputOverlap.addEventListener("change", calculateLayout);
    inputPrintMargin.addEventListener("change", calculateLayout);
    chkAutoTrim.addEventListener("change", handleImageUpload);
    btnProcessAction.addEventListener("click", processImage);
    btnRotate.addEventListener("click", rotateImage);
    btnClear.addEventListener("click", clearWorkspace);
    btnDownloadAll.addEventListener("click", downloadAllPages);

    // --- PRIMARY FUNCTIONS ---

    function handleImageUpload() {
        const file = uploadInput.files[0];
        if (!file && !sourceImg) return;
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    sourceImg = img;
                    rotation = 0;
                    prepareWorkingImage();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            uploadInput.value = "";
        } else if (sourceImg) {
            prepareWorkingImage();
        }
    }

    function prepareWorkingImage() {
        if (!sourceImg) return;
        outputContainer.innerHTML = "<p>Analizando bordes...</p>";
        if (chkAutoTrim.checked) {
            trimImage(sourceImg, (trimmedImage) => {
                workingImg = trimmedImage;
                calculateLayout();
            });
        } else {
            workingImg = sourceImg;
            calculateLayout();
        }
    }

    function calculateLayout() {
        const designWidthMm = parseFloat(inputDesignWidth.value);
        const printMarginMm = parseFloat(inputPrintMargin.value) || 0;

        if (!workingImg || !designWidthMm || designWidthMm <= 0) {
            splitInfo.innerHTML = "Esperando imagen y ancho real...";
            btnProcessAction.disabled = true;
            return;
        }

        const rotatedCanvas = getRotatedCanvas(workingImg, rotation);

        REAL_PX_PER_MM = rotatedCanvas.width / designWidthMm;
        const imgW_mm = designWidthMm;
        const imgH_mm = rotatedCanvas.height / REAL_PX_PER_MM;

        const paperW_port = parseFloat(inputPaperWidth.value);
        const paperH_port = parseFloat(inputPaperHeight.value);

        const printableW_port = paperW_port - (2 * printMarginMm);
        const printableH_port = paperH_port - (2 * printMarginMm);

        const canFitPortrait = imgW_mm <= printableW_port && imgH_mm <= printableH_port;
        const canFitLandscape = imgW_mm <= (paperH_port - (2 * printMarginMm)) && imgH_mm <= (paperW_port - (2 * printMarginMm));

        if (canFitPortrait || canFitLandscape) {
            currentMode = 'FIT';
            splitLayout = { orientation: canFitPortrait ? 'portrait' : 'landscape' };
            const orientationText = canFitPortrait ? 'una página A4 vertical' : 'una página A4 horizontal';
            splitInfo.innerHTML = `MODO: <b>AJUSTAR</b>. La imagen (${Math.round(imgW_mm)}x${Math.round(imgH_mm)}mm) cabe en ${orientationText} respetando márgenes.`;
        } else {
            currentMode = 'SPLIT';
            splitLayout = calculateBestSplit(imgW_mm, imgH_mm);
            splitInfo.innerHTML = `MODO: <b>DIVIDIR</b>. Se usarán <b>${splitLayout.cols * splitLayout.rows}</b> páginas A4 en <b>${splitLayout.orientation === 'portrait' ? 'vertical' : 'horizontal'}</b>.`;
        }

        btnProcessAction.disabled = false;
        if (initialMessage) initialMessage.style.display = 'none';
        outputContainer.innerHTML = '';
    }

    function calculateBestSplit(imgW_mm, imgH_mm) {
        const overlapMm = parseFloat(inputOverlap.value);
        const printMarginMm = parseFloat(inputPrintMargin.value) || 0;
        const paperW_port = parseFloat(inputPaperWidth.value);
        const paperH_port = parseFloat(inputPaperHeight.value);

        const printableW_port = paperW_port - (2 * printMarginMm);
        const printableH_port = paperH_port - (2 * printMarginMm);
        const effW_port = printableW_port - overlapMm;
        const effH_port = printableH_port - overlapMm;
        const cols_port = Math.ceil((imgW_mm - overlapMm) / effW_port);
        const rows_port = Math.ceil((imgH_mm - overlapMm) / effH_port);
        const pages_port = cols_port * rows_port;

        const printableW_land = paperH_port - (2 * printMarginMm);
        const printableH_land = paperW_port - (2 * printMarginMm);
        const effW_land = printableW_land - overlapMm;
        const effH_land = printableH_land - overlapMm;
        const cols_land = Math.ceil((imgW_mm - overlapMm) / effW_land);
        const rows_land = Math.ceil((imgH_mm - overlapMm) / effH_land);
        const pages_land = cols_land * rows_land;

        if (pages_port <= pages_land) {
            return { orientation: 'portrait', cols: cols_port, rows: rows_port, pages: pages_port };
        } else {
            return { orientation: 'landscape', cols: cols_land, rows: rows_land, pages: pages_land };
        }
    }

    function processImage() {
        if (!workingImg || REAL_PX_PER_MM <= 0) return;
        outputContainer.innerHTML = "<p>Procesando... Por favor, espera.</p>";
        hiresDownloads = [];
        setTimeout(() => {
            currentMode === 'SPLIT' ? executeSplit() : executeFit();
        }, 50);
    }

    function executeFit() {
        const rotatedCanvas = getRotatedCanvas(workingImg, rotation);
        const printMarginMm = parseFloat(inputPrintMargin.value) || 0;
        const paperW_mm = splitLayout.orientation === 'portrait' ? parseFloat(inputPaperWidth.value) : parseFloat(inputPaperHeight.value);
        const paperH_mm = splitLayout.orientation === 'portrait' ? parseFloat(inputPaperHeight.value) : parseFloat(inputPaperWidth.value);

        const pageW_px = paperW_mm * REAL_PX_PER_MM;
        const pageH_px = paperH_mm * REAL_PX_PER_MM;
        const margin_px = printMarginMm * REAL_PX_PER_MM;

        const printableW_px = pageW_px - (2 * margin_px);
        const printableH_px = pageH_px - (2 * margin_px);

        const hiresCanvas = document.createElement('canvas');
        hiresCanvas.width = pageW_px; hiresCanvas.height = pageH_px;
        const ctx = hiresCanvas.getContext('2d');
        ctx.fillStyle = "white"; ctx.fillRect(0, 0, pageW_px, pageH_px);

        let finalW, finalH;
        if ((rotatedCanvas.width / printableW_px) > (rotatedCanvas.height / printableH_px)) {
            finalW = printableW_px;
            finalH = finalW * (rotatedCanvas.height / rotatedCanvas.width);
        } else {
            finalH = printableH_px;
            finalW = finalH * (rotatedCanvas.width / rotatedCanvas.height);
        }

        const dx = margin_px + (printableW_px - finalW) / 2;
        const dy = margin_px;

        ctx.drawImage(rotatedCanvas, 0, 0, rotatedCanvas.width, rotatedCanvas.height, dx, dy, finalW, finalH);

        createPagePreview(hiresCanvas, 1);
        outputContainer.innerHTML = '';
        outputContainer.appendChild(hiresDownloads[0].previewCard);
    }

    function executeSplit() {
        const rotatedCanvas = getRotatedCanvas(workingImg, rotation);
        const { orientation, cols, rows } = splitLayout;
        const overlapMm = parseFloat(inputOverlap.value);
        const printMarginMm = parseFloat(inputPrintMargin.value) || 0;

        const paperW_mm = orientation === 'portrait' ? parseFloat(inputPaperWidth.value) : parseFloat(inputPaperHeight.value);
        const paperH_mm = orientation === 'portrait' ? parseFloat(inputPaperHeight.value) : parseFloat(inputPaperWidth.value);

        const pageW_px = paperW_mm * REAL_PX_PER_MM;
        const pageH_px = paperH_mm * REAL_PX_PER_MM;
        const margin_px = printMarginMm * REAL_PX_PER_MM;
        const overlap_px = overlapMm * REAL_PX_PER_MM;

        const printableW_px = pageW_px - (2 * margin_px);
        const printableH_px = pageH_px - (2 * margin_px);

        const effectiveSliceW_px = printableW_px - overlap_px;
        const effectiveSliceH_px = printableH_px - overlap_px;

        outputContainer.innerHTML = "";
        let pageCount = 1;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const sx = col * effectiveSliceW_px;
                const sy = row * effectiveSliceH_px;

                const sWidth = Math.min(printableW_px, rotatedCanvas.width - sx);
                const sHeight = Math.min(printableH_px, rotatedCanvas.height - sy);

                const hiresCanvas = document.createElement('canvas');
                hiresCanvas.width = pageW_px; hiresCanvas.height = pageH_px;
                const hiresCtx = hiresCanvas.getContext('2d');
                hiresCtx.fillStyle = "white"; hiresCtx.fillRect(0, 0, pageW_px, pageH_px);

                const dx = margin_px + (printableW_px - sWidth) / 2;
                const dy = margin_px;

                hiresCtx.drawImage(rotatedCanvas, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight);

                createPagePreview(hiresCanvas, pageCount++);
            }
        }
        hiresDownloads.forEach(d => outputContainer.appendChild(d.previewCard));
    }

    // --- HELPER & UTILITY FUNCTIONS ---
    function createPagePreview(hiresCanvas, pageNum) {
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 210;
        previewCanvas.height = (previewCanvas.width / hiresCanvas.width) * hiresCanvas.height;
        previewCanvas.getContext('2d').drawImage(hiresCanvas, 0, 0, previewCanvas.width, previewCanvas.height);

        const card = document.createElement('div'); card.className = 'page-card';
        const img = document.createElement('img'); img.src = previewCanvas.toDataURL();
        const info = document.createElement('div'); info.className = 'page-info'; info.textContent = `Página ${pageNum}`;
        card.appendChild(img); card.appendChild(info);

        hiresDownloads.push({ 
            url: hiresCanvas.toDataURL("image/png"), 
            name: `pag-${pageNum}-${currentMode.toLowerCase()}.png`,
            previewCard: card
        });
    }

    function getRotatedCanvas(image, angle) {
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
        const w = image.width, h = image.height;
        if (angle === 90 || angle === 270) { canvas.width = h; canvas.height = w; } 
        else { canvas.width = w; canvas.height = h; }
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(image, -w / 2, -h / 2);
        return canvas;
    }
    
    function trimImage(image, callback) {
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
        canvas.width = image.width; canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                if (data[i + 3] > 20) { 
                    if (x < minX) minX = x; if (x > maxX) maxX = x;
                    if (y < minY) minY = y; if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX === -1) { 
            const emptyImg = new Image(); emptyImg.onload = () => callback(emptyImg); 
            emptyImg.src = canvas.toDataURL(); return;
        }

        const trimW = maxX - minX + 1, trimH = maxY - minY + 1;
        const trimmedCanvas = document.createElement('canvas');
        trimmedCanvas.width = trimW; trimmedCanvas.height = trimH;
        trimmedCanvas.getContext('2d').drawImage(canvas, minX, minY, trimW, trimH, 0, 0, trimW, trimH);
        
        const trimmedImage = new Image();
        trimmedImage.onload = () => callback(trimmedImage);
        trimmedImage.src = trimmedCanvas.toDataURL();
    }

    function rotateImage() {
        if (!workingImg) return;
        rotation = (rotation + 90) % 360;
        calculateLayout();
    }

    function clearWorkspace() {
        sourceImg = null; workingImg = null; rotation = 0; hiresDownloads = []; splitLayout = {}; REAL_PX_PER_MM = 0;
        outputContainer.innerHTML = "";
        inputDesignWidth.value = '';
        if (initialMessage) { initialMessage.style.display = 'block'; }
        splitInfo.innerHTML = "";
        btnProcessAction.disabled = true;
    }

    function downloadAllPages() {
        if (hiresDownloads.length === 0) return;
        hiresDownloads.forEach((download) => {
            const link = document.createElement('a');
            link.href = download.url;
            link.download = download.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});