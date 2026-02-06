# Design: Project Setup

## Overview
Set up the OmniFeedback React library project with modern tooling, TypeScript strict mode, and comprehensive testing infrastructure.

## Goals
- Create a minimal, modern React library project
- Enable tree-shaking and optimal bundle size
- Provide excellent developer experience
- Support all major UI library adapters
- Comprehensive testing setup

## Project Structure

```
omnifeedback/
├── src/
│   ├── index.ts                 # Main exports
│   ├── core/
│   │   ├── index.ts
│   │   ├── FeedbackManager.ts
│   │   ├── FeedbackStore.ts
│   │   ├── FeedbackQueue.ts
│   │   ├── EventBus.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useFeedback.ts
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   ├── useLoading.ts
│   │   ├── useAlert.ts
│   │   ├── useProgress.ts
│   │   └── useConfirm.ts
│   ├── providers/
│   │   ├── index.ts
│   │   └── FeedbackProvider.tsx
│   ├── components/
│   │   ├── Toast/
│   │   ├── Modal/
│   │   ├── Loading/
│   │   ├── Alert/
│   │   ├── Progress/
│   │   └── Confirm/
│   ├── adapters/
│   │   ├── types.ts
│   │   ├── shadcn/
│   │   ├── mantine/
│   │   ├── chakra/
│   │   ├── mui/
│   │   ├── antd/
│   │   └── headless/
│   ├── utils/
│   │   ├── classNames.ts
│   │   ├── constants.ts
│   │   ├── animation.ts
│   │   ├── positioning.ts
│   │   └── accessibility.ts
│   └── styles/
│       ├── base.css
│       └── animations.css
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
├── demo/                        # Interactive demo site with Playground
│
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.js
└── postcss.config.js
```

## Key Configuration Files

### package.json
```json
{
  "name": "omnifeedback",
  "version": "0.1.0",
  "description": "Universal React feedback management - Toast, Modal, Loading, Alert with multi-library support",
  "author": "Your Name",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./adapters/shadcn": {
      "import": "./dist/adapters/shadcn/index.js",
      "require": "./dist/adapters/shadcn/index.cjs",
      "types": "./dist/adapters/shadcn/index.d.ts"
    },
    "./adapters/mantine": {
      "import": "./dist/adapters/mantine/index.js",
      "require": "./dist/adapters/mantine/index.cjs",
      "types": "./dist/adapters/mantine/index.d.ts"
    },
    "./adapters/chakra": {
      "import": "./dist/adapters/chakra/index.js",
      "require": "./dist/adapters/chakra/index.cjs",
      "types": "./dist/adapters/chakra/index.d.ts"
    },
    "./adapters/mui": {
      "import": "./dist/adapters/mui/index.js",
      "require": "./dist/adapters/mui/index.cjs",
      "types": "./dist/adapters/mui/index.d.ts"
    },
    "./adapters/antd": {
      "import": "./dist/adapters/antd/index.js",
      "require": "./dist/adapters/antd/index.cjs",
      "types": "./dist/adapters/antd/index.d.ts"
    },
    "./adapters/headless": {
      "import": "./dist/adapters/headless/index.js",
      "require": "./dist/adapters/headless/index.cjs",
      "types": "./dist/adapters/headless/index.d.ts"
    },
    "./styles": "./dist/styles/index.css"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "sideEffects": [
    "*.css"
  ],
  "keywords": [
    "react",
    "toast",
    "modal",
    "loading",
    "alert",
    "feedback",
    "notification",
    "shadcn",
    "mantine",
    "chakra",
    "mui",
    "antd",
    "tailwind"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc -p tsconfig.build.json && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit",
    "validate": "pnpm lint && pnpm typecheck && pnpm test run",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "prepublishOnly": "pnpm validate && pnpm build"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "@radix-ui/react-toast": { "optional": true },
    "@radix-ui/react-dialog": { "optional": true },
    "@mantine/core": { "optional": true },
    "@mantine/hooks": { "optional": true },
    "@chakra-ui/react": { "optional": true },
    "@mui/material": { "optional": true },
    "antd": { "optional": true }
  },
  "dependencies": {
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@vitest/coverage-v8": "^1.3.0",
    "@vitest/ui": "^1.3.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "happy-dom": "^13.0.0",
    "playwright": "^1.41.0",
    "postcss": "^8.4.0",
    "prettier": "^3.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.1.0",
    "vite-plugin-dts": "^3.7.0",
    "vitest": "^1.3.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Strict Type Checking */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    /* Additional Checks */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@hooks/*": ["src/hooks/*"],
      "@components/*": ["src/components/*"],
      "@adapters/*": ["src/adapters/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.build.json" }]
}
```

