import { defineConfig } from 'vite';
import { resolve, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

export default defineConfig({
  server: {
    proxy: {
      // Redirige las peticiones que empiezan por /api al emulador de funciones
      '/api': {
        target: 'http://127.0.0.1:8916/copyfast-control-v2/us-central1/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      // Permite usar '@/archivo' para referirse a la raíz de public
      '@': resolve(__dirname, 'public'),
    },
  },
  root: 'public', // Establecemos public como raíz para que Vite procese los JS
  envDir: '../', // Indica a Vite que busque los archivos .env en la raíz del proyecto (un nivel arriba de public)
  publicDir: '../static', // Nueva carpeta para archivos que NO se procesan (fetch, img, etc)
  build: {
    outDir: '../dist', // Al cambiar el root, dist debe estar un nivel arriba
    emptyOutDir: true,
    sourcemap: false, // Desactivar en producción para mayor seguridad
    rollupOptions: {
      // AUTOMATIZACIÓN: Busca todos los .html en public y sus subcarpetas
      input: Object.fromEntries(
        glob.sync('public/**/*.html').map(file => [
          relative('public', file.slice(0, file.length - extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        chunkFileNames: 'admin/js/[name]-[hash].js',
        entryFileNames: 'admin/js/[name]-[hash].js',
        assetFileNames: 'admin/assets/[name]-[hash].[ext]',
        // MEJORA: Separar Firebase y librerías de terceros en un archivo aparte
        manualChunks: {
          vendor: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        }
      }
    },
  },
});
