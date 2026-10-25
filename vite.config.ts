import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'recharts-vendor': ['recharts'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
