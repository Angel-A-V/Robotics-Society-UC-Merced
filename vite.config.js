import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/admin': 'http://localhost:8000',
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  },
  define: {
    // Makes the Railway backend URL available in your React code
    // In dev: uses localhost. In production: uses the Railway URL from Cloudflare env vars.
    __API_BASE__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8000'),
    __WS_BASE__: JSON.stringify(process.env.VITE_WS_URL || 'ws://localhost:8000'),
  }
})