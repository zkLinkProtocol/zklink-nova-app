import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const pathResolve = (path: string): string => resolve(process.cwd(), path)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': pathResolve('src'),
      '#': pathResolve('types'),
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/twitter': {
        target: "https://api.twitter.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/twitter/, '')
      },
      '/api': {
        target: "http://13.114.13.100:3055",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/points': {
        target: "http://13.114.13.100:3055",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/points/, '')
      }
    }
  }
})
