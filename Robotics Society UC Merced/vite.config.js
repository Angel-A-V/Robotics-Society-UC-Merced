// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request from React starting with /api gets forwarded to Django
      '/api': 'http://localhost:8000',
      // Any request to /admin goes to Django's built-in admin panel
      '/admin': 'http://localhost:8000',
      // WebSocket connections — ws:// needs its own proxy entry with ws: true
      // Without this, the browser's WebSocket call to ws://localhost:5173/ws/chat/1/
      // would fail because Vite doesn't know to forward it to port 8000
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,     // tells Vite this is a WebSocket proxy, not a regular HTTP one
      },
    }
  }
})