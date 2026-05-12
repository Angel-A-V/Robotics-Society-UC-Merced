// src/api.js — central config for API and WebSocket URLs
// In development: uses empty string so Vite proxy handles /api → localhost:8000
// In production: uses the Railway backend URL from the build environment variable

export const API_BASE = import.meta.env.VITE_API_URL || ''
export const WS_BASE  = import.meta.env.VITE_WS_URL  || ''