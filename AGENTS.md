# Agent Development Principles for OmniFeedback

## Project Overview

OmniFeedback is a **universal React feedback management library** that provides Toast, Modal, Loading, Alert, Progress, and other feedback components through a single unified API. This is an **LLM-agent-coded project** where the human developer provides feedback but does not write code directly.

**Key Differentiator:** One API that works seamlessly with shadcn/ui, Mantine, Chakra UI, MUI, Ant Design, and pure Tailwind CSS.

## Core Development Principles

### 1. Design-First Approach
- Every feature has a corresponding `design/*.md` file
- Read the design doc before implementing a feature
- Design docs specify:
  - High-level architecture
  - Key interfaces and their responsibilities
  - Edge cases and gotchas
  - Testing considerations
  - Usage examples

### 2. Multi-Library Compatibility
- **Adapter Pattern:** Each UI library has its own adapter
- **Zero coupling:** Core logic must be UI-library agnostic
- **Consistent API:** Same hook interface regardless of adapter
- **Tree-shakeable:** Users only bundle what they use

### 3. Code Quality Standards

#### TypeScript Strict Mode
- `strict: true` in tsconfig.json
- No `any` types (absolutely none)
- Explicit return types on all public functions
- Comprehensive JSDoc comments

#### Simplicity Over Cleverness
- Write straightforward, readable code
- Avoid premature optimization
- No unnecessary abstractions
- Clear naming over comments

#### SOLID Principles
- **S**ingle Responsibility: Each class/function does one thing
- **O**pen/Closed: Extend via adapters, not modification
- **L**iskov Substitution: Adapters are interchangeable
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Core depends on abstractions

#### Error Handling
- Never throw unhandled errors
- Provide meaningful error messages
- Graceful degradation when possible
- Log errors clearly for debugging

### 4. Incremental Development
- Build features one at a time
- Each feature should be testable independently
- Commit working code frequently
- Don't break existing functionality
- Follow semantic versioning

### 5. Performance Requirements
- **Bundle size:** Core < 10KB gzipped
- **First render:** < 16ms
- **No layout shifts:** Use portals and fixed positioning
- **Memory efficient:** Clean up timers and subscriptions
- **Tree-shakeable:** Support dead code elimination

### 6. Testing Requirements
- **Coverage:** >= 90% for all metrics
- **Unit tests:** Every component, hook, and utility
- **Integration tests:** Adapter + Core combinations
- **E2E tests:** Real browser scenarios with Playwright
- **Visual tests:** No layout regressions

### 7. Zero Tolerance for Bugs
- No z-index conflicts
- No layout shifts or visual glitches
- No memory leaks
- No accessibility violations
- No unhandled edge cases

## Project Structure

