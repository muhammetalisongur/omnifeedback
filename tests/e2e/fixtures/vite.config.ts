/**
 * Vite configuration for E2E test fixture application.
 * Serves a minimal React app that exercises OmniFeedback components.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const projectRoot = resolve(__dirname, '../../..');

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      '@core': resolve(projectRoot, 'src/core'),
      '@hooks': resolve(projectRoot, 'src/hooks'),
      '@providers': resolve(projectRoot, 'src/providers'),
      '@components': resolve(projectRoot, 'src/components'),
      '@adapters': resolve(projectRoot, 'src/adapters'),
      '@utils': resolve(projectRoot, 'src/utils'),
      '@styles': resolve(projectRoot, 'src/styles'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
