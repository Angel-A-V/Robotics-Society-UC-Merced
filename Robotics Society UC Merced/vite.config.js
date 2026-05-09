// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // REST API — forwarded to Django
      '/api': 'http://localhost:8000',

      // Django admin panel
      '/admin': 'http://localhost:8000',

      // WebSocket — must use ws:// target with ws:true flag
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },

      // Media files (uploaded images, PDFs, documents)
      // Without this proxy, /media/ URLs hit Vite's dev server (port 5173)
      // which returns 404 because media lives on Django (port 8000).
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },

      // Static files (Django admin CSS/JS when accessed through Vite)
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  }
})