import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: Object.fromEntries(['/auth', '/items', '/outfits'].map(path => [path, {
      target: process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:8080',
      changeOrigin: true,
    }])),
  },
})
