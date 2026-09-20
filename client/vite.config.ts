import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', 'canvas-confetti', 'clsx', 'tailwind-merge', 'gsap'],
    force: true,
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: true,
    },
  },
})
