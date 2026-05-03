// Worker para procesamiento pesado de vectores
importScripts('https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.min.js');

self.onmessage = function(e) {
    const { pixels, width, height, options } = e.data;
    
    try {
        // Reconstruimos el objeto que espera ImageTracer: {width, height, data}
        const imgData = { width, height, data: pixels };
        
        // Usamos imagedataToSVG que es sincrónico y devuelve el string directamente
        const svgstr = ImageTracer.imagedataToSVG(imgData, options);
        self.postMessage({ success: true, svgstr });
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
};