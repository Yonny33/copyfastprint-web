let canvas;
const PIXELS_PER_CM = 15;
let currentWidthCm = 58;
let currentHeightCm = 100;

document.addEventListener('DOMContentLoaded', () => {
    // --- EVENTOS DE SELECCIÓN DE ANCHO INICIAL ---
    document.querySelectorAll('.option-card[data-width]').forEach(card => {
        card.addEventListener('click', () => {
            const width = card.dataset.width;
            if (width) {
                selectWorkspace(parseInt(width, 10));
            }
        });
    });

    // --- EVENTOS DEL MODAL DE AJUSTE DE ANCHO ---
    const modal = document.getElementById('modal-adjust-width');
    const newWidthInput = document.getElementById('new-width-input');

    // Abrir modal
    document.getElementById('btn-adjust-width').addEventListener('click', () => {
        newWidthInput.value = currentWidthCm; // Mostrar el ancho actual en el input
        modal.style.display = 'flex';
        newWidthInput.focus();
    });

    // Cerrar modal con botón Cancelar
    document.getElementById('btn-cancel-width').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Aplicar cambio de ancho
    document.getElementById('btn-apply-width').addEventListener('click', () => {
        const newWidth = parseInt(newWidthInput.value, 10);
        if (newWidth && newWidth >= 10 && newWidth <= 100) {
            adjustCanvasWidth(newWidth);
            modal.style.display = 'none';
        } else {
            alert("Por favor, introduce un ancho válido entre 10 y 100 cm.");
        }
    });
    
    // Permitir Enter en el input del modal
    newWidthInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById('btn-apply-width').click();
        }
    });

    // --- EVENTOS DE LA PALETA DE COLORES DEL LIENZO ---
    const palette = document.getElementById('canvas-bg-palette');
    palette.addEventListener('click', (e) => {
        if (e.target.classList.contains('palette-btn')) {
            const button = e.target;
            const color = button.dataset.color;

            // Actualizar el botón activo
            const currentActive = palette.querySelector('.palette-btn.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            button.classList.add('active');

            // Cambiar el fondo del lienzo
            if (color === 'checker') {
                canvas.backgroundColor = null; // Dejar que el CSS de fondo (checker) se muestre
                canvas.set('backgroundImage', null);
            } else {
                canvas.backgroundImage = null;
                canvas.backgroundColor = color;
            }
            canvas.renderAll();
        }
    });
});

function selectWorkspace(widthCm) {
    if (typeof fabric === "undefined") {
        alert("Error: La librería gráfica no cargó correctamente. Por favor recarga la página.");
        return;
    }

    document.querySelector(".workspace-selector").style.display = "none";
    document.getElementById("dtf-workspace").style.display = "block";

    currentWidthCm = widthCm;
    currentHeightCm = 100;
    document.getElementById("workspace-info").textContent = `Mesa: ${currentWidthCm}cm x ${currentHeightCm}cm`;

    initFabricCanvas(widthCm, currentHeightCm);
    drawRulers(widthCm, currentHeightCm);
    initGuideListeners();
}

function initFabricCanvas(widthCm, heightCm) {
    const widthPx = widthCm * PIXELS_PER_CM;
    const heightPx = heightCm * PIXELS_PER_CM;

    canvas = new fabric.Canvas("c", { width: widthPx, height: heightPx, backgroundColor: null });

    fabric.Object.prototype.set({
        transparentCorners: false, cornerColor: "#ffffff", cornerStrokeColor: "#000000",
        borderColor: "#000000", cornerSize: 12, padding: 5, cornerStyle: "circle",
    });

    document.addEventListener("keydown", (e) => { if (e.key === "Delete" || e.key === "Backspace") deleteSelected(); });

    // Configuración de bordes inteligentes
    setupBorders(widthPx, heightPx);
    
    // Configuración de eventos del lienzo
    setupCanvasEvents();
}

