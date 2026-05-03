/**
 * ImageCore: Motor unificado para las herramientas de Copy Fast & Print
 */
export const ImageCore = {
    // Factor para exportación 300 DPI (aprox 3x el tamaño estándar)
    EXPORT_MULTIPLIER: 3,

    /**
     * Descarga un canvas en Alta Resolución (HD)
     */
    downloadHD(canvas, filename) {
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = canvas.width * this.EXPORT_MULTIPLIER;
        exportCanvas.height = canvas.height * this.EXPORT_MULTIPLIER;
        const ctx = exportCanvas.getContext("2d");
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

        const link = document.createElement("a");
        link.download = `${filename}-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL("image/png");
        link.click();
    },

    // Utilidades compartidas de Zoom y transformación pueden agregarse aquí
};