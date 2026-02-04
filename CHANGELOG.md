# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Integration test infrastructure (tests/integration/)
- E2E test infrastructure with Playwright (tests/e2e/)
- PromptContainer auto-rendering in FeedbackProvider (9th container)
- `renderPrompts` prop on FeedbackProvider for controlling Prompt container rendering

### Changed
- Updated README.md with complete API documentation for all 15 feedback types
- Updated IMPLEMENTATION.md to reflect actual completion status
- Updated AGENTS.md testing strategy to document co-located test approach
- Updated design/01-core-architecture.md with all 15 FeedbackType definitions
- Updated QUICKSTART.md with current project status, all 24 design docs, and correct URLs
- Clarified Connection as a hook-only feature (no visual component needed)
- Updated GitHub URLs from placeholder to muhammetalisongur

### Fixed
- Removed incorrect `clearAll` property from useFeedback API documentation in README.md
- Fixed PromptContainer not being auto-rendered in FeedbackProvider (Promise-based dialog bug)
- Fixed "16 feedback types" → "15 feedback types" count in documentation
- Fixed badge URL placeholder in README.md

## [0.1.0] - 2026-02-04

### Added

#### Core Architecture
- FeedbackManager singleton with add/remove/update/updateStatus operations
- FeedbackStore with Zustand - Map-based reactive state with 12 selector hooks
- FeedbackQueue with priority ordering (error=100, warning=75, success=50, info=25)
- EventBus with type-safe pub/sub (on, once, off, emit)
- 877-line type definitions covering 15 feedback types
- Utility functions: generateId, cn (class merger), positioning

#### Core Components (6)
- **Toast** - 6 positions, countdown progress bar, pause on hover/focus loss, promise API
- **Modal** - Focus trap, scroll lock, nested modals, 5 sizes, keyboard navigation
- **Loading** - 5 spinner variants, overlay with backdrop blur, wrap() API, cancellable
- **Alert** - 5 variants, dismissible, action buttons, auto-dismiss, custom icons
- **Progress** - Linear + Circular variants, indeterminate, striped, animated
- **Confirm** - Promise-based API returning boolean, primary/danger variants

#### Extended Components (9)
- **Banner** - Full-width announcements, localStorage dismiss memory, sticky positioning
- **Drawer** - 4 positions (left/right/top/bottom), 5 sizes, overlay, ESC close
- **Popconfirm** - 12 placement options, arrow, offset, popover-based
- **Skeleton** - Compound component (Text, Avatar, Card, Table), pulse/wave animations
- **Empty** - 8 preset types (no-data, no-results, no-permission, error, offline, 404, 403, 500)
- **Result** - 7 status types (success, error, info, warning, 404, 403, 500)
- **Connection** - Online/offline detection, action queue, ping mechanism
- **Prompt** - Promise-based input dialog, validation, multiple input types
- **Sheet** - Bottom sheet with snap points, drag-to-dismiss, action sheet variant

#### Hooks (18)
- `useFeedback` - Combined hook for all feedback types
- `useToast`, `useModal`, `useLoading`, `useAlert`, `useProgress`, `useConfirm`
- `useBanner`, `useDrawer`, `usePopconfirm`, `useSkeleton`, `useResult`
- `useConnection`, `usePrompt`, `useSheet`
- `useFocusTrap`, `useScrollLock`, `useDrag` (utility hooks)

#### Adapters (6 x 16 components)
- **Headless** - Pure Tailwind CSS, zero dependencies, dark mode, reference implementation
- **shadcn/ui** - Radix UI primitives, CSS variables theming
- **Mantine** - @mantine/core components, @tabler/icons-react
- **Chakra UI** - @chakra-ui/react components, theme integration
- **MUI** - @mui/material components, Material Design patterns
- **Ant Design** - antd components, Ant Design patterns

#### Infrastructure
- FeedbackProvider with React Context and 9 auto-rendered containers
- Portal-based rendering for all overlay components
- TypeScript strict mode with exactOptionalPropertyTypes
- 43 test files, 988+ tests passing
- 90% coverage threshold enforced

#### Project Setup
- Vite build configuration with multi-entry points for adapters
- Vitest testing configuration with happy-dom environment
- ESLint configuration with strict TypeScript rules (no-any enforced)
- Tailwind CSS configuration with custom animations
- Test setup with DOM mocks (matchMedia, ResizeObserver, IntersectionObserver)
