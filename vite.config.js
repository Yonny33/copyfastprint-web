
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // Define 'public' como el directorio raíz donde viven tus archivos HTML.
  root: 'public',
  build: {
    // La compilación final se guardará en una carpeta 'dist' en la raíz del proyecto.
    outDir: '../dist',
    // Limpia el directorio 'dist' antes de cada compilación.
    emptyOutDir: true,
    rollupOptions: {
      // Configuración para que Vite maneje Múltiples Páginas (MPA).
      // Busca dinámicamente todos los .html dentro de la carpeta 'public'.
      input: Object.fromEntries(
        globSync('public/**/*.html').map(file => [
          // Crea un nombre de entrada lógico para cada archivo HTML.
          // Ejemplo: 'public/admin/clientes.html' se convierte en 'admin/clientes'.
          file.slice(file.indexOf('/') + 1, file.length - 5),
          // Resuelve la ruta completa del archivo.
          resolve(__dirname, file)
        ])
      )
    },
  },
  server: {
    // Abre el 'index.html' por defecto al iniciar el servidor de desarrollo.
    open: '/index.html',
    // Configuración del proxy para redirigir las llamadas a la API.
    proxy: {
      // Cualquier petición que empiece con /api...
      '/api': {
        // ...será redirigida al emulador de Firebase Functions.
        target: 'http://127.0.0.1:5001/copyfast-control-v2/us-central1',
        // Esto es necesario para que el emulador acepte la petición.
        changeOrigin: true,
        // NO necesitamos reescribir la ruta, ya que tu función se llama 'api'.
      }
    }
  }
});
