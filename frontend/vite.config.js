import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, host: true },
  build: { outDir: 'dist' },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.js',

  esbuild: {
    legalComments: 'none',
  },
  build: {
    sourcemap: false, 
  },
  define: {
    'process.env': {}
    }
  }
})