function setupBorders(widthPx, heightPx) {
    const borderOpts = { fill: '#8b0000', selectable: false, evented: false, visible: false, isBorder: true };
    const t = 5; // Grosor del borde
    canvas.borders = {
        top: new fabric.Rect({ ...borderOpts, top: 0, left: 0, width: widthPx, height: t }),
        bottom: new fabric.Rect({ ...borderOpts, top: heightPx - t, left: 0, width: widthPx, height: t }),
        left: new fabric.Rect({ ...borderOpts, top: 0, left: 0, width: t, height: heightPx }),
        right: new fabric.Rect({ ...borderOpts, top: 0, left: widthPx - t, width: t, height: heightPx })
    };
    canvas.add(...Object.values(canvas.borders));
}

function setupCanvasEvents() {
    canvas.on({
        'object:moving': (e) => {
            const obj = e.target;
            const rect = obj.getBoundingRect();
            const limit = 2;
            canvas.borders.top.visible = rect.top <= limit;
            canvas.borders.left.visible = rect.left <= limit;
            canvas.borders.bottom.visible = rect.top + rect.height >= canvas.height - limit;
            canvas.borders.right.visible = rect.left + rect.width >= canvas.width - limit;
            updateDimTooltip(obj);
        },
        'mouse:up': () => {
            Object.values(canvas.borders).forEach(b => b.visible = false);
            if (!canvas.getActiveObject()) document.getElementById("dim-tooltip").style.display = "none";
        },
        'object:scaling': (e) => updateDimTooltip(e.target),
        'object:rotating': (e) => updateDimTooltip(e.target, true),
        'selection:created': (e) => { if (e.selected.length === 1) updateDimTooltip(e.selected[0]); },
        'selection:updated': (e) => { if (e.selected.length === 1) updateDimTooltip(e.selected[0]); },
        'selection:cleared': () => document.getElementById("dim-tooltip").style.display = "none",
        'object:modified': () => { if (!canvas.getActiveObject()) document.getElementById("dim-tooltip").style.display = "none"; }
    });
}

// --- NUEVA FUNCIÓN CENTRALIZADA PARA AJUSTAR ANCHO ---
function adjustCanvasWidth(newWidthCm) {
    currentWidthCm = newWidthCm;
    const newWidthPx = newWidthCm * PIXELS_PER_CM;

    // Redimensionar el canvas
    canvas.setWidth(newWidthPx);

    // Re-dibujar las reglas
    drawRulers(currentWidthCm, currentHeightCm);

    // Re-posicionar los bordes
    canvas.borders.top.set('width', newWidthPx);
    canvas.borders.bottom.set('width', newWidthPx);
    canvas.borders.right.set('left', newWidthPx - 5);

    // Re-posicionar las guías verticales
    canvas.getObjects('line').forEach(line => {
        if (line.isGuide && line.lockMovementY) { // Es una guía vertical
            line.set({ x1: 50, x2: 50 }); // Simplemente la reposiciona si se salió
        }
    });
    
    // Actualizar texto informativo
    document.getElementById("workspace-info").textContent = `Mesa: ${currentWidthCm}cm x ${currentHeightCm}cm`;

    canvas.renderAll();
}

function drawRulers(widthCm, heightCm) {
  const rulerTop = document.getElementById("ruler-top");
  const rulerLeft = document.getElementById("ruler-left");
  rulerTop.innerHTML = "";
  rulerLeft.innerHTML = "";
  rulerTop.style.width = widthCm * PIXELS_PER_CM + "px";
  rulerLeft.style.height = heightCm * PIXELS_PER_CM + "px";

  for (let i = 0; i <= widthCm; i++) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick";
    tick.style.left = i * PIXELS_PER_CM + "px";
    if (i % 5 === 0) { tick.style.height = "100%"; tick.textContent = i; tick.style.paddingLeft = "2px"; } 
    else { tick.style.height = "25%"; }
    rulerTop.appendChild(tick);
  }
  for (let i = 0; i <= heightCm; i++) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick";
    tick.style.top = i * PIXELS_PER_CM + "px";
    if (i % 5 === 0) { tick.style.width = "100%"; tick.textContent = i; tick.style.paddingTop = "0px"; } 
    else { tick.style.width = "25%"; }
    rulerLeft.appendChild(tick);
  }
}

