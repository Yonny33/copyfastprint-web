let canvas;
const PIXELS_PER_CM = 15; // Factor de escala para visualización en pantalla (aprox 38 DPI)
let currentWidthCm = 58; // Ancho actual seleccionado
let currentHeightCm = 100; // Altura actual (inicia en 1 metro)
// NOTA: Para impresión real se necesita más calidad, pero para armar el layout en web
// usamos una escala manejable y al exportar podemos multiplicar.

// Aseguramos que la función sea accesible globalmente
window.selectWorkspace = function (widthCm) {
  if (typeof fabric === "undefined") {
    alert(
      "Error: La librería gráfica no cargó correctamente. Por favor recarga la página.",
    );
    return;
  }

  // 1. Ocultar selector, mostrar área de trabajo
  document.querySelector(".workspace-selector").style.display = "none";
  document.getElementById("dtf-workspace").style.display = "block";

  // 2. Actualizar info
  currentWidthCm = widthCm;
  currentHeightCm = 100; // Reiniciar a 1 metro
  document.getElementById("workspace-info").textContent =
    `Mesa: ${currentWidthCm}cm x ${currentHeightCm}cm`;

  // 3. Inicializar Fabric Canvas
  initFabricCanvas(widthCm, currentHeightCm);
  drawRulers(widthCm, currentHeightCm);
  initGuideListeners(); // Activar listeners para sacar guías
};

function initFabricCanvas(widthCm, heightCm) {
  const widthPx = widthCm * PIXELS_PER_CM;
  const heightPx = heightCm * PIXELS_PER_CM;

  // Crear el canvas de Fabric
  canvas = new fabric.Canvas("c", {
    width: widthPx,
    height: heightPx,
    backgroundColor: null, // Transparente
  });

  // Configurar controles visuales de los objetos
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: "#ffffff",
    cornerStrokeColor: "#000000",
    borderColor: "#000000",
    cornerSize: 12,
    padding: 5,
    cornerStyle: "circle",
  });

  // Evento para eliminar con tecla Supr/Delete
  document.addEventListener("keydown", function (e) {
    if (e.key === "Delete" || e.key === "Backspace") {
      deleteSelected();
    }
  });

  // --- BORDES INTELIGENTES ---
  // Creamos 4 líneas rojas invisibles en los bordes
  const borderOpts = { fill: '#8b0000', selectable: false, evented: false, visible: false, isBorder: true };
  const t = 5; // Grosor del borde visual
  
  canvas.borders = {
      top: new fabric.Rect({ ...borderOpts, top: 0, left: 0, width: widthPx, height: t }),
      bottom: new fabric.Rect({ ...borderOpts, top: heightPx - t, left: 0, width: widthPx, height: t }),
      left: new fabric.Rect({ ...borderOpts, top: 0, left: 0, width: t, height: heightPx }),
      right: new fabric.Rect({ ...borderOpts, top: 0, left: widthPx - t, width: t, height: heightPx })
  };
  canvas.add(canvas.borders.top, canvas.borders.bottom, canvas.borders.left, canvas.borders.right);

  // Evento al mover objetos: Detectar colisión con bordes
  canvas.on("object:moving", function (e) {
    const obj = e.target;
    const rect = obj.getBoundingRect();
    const limit = 2; // Sensibilidad en píxeles

    canvas.borders.top.visible = rect.top <= limit;
    canvas.borders.left.visible = rect.left <= limit;
    canvas.borders.bottom.visible = rect.top + rect.height >= canvas.height - limit;
    canvas.borders.right.visible = rect.left + rect.width >= canvas.width - limit;
  });

  canvas.on("mouse:up", function() {
      // Ocultar bordes al soltar
      Object.values(canvas.borders).forEach(b => b.visible = false);
  });

  // Eventos para mostrar dimensiones al escalar
  canvas.on("object:scaling", function (e) {
    updateDimTooltip(e.target);
  });
  canvas.on("object:rotating", function (e) {
    updateDimTooltip(e.target, false, true);
  });
  canvas.on("object:modified", function () {
    document.getElementById("dim-tooltip").style.display = "none";
  });
  canvas.on("selection:created", function (e) {
    if (e.selected.length === 1) updateDimTooltip(e.selected[0], true);
  });
  canvas.on("selection:updated", function (e) {
    if (e.selected.length === 1) updateDimTooltip(e.selected[0], true);
  });
  canvas.on("selection:cleared", function () {
    document.getElementById("dim-tooltip").style.display = "none";
  });
}

