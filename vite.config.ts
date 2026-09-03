import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],

  // GitHub Pages uses /Kiyaso/, Bolt/local use /
  base: process.env.GITHUB_ACTIONS ? '/Kiyaso/' : '/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'data-vendor': ['@supabase/supabase-js', 'zod', 'react-hook-form', '@hookform/resolvers'],
        },
      },
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});