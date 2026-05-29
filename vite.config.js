import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Scam-shield-platform/', // Must match exact GitHub repo name (capital S)
  plugins: [
    react(),
    tailwindcss(),
  ],
})

