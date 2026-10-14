import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  timeout: 30_000,
  resolve: { 
    alias: { 
      '@': '/src' 
    }
  },
  base: '/',
  server: { 
    port: 5173, // 1449 
    strictPort: true,
    open: true, 
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://127.0.0.1:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})