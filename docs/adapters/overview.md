# Adapter System Overview

OmniFeedback uses an **adapter pattern** to decouple feedback logic from UI rendering. The core library manages state, queues, timers, and lifecycle events, while adapters provide the visual components that match your chosen UI library.

This architecture allows you to switch UI libraries without changing any hook calls or business logic.

## What is an Adapter?

An adapter is an object that implements the `IFeedbackAdapter` interface. It provides:

- **16 component slots** -- React components for every feedback type (toast, modal, loading, alert, progress, confirm, banner, drawer, popconfirm, skeleton, result, prompt, sheet, action sheet, connection).
- **3 utility functions** -- Dark mode detection (`isDarkMode`), style injection (`injectStyles`), and animation configuration (`animations`).

The core system passes standardized props to these components. Each adapter renders them using its target UI library's design language and component primitives.

```
   Your App (hooks)
        |
   FeedbackManager (core logic, state, events)
        |
   Adapter (rendering layer)
        |
   UI Library (shadcn, Mantine, MUI, etc.)
```

## Available Adapters

OmniFeedback ships with six official adapters:

| Adapter    | Name        | UI Library                  | Peer Dependencies                 | Best For                                |
|------------|-------------|-----------------------------|------------------------------------|----------------------------------------|
| Headless   | `headless`  | Pure Tailwind CSS           | None                               | Custom designs, Tailwind-first projects |
| shadcn/ui  | `shadcn`    | Radix UI + Tailwind CSS     | `@radix-ui/react-toast`, `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-progress` | shadcn/ui projects, Radix-based apps |
| Mantine    | `mantine`   | Mantine 7+                  | `@mantine/core`, `@mantine/hooks`  | Mantine-based applications              |
| Chakra UI  | `chakra`    | Chakra UI 2.8+              | `@chakra-ui/react`                 | Chakra UI-based applications            |
| MUI        | `mui`       | Material UI 5+              | `@mui/material`, `@emotion/react`, `@emotion/styled` | Material Design projects     |
| Ant Design | `antd`      | Ant Design 5+               | `antd`                             | Enterprise applications using Ant Design|

All adapters implement the same `IFeedbackAdapter` interface and provide identical functionality. The difference is purely visual.

## Choosing an Adapter

Use this decision tree:

1. **Already using shadcn/ui?** Use the `shadcn` adapter. It leverages the same Radix + Tailwind primitives.
2. **Already using Mantine?** Use the `mantine` adapter. It reads Mantine CSS variables for consistent theming.
3. **Already using Chakra UI?** Use the `chakra` adapter.
4. **Already using MUI?** Use the `mui` adapter. It follows Material Design motion and timing standards.
5. **Already using Ant Design?** Use the `antd` adapter.
6. **Using Tailwind without a component library?** Use the `headless` adapter. Zero extra dependencies.
7. **Not sure?** Start with `headless`. You can switch adapters later without changing any hook calls.

## Installation

Install the core library and the peer dependencies for your chosen adapter:

```bash
# Headless (pure Tailwind) -- no extra dependencies
pnpm add omnifeedback

# shadcn/ui
pnpm add omnifeedback @radix-ui/react-toast @radix-ui/react-dialog @radix-ui/react-alert-dialog @radix-ui/react-progress

# Mantine
pnpm add omnifeedback @mantine/core @mantine/hooks

# Chakra UI
pnpm add omnifeedback @chakra-ui/react

# MUI
pnpm add omnifeedback @mui/material @emotion/react @emotion/styled

# Ant Design
pnpm add omnifeedback antd
```

All adapter peer dependencies are marked as **optional** in `package.json`. You only need to install the ones for your chosen adapter.

## Usage

Import your adapter and pass it to the `FeedbackProvider`. If no adapter is specified, the headless adapter is used by default.

```tsx
import { FeedbackProvider } from 'omnifeedback';
import { shadcnAdapter } from 'omnifeedback/adapters/shadcn';

function App() {
  return (
    <FeedbackProvider toastPosition="top-right">
      <YourApp />
    </FeedbackProvider>
  );
}
```

### Adapter Import Paths