```
omnifeedback/
├── AGENTS.md                    # This file - AI agent instructions
├── README.md                    # User-facing documentation
├── IMPLEMENTATION.md            # Implementation status tracking
├── QUICKSTART.md                # Quick start guide
├── CHANGELOG.md                 # Version history
│
├── design/                      # Feature design documents
│   ├── 00-project-setup.md      # Initial setup, tooling
│   ├── 01-core-architecture.md  # Core system design
│   ├── 02-toast-system.md       # Toast implementation
│   ├── 03-modal-system.md       # Modal implementation
│   ├── 04-loading-system.md     # Loading/spinner implementation
│   ├── 05-alert-system.md       # Alert implementation
│   ├── 06-progress-system.md    # Progress bar implementation
│   ├── 07-confirm-dialog.md     # Confirm dialog implementation
│   ├── 08-banner-system.md      # Banner/announcement implementation
│   ├── 09-drawer-system.md      # Drawer/side panel implementation
│   ├── 10-popconfirm-system.md  # Popconfirm implementation
│   ├── 11-skeleton-system.md    # Skeleton/placeholder implementation
│   ├── 12-empty-state.md        # Empty state implementation
│   ├── 13-result-page.md        # Result page implementation
│   ├── 14-connection-status.md  # Connection status implementation
│   ├── 15-prompt-dialog.md      # Prompt dialog implementation
│   ├── 16-sheet-system.md       # Bottom sheet implementation
│   ├── 17-adapter-shadcn.md     # shadcn/ui adapter
│   ├── 18-adapter-mantine.md    # Mantine adapter
│   ├── 19-adapter-chakra.md     # Chakra UI adapter
│   ├── 20-adapter-mui.md        # MUI adapter
│   ├── 21-adapter-antd.md       # Ant Design adapter
│   ├── 22-adapter-headless.md   # Headless/Tailwind adapter
│   └── 23-npm-publishing.md     # NPM package setup
│
├── src/                         # Source code
│   ├── index.ts                 # Main exports
│   ├── core/                    # UI-agnostic core logic
│   ├── hooks/                   # React hooks
│   ├── providers/               # React context providers
│   ├── components/              # Base components
│   ├── adapters/                # UI library adapters
│   ├── utils/                   # Utility functions
│   └── styles/                  # Base CSS/animations
│
├── tests/                       # Test infrastructure & cross-cutting tests
│   ├── setup.ts                 # Global test setup (DOM mocks, cleanup)
│   ├── unit/                    # Setup validation tests
│   ├── integration/             # Adapter + Core integration tests
│   └── e2e/                     # Playwright E2E tests
│
│   NOTE: Unit tests are co-located with source files (src/**/*.test.{ts,tsx})
│   This follows modern React testing conventions for better DX.
│
├── docs/                        # Documentation
├── examples/                    # Example projects
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

## Implementation Order

### Phase 1: Foundation
1. **00-project-setup** - Tooling, TypeScript, build system
2. **01-core-architecture** - FeedbackManager, Store, EventBus, Queue

### Phase 2: Core Components (6 components) ✅
3. **02-toast-system** - Toast component and useToast hook
4. **03-modal-system** - Modal component and useModal hook
5. **04-loading-system** - Loading component and useLoading hook
6. **05-alert-system** - Alert component and useAlert hook
7. **06-progress-system** - Progress component and useProgress hook
8. **07-confirm-dialog** - Confirm dialog and useConfirm hook

### Phase 3: Extended Components (9 new components) ✅
9. **08-banner-system** - Banner/announcement and useBanner hook
10. **09-drawer-system** - Drawer/side panel and useDrawer hook
11. **10-popconfirm-system** - Popconfirm and usePopconfirm hook
12. **11-skeleton-system** - Skeleton components and useSkeleton hook
13. **12-empty-state** - Empty state preset components
14. **13-result-page** - Result page component
15. **14-connection-status** - Connection status and useConnection hook
16. **15-prompt-dialog** - Prompt dialog and usePrompt hook
17. **16-sheet-system** - Bottom sheet and useSheet hook

### Phase 4: Adapters (6 adapters × 16 components) ✅
18. **17-adapter-shadcn** - shadcn/ui integration
19. **18-adapter-mantine** - Mantine integration
20. **19-adapter-chakra** - Chakra UI integration
21. **20-adapter-mui** - MUI integration
22. **21-adapter-antd** - Ant Design integration
23. **22-adapter-headless** - Pure Tailwind/Headless

### Phase 5: Quality & Publishing ⏳
24. **23-npm-publishing** - Package, docs, release
25. **Integration tests** - Adapter + Core combinations
26. **E2E tests** - Playwright browser tests

## Testing Strategy

### Unit Testing (Vitest + React Testing Library)
- **Co-located with source files** (src/**/*.test.{ts,tsx})
- Test each component in isolation
- Test hooks with renderHook
- Test utilities with pure functions
- Mock adapters for core tests
- Currently: 50 test files (42 unit + 1 setup, 4 integration, 3 e2e), 1081 tests passing

### Integration Testing (tests/integration/)
- Test Core + Adapter combinations
- Test Provider + Hook interactions
- Test real DOM updates
- Test feedback lifecycle (Manager → Store → Component → DOM)

### E2E Testing (Playwright) (tests/e2e/)
- Test user flows in real browser
- Test animations and transitions
- Test multiple feedback items
- Test across different screen sizes
- Test accessibility (keyboard navigation, ARIA)

### Test Infrastructure (tests/setup.ts)
- Global test setup loaded before all tests via vitest.config.ts
- DOM mocks: matchMedia, ResizeObserver, IntersectionObserver
- Animation mocks: requestAnimationFrame, cancelAnimationFrame
- Cleanup: Portal containers, dialog elements after each test

### What to Test for Each Feature
- ✅ Happy path works
- ✅ Error cases handled gracefully
- ✅ Performance is acceptable (< 16ms render)
- ✅ Accessibility requirements met
- ✅ Works with all adapters
- ✅ No memory leaks
- ✅ No z-index conflicts
- ✅ No layout shifts

## Common Pitfalls to Avoid

1. **Z-Index Wars** - Use centralized Z_INDEX constants
2. **Layout Shifts** - Always use portals with fixed positioning
3. **Memory Leaks** - Clean up timers, subscriptions in useEffect
4. **Accessibility** - Always include ARIA attributes, keyboard support
5. **Bundle Size** - Use named exports, avoid barrel files for tree-shaking
6. **Type Safety** - Never use `any`, create specific types
7. **State Management** - Keep feedback state in single store
8. **Animation Jank** - Use CSS transforms, not layout properties
9. **SSR Issues** - Check for `typeof window` before DOM access
10. **Event Cleanup** - Remove event listeners on unmount

## Code Style

### Naming Conventions
- **Files:** 
  - Components: `PascalCase.tsx` (Toast.tsx)
  - Hooks: `camelCase.ts` (useToast.ts)
  - Utils: `camelCase.ts` (classNames.ts)
  - Types: `types.ts` or `PascalCase.types.ts`
- **Variables/Functions:** camelCase
- **Classes/Components:** PascalCase
- **Interfaces/Types:** PascalCase with `I` prefix for interfaces
- **Constants:** UPPER_SNAKE_CASE
- **Enums:** PascalCase

### File Organization
```typescript
// 1. Imports (external first, then internal, then types)
import React, { useState, useCallback } from 'react';
import { cn } from '../utils/classNames';
import type { IToastProps } from './types';

