/**
 * main.jsx — Application Entry Point
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the very first file React reads when the app starts.
 * It mounts the root <App /> component into the <div id="root"> element
 * that lives inside index.html.
 *
 * <StrictMode> is a development tool from React that:
 *   • Intentionally renders components twice to catch side-effects
 *   • Warns about deprecated lifecycle methods / unsafe patterns
 *   • Has NO effect in production builds — it's purely a dev safety net
 *
 * index.css is imported here so global base styles (font, reset, etc.)
 * are applied before any component renders.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // Global CSS reset + font stack
import App from './App.jsx'

// Find the <div id="root"> in index.html and hand React control over it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
