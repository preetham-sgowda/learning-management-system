import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    open: true,
    allowedHosts: true,

    proxy: {
      '/api': {
        target: 'https://learning-management-system-1-i9my.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})