function initGuideListeners() {
    document.getElementById('ruler-top').onmousedown = () => createGuide('horizontal');
    document.getElementById('ruler-left').onmousedown = () => createGuide('vertical');
}

function createGuide(orientation) {
    if(!canvas) return;
    const props = { stroke: '#8b0000', strokeWidth: 1, selectable: true, evented: true, hasControls: false, isGuide: true, hoverCursor: 'move' };
    const line = orientation === 'horizontal' ? 
        new fabric.Line([0, 50, canvas.width, 50], { ...props, lockMovementX: true, lockRotation: true }) :
        new fabric.Line([50, 0, 50, canvas.height], { ...props, lockMovementY: true, lockRotation: true });
    canvas.add(line); canvas.setActiveObject(line); canvas.renderAll();
}

function updateDimTooltip(obj, isRotating) {
  const tooltip = document.getElementById("dim-tooltip");
  tooltip.textContent = isRotating ? `${Math.round(obj.angle % 360)}°` : `${(obj.getScaledWidth() / PIXELS_PER_CM).toFixed(1)} cm x ${(obj.getScaledHeight() / PIXELS_PER_CM).toFixed(1)} cm`;
  tooltip.style.display = "block";
  const canvasRect = document.querySelector(".canvas-container").getBoundingClientRect();
  const objCenter = obj.getCenterPoint();
  tooltip.style.top = (canvasRect.top + objCenter.y + window.scrollY - 40) + "px";
  tooltip.style.left = (canvasRect.left + objCenter.x + window.scrollX) + "px";
}

function findNextPosition(imgWidth, imgHeight) {
    const objs = canvas.getObjects().filter(o => !o.isGuide && !o.isBorder);
    if (objs.length === 0) return { left: 0, top: 0 };
    objs.sort((a, b) => (a.top - b.top) || (a.left - b.left));
    const lastObj = objs[objs.length - 1];
    const lastRight = lastObj.left + lastObj.getScaledWidth();
    const padding = 5;
    if (lastRight + imgWidth + padding <= canvas.width) return { left: lastRight + padding, top: lastObj.top };
    let maxBottom = objs.reduce((max, o) => Math.max(max, o.top + o.getScaledHeight()), 0);
    return { left: 0, top: maxBottom + padding };
}

document.getElementById("img-upload").addEventListener("change", function (e) {
  const files = e.target.files;
  if (!files || !canvas) return;
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (f) => {
      const tempImg = new Image();
      tempImg.onload = () => {
        const trimmedDataUrl = trimTransparentPixels(tempImg) || tempImg.src;
        fabric.Image.fromURL(trimmedDataUrl, (img) => {
          const scaleFactor = Math.min((canvas.width * 0.5) / img.width, (canvas.height * 0.5) / img.height, 1);
          const pos = findNextPosition(img.width * scaleFactor, img.height * scaleFactor);
          img.scale(scaleFactor).set(pos);
          canvas.add(img).setActiveObject(img);
        });
      };
      tempImg.src = f.target.result;
    };
    reader.readAsDataURL(file);
  }
  this.value = "";
});

function trimTransparentPixels(image) {
  const trimCanvas = document.createElement("canvas");
  trimCanvas.width = image.width; trimCanvas.height = image.height;
  const ctx = trimCanvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, image.width, image.height).data;
  let minX = image.width, minY = image.height, maxX = 0, maxY = 0;
  let found = false;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (data[(y * image.width + x) * 4 + 3] > 0) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        found = true;
      }
    }
  }
  if (!found) return null;
  const padding = 1;
  const cropX = Math.max(0, minX - padding), cropY = Math.max(0, minY - padding);
  const cropW = Math.min(image.width, maxX + padding) - cropX + 1, cropH = Math.min(image.height, maxY + padding) - cropY + 1;
  if (cropW >= image.width && cropH >= image.height) return null;
  const cutCanvas = document.createElement("canvas");
  cutCanvas.width = cropW; cutCanvas.height = cropH;
  cutCanvas.getContext("2d").drawImage(trimCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  return cutCanvas.toDataURL();
}

