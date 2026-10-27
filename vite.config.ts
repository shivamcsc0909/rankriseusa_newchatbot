import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    include: ['react-simple-maps', 'prop-types'],
  },

  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      // Local only: forward /api/* to PHP built-in server (npm run dev:php / npm run dev:local).
      // Production is unchanged — Hostinger serves public_html/api via Apache + PHP.
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (
              id.includes('d3-') ||
              id.includes('topojson') ||
              id.includes('react-simple-maps')
            ) {
              return 'maps-vendor';
            }

            if (id.includes('framer-motion') || id.includes('motion-dom')) {
              return 'motion';
            }

            if (id.includes('swiper')) {
              return 'swiper-vendor';
            }

            if (id.includes('@paypal')) {
              return 'paypal-vendor';
            }

            if (id.includes('@radix-ui')) {
              return 'radix-vendor';
            }

            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/react-router/') ||
              id.includes('/node_modules/react-router-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'react-vendor';
            }

            return 'vendor';
          }
        },
      },
    },
  },
});