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
    }
  }
})