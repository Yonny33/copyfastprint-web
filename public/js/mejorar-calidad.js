document.addEventListener("DOMContentLoaded", () => {
    // --- DOM ELEMENTS ---
    const uploadInput = document.getElementById("image-upload");
    const comparisonWrapper = document.getElementById("comparison-wrapper");
    const imageOriginal = document.getElementById("image-original");
    const imageEnhanced = document.getElementById("image-enhanced");
    const comparisonSlider = document.getElementById("comparison-slider");
    const placeholderText = document.getElementById("placeholder-text");
    const originalDimensions = document.getElementById("original-dimensions");
    const processedDimensions = document.getElementById("processed-dimensions");
    const scaleFactorSelect = document.getElementById("scale-factor");
    const sharpenLevelSelect = document.getElementById("sharpen-level");
    const btnDownload = document.getElementById("btn-download");
    const btnClear = document.getElementById("btn-clear");
    const loader = document.getElementById("loader");

    // --- STATE ---
    let sourceImage = null;
    let processedImageDataURL = null;
    let isDragging = false;

    // --- KERNELS for Sharpening ---
    const sharpenKernels = {
        low: [0, -0.5, 0, -0.5, 3, -0.5, 0, -0.5, 0],
        medium: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        high: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
    };

    // --- EVENT LISTENERS ---
    uploadInput.addEventListener("change", handleImageUpload);
    scaleFactorSelect.addEventListener("change", () => processImage());
    sharpenLevelSelect.addEventListener("change", () => processImage());
    btnDownload.addEventListener("click", downloadImage);
    btnClear.addEventListener("click", clearWorkspace);

    // Slider events
    comparisonSlider.addEventListener("mousedown", () => { isDragging = true; });
    document.addEventListener("mouseup", () => { isDragging = false; });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const rect = comparisonWrapper.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let percentage = (offsetX / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        comparisonSlider.style.left = `${percentage}%`;
        imageEnhanced.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    });

    // --- FUNCTIONS ---

    function getPrintSize(width, height, dpi = 300) {
        const widthInches = width / dpi;
        const heightInches = height / dpi;
        const widthCm = (widthInches * 2.54).toFixed(1);
        const heightCm = (heightInches * 2.54).toFixed(1);
        return `(~${widthCm}x${heightCm}cm @ ${dpi}ppp)`;
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            sourceImage = new Image();
            sourceImage.onload = () => {
                displayOriginalImage();
                processImage();
            };
            sourceImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function displayOriginalImage() {
        placeholderText.style.display = 'none';
        imageOriginal.src = sourceImage.src;
        imageOriginal.style.display = 'block';
        const printSize = getPrintSize(sourceImage.width, sourceImage.height);
        originalDimensions.innerHTML = `<strong>Original:</strong> ${sourceImage.width}x${sourceImage.height}px <span class="print-size">${printSize}</span>`;
    }

    function processImage() {
        if (!sourceImage) return;

        loader.style.display = 'block';
        imageEnhanced.style.display = 'none';
        processedDimensions.innerHTML = '<strong>Mejorado:</strong> Procesando...';

        setTimeout(() => {
            const scale = parseInt(scaleFactorSelect.value);
            const sharpenLevel = sharpenLevelSelect.value;

            const upscaledCanvas = document.createElement('canvas');
            const upscaledCtx = upscaledCanvas.getContext('2d');
            upscaledCanvas.width = sourceImage.width * scale;
            upscaledCanvas.height = sourceImage.height * scale;

            upscaledCtx.drawImage(sourceImage, 0, 0, upscaledCanvas.width, upscaledCanvas.height);

            const imageData = upscaledCtx.getImageData(0, 0, upscaledCanvas.width, upscaledCanvas.height);
            const kernel = sharpenKernels[sharpenLevel];
            const sharpenedData = applyConvolution(imageData, kernel);
            upscaledCtx.putImageData(sharpenedData, 0, 0);

            processedImageDataURL = upscaledCanvas.toDataURL("image/png");
            imageEnhanced.src = processedImageDataURL;
            imageEnhanced.style.display = 'block';

            loader.style.display = 'none';
            const printSize = getPrintSize(upscaledCanvas.width, upscaledCanvas.height);
            processedDimensions.innerHTML = `<strong>Mejorado:</strong> ${upscaledCanvas.width}x${upscaledCanvas.height}px <span class="print-size">${printSize}</span>`;

        }, 50);
    }
    
    function applyConvolution(imageData, kernel) {
        const src = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const output = new ImageData(width, height);
        const dst = output.data;

        const side = Math.round(Math.sqrt(kernel.length));
        const halfSide = Math.floor(side / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                const dstOff = (y * width + x) * 4;

                for (let cy = 0; cy < side; cy++) {
                    for (let cx = 0; cx < side; cx++) {
                        const scy = y + cy - halfSide;
                        const scx = x + cx - halfSide;

                        if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
                            const srcOff = (scy * width + scx) * 4;
                            const wt = kernel[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = src[dstOff + 3];
            }
        }
        return output;
    }

    function downloadImage() {
        if (!processedImageDataURL) {
            alert("No hay imagen procesada para descargar.");
            return;
        }
        const link = document.createElement('a');
        link.href = processedImageDataURL;
        link.download = `imagen-mejorada-${scaleFactorSelect.value}x.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function clearWorkspace() {
        sourceImage = null;
        processedImageDataURL = null;
        imageOriginal.style.display = 'none';
        imageEnhanced.style.display = 'none';
        placeholderText.style.display = 'block';
        originalDimensions.innerHTML = '<strong>Original:</strong> -';
        processedDimensions.innerHTML = '<strong>Mejorado:</strong> -';
        uploadInput.value = '';
        comparisonSlider.style.left = '50%';
        imageEnhanced.style.clipPath = 'inset(0 50% 0 0)';
    }
});
