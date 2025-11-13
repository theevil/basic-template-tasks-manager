import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @use "sass:color";
          @use "@/styles/variables" as *;
          @use "@/styles/globals/base" as *;
        `,
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0',
    cors: true,
    hmr: {
      host: 'localhost',
      port: 3000,
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
    },
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      },
      // Proxy WebSocket for HMR
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    },
  },
})