// --- DIBUJAR REGLAS ---
function drawRulers(widthCm, heightCm) {
  const rulerTop = document.getElementById("ruler-top");
  const rulerLeft = document.getElementById("ruler-left");

  // Limpiar reglas anteriores
  rulerTop.innerHTML = "";
  rulerLeft.innerHTML = "";

  // Ajustar tamaños de contenedores
  rulerTop.style.width = widthCm * PIXELS_PER_CM + "px";
  rulerLeft.style.height = heightCm * PIXELS_PER_CM + "px";

  // Regla Horizontal (Top)
  for (let i = 0; i <= widthCm; i++) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick";
    tick.style.left = i * PIXELS_PER_CM + "px";
    // Marcas grandes cada 5cm, pequeñas cada 1cm
    if (i % 5 === 0) {
      tick.style.height = "100%";
      tick.textContent = i;
      tick.style.paddingLeft = "2px";
    } else {
      tick.style.height = "25%";
    }
    rulerTop.appendChild(tick);
  }

  // Regla Vertical (Left)
  for (let i = 0; i <= heightCm; i++) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick";
    tick.style.top = i * PIXELS_PER_CM + "px";
    if (i % 5 === 0) {
      tick.style.width = "100%";
      tick.textContent = i;
      tick.style.paddingTop = "0px";
    } else {
      tick.style.width = "25%";
    }
    rulerLeft.appendChild(tick);
  }
}

// --- GUÍAS INTERACTIVAS ---
function initGuideListeners() {
    const rTop = document.getElementById('ruler-top');
    const rLeft = document.getElementById('ruler-left');
    
    // Al hacer clic en la regla, crea una guía
    rTop.onmousedown = (e) => createGuide('horizontal');
    rLeft.onmousedown = (e) => createGuide('vertical');
}

function createGuide(orientation) {
    if(!canvas) return;
    let line;
    const props = {
        stroke: '#8b0000', strokeWidth: 1, selectable: true, evented: true, 
        hasControls: false, isGuide: true, hoverCursor: 'move'
    };

    if(orientation === 'horizontal') {
        // Línea horizontal que cruza todo el ancho
        line = new fabric.Line([0, 50, canvas.width, 50], {
            ...props, lockMovementX: true, lockRotation: true
        });
    } else {
        // Línea vertical que cruza todo el alto
        line = new fabric.Line([50, 0, 50, canvas.height], {
            ...props, lockMovementY: true, lockRotation: true
        });
    }
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
}

function updateDimTooltip(obj, showStatic, isRotating) {
  const tooltip = document.getElementById("dim-tooltip");
  
  if (isRotating) {
      tooltip.textContent = `${Math.round(obj.angle % 360)}°`;
  } else {
      const wCm = (obj.getScaledWidth() / PIXELS_PER_CM).toFixed(1);
      const hCm = (obj.getScaledHeight() / PIXELS_PER_CM).toFixed(1);
      tooltip.textContent = `${wCm} cm x ${hCm} cm`;
  }
  
  tooltip.style.display = "block";

  // Posicionar cerca del objeto
  const canvasRect = document.querySelector(".canvas-container").getBoundingClientRect();
  const objCenter = obj.getCenterPoint();
  
  // Posición absoluta en pantalla
  const top = canvasRect.top + objCenter.y + window.scrollY - 40; 
  const left = canvasRect.left + objCenter.x + window.scrollX;

  tooltip.style.top = top + "px";
  tooltip.style.left = left + "px";
  
  if(showStatic) {
      setTimeout(() => { tooltip.style.display = 'none'; }, 2000);
  }
}

