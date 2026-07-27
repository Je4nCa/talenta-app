import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(() => ({
  // Antes servía desde github.io/talenta-app/ (subpath) — ahora el dominio
  // propio (talentaapp.com) sirve el sitio desde la raíz, y GitHub Pages ya
  // redirige la URL vieja del subpath a ese dominio. Sin este cambio, todos
  // los assets del build quedan referenciados en /talenta-app/... que ya no
  // existe, y el sitio carga solo el HTML vacío (JS/CSS en 404).
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
}))
