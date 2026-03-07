import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Charts library separate chunk
          'charts': ['recharts'],
          // AI services separate chunk
          'ai': ['compromise', 'compromise-dates', 'compromise-numbers'],
          // Date utilities
          'date-utils': ['date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase slightly from 500 to 600
  },
});
