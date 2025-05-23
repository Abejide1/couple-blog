import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Base path for Capacitor
  base: './',
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Sourcemaps for debugging
    sourcemap: true,
  },
  // Server settings
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    // For handling cross-origin requests in development
    cors: true,
  },
})