// --- ORGANIZACIÓN AUTOMÁTICA (AUTO-ARRANGE) ---
function findNextPosition(imgWidth, imgHeight) {
    // Filtrar solo imágenes (ignorar guías y bordes)
    const objs = canvas.getObjects().filter(o => !o.isGuide && !o.isBorder);
    
    if (objs.length === 0) return { left: 0, top: 0 };

    // Ordenar objetos por posición vertical (top) y luego horizontal (left)
    objs.sort((a, b) => (a.top - b.top) || (a.left - b.left));
    
    const lastObj = objs[objs.length - 1];
    const lastRight = lastObj.left + lastObj.getScaledWidth();
    const lastTop = lastObj.top;
    
    // Margen entre imágenes
    const padding = 5; 

    // Estrategia: Intentar poner a la derecha del último objeto
    if (lastRight + imgWidth + padding <= canvas.width) {
        return { left: lastRight + padding, top: lastTop };
    } else {
        // Si no cabe, buscar el punto más bajo de toda la mesa para empezar nueva fila
        let maxBottom = 0;
        objs.forEach(o => {
            const b = o.top + o.getScaledHeight();
            if(b > maxBottom) maxBottom = b;
        });
        return { left: 0, top: maxBottom + padding };
    }
}

// --- SUBIR IMÁGENES ---
document.getElementById("img-upload").addEventListener("change", function (e) {
  const files = e.target.files;
  // Validación de seguridad: si no hay canvas (por error previo), no hacer nada
  if (!files || !canvas) return;

  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (f) {
      const data = f.target.result;

      // Crear imagen temporal para procesar recorte de transparencia
      const tempImg = new Image();
      tempImg.onload = function () {
        // Recortar bordes transparentes
        const trimmedDataUrl = trimTransparentPixels(tempImg) || data;

        fabric.Image.fromURL(trimmedDataUrl, function (img) {
          // Escalar imagen si es muy grande para el lienzo (usando el tamaño recortado)
          const scaleFactor = Math.min(
            (canvas.width * 0.5) / img.width,
            (canvas.height * 0.5) / img.height,
            1,
          );

          // Usar la nueva lógica de posicionamiento
          const pos = findNextPosition(img.width * scaleFactor, img.height * scaleFactor);
          img.scale(scaleFactor);
          img.set({ left: pos.left, top: pos.top });

          canvas.add(img);
          canvas.setActiveObject(img);
        });
      };
      tempImg.src = data;
    };
    reader.readAsDataURL(files[i]);
  }
  // Limpiar input para permitir subir la misma imagen de nuevo si se borró
  this.value = "";
});

// --- FUNCIÓN PARA RECORTAR TRANSPARENCIA (TRIM) ---
function trimTransparentPixels(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  let minX = w,
    minY = h,
    maxX = 0,
    maxY = 0;
  let found = false;

  // Escanear píxeles para encontrar los límites del contenido visible
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = data[(y * w + x) * 4 + 3]; // Canal Alpha
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return null; // Imagen vacía o totalmente transparente

  // Añadir un pequeño margen de seguridad (1px)
  const padding = 1;
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropW = Math.min(w, maxX + padding) - cropX + 1;
  const cropH = Math.min(h, maxY + padding) - cropY + 1;

  // Si no se recortó nada sustancial, devolver null para usar la original
  if (cropW >= w && cropH >= h) return null;

  const cutCanvas = document.createElement("canvas");
  cutCanvas.width = cropW;
  cutCanvas.height = cropH;
  const cutCtx = cutCanvas.getContext("2d");
  cutCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  return cutCanvas.toDataURL();
}

// --- ELIMINAR OBJETO ---
document.getElementById("btn-delete").addEventListener("click", deleteSelected);

function deleteSelected() {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length) {
    canvas.discardActiveObject();
    activeObjects.forEach(function (obj) {
      canvas.remove(obj);
    });
  }
}