// 2. Constants
const DEFAULT_DURATION = 5000;

// 3. Types (if not in separate file)
interface LocalType {}

// 4. Helper functions (if small)
const helper = () => {};

// 5. Main component/function
export function Toast() {}

// 6. Sub-components (if tightly coupled)
function ToastIcon() {}

// 7. Default export (if needed)
export default Toast;
```

### React Component Structure
```typescript
export const Component = memo(forwardRef<HTMLDivElement, Props>(
  function Component(props, ref) {
    // 1. Destructure props
    const { message, onDismiss, ...rest } = props;
    
    // 2. Hooks (useState, useEffect, custom hooks)
    const [visible, setVisible] = useState(true);
    
    // 3. Callbacks (useCallback)
    const handleDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);
    
    // 4. Effects (useEffect)
    useEffect(() => {
      // ...
    }, []);
    
    // 5. Render
    return (
      <div ref={ref} {...rest}>
        {message}
      </div>
    );
  }
));

Component.displayName = 'Component';
```

## Decision Log

### Why React-only (not Vue/Svelte)?
- React has largest ecosystem
- Most UI libraries are React-first
- Can expand to other frameworks later via separate packages

### Why Zustand for State?
- Minimal bundle size (~1KB)
- No boilerplate
- Works outside React components
- TypeScript-first
- Supports subscriptions

### Why Adapter Pattern?
- Clean separation of concerns
- Easy to add new UI libraries
- Users only bundle what they need
- Consistent API across libraries

### Why Portals for Feedback?
- Avoids z-index issues with parent elements
- Feedback appears above all content
- No layout interference
- Consistent positioning

### Why CSS Transforms for Animation?
- GPU-accelerated
- No layout thrashing
- Smooth 60fps animations
- Works with will-change

## Agent Workflow

When implementing a feature:

1. **Read** the corresponding design doc in `design/`
2. **Understand** the requirements, interfaces, and edge cases
3. **Write tests first** (TDD approach preferred)
4. **Implement** following the principles above
5. **Test** with `pnpm test` and `pnpm test:e2e`
6. **Verify** lint passes with `pnpm lint`
7. **Document** with JSDoc and update docs if needed
8. **Update** IMPLEMENTATION.md with progress

## Notes for Human Developer

### Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Run unit tests
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run E2E tests
pnpm lint             # Lint code
pnpm lint:fix         # Fix lint errors
pnpm typecheck        # Type check
pnpm storybook        # Start Storybook
pnpm validate         # Run all checks (before commit)
```

### Quality Gates
Before merging any code:
- [ ] All tests pass
- [ ] Coverage >= 90%
- [ ] No lint errors
- [ ] No type errors
- [ ] IMPLEMENTATION.md updated
- [ ] CHANGELOG.md updated (if user-facing change)

### Getting Help
- Check design docs for feature specifications
- Check existing code for patterns
- Check tests for usage examples
- Ask human developer for clarification if needed
