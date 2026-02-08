import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@providers': resolve(__dirname, 'src/providers'),
      '@components': resolve(__dirname, 'src/components'),
      '@adapters': resolve(__dirname, 'src/adapters'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'adapters/shadcn/index': resolve(__dirname, 'src/adapters/shadcn/index.ts'),
        'adapters/mantine/index': resolve(__dirname, 'src/adapters/mantine/index.ts'),
        'adapters/chakra/index': resolve(__dirname, 'src/adapters/chakra/index.ts'),
        'adapters/mui/index': resolve(__dirname, 'src/adapters/mui/index.ts'),
        'adapters/antd/index': resolve(__dirname, 'src/adapters/antd/index.ts'),
        'adapters/headless/index': resolve(__dirname, 'src/adapters/headless/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mantine/core',
        '@mantine/hooks',
        '@chakra-ui/react',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled',
        'antd',
        'zustand',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          zustand: 'zustand',
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
