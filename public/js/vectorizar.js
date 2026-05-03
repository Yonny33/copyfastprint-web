import '@/css/modules/_vector_tool.css';
import { ImageCore } from './image-core.js';

document.addEventListener("DOMContentLoaded", function () {
    // --- ELEMENTOS DEL DOM ---
    const imgOriginalPreview = document.getElementById("img-original-preview");
    const placeholderOriginal = document.getElementById("placeholder-original");
    
    const svgOutput = document.getElementById("svg-output");
    const placeholderVector = document.getElementById("placeholder-vector");

    const uploadInput = document.getElementById("img-upload-vector");
    const downloadBtn = document.getElementById("btn-download-vector");
    const deleteBtn = document.getElementById("btn-delete-vector");
    const processBtn = document.getElementById("btn-process-vector");
    const processBtnContainer = document.getElementById("container-process-btn");

    // --- NUEVOS CONTROLES DE CONFIGURACIÓN ---
    const colorsInput = document.getElementById("vector-colors");
    const colorsVal = document.getElementById("vector-colors-val");
    const detailSlider = document.getElementById("vector-detail");
    const detailVal = document.getElementById("vector-detail-val");
    const presetSelect = document.getElementById("vector-preset");
    const blurInput = document.getElementById("vector-blur");
    const blurVal = document.getElementById("vector-blur-val");
    const omitInput = document.getElementById("vector-omit");
    const omitVal = document.getElementById("vector-omit-val");

    // --- ESTADO ---
    let currentSvgString = null;
    let originalImageDataUrl = null;

    // --- EVENT LISTENERS ---
    uploadInput.addEventListener("change", handleImageUpload);
    downloadBtn.addEventListener("click", handleDownload);
    deleteBtn.addEventListener("click", handleDelete);
    processBtn.addEventListener("click", handleVectorize);

    if (colorsInput) {
        colorsInput.addEventListener("input", () => {
            if (colorsVal) colorsVal.textContent = colorsInput.value;
        });
    }

    if (detailSlider) {
        detailSlider.addEventListener("input", () => {
            if (detailVal) detailVal.textContent = detailSlider.value;
        });
    }

    if (blurInput) {
        blurInput.addEventListener("input", () => {
            if (blurVal) blurVal.textContent = blurInput.value;
        });
    }

    if (omitInput) {
        omitInput.addEventListener("input", () => {
            if (omitVal) omitVal.textContent = omitInput.value;
        });
    }

    // --- FUNCIONES PRINCIPALES ---

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            originalImageDataUrl = event.target.result;
            
            // 1. Mostrar imagen original
            imgOriginalPreview.src = originalImageDataUrl;
            imgOriginalPreview.style.display = "block";
            placeholderOriginal.style.display = "none";

            // 2. Resetear resultado anterior
            svgOutput.innerHTML = "";
            placeholderVector.style.display = "flex";
            placeholderVector.innerHTML = '<i class="fas fa-arrow-left" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>Presiona "Vectorizar"';
            currentSvgString = null;

            // 3. Mostrar botón de acción
            processBtnContainer.style.display = "flex";
        };
        reader.readAsDataURL(file);
        e.target.value = ""; 
    }

    function handleVectorize() {
        if (!originalImageDataUrl) return;

        // Obtener valores dinámicos de los controles para evitar errores de referencia
        const numColors = colorsInput ? parseInt(colorsInput.value) : 64;
        const detailLevel = detailSlider ? parseFloat(detailSlider.value) : 0.1;
        const blurRadius = blurInput ? parseFloat(blurInput.value) : 0;
        const pathOmit = omitInput ? parseInt(omitInput.value) : 0;
        const preset = presetSelect ? presetSelect.value : 'default';

        showLoading("Procesando vectores...");

        const options = {
            ltres: detailLevel,       
            qtres: detailLevel,       
            pathomit: pathOmit,      
            
            colorsampling: 2, 
            numberofcolors: numColors, 
            mincolorratio: 0,
            colorquantcycles: numColors > 32 ? 15 : 10, 
            
            scale: 1,       
            strokewidth: 0, 
            linefilter: false, 
            blurradius: blurRadius,     
            blurdelta: 10
        };

        // Obtener los píxeles de la imagen (El Worker no puede usar "Image")
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = imgOriginalPreview.naturalWidth;
        tempCanvas.height = imgOriginalPreview.naturalHeight;
        tempCtx.drawImage(imgOriginalPreview, 0, 0);
        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

        // Inicializar Web Worker (Tecnología de Rendimiento)
        const worker = new Worker(new URL('./vector-worker.js', import.meta.url), { type: 'classic' });
        
        // Enviamos los píxeles y dimensiones. Transferimos el buffer para máximo rendimiento.
        worker.postMessage({ 
            pixels: imgData.data, 
            width: imgData.width, 
            height: imgData.height, 
            options 
        }, [imgData.data.buffer]);

        worker.onmessage = function(e) {
            const { success, svgstr, error } = e.data;
            if (success) {
                currentSvgString = svgstr;
                svgOutput.innerHTML = svgstr;
                
                const svgEl = svgOutput.querySelector('svg');
                if(svgEl) {
                    const w = parseFloat(svgEl.getAttribute('width'));
                    const h = parseFloat(svgEl.getAttribute('height'));
                    if (!svgEl.hasAttribute('viewBox') && !isNaN(w) && !isNaN(h)) {
                        svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
                    }
                    svgEl.removeAttribute('width');
                    svgEl.removeAttribute('height');
                }
                placeholderVector.style.display = "none";
            } else {
                console.error(error);
                alert("Error en el procesamiento en segundo plano.");
            }
            hideLoading();
            worker.terminate(); // Liberar memoria
        };
    }

    function handleDownload() {
        if (!currentSvgString) {
            alert("No hay imagen vectorizada para descargar.");
            return;
        }
        
        // Crear un Blob con el contenido SVG
        const blob = new Blob([currentSvgString], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.download = `vectorizado-${Date.now()}.svg`;
        link.href = url;
        link.click();
    }

    function handleDelete() {
        currentSvgString = null;
        originalImageDataUrl = null;
        
        imgOriginalPreview.src = "";
        imgOriginalPreview.style.display = "none";
        placeholderOriginal.style.display = "block";

        svgOutput.innerHTML = "";
        placeholderVector.style.display = "flex";
        placeholderVector.innerHTML = '<i class="fas fa-bezier-curve" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>Esperando imagen...';
        
        processBtnContainer.style.display = "none";
        uploadInput.value = "";
    }

    // --- UI HELPERS ---
    function showLoading(text) {
        // Esta función crea el overlay de carga si no existe.
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