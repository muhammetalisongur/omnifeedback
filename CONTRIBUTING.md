# Contributing to OmniFeedback

Thank you for your interest in contributing to OmniFeedback! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing Requirements](#testing-requirements)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [CI Validation](#ci-validation)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior via the repository's issue tracker.

## Getting Started

1. **Fork** the repository on GitHub: [muhammetalisongur/omnifeedback](https://github.com/muhammetalisongur/omnifeedback)
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/omnifeedback.git
   cd omnifeedback
   ```
3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/muhammetalisongur/omnifeedback.git
   ```
4. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** (recommended package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Useful Commands

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `pnpm dev`            | Start the development server         |
| `pnpm build`          | Create a production build            |
| `pnpm test`           | Run unit tests                       |
| `pnpm test:coverage`  | Run tests with coverage report       |
| `pnpm test:e2e`       | Run Playwright E2E tests             |
| `pnpm lint`           | Lint the codebase                    |
| `pnpm lint:fix`       | Automatically fix lint errors        |
| `pnpm typecheck`      | Run TypeScript type checking         |
| `pnpm ci:local`       | Run the full CI pipeline locally     |
| `pnpm validate`       | Run all quality checks before commit |

## Development Workflow

1. **Sync your fork** with upstream before starting work:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. **Create a feature branch** with a descriptive name:
   ```bash
   git checkout -b feat/add-snackbar-component
   ```
3. **Make your changes** following the code style and testing guidelines below.
4. **Run validation** to ensure everything passes:
   ```bash
   pnpm ci:local
   ```
5. **Commit your changes** using the commit message format described below.
6. **Push your branch** and open a Pull Request against `main`.

## Code Style

OmniFeedback enforces strict code quality standards via **ESLint** and **Prettier**. Please refer to [AGENTS.md](./AGENTS.md) for the full code style specification.

### Key Rules

- **Language:** All code artifacts (variable names, function names, comments, JSDoc, string literals) must be written in **English**.
- **TypeScript Strict Mode:** `strict: true` is enabled. No `any` types are allowed.
- **Explicit return types** on all public functions and exported members.
- **Comprehensive JSDoc** comments on all public APIs.
- **SOLID principles** must be followed in all implementations.

### Naming Conventions

| Element              | Convention          | Example                |
| -------------------- | ------------------- | ---------------------- |
| Components           | PascalCase          | `Toast.tsx`            |
| Hooks                | camelCase with `use` | `useToast.ts`          |
| Utilities            | camelCase           | `classNames.ts`        |
| Interfaces           | PascalCase + `I`    | `IToastOptions`        |
| Constants            | UPPER_SNAKE_CASE    | `DEFAULT_DURATION`     |
| Variables/Functions  | camelCase           | `handleDismiss`        |

### File Organization

Follow this order within each file:

1. Imports (external, then internal, then types)
2. Constants
3. Types (if not in a separate file)
4. Helper functions
5. Main component/function
6. Sub-components
7. Default export (if needed)

### Linting

```bash
# Check for lint errors
pnpm lint

# Auto-fix lint errors
pnpm lint:fix
```

All lint errors must be resolved before submitting a PR.

## Testing Requirements

OmniFeedback maintains high test coverage standards. All contributions must include appropriate tests.

### Coverage Thresholds

All coverage metrics must meet or exceed **90%**:

- **Statements:** >= 90%
- **Branches:** >= 90%
- **Functions:** >= 90%
- **Lines:** >= 90%

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests with coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### Test Guidelines

- **Unit tests** are co-located with source files (`src/**/*.test.{ts,tsx}`).
- **Integration tests** live in `tests/integration/`.
- **E2E tests** live in `tests/e2e/`.
- Use **React Testing Library** for component tests.
- Use **`renderHook`** for hook tests.
- Test the following for every feature:
  - Happy path works correctly
  - Error cases are handled gracefully
  - Accessibility requirements are met (ARIA, keyboard navigation)
  - No memory leaks or layout shifts
  - Compatibility with all adapters

## Commit Message Format

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                       |
| ---------- | ------------------------------------------------- |
| `feat`     | A new feature                                     |
| `fix`      | A bug fix                                         |
| `docs`     | Documentation only changes                        |
| `style`    | Changes that do not affect the meaning of the code |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf`     | A code change that improves performance           |
| `test`     | Adding missing tests or correcting existing tests |
| `chore`    | Changes to the build process or auxiliary tools   |
| `ci`       | Changes to CI configuration files and scripts     |

### Scopes

Common scopes include: `core`, `toast`, `modal`, `loading`, `alert`, `progress`, `confirm`, `banner`, `drawer`, `popconfirm`, `skeleton`, `result`, `connection`, `prompt`, `sheet`, `adapters`, `hooks`, `providers`, `utils`, `docs`, `config`.

### Examples

```
feat(toast): add promise-based toast API
fix(modal): resolve z-index conflict with drawer
docs(readme): update installation instructions
test(adapters): add integration tests for MUI adapter
refactor(core): extract event bus into separate module
```

## Pull Request Process

### Before Submitting

1. Ensure your branch is up to date with `main`.
2. Run the full CI pipeline locally:
   ```bash
   pnpm ci:local
   ```
3. Verify that all of the following pass:
   - All tests pass (`pnpm test`)
   - Coverage thresholds are met (`pnpm test:coverage`)
   - No lint errors (`pnpm lint`)
   - No type errors (`pnpm typecheck`)
   - Build succeeds (`pnpm build`)

### PR Checklist

- [ ] My code follows the project's code style guidelines
- [ ] I have written tests for my changes
- [ ] All new and existing tests pass
- [ ] Test coverage meets the 90%+ threshold
- [ ] Lint and typecheck pass with no errors
- [ ] `pnpm ci:local` passes successfully
- [ ] I have updated documentation if needed
- [ ] I have updated CHANGELOG.md for user-facing changes
- [ ] My commits follow the conventional commit format

### Review Process

1. A maintainer will review your PR.
2. Address any requested changes.
3. Once approved, a maintainer will merge your PR.

## CI Validation

Before submitting any Pull Request, you **must** run the local CI pipeline:

```bash
pnpm ci:local
```

This command runs the same checks that the CI pipeline executes on GitHub:

- Linting (ESLint + Prettier)
- Type checking (TypeScript strict mode)
- Unit and integration tests with coverage
- Production build
- Bundle size validation

**A PR will not be merged if `pnpm ci:local` does not pass.**

## Reporting Issues

- Use the [Bug Report](https://github.com/muhammetalisongur/omnifeedback/issues/new?template=bug_report.md) template for bugs.
- Use the [Feature Request](https://github.com/muhammetalisongur/omnifeedback/issues/new?template=feature_request.md) template for new ideas.
- Check existing issues before creating a new one.

## Questions?

If you have questions about contributing, feel free to open a [Discussion](https://github.com/muhammetalisongur/omnifeedback/discussions) on the repository.

---

Thank you for helping make OmniFeedback better!
