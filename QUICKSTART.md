# OmniFeedback Quick Start Guide

## Project Status

Phase 1-4 completed. Phase 5 (Quality & Publishing) in progress.

- 15 feedback types, 18 hooks, 15 component directories
- 6 UI library adapters (96 adapter components)
- 54 test files (47 unit, 4 integration, 3 e2e), 1081 tests, 90% coverage threshold

## Requirements

- **Node.js** 18.0.0 or higher
- **pnpm** (recommended) or npm/yarn
- **React** 18.0.0 or higher

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/muhammetalisongur/omnifeedback.git
cd omnifeedback
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

### 3. Run Tests

```bash
# Run all tests (unit + integration)
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

## Project Structure

```
omnifeedback/
├── AGENTS.md              # AI agent development principles
├── README.md              # User documentation
├── IMPLEMENTATION.md      # Implementation status tracking
├── QUICKSTART.md          # This file
├── CHANGELOG.md           # Version history
│
├── design/                # Feature design documents (24 files)
│   ├── 00-project-setup.md
│   ├── 01-core-architecture.md
│   ├── 02-toast-system.md
│   ├── ...
│   ├── 22-adapter-headless.md
│   └── 23-npm-publishing.md
│
├── src/                   # Source code
│   ├── index.ts           # Main library entry point
│   ├── core/              # Core logic (UI agnostic)
│   │   ├── types.ts       # 877-line type definitions
│   │   ├── FeedbackManager.ts
│   │   ├── FeedbackStore.ts
│   │   ├── FeedbackQueue.ts
│   │   └── EventBus.ts
│   ├── hooks/             # 18 React hooks (co-located tests)
│   ├── providers/         # FeedbackProvider (React context)
│   ├── components/        # 15 component directories
│   ├── adapters/          # 6 UI library adapters
│   │   ├── headless/      # Pure Tailwind CSS (reference impl)
│   │   ├── shadcn/        # Radix UI + Tailwind
│   │   ├── mantine/       # @mantine/core
│   │   ├── chakra/        # @chakra-ui/react
│   │   ├── mui/           # @mui/material
│   │   └── antd/          # Ant Design
│   ├── utils/             # Utilities (generateId, cn, positioning)
│   └── styles/            # CSS/animations
│
├── tests/                 # Test infrastructure & cross-cutting tests
│   ├── setup.ts           # Global test setup (DOM mocks, cleanup)
│   ├── unit/              # Setup validation tests
│   ├── integration/       # Provider + Core integration tests
│   └── e2e/               # Playwright E2E tests
│
│   NOTE: Unit tests are co-located with source files (src/**/*.test.{ts,tsx})
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

## Implementation Phases

### Phase 1: Foundation ✅
1. Project setup (tooling, TypeScript, Vite, Vitest)
2. Core architecture (FeedbackManager, Store, Queue, EventBus)

### Phase 2: Core Components (6) ✅
3. Toast system (6 positions, countdown, pause on hover, promise API)
4. Modal system (focus trap, scroll lock, nested modals, 5 sizes)
5. Loading system (5 spinners, overlay, wrap() API, cancellable)
6. Alert system (5 variants, dismissible, action buttons)
7. Progress system (linear + circular, indeterminate, striped)
8. Confirm dialog (Promise-based, primary/danger variants)

### Phase 3: Extended Components (9) ✅
9. Banner system (full-width, localStorage dismiss, sticky)
10. Drawer system (4 positions, 5 sizes, overlay)
11. Popconfirm system (12 placements, arrow, popover-based)
12. Skeleton system (compound: Text, Avatar, Card, Table)
13. Empty state (8 presets: no-data, 404, 403, 500, etc.)
14. Result page (7 status types)
15. Connection status (online/offline detection, action queue)
16. Prompt dialog (Promise-based input, validation)
17. Sheet system (snap points, drag-to-dismiss, action sheet)

### Phase 4: Adapters (6 x 16 components) ✅
18. shadcn/ui adapter
19. Mantine adapter
20. Chakra UI adapter
21. MUI adapter
22. Ant Design adapter
23. Headless (Tailwind) adapter

### Phase 5: Quality & Publishing ⏳
24. NPM publishing setup
25. Integration tests ✅
26. E2E tests ✅

