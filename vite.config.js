import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // host: true hace que Vite escuche en 0.0.0.0 en lugar de 127.0.0.1.
    // Esto es necesario para que el puerto sea accesible desde fuera del
    // contenedor Docker cuando se usa el modo de desarrollo (npm run dev).
    // En el modo de producción (multi-stage build + Nginx) esto no aplica.
    host: true,
    port: 5173,
  },
})
