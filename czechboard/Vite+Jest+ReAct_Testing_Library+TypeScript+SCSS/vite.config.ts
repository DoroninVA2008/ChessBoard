import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  timeout: 30_000,
  resolve: { 
    alias: { 
      '@': './src' 
    }
  },
  base: '/',
  server: { 
    port: 1449, 
    strictPort: true,
    open: true, 
    host: true,
  },
})