| Adapter    | Import Statement                                           |
|------------|------------------------------------------------------------|
| Headless   | `import { headlessAdapter } from 'omnifeedback/adapters/headless'` |
| shadcn/ui  | `import { shadcnAdapter } from 'omnifeedback/adapters/shadcn'`     |
| Mantine    | `import { mantineAdapter } from 'omnifeedback/adapters/mantine'`   |
| Chakra UI  | `import { chakraAdapter } from 'omnifeedback/adapters/chakra'`     |
| MUI        | `import { muiAdapter } from 'omnifeedback/adapters/mui'`           |
| Ant Design | `import { antdAdapter } from 'omnifeedback/adapters/antd'`         |

Each adapter module also exports individual components for advanced customization:

```tsx
// Import individual components for overrides
import { HeadlessToast, HeadlessModal } from 'omnifeedback/adapters/headless';
import { ShadcnToast, ShadcnConfirm } from 'omnifeedback/adapters/shadcn';
```

## IFeedbackAdapter Interface

Every adapter must implement the following interface. This is the contract between the core system and the rendering layer.

### Component Slots (16 total)

| Category       | Component                   | Props Interface               | Description                         |
|----------------|-----------------------------|-------------------------------|-------------------------------------|
| **Notification** | `ToastComponent`          | `IAdapterToastProps`          | Individual toast notification       |
|                | `ToastContainerComponent`   | `IAdapterToastContainerProps` | Container that positions toasts     |
|                | `BannerComponent`           | `IAdapterBannerProps`         | Full-width banner announcement      |
| **Dialog**     | `ModalComponent`            | `IAdapterModalProps`          | Modal dialog overlay                |
|                | `ConfirmComponent`          | `IAdapterConfirmProps`        | Confirmation dialog                 |
|                | `PromptComponent`           | `IAdapterPromptProps`         | Input prompt dialog                 |
|                | `DrawerComponent`           | `IAdapterDrawerProps`         | Side panel drawer                   |
|                | `PopconfirmComponent`       | `IAdapterPopconfirmProps`     | Popover confirmation near trigger   |
| **Sheet**      | `SheetComponent`            | `IAdapterSheetProps`          | Bottom sheet with snap points       |
|                | `ActionSheetComponent`      | `IAdapterActionSheetProps`    | Action sheet with selectable items  |
| **Feedback**   | `AlertComponent`            | `IAdapterAlertProps`          | Inline alert message                |
|                | `LoadingComponent`          | `IAdapterLoadingProps`        | Loading spinner/overlay             |
|                | `ProgressComponent`         | `IAdapterProgressProps`       | Progress bar (linear/circular)      |
|                | `SkeletonComponent`         | `IAdapterSkeletonProps`       | Skeleton placeholder loader         |
|                | `ResultComponent`           | `IAdapterResultProps`         | Result/status page                  |
| **Status**     | `ConnectionComponent`       | `IAdapterConnectionProps`     | Connection status indicator         |

### Utility Functions (3 total)

| Function       | Signature               | Description                                           |
|----------------|--------------------------|-------------------------------------------------------|
| `isDarkMode`   | `() => boolean`          | Detects if dark mode is currently active              |
| `injectStyles` | `() => void`             | Injects required CSS keyframes and utility classes    |
| `animations`   | `IAdapterAnimations`     | Animation class names and duration configuration      |

### IAdapterAnimations

```ts
interface IAdapterAnimations {
  enter: string;   // CSS class(es) for enter animation
  exit: string;    // CSS class(es) for exit animation
  duration: number; // Animation duration in milliseconds
}
```

### Metadata

| Field     | Type     | Description                    |
|-----------|----------|--------------------------------|
| `name`    | `string` | Unique adapter identifier      |
| `version` | `string` | Adapter version string         |

## Adapter Features Matrix

| Feature                   | Headless | shadcn/ui | Mantine | Chakra | MUI  | Ant Design |
|---------------------------|----------|-----------|---------|--------|------|------------|
| All 16 component slots    | Yes      | Yes       | Yes     | Yes    | Yes  | Yes        |
| Enter/exit animations     | Yes      | Yes       | Yes     | Yes    | Yes  | Yes        |
| Dark mode detection       | Yes      | Yes       | Yes     | Yes    | Yes  | Yes        |
| Automatic style injection | Yes      | Yes       | Yes     | Yes    | Yes  | Yes        |
| SSR-safe guards           | Yes      | Yes       | Yes     | Yes    | Yes  | Yes        |
| RTL support               | Yes      | Yes       | Yes     | Yes    | Yes  | Yes        |
| Custom CSS prefix support | Yes      | Yes       | Yes     | Yes    | Yes  | Yes        |
| Zero extra dependencies   | Yes      | No        | No      | No     | No   | No         |
| Tailwind CSS required     | Yes      | Yes       | No      | No     | No   | No         |