// --- ACCIONES DE LA BARRA DE HERRAMIENTAS ---
document.getElementById("btn-delete").addEventListener("click", deleteSelected);
function deleteSelected() {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) canvas.remove(...activeObjects); canvas.discardActiveObject().renderAll();
}

document.getElementById("btn-clear").addEventListener("click", () => {
  if (confirm("¿Estás seguro de borrar todas las imágenes del lienzo?")) {
    canvas.remove(...canvas.getObjects().filter(obj => !obj.isBorder && !obj.isGuide));
    canvas.discardActiveObject().renderAll();
  }
});

document.getElementById('btn-duplicate').addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) { alert("Por favor, selecciona una imagen para duplicar."); return; }
    activeObject.clone((cloned) => {
        canvas.discardActiveObject();
        cloned.set({ left: cloned.left + 20, top: cloned.top + 20, evented: true });
        canvas.add(cloned).setActiveObject(cloned).requestRenderAll();
    });
});

document.getElementById("btn-add-meter").addEventListener("click", () => {
  if (!canvas) return;
  currentHeightCm += 100;
  const newHeightPx = currentHeightCm * PIXELS_PER_CM;
  canvas.setHeight(newHeightPx);
  if(canvas.borders) {
      canvas.borders.bottom.top = newHeightPx - 5;
      canvas.borders.left.height = newHeightPx;
      canvas.borders.right.height = newHeightPx;
  }
  canvas.renderAll();
  document.getElementById("workspace-info").textContent = `Mesa: ${currentWidthCm}cm x ${currentHeightCm}cm`;
  drawRulers(currentWidthCm, currentHeightCm);
});

document.getElementById("btn-center-view").addEventListener("click", () => {
  document.getElementById("dtf-workspace").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("btn-download").addEventListener("click", () => {
  showLoading("Generando Alta Calidad...");
  setTimeout(() => {
    canvas.discardActiveObject().renderAll();
    const hiddenObjects = canvas.getObjects().filter(o => o.isGuide || o.isBorder);
    hiddenObjects.forEach(o => o.visible = false);
    canvas.renderAll();

    let maxBottom = canvas.getObjects().filter(o => o.visible).reduce((max, obj) => Math.max(max, obj.getBoundingRect().top + obj.getBoundingRect().height), 0);
    const originalHeight = canvas.getHeight();
    if (maxBottom > 0) canvas.setHeight(Math.min(originalHeight, maxBottom + PIXELS_PER_CM));
    canvas.renderAll();

    let multiplier = 8, dataURL = "";
    try {
        try { dataURL = canvas.toDataURL({ format: "png", quality: 1, multiplier: multiplier }); }
        catch (e) { multiplier = 4; dataURL = canvas.toDataURL({ format: "png", quality: 1, multiplier: multiplier }); }
    } catch (e) { multiplier = 2; dataURL = canvas.toDataURL({ format: "png", quality: 1, multiplier: multiplier }); }

    if (!dataURL) { alert("Error: La imagen es demasiado grande. Intenta reducir el tamaño."); hideLoading(); return; }
    
    if (maxBottom > 0) canvas.setHeight(originalHeight);
    hiddenObjects.forEach(o => { if(o.isGuide) o.visible = true; });
    canvas.renderAll();

    const link = document.createElement("a");
    link.download = `metro-dtf-${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    hideLoading();
  }, 100);
});

document.getElementById("btn-reset-img").addEventListener("click", () => {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "image") {
    activeObject.scale(1).rotate(0).set({ flipX: false, flipY: false });
    canvas.requestRenderAll();
    updateDimTooltip(activeObject, true);
  }
});

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
