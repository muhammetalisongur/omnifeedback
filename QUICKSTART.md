# OmniFeedback Quick Start Guide

## 🚀 Project Status: IN DEVELOPMENT

This project is being built incrementally following the design documents in the `design/` folder.

## 📋 Requirements

- **Node.js** 18.0.0 or higher
- **pnpm** (recommended) or npm/yarn
- **React** 18.0.0 or higher

## 🛠️ Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/omnifeedback.git
cd omnifeedback
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

### 3. Run Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test -- --watch

# Run E2E tests
pnpm test:e2e
```

### 4. Build Library

```bash
pnpm build
```

## 📁 Project Structure

```
omnifeedback/
├── AGENTS.md              # AI agent development principles
├── README.md              # User documentation
├── IMPLEMENTATION.md      # Implementation status tracking
├── QUICKSTART.md          # This file
│
├── design/                # Feature design documents
│   ├── 00-project-setup.md
│   ├── 01-core-architecture.md
│   ├── 02-toast-system.md
│   └── ...
│
├── src/                   # Source code
│   ├── core/              # Core logic (UI agnostic)
│   ├── hooks/             # React hooks
│   ├── providers/         # React context
│   ├── components/        # Base components
│   ├── adapters/          # UI library adapters
│   ├── utils/             # Utilities
│   └── styles/            # CSS/animations
│
├── tests/                 # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                  # Documentation
└── examples/              # Example projects
```

## 🎯 Implementation Order

The project is being built in phases:

### Phase 1: Foundation ⏳
1. Project setup (tooling, TypeScript)
2. Core architecture (Manager, Store, Queue, Events)

### Phase 2: Components ⏳
3. Toast system
4. Modal system
5. Loading system
6. Alert system
7. Progress system
8. Confirm dialog

### Phase 3: Adapters ⏳
9. shadcn/ui adapter
10. Mantine adapter
11. Chakra UI adapter
12. MUI adapter
13. Ant Design adapter
14. Headless (Tailwind) adapter

### Phase 4: Publishing ⏳
15. NPM package setup and publish

## 🧪 Testing

### Running Tests

```bash
# Unit tests
pnpm test

# With UI
pnpm test:ui

# Coverage report
pnpm test:coverage

# E2E tests (requires running dev server)
pnpm test:e2e
```

### Writing Tests

Tests are located next to source files with `.test.ts` or `.test.tsx` extension:

```
src/
├── hooks/
│   ├── useToast.ts
│   └── useToast.test.ts
```

## 📖 Design Documents

Before implementing any feature, read the corresponding design document:

| Feature | Design Doc |
|---------|------------|
| Project Setup | `design/00-project-setup.md` |
| Core Architecture | `design/01-core-architecture.md` |
| Toast System | `design/02-toast-system.md` |
| Modal System | `design/03-modal-system.md` |
| Loading System | `design/04-loading-system.md` |
| Alert System | `design/05-alert-system.md` |
| Progress System | `design/06-progress-system.md` |
| Confirm Dialog | `design/07-confirm-dialog.md` |

## 🔧 Available Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm storybook        # Start Storybook

# Building
pnpm build            # Build for production
pnpm build-storybook  # Build Storybook

# Testing
pnpm test             # Run unit tests
pnpm test:coverage    # Run with coverage
pnpm test:e2e         # Run E2E tests

# Code Quality
pnpm lint             # Lint code
pnpm lint:fix         # Fix lint errors
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript check

# All checks
pnpm validate         # Run lint + typecheck + tests
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/...'"

**Solution**: Check that path aliases are configured in both `tsconfig.json` and `vite.config.ts`.

### Issue: Tests fail with "document is not defined"

**Solution**: Ensure `vitest.config.ts` has `environment: 'happy-dom'` configured.

### Issue: Build fails with peer dependency warnings

**Solution**: UI library adapters have peer dependencies. Install the required library for your adapter.

### Issue: TypeScript errors about `any`

**Solution**: This project uses strict mode. Never use `any` - create proper types instead.

## 📝 Contribution Guidelines

1. Read the design document before implementing
2. Write tests first (TDD preferred)
3. Ensure all tests pass before committing
4. Keep coverage above 90%
5. Update IMPLEMENTATION.md with progress
6. Follow the code style in AGENTS.md

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vitest](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🆘 Getting Help

- Check design docs for specifications
- Check existing tests for usage examples
- Check AGENTS.md for development principles
- Open an issue for bugs or questions

---

**Happy coding! 🎉**
