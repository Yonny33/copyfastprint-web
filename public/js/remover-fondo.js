document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imgUpload = document.getElementById('img-upload');
    const toleranceInput = document.getElementById('tolerance');
    const toleranceVal = document.getElementById('tolerance-val');
    const contiguousInput = document.getElementById('contiguous');
    const placeholder = document.getElementById('placeholder-text');
    
    let originalImage = null;
    let history = []; // Pila para deshacer
    
    // Actualizar valor visual de tolerancia
    toleranceInput.addEventListener('input', (e) => {
        toleranceVal.textContent = e.target.value;
    });

    // --- SUBIR IMAGEN ---
    imgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Ajustar tamaño del canvas
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Dibujar imagen
                ctx.drawImage(img, 0, 0);
                originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
                saveState(); // Guardar estado inicial
                
                // UI
                placeholder.style.display = 'none';
                canvas.style.display = 'block';
                
                // Ajustar visualización CSS para que quepa en pantalla si es muy grande
                if(img.width > 800) {
                    canvas.style.width = '100%';
                    canvas.style.height = 'auto';
                } else {
                    canvas.style.width = 'auto';
                    canvas.style.height = 'auto';
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        imgUpload.value = ''; // Reset input
    });

    // --- CLICK PARA BORRAR (MAGIC WAND) ---
    canvas.addEventListener('mousedown', (e) => {
        if (!originalImage) return;

        // Obtener coordenadas del clic ajustadas a la escala visual del canvas
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        const tolerance = parseInt(toleranceInput.value);
        const contiguous = contiguousInput.checked;

        removeColor(x, y, tolerance, contiguous);
    });

    function removeColor(startX, startY, tolerance, contiguous) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Obtener color del píxel clicado
        const startPos = (startY * width + startX) * 4;
        const targetR = data[startPos];
        const targetG = data[startPos + 1];
        const targetB = data[startPos + 2];
        const targetA = data[startPos + 3];

        if (targetA === 0) return; // Ya es transparente

        // Función para verificar si un píxel coincide con la tolerancia
        const match = (pos) => {
            const r = data[pos];
            const g = data[pos + 1];
            const b = data[pos + 2];
            const a = data[pos + 3];
            
            // Si ya es transparente, no coincide (para evitar bucles)
            if (a === 0) return false;

            // Distancia Euclidiana simple
            const dist = Math.sqrt(
                (r - targetR) ** 2 +
                (g - targetG) ** 2 +
                (b - targetB) ** 2
            );
            // Tolerancia aproximada (0-100 mapeado a distancia de color 0-441)
            return dist <= (tolerance * 4.4); 
        };

        if (contiguous) {
            // --- FLOOD FILL (Algoritmo de relleno por inundación) ---
            const stack = [[startX, startY]];
            const visited = new Uint8Array(width * height); // Para evitar procesar el mismo pixel

            while (stack.length) {
                const [cx, cy] = stack.pop();
                const pos = (cy * width + cx) * 4;

                if (visited[cy * width + cx]) continue;
                
                if (match(pos)) {
                    // Borrar píxel (Alpha = 0)
                    data[pos + 3] = 0;
                    visited[cy * width + cx] = 1;

                    // Añadir vecinos
                    if (cx > 0) stack.push([cx - 1, cy]);
                    if (cx < width - 1) stack.push([cx + 1, cy]);
                    if (cy > 0) stack.push([cx, cy - 1]);
                    if (cy < height - 1) stack.push([cx, cy + 1]);
                }
            }
        } else {
            // --- REEMPLAZO GLOBAL ---
            for (let i = 0; i < data.length; i += 4) {
                if (match(i)) {
                    data[i + 3] = 0;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        saveState();
    }

    // --- HISTORIAL (UNDO) ---
    function saveState() {
        // Guardar copia del canvas actual
        if (history.length > 5) history.shift(); // Limitar a 5 pasos
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    document.getElementById('btn-undo').addEventListener('click', () => {
        if (history.length > 1) {
            history.pop(); // Eliminar estado actual
            const previousState = history[history.length - 1];
            ctx.putImageData(previousState, 0, 0);
        }
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        if (originalImage) {
            ctx.putImageData(originalImage, 0, 0);
            history = [originalImage];
        }
    });

    // --- DESCARGAR ---
    document.getElementById('btn-download').addEventListener('click', () => {
        if (!originalImage) return;
        const link = document.createElement('a');
        link.download = `sin-fondo-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});