// --- LIMPIAR TODO ---
document.getElementById("btn-clear").addEventListener("click", function () {
  if (confirm("¿Estás seguro de borrar todo el lienzo?")) {
    canvas.clear();
    // Restaurar color de fondo transparente (null) o blanco si se prefiere
    canvas.setBackgroundColor(null, canvas.renderAll.bind(canvas));
  }
});

// --- AGREGAR METRO (EXTENDER LIENZO) ---
document.getElementById("btn-add-meter").addEventListener("click", function () {
  if (!canvas) return; // Seguridad
  currentHeightCm += 100; // Sumar 100cm
  const newHeightPx = currentHeightCm * PIXELS_PER_CM;

  canvas.setHeight(newHeightPx);
  
  // Actualizar bordes y guías verticales
  if(canvas.borders) {
      canvas.borders.bottom.top = newHeightPx - 5;
      canvas.borders.left.height = newHeightPx;
      canvas.borders.right.height = newHeightPx;
  }
  
  canvas.renderAll();

  document.getElementById("workspace-info").textContent =
    `Mesa: ${currentWidthCm}cm x ${currentHeightCm}cm`;
  drawRulers(currentWidthCm, currentHeightCm); // Redibujar regla vertical
});

// --- CENTRAR VISTA / IR ARRIBA ---
document.getElementById("btn-center-view").addEventListener("click", function () {
  // Hacemos scroll suave hacia el inicio del área de trabajo
  const workspace = document.getElementById("dtf-workspace");
  workspace.scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- DESCARGAR ---
document.getElementById("btn-download").addEventListener("click", function () {
  // Deseleccionar objetos para que no salgan los bordes de selección en la imagen
  canvas.discardActiveObject();
  canvas.renderAll();

  // Ocultar guías y bordes antes de exportar
  const guidesAndBorders = canvas.getObjects().filter(o => o.isGuide || o.isBorder);
  guidesAndBorders.forEach(o => o.visible = false);
  canvas.renderAll();

  // 1. Calcular altura real utilizada (Trim vacío)
  let maxBottom = 0;
  canvas.getObjects().forEach((obj) => {
    if (!obj.visible) return; // Ignorar objetos ocultos (guías, bordes)
    const bound = obj.getBoundingRect();
    const bottom = bound.top + bound.height;
    if (bottom > maxBottom) maxBottom = bottom;
  });

  // Añadir un pequeño margen (1cm) si hay objetos, si no, dejar como está
  const originalHeight = canvas.getHeight();
  if (maxBottom > 0) {
      const newHeight = Math.min(originalHeight, maxBottom + PIXELS_PER_CM);
      canvas.setHeight(newHeight);
      canvas.renderAll();
  }

  // Multiplicador para mejorar calidad (exportar a mayor resolución que la pantalla)
  // Si en pantalla 1cm = 15px, multiplicamos por 4 para tener 60px/cm (~150 DPI)
  // Para 300 DPI necesitaríamos multiplicar por ~8, pero puede ser muy pesado para el navegador.
  const multiplier = 4;

  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: multiplier,
  });

  // Restaurar altura original
  if (maxBottom > 0) {
      canvas.setHeight(originalHeight);
      canvas.renderAll();
  }
  
  // Restaurar visibilidad de guías (opcional, por si el usuario sigue editando)
  guidesAndBorders.forEach(o => { if(o.isGuide) o.visible = true; }); // Solo restaurar guías, bordes siguen ocultos
  canvas.renderAll();

  // Crear enlace temporal para descargar
  const link = document.createElement("a");
  link.download = `metro-dtf-${Date.now()}.png`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// --- MANEJO DE RESPONSIVE DEL CANVAS (Opcional) ---
// FabricJS no es responsive por defecto, pero el contenedor CSS tiene overflow:auto
// así que en móviles aparecerán barras de desplazamiento, lo cual es correcto
// para mantener la precisión de las medidas.
