import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/router': path.resolve(__dirname, './src/router'),
    },
  },
  build: {
    // Production optimizations
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // TanStack libraries
          'tanstack-vendor': ['@tanstack/react-query', '@tanstack/react-table'],
          // Form libraries
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'yup'],
          // UI component libraries (Radix UI)
          'radix-vendor': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          // Chart library (large)
          'chart-vendor': ['recharts'],
          // Icon library (large)
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    // Optimize chunk size
    target: 'esnext',
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      // Proxy API requests to backend
      // In Docker: uses service name 'api' via Docker network
      // Local dev: uses localhost:8000
      '/api': {
        target: process.env.DOCKER_SERVICE_API || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

