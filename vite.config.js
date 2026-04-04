import { defineConfig } from 'vite';
import { resolve } from 'path';

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
  root: 'public', // Establecemos public como raíz para que Vite procese los JS
  envDir: '../', // Indica a Vite que busque los archivos .env en la raíz del proyecto (un nivel arriba de public)
  publicDir: '../static', // Nueva carpeta para archivos que NO se procesan (fetch, img, etc)
  build: {
    outDir: '../dist', // Al cambiar el root, dist debe estar un nivel arriba
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Páginas Pública
        main: resolve(__dirname, 'public/index.html'),
        'diseño': resolve(__dirname, 'public/diseño.html'),
        acercade: resolve(__dirname, 'public/acercade.html'),
        cotizacion: resolve(__dirname, 'public/cotizacion.html'),
        'conversor-divisas': resolve(__dirname, 'public/conversor-divisas.html'),
        herramientas: resolve(__dirname, 'public/herramientas.html'),
        'remover-fondo': resolve(__dirname, 'public/remover-fondo.html'),
        'quitar-bordes': resolve(__dirname, 'public/quitar-bordes.html'),
        'duplicar-tamaño': resolve(__dirname, 'public/duplicar-tamaño.html'),
        vectorizar: resolve(__dirname, 'public/vectorizar.html'),
        'dividir-imagen': resolve(__dirname, 'public/dividir-imagen.html'),
        'mejorar-calidad': resolve(__dirname, 'public/mejorar-calidad.html'),
        especificaciones: resolve(__dirname, 'public/especificaciones.html'),

        // Páginas de Administración
        admin: resolve(__dirname, 'public/admin/admin.html'),
        login: resolve(__dirname, 'public/admin/login-registro.html'),
        ventas: resolve(__dirname, 'public/admin/ventas.html'),
        gastos: resolve(__dirname, 'public/admin/gastos.html'),
        clientes: resolve(__dirname, 'public/admin/clientes.html'),
        analisis: resolve(__dirname, 'public/admin/analisis.html'),
        costos: resolve(__dirname, 'public/admin/costos.html'),
        deudores: resolve(__dirname, 'public/admin/deudores.html'),
        inventario: resolve(__dirname, 'public/admin/inventario.html'),
      },
      output: {
        chunkFileNames: 'admin/js/[name]-[hash].js',
        entryFileNames: 'admin/js/[name]-[hash].js',
        assetFileNames: 'admin/assets/[name]-[hash].[ext]'
      }
    },
  },
});
