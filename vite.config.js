import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from "@cloudflare/vite-plugin"
import seoPages from './vite-plugins/seo-pages.js'

export default defineConfig({
  // seoPages: per-page <head> tags + sitemap.xml for Google (see src/data/seo.js)
  plugins: [react(), cloudflare(), seoPages()],
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
  }
})