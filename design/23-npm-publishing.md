# Design: NPM Publishing

## Overview
Configure the package for NPM publishing with proper exports, documentation, and CI/CD setup.

## Goals
- Proper package.json exports configuration
- Tree-shakeable builds
- TypeScript declarations
- GitHub Actions CI/CD
- Comprehensive documentation
- Semantic versioning
- Changelog management

## Package Configuration

### package.json

```json
{
  "name": "omnifeedback",
  "version": "1.0.0",
  "description": "Universal React feedback management - Toast, Modal, Loading, Alert with multi-library support",
  "author": "Your Name <your@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/muhammetalisongur/omnifeedback.git"
  },
  "homepage": "https://github.com/muhammetalisongur/omnifeedback#readme",
  "bugs": {
    "url": "https://github.com/muhammetalisongur/omnifeedback/issues"
  },
  "keywords": [
    "react",
    "toast",
    "modal",
    "loading",
    "alert",
    "notification",
    "feedback",
    "shadcn",
    "mantine",
    "chakra",
    "mui",
    "antd",
    "tailwind",
    "typescript"
  ],
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
      "import": {
        "types": "./dist/adapters/shadcn/index.d.ts",
        "default": "./dist/adapters/shadcn/index.js"
      },
      "require": {
        "types": "./dist/adapters/shadcn/index.d.cts",
        "default": "./dist/adapters/shadcn/index.cjs"
      }
    },
    "./adapters/mantine": {
      "import": {
        "types": "./dist/adapters/mantine/index.d.ts",
        "default": "./dist/adapters/mantine/index.js"
      },
      "require": {
        "types": "./dist/adapters/mantine/index.d.cts",
        "default": "./dist/adapters/mantine/index.cjs"
      }
    },
    "./adapters/chakra": {
      "import": {
        "types": "./dist/adapters/chakra/index.d.ts",
        "default": "./dist/adapters/chakra/index.js"
      },
      "require": {
        "types": "./dist/adapters/chakra/index.d.cts",
        "default": "./dist/adapters/chakra/index.cjs"
      }
    },
    "./adapters/mui": {
      "import": {
        "types": "./dist/adapters/mui/index.d.ts",
        "default": "./dist/adapters/mui/index.js"
      },
      "require": {
        "types": "./dist/adapters/mui/index.d.cts",
        "default": "./dist/adapters/mui/index.cjs"
      }
    },
    "./adapters/antd": {
      "import": {
        "types": "./dist/adapters/antd/index.d.ts",
        "default": "./dist/adapters/antd/index.js"
      },
      "require": {
        "types": "./dist/adapters/antd/index.d.cts",
        "default": "./dist/adapters/antd/index.cjs"
      }
    },
    "./adapters/headless": {
      "import": {
        "types": "./dist/adapters/headless/index.d.ts",
        "default": "./dist/adapters/headless/index.js"
      },
      "require": {
        "types": "./dist/adapters/headless/index.d.cts",
        "default": "./dist/adapters/headless/index.cjs"
      }
    },
    "./styles": "./dist/styles/index.css"
  },
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  "sideEffects": [
    "*.css"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "scripts": {
    "prepublishOnly": "pnpm validate && pnpm build",
    "version": "pnpm changelog && git add CHANGELOG.md",
    "postversion": "git push && git push --tags"
  }
}
```

## GitHub Actions CI/CD

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
```

### .github/workflows/release.yml

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm validate
      - run: pnpm build
      - run: pnpm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

## Changelog Format

### CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
- Toast system with all positions
- Modal system with focus trap
- Loading system with overlay
- Alert system with actions
- Progress system (linear and circular)
- Confirm dialog with promise API
- shadcn/ui adapter
- Mantine adapter
- Chakra UI adapter
- MUI adapter
- Ant Design adapter
- Headless (Tailwind) adapter

### Documentation
- README with full API reference
- QUICKSTART guide
- Design documents for all features
```

## Release Process

### Version Bump

```bash
# Patch release (bug fixes)
pnpm version patch

# Minor release (new features)
pnpm version minor

# Major release (breaking changes)
pnpm version major
```

### Manual Release Steps

1. **Ensure all tests pass**
   ```bash
   pnpm validate
   ```

2. **Update CHANGELOG.md**
   - Move "Unreleased" items to new version section
   - Add release date

3. **Bump version**
   ```bash
   pnpm version minor -m "Release v%s"
   ```

4. **Push with tags**
   ```bash
   git push --follow-tags
   ```

5. **GitHub Actions will automatically**
   - Run tests
   - Build package
   - Publish to NPM
   - Create GitHub release

## NPM Publishing Checklist

### Pre-publish
- [ ] All tests pass (`pnpm test`)
- [ ] Coverage >= 90% (`pnpm test:coverage`)
- [ ] No lint errors (`pnpm lint`)
- [ ] No type errors (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] CHANGELOG.md updated
- [ ] README.md up to date
- [ ] Version bumped appropriately

### Post-publish
- [ ] Verify on npmjs.com
- [ ] Test installation in clean project
- [ ] Verify all exports work
- [ ] Verify types work
- [ ] Create GitHub release notes
- [ ] Announce release (Twitter, Discord, etc.)

## Bundle Size Monitoring

### Size Limits

```json
// package.json
{
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "10 KB"
    },
    {
      "path": "dist/adapters/headless/index.js",
      "limit": "5 KB"
    },
    {
      "path": "dist/adapters/shadcn/index.js",
      "limit": "8 KB"
    }
  ]
}
```

### Add to CI

```yaml
# .github/workflows/ci.yml
size:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
    - uses: actions/setup-node@v4
    - run: pnpm install --frozen-lockfile
    - run: pnpm build
    - run: npx size-limit
```

## Documentation Site

### Options
1. **Docusaurus** - Full-featured docs site
2. **VitePress** - Lightweight, Vite-powered
3. **Storybook** - Interactive component docs

### Recommended: Storybook + GitHub Pages

```bash
pnpm add -D @storybook/react-vite
pnpm storybook init
```

Deploy to GitHub Pages via Actions.

## Implementation Checklist

- [ ] Configure package.json exports
- [ ] Set up .npmignore or files field
- [ ] Create LICENSE file
- [ ] Create CHANGELOG.md
- [ ] Set up GitHub Actions CI
- [ ] Set up GitHub Actions release
- [ ] Configure NPM_TOKEN secret
- [ ] Add size-limit checks
- [ ] Set up Storybook
- [ ] Deploy docs to GitHub Pages
- [ ] Create example projects
- [ ] Test publish with `npm publish --dry-run`
- [ ] First publish to NPM

## Notes

- Use `pnpm publish --provenance` for NPM provenance
- Keep bundle size small - monitor with size-limit
- Test all exports in a clean project before release
- Use GitHub releases for release notes
- Consider beta/alpha releases for testing