### tsconfig.build.json
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "allowImportingTsExtensions": false
  },
  "include": ["src"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"]
}
```

### vite.config.ts
```typescript
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
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@components': resolve(__dirname, 'src/components'),
      '@adapters': resolve(__dirname, 'src/adapters'),
      '@utils': resolve(__dirname, 'src/utils'),
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
        '@radix-ui/react-toast',
        '@radix-ui/react-dialog',
        '@mantine/core',
        '@mantine/hooks',
        '@chakra-ui/react',
        '@mui/material',
        'antd',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
});
```

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.stories.tsx',
        'src/index.ts',
      ],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@components': resolve(__dirname, 'src/components'),
      '@adapters': resolve(__dirname, 'src/adapters'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
});
```

### .eslintrc.cjs
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'vitest.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // TypeScript strict rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    
    // React rules
    'react/prop-types': 'off',
    'react/display-name': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        'slide-out-right': 'slide-out-right 0.2s ease-in',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      zIndex: {
        'toast': '9999',
        'modal': '10000',
        'modal-backdrop': '9998',
        'loading': '10001',
      },
    },
  },
  plugins: [],
};
```

### tests/setup.ts
```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Implementation Steps

1. **Initialize Project**
   ```bash
   mkdir omnifeedback
   cd omnifeedback
   pnpm init
   ```

2. **Install Dependencies**
   ```bash
   # Core dependencies
   pnpm add zustand
   
   # Dev dependencies
   pnpm add -D typescript vite @vitejs/plugin-react vite-plugin-dts
   pnpm add -D vitest @vitest/coverage-v8 @vitest/ui happy-dom
   pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
   pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
   pnpm add -D eslint-plugin-react eslint-plugin-react-hooks
   pnpm add -D prettier tailwindcss postcss autoprefixer
   pnpm add -D react react-dom @types/react @types/react-dom
   pnpm add -D playwright @playwright/test
   ```

3. **Create Directory Structure**
   ```bash
   mkdir -p src/{core,hooks,providers,components,adapters,utils,styles}
   mkdir -p src/components/{Toast,Modal,Loading,Alert,Progress,Confirm}
   mkdir -p src/adapters/{shadcn,mantine,chakra,mui,antd,headless}
   mkdir -p tests/{unit,integration,e2e}
   mkdir -p docs examples
   ```

4. **Create Configuration Files**
   - Create all config files as shown above
   - Make sure tsconfig is properly configured

5. **Create Initial Source Files**
   - Create `src/index.ts` with placeholder exports
   - Create empty `index.ts` in each subdirectory

6. **Verify Setup**
   ```bash
   pnpm typecheck    # Should pass with no errors
   pnpm lint         # Should pass with no errors
   pnpm test         # Should run (no tests yet)
   pnpm build        # Should create dist folder
   ```

## Testing Checklist

- [ ] `pnpm install` succeeds
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` runs without error
- [ ] `pnpm build` creates dist folder
- [ ] `pnpm dev` starts dev server
- [ ] Path aliases work (@core, @hooks, etc.)
- [ ] CSS/Tailwind works

## Common Issues

### Issue: "Cannot find module '@/...'"
**Solution**: Verify path aliases in both tsconfig.json and vite.config.ts match

### Issue: "Type 'any' is not allowed"
**Solution**: Enable strict mode and fix all type issues - never use `any`

### Issue: "Build fails with external dependency errors"
**Solution**: Add all peer dependencies to rollupOptions.external

### Issue: "Tests fail with 'document is not defined'"
**Solution**: Ensure vitest.config.ts has `environment: 'happy-dom'`

### Issue: "CSS not included in build"
**Solution**: Import CSS in index.ts and add to sideEffects in package.json

## Agent Checklist

When implementing this:
- [ ] Create all directories as specified
- [ ] Create package.json with all dependencies
- [ ] Create tsconfig.json with strict mode
- [ ] Create vite.config.ts with library build
- [ ] Create vitest.config.ts with coverage
- [ ] Create .eslintrc.cjs with strict rules
- [ ] Create tailwind.config.js with animations
- [ ] Create tests/setup.ts with mocks
- [ ] Create placeholder index.ts files
- [ ] Verify all commands work
- [ ] Document any deviations

## Notes

- Keep dependencies minimal initially
- Don't add UI library dependencies yet - they're peer deps
- Focus on build infrastructure first
- Tests should work even with no actual code
- ESLint strict mode will catch `any` usage early
