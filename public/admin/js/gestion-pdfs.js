import { API_BASE_URL, storage } from '@/firebase-config.js';
import '@/admin/css/modules/_pdfs.css';
import '@/admin/css/modules/_common_admin_ui.css';
import '@/admin/css/modules/_responsive.css';
import '@/admin/css/modules/_tables.css';
import * as pdfjsLib from 'pdfjs-dist';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Configurar el worker de PDF.js (necesario para el rendimiento)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = API_BASE_URL;
    
    const elements = {
        pdfGrid: document.getElementById('pdf-grid'),
        modalViewer: document.getElementById('pdf-modal-viewer'),
        pdfUpload: document.getElementById('pdf-upload'),
        renderCanvas: document.getElementById('pdf-render-canvas'),
        annotCanvas: document.getElementById('annotation-canvas'),
        zoomPercent: document.getElementById('zoom-percent'),
        currentPage: document.getElementById('current-page'),
        totalPages: document.getElementById('total-pages'),
        fileName: document.getElementById('modal-file-name'),
        search: document.getElementById('pdf-search'),
        // Nuevos elementos para las herramientas de dibujo
        toolColor: document.getElementById('tool-color'),
        toolSize: document.getElementById('tool-size'),
        toolControls: document.getElementById('tool-controls'),
        clearAnnotations: document.getElementById('clear-annotations')
    };

    const renderCtx = elements.renderCanvas.getContext('2d', { willReadFrequently: true }); // Necesario para algunas operaciones de borrado
    const annotCtx = elements.annotCanvas.getContext('2d');
    
    let currentPdf = null;
    let currentPageNum = 1;
    let isDrawing = false;
    let currentTool = 'cursor';
    let currentZoom = 1.5; // Escala inicial
    let lastX = 0;
    let lastY = 0;
    let allPdfs = [];

    // --- CARGAR LISTA ---
    const loadPdfs = async () => {
        try {
            const res = await fetch(`${API_URL}/pdfs`);
            const result = await res.json();
            allPdfs = result.status === "success" ? result.data : [];
            renderDriveGrid(allPdfs);
        } catch (e) { console.error("Error al cargar lista:", e); }
    };

    const renderDriveGrid = (items) => {
        elements.pdfGrid.innerHTML = items.length ? '' : '<p class="empty-msg">No hay documentos en tu unidad.</p>';
        items.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'file-card animate-up';
            card.innerHTML = `
                <button class="btn-delete-mini" data-id="${doc.id}" title="Eliminar"><i class="fas fa-times"></i></button>
                <i class="fas fa-file-pdf"></i>
                <span class="file-name">${doc.nombre}</span>
                <span class="file-date">${new Date(doc.fecha).toLocaleDateString()}</span>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-delete-mini')) {
                    e.stopPropagation();
                    deletePdf(doc.id);
                } else {
                    elements.fileName.textContent = doc.nombre;
                    openPdf(doc.url);
                }
            });
            elements.pdfGrid.appendChild(card);
        });
    };

    const deletePdf = async (id) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este PDF?")) return;
        
        const docToDelete = allPdfs.find(p => p.id === id);
        
        try {
            // 1. Intentar borrar de Storage si tenemos la ruta
            if (docToDelete && docToDelete.storagePath) {
                const fileRef = ref(storage, docToDelete.storagePath);
                await deleteObject(fileRef).catch(e => console.warn("Archivo no encontrado en Storage"));
            }

            // 2. Borrar de la base de datos
            const res = await fetch(`${API_URL}/pdfs/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.status === "success") loadPdfs();
            else alert("Error al eliminar: " + result.message);
        } catch (e) { console.error("Error:", e); }
    };

    // --- VISOR DE PDF ---
    const openPdf = async (url) => {
        document.getElementById('loading-overlay').style.display = 'flex';
        try {
            currentPdf = await pdfjsLib.getDocument(url).promise;
            currentPageNum = 1;
            currentZoom = 1.5;
            await renderPage(currentPageNum);
            elements.modalViewer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } catch (e) {
            alert("No se pudo abrir el PDF. Asegúrate de que la URL sea válida.");
        } finally { document.getElementById('loading-overlay').style.display = 'none'; }
    };

    const renderPage = async (num) => {
        const page = await currentPdf.getPage(num);
        const viewport = page.getViewport({ scale: currentZoom });
        
        elements.renderCanvas.width = viewport.width;
        elements.renderCanvas.height = viewport.height;
        elements.annotCanvas.width = viewport.width;
        elements.annotCanvas.height = viewport.height;

        await page.render({ canvasContext: renderCtx, viewport: viewport }).promise;
        elements.currentPage.textContent = num;
        elements.totalPages.textContent = currentPdf.numPages;
        elements.zoomPercent.textContent = `${Math.round(currentZoom * 100)}%`;
        
        annotCtx.clearRect(0, 0, elements.annotCanvas.width, elements.annotCanvas.height);
    };

    // --- LÓGICA DE DIBUJO (EDITOR) ---
    const startDrawing = (e) => {
        if (currentTool === 'cursor') return;
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
        annotCtx.beginPath();
        annotCtx.moveTo(lastX, lastY);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        
        const color = elements.toolColor.value;
        const size = elements.toolSize.value;

        annotCtx.lineWidth = size;
        annotCtx.lineCap = 'round';
        annotCtx.lineJoin = 'round';

        if (currentTool === 'pen') {
            annotCtx.globalCompositeOperation = 'source-over'; // Dibujo normal
            annotCtx.strokeStyle = color;
        } else if (currentTool === 'highlighter') {
            // Efecto de resaltador: multiplicar colores y transparencia
            annotCtx.globalCompositeOperation = 'multiply';
            const r = parseInt(color.slice(1,3), 16);
            const g = parseInt(color.slice(3,5), 16);
            const b = parseInt(color.slice(5,7), 16);
            annotCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`; // 40% opacidad
            annotCtx.lineWidth = size * 4; // El resaltador suele ser más ancho
        } else if (currentTool === 'eraser') {
            annotCtx.globalCompositeOperation = 'destination-out'; // Borra lo que hay debajo
            annotCtx.strokeStyle = 'rgba(0,0,0,1)'; // El color no importa para destination-out
            annotCtx.lineWidth = size * 5; // Borrador más ancho
        }

        annotCtx.lineTo(e.offsetX, e.offsetY);
        annotCtx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const stopDrawing = () => {
        isDrawing = false;
    };

    // --- EVENTOS ---
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        currentZoom += 0.25;
        renderPage(currentPageNum);
    });

    elements.clearAnnotations.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todas las anotaciones de esta página?')) {
            annotCtx.clearRect(0, 0, elements.annotCanvas.width, elements.annotCanvas.height);
        }
    });

    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        if (currentZoom > 0.5) { currentZoom -= 0.25; renderPage(currentPageNum); }
    });

    document.getElementById('btn-close-viewer').addEventListener('click', () => {
        elements.modalViewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPageNum < currentPdf.numPages) renderPage(++currentPageNum);
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPageNum > 1) renderPage(--currentPageNum);
    });

    elements.search.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        renderDriveGrid(allPdfs.filter(p => p.nombre.toLowerCase().includes(term)));
    });

    // Eventos para las herramientas de dibujo
    elements.annotCanvas.addEventListener('mousedown', startDrawing);
    elements.annotCanvas.addEventListener('mousemove', draw);
    elements.annotCanvas.addEventListener('mouseup', stopDrawing);
    elements.annotCanvas.addEventListener('mouseout', stopDrawing); // Detener dibujo si el ratón sale del canvas

    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.dataset.tool;
            // Actualizar cursor y visibilidad de los controles de herramienta
            if (currentTool === 'cursor') {
                elements.annotCanvas.style.cursor = 'default';
                elements.toolControls.style.display = 'none';
            } else {
                elements.annotCanvas.style.cursor = 'crosshair';
                elements.toolControls.style.display = 'flex';
            }
        });
    });

    elements.pdfUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0]; if (!file) return;
        document.getElementById('loading-overlay').style.display = 'flex';
        try {
            const storagePath = `documentos_pdfs/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            // 2. Guardar el link permanente en la base de datos
            await fetch(`${API_URL}/pdfs`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ nombre: file.name, url: downloadUrl, storagePath: storagePath })
            });
            
            loadPdfs();
            openPdf(downloadUrl);
        } catch (error) {
            console.error("Error en la subida:", error);
            alert("Error al subir el PDF. Verifica la conexión.");
        } finally {
            document.getElementById('loading-overlay').style.display = 'none';
        }
    });

    loadPdfs();
});