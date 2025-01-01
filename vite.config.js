import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
  },
  optimizeDeps: {
    include: ['react-quill'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  proxy: {
    '/devslog/server': {
      target: 'http://localhost',
      changeOrigin: true,
      secure: false,
    }
  },
  resolve: {
    alias: {
      'react-quill': 'react-quill',
    },
  },
})

