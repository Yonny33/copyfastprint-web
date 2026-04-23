import '@/css/modules/_vector_tool.css';

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

        if (preset === 'logo') {
            options.ltres = 0.05;
            options.qtres = 0.05;
            options.numberofcolors = Math.min(numColors, 16);
        } else if (preset === 'photo') {
            options.linefilter = true;
        }

        // Ejecutar vectorización con un pequeño delay para que el UI no se congele antes de mostrar el loader
        setTimeout(() => {
            try {
                ImageTracer.imageToSVG(originalImageDataUrl, function(svgstr) {
                    currentSvgString = svgstr;
                    
                    // Mostrar resultado
                    svgOutput.innerHTML = svgstr;
                    
                    // Ajustar SVG para que sea responsive dentro del contenedor
                    const svgEl = svgOutput.querySelector('svg');
                    if(svgEl) {
                        // 1. Asegurar que tenga viewBox (Coordenadas internas)
                        // ImageTracer a veces no lo pone, y sin esto el SVG no escala y se ve como una línea.
                        const w = parseFloat(svgEl.getAttribute('width'));
                        const h = parseFloat(svgEl.getAttribute('height'));
                        
                        if (!svgEl.hasAttribute('viewBox') && !isNaN(w) && !isNaN(h)) {
                            svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
                        }

                        // 2. Quitar atributos fijos para que el CSS controle el tamaño (100%)
                        svgEl.removeAttribute('width');
                        svgEl.removeAttribute('height');
                    }

                    placeholderVector.style.display = "none";
                    hideLoading();
                }, options);
            } catch (e) {
                console.error(e);
                alert("Error al vectorizar. Intenta con una imagen más simple.");
                hideLoading();
            }
        }, 100);
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