## Testing

### Test Strategy

| Type | Location | Count |
|------|----------|-------|
| Unit tests | `src/**/*.test.{ts,tsx}` (co-located) | 43 files |
| Integration tests | `tests/integration/` | 4 files |
| E2E tests | `tests/e2e/` | 3 specs |
| Setup | `tests/setup.ts` | 1 file |

### Running Tests

```bash
# Unit + integration tests
pnpm test

# Visual test runner
pnpm test:ui

# Coverage report (90% threshold)
pnpm test:coverage

# E2E tests (Playwright)
pnpm test:e2e
```

### Writing Tests

Unit tests are co-located next to source files:

```
src/
├── hooks/
│   ├── useToast.ts
│   └── useToast.test.tsx
├── core/
│   ├── FeedbackManager.ts
│   └── FeedbackManager.test.ts
```

## Design Documents

All 24 design documents specify feature requirements before implementation:

| # | Feature | Design Doc |
|---|---------|------------|
| 00 | Project Setup | `design/00-project-setup.md` |
| 01 | Core Architecture | `design/01-core-architecture.md` |
| 02 | Toast System | `design/02-toast-system.md` |
| 03 | Modal System | `design/03-modal-system.md` |
| 04 | Loading System | `design/04-loading-system.md` |
| 05 | Alert System | `design/05-alert-system.md` |
| 06 | Progress System | `design/06-progress-system.md` |
| 07 | Confirm Dialog | `design/07-confirm-dialog.md` |
| 08 | Banner System | `design/08-banner-system.md` |
| 09 | Drawer System | `design/09-drawer-system.md` |
| 10 | Popconfirm System | `design/10-popconfirm-system.md` |
| 11 | Skeleton System | `design/11-skeleton-system.md` |
| 12 | Empty State | `design/12-empty-state.md` |
| 13 | Result Page | `design/13-result-page.md` |
| 14 | Connection Status | `design/14-connection-status.md` |
| 15 | Prompt Dialog | `design/15-prompt-dialog.md` |
| 16 | Sheet System | `design/16-sheet-system.md` |
| 17 | shadcn/ui Adapter | `design/17-adapter-shadcn.md` |
| 18 | Mantine Adapter | `design/18-adapter-mantine.md` |
| 19 | Chakra UI Adapter | `design/19-adapter-chakra.md` |
| 20 | MUI Adapter | `design/20-adapter-mui.md` |
| 21 | Ant Design Adapter | `design/21-adapter-antd.md` |
| 22 | Headless Adapter | `design/22-adapter-headless.md` |
| 23 | NPM Publishing | `design/23-npm-publishing.md` |

## Available Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm storybook        # Start Storybook

# Building
pnpm build            # Production build

# Testing
pnpm test             # Run unit + integration tests
pnpm test:coverage    # Run with coverage report
pnpm test:ui          # Visual test runner
pnpm test:e2e         # Run Playwright E2E tests

# Code Quality
pnpm lint             # Lint code
pnpm lint:fix         # Fix lint errors
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript check

# All checks
pnpm validate         # Run lint + typecheck + tests
```

## Troubleshooting

### Issue: "Cannot find module '@/...'"

**Solution**: Check that path aliases are configured in both `tsconfig.json` and `vite.config.ts`.

### Issue: Tests fail with "document is not defined"

**Solution**: Ensure `vitest.config.ts` has `environment: 'happy-dom'` configured.

### Issue: Build fails with peer dependency warnings

**Solution**: UI library adapters have peer dependencies. Install the required library for your adapter.

### Issue: TypeScript errors about `any`

**Solution**: This project uses strict mode. Never use `any` - create proper types instead.

## Contribution Guidelines

1. Read the design document before implementing
2. Write tests first (TDD preferred)
3. Ensure all tests pass before committing
4. Keep coverage above 90%
5. Update IMPLEMENTATION.md with progress
6. Follow the code style in AGENTS.md

## Resources

- [React Documentation](https://react.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vitest](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)

## Getting Help

- Check design docs for specifications
- Check existing tests for usage examples
- Check AGENTS.md for development principles
- Open an issue at [GitHub](https://github.com/muhammetalisongur/omnifeedback/issues)
