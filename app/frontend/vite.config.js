import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <--- ESTO ES LO MÁS IMPORTANTE
    port: 5173,
    watch: {
      usePolling: true, // Esto ayuda a que detecte cambios en Windows
    },
  },
})