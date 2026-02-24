document.addEventListener("DOMContentLoaded", function () {
    const uploadInput = document.getElementById("img-upload-split");
    const outputContainer = document.getElementById("output-container");
    
    // Inputs de configuración
    const inputPaperWidth = document.getElementById("paper-width");
    const inputPaperHeight = document.getElementById("paper-height");
    const inputOverlap = document.getElementById("overlap");
    const inputScale = document.getElementById("scale-percent");
    const inputTargetPages = document.getElementById("target-pages");
    const btnRotate = document.getElementById("btn-rotate");
    const btnClear = document.getElementById("btn-clear-split");

    let currentImg = null;
    let rotation = 0;

    uploadInput.addEventListener("change", handleImageUpload);
    if(btnClear) btnClear.addEventListener("click", () => {
        currentImg = null;
        outputContainer.innerHTML = "";
        uploadInput.value = "";
    });
    
    // Eventos para actualizar en tiempo real
    inputPaperHeight.addEventListener("change", () => processImage());
    inputOverlap.addEventListener("change", () => processImage());
    inputScale.addEventListener("change", () => { inputTargetPages.value = ""; processImage(); }); // Si cambia escala manual, borra target pages
    inputTargetPages.addEventListener("change", () => processImage());
    btnRotate.addEventListener("click", () => { rotation = (rotation + 90) % 360; processImage(); });

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function() {
                currentImg = img;
                rotation = 0; // Resetear rotación al subir nueva imagen
                processImage();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // Reset para permitir subir la misma imagen de nuevo
    }

    function processImage() {
        if (!currentImg) return;
        outputContainer.innerHTML = ""; // Limpiar resultados anteriores

        // --- 0. Pre-procesar imagen (Rotar y Escalar) ---
        const canvasTemp = document.createElement('canvas');
        const ctxTemp = canvasTemp.getContext('2d');

        let w = currentImg.width;
        let h = currentImg.height;
        if (rotation === 90 || rotation === 270) { w = currentImg.height; h = currentImg.width; }

        // --- Lógica de Escala ---
        let scale = (parseFloat(inputScale.value) || 100) / 100;
        
        // Si el usuario pidió un número específico de páginas, calculamos la escala necesaria
        const targetPages = parseInt(inputTargetPages.value);
        if (targetPages > 0) {
            const paperWidthMm = parseFloat(inputPaperWidth.value) || 210;
            const paperHeightMm = parseFloat(inputPaperHeight.value) || 290;
            const overlapMm = parseFloat(inputOverlap.value) || 10;
            
            // 1. Calcular altura objetivo en píxeles (basado en el ancho actual de la imagen)
            // Relación: Si la imagen tiene ancho W, y el papel es 210mm, entonces 1mm = W / 210 px
            const pxPerMm = w / paperWidthMm;
            const pageHeightPx = paperHeightMm * pxPerMm;
            const overlapPx = overlapMm * pxPerMm;
            const effectiveHeightPx = pageHeightPx - overlapPx;
            
            // Altura total necesaria = (Páginas * AlturaEfectiva) + Overlap
            const targetHeightPx = (targetPages * effectiveHeightPx) + overlapPx;
            
            // Nueva escala = AlturaObjetivo / AlturaActual
            scale = targetHeightPx / h;
            
            // Actualizar el input de escala visualmente (opcional, para que el usuario vea)
            inputScale.value = Math.round(scale * 100);
        }

        canvasTemp.width = w * scale;
        canvasTemp.height = h * scale;

        ctxTemp.translate(canvasTemp.width/2, canvasTemp.height/2);
        ctxTemp.rotate(rotation * Math.PI / 180);
        ctxTemp.scale(scale, scale);
        ctxTemp.drawImage(currentImg, -currentImg.width/2, -currentImg.height/2);

        // Usamos la imagen procesada para el corte
        const imgToSlice = canvasTemp;

        // 1. Obtener configuración en milímetros
        const paperWidthMm = parseFloat(inputPaperWidth.value) || 210;
        const paperHeightMm = parseFloat(inputPaperHeight.value) || 290;
        const overlapMm = parseFloat(inputOverlap.value) || 10;

        // 2. Calcular la relación de Píxeles por Milímetro
        // Asumimos que el ANCHO de la imagen se va a imprimir ocupando el ANCHO del papel (210mm)
        // Esto es lo estándar en la F170 para aprovechar el ancho máximo.
        const pxPerMm = imgToSlice.width / paperWidthMm;

        // 3. Calcular alturas en píxeles
        const pageHeightPx = paperHeightMm * pxPerMm;
        const overlapPx = overlapMm * pxPerMm;
        
        // Altura efectiva de avance por página (lo que avanza sin contar lo que se repite)
        const effectiveHeightPx = pageHeightPx - overlapPx;

        let currentY = 0;
        let pageCount = 1;

        // 4. Bucle de corte
        while (currentY < imgToSlice.height) {
            // Crear canvas para esta hoja
            const canvas = document.createElement('canvas');
            canvas.width = imgToSlice.width;
            canvas.height = pageHeightPx; // La altura del canvas es la altura de la hoja
            const ctx = canvas.getContext('2d');

            // Dibujar la sección correspondiente
            
            // Calcular cuánto nos queda de imagen
            let sourceHeight = pageHeightPx;
            
            // Si es la última hoja y sobra espacio, ajustamos (opcional, o dejamos blanco)
            if (currentY + sourceHeight > imgToSlice.height) {
                // Opción A: Dejar el canvas del tamaño completo A4 (con espacio blanco abajo) -> Mejor para impresora
                // Opción B: Recortar el canvas -> A veces la impresora lo escala mal.
                // Usaremos Opción A: Dibujamos solo lo que queda, el resto del canvas será transparente/blanco
                sourceHeight = imgToSlice.height - currentY;
            }

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            ctx.drawImage(imgToSlice, 
                0, currentY, imgToSlice.width, sourceHeight, // Origen
                0, 0, imgToSlice.width, sourceHeight // Destino
            );

            // Crear elemento visual
            createPagePreview(canvas, pageCount);

            // Avanzar cursor (menos el overlap para que se repita esa zona)
            currentY += effectiveHeightPx;
            pageCount++;
        }
    }

    function createPagePreview(canvas, pageNum) {
        const card = document.createElement('div');
        card.className = 'page-card';

        const img = document.createElement('img');
        img.src = canvas.toDataURL("image/jpeg", 0.9); // Calidad JPG alta
        
        const info = document.createElement('div');
        info.className = 'page-info';
        info.innerHTML = `Página ${pageNum} <a href="${img.src}" download="corte-pag-${pageNum}.jpg" style="color: var(--primary-color); margin-left:5px;"><i class="fas fa-download"></i></a>`;

        card.appendChild(img);
        card.appendChild(info);
        outputContainer.appendChild(card);
    }
});