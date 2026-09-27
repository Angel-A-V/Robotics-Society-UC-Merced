import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ── Ignored paths ──
  // Only src/ is ours. Without these, `npm run lint` also walks Django's
  // collected static files and the Python venv's vendored JavaScript, which
  // buries our own 14 findings under ~3,200 from third-party code.
  globalIgnores([
    'dist',         // Build output
    'backend/**',   // Python side — the only JS in there is vendored
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
