// ── Entry Point ────────────────────────────────────────────────────────
// Mounts the app into <div id="root"> in index.html and loads the
// stylesheet manifest. Nothing else belongs in this file.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
