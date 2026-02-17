import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'WebMightals',
      fileName: 'web-mightals',
      formats: ['iife'],
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
