import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'omnifeedback': resolve(__dirname, '../src'),
      'omnifeedback/adapters/headless': resolve(__dirname, '../src/adapters/headless'),
      'omnifeedback/adapters/shadcn': resolve(__dirname, '../src/adapters/shadcn'),
      'omnifeedback/adapters/mantine': resolve(__dirname, '../src/adapters/mantine'),
      'omnifeedback/adapters/chakra': resolve(__dirname, '../src/adapters/chakra'),
      'omnifeedback/adapters/mui': resolve(__dirname, '../src/adapters/mui'),
      'omnifeedback/adapters/antd': resolve(__dirname, '../src/adapters/antd'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
