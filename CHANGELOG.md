# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with TypeScript strict mode
- Vite build configuration with multi-entry points for adapters
- Vitest testing configuration with 90%% coverage threshold
- ESLint configuration with strict TypeScript rules (no-any enforced)
- Tailwind CSS configuration with custom animations
- Directory structure for core, hooks, providers, components, adapters, utils, and styles
- Placeholder index.ts files for all modules
- CSS base styles with CSS custom properties for theming
- Animation CSS classes for feedback components
- Adapter type definitions (IFeedbackAdapter interface)
- Test setup file with DOM mocks (matchMedia, ResizeObserver, IntersectionObserver)

## [0.1.0] - TBD

### Planned
- Core architecture (FeedbackManager, FeedbackStore, FeedbackQueue, EventBus)
- Toast system with all positions and variants
- Modal system with focus trap and keyboard support
- Loading system with overlay support
- Alert system with action buttons
- Progress system with indeterminate mode
- Confirm dialog with danger variant
- All UI library adapters (shadcn, mantine, chakra, mui, antd, headless)