### Dark Mode Detection by Adapter

Each adapter detects dark mode using the method most appropriate for its UI library:

| Adapter    | Detection Method                                                                 |
|------------|---------------------------------------------------------------------------------|
| Headless   | `document.documentElement.classList.contains('dark')` or `prefers-color-scheme` |
| shadcn/ui  | `document.documentElement.classList.contains('dark')`                           |
| Mantine    | `data-mantine-color-scheme="dark"` attribute or `prefers-color-scheme`          |
| Chakra UI  | Chakra color mode context or `prefers-color-scheme`                             |
| MUI        | `document.documentElement.classList.contains('dark')` or `prefers-color-scheme` |
| Ant Design | `document.documentElement.classList.contains('dark')` or `prefers-color-scheme` |

## Creating a Custom Adapter

You can create a custom adapter by implementing the `IFeedbackAdapter` interface. This is useful when:

- You use a UI library not covered by the official adapters.
- You need heavily customized feedback components.
- You want to integrate with a design system.

### Minimal Example

```tsx
import type { IFeedbackAdapter } from 'omnifeedback/adapters/types';

const myAdapter: IFeedbackAdapter = {
  name: 'my-custom-adapter',
  version: '1.0.0',

  // Provide all 16 component implementations
  ToastComponent: MyToast,
  ToastContainerComponent: MyToastContainer,
  BannerComponent: MyBanner,
  ModalComponent: MyModal,
  ConfirmComponent: MyConfirm,
  PromptComponent: MyPrompt,
  DrawerComponent: MyDrawer,
  PopconfirmComponent: MyPopconfirm,
  SheetComponent: MySheet,
  ActionSheetComponent: MyActionSheet,
  AlertComponent: MyAlert,
  LoadingComponent: MyLoading,
  ProgressComponent: MyProgress,
  SkeletonComponent: MySkeleton,
  ResultComponent: MyResult,
  ConnectionComponent: MyConnection,

  // Utility functions
  isDarkMode: () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  },

  injectStyles: () => {
    if (typeof document === 'undefined') return;
    // Inject any required CSS keyframes or styles
  },

  animations: {
    enter: 'fade-in',
    exit: 'fade-out',
    duration: 200,
  },
};
```

### Tips for Custom Adapters

1. **Start from the headless adapter.** Copy individual components from `omnifeedback/adapters/headless` and customize them.
2. **Respect the `status` prop.** Every component receives a `status` prop (`pending`, `entering`, `visible`, `exiting`, `removed`) for animation control.
3. **Guard against SSR.** Always check `typeof document === 'undefined'` in `isDarkMode` and `injectStyles`.
4. **Use `IAdapterBaseProps`.** All component props extend this interface, which includes `status`, `className`, `style`, and `testId`.

### Using the AdapterFactory Pattern

For configurable adapters, you can use the factory pattern:

```tsx
import type { AdapterFactory, IAdapterConfig } from 'omnifeedback/adapters/types';

const createMyAdapter: AdapterFactory = (config?: IAdapterConfig) => {
  const cssPrefix = config?.cssPrefix ?? 'my';

  return {
    name: 'my-adapter',
    version: '1.0.0',
    // ... component implementations using cssPrefix
    animations: {
      enter: config?.animations?.enter ?? 'fade-in',
      exit: config?.animations?.exit ?? 'fade-out',
      duration: config?.animations?.duration ?? 200,
    },
    isDarkMode: () => {
      if (!config?.detectDarkMode) return false;
      if (typeof document === 'undefined') return false;
      return document.documentElement.classList.contains('dark');
    },
    injectStyles: () => { /* ... */ },
    // ... all 16 components
  };
};
```

## Related Guides

- **[Getting Started](../getting-started.md)** -- Quick setup with adapter selection.
- **[Configuration Guide](../configuration.md)** -- Provider props and global configuration.
- **[Testing with OmniFeedback](../guides/testing.md)** -- Test setup and hook testing patterns.
