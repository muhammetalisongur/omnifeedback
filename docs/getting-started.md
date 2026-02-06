# Getting Started with OmniFeedback

OmniFeedback is a universal React feedback management library that provides a single, unified API for toast notifications, modals, loading indicators, confirmation dialogs, banners, drawers, prompts, sheets, and more. It works seamlessly across multiple UI libraries through its adapter system.

This guide walks you through installation, setup, and your first usage in under five minutes.

## Prerequisites

Before you begin, ensure your project meets the following requirements:

| Requirement | Minimum Version |
|-------------|-----------------|
| Node.js     | 18.0.0+         |
| React       | 18.0.0+         |
| React DOM   | 18.0.0+         |
| TypeScript  | 5.0+ (recommended, not required) |

OmniFeedback is written in TypeScript and ships with full type definitions. You do not need TypeScript in your project, but you will get the best developer experience with it.

## Step 1: Install

Install the core package using your preferred package manager:

```bash
# pnpm (recommended)
pnpm add omnifeedback

# npm
npm install omnifeedback

# yarn
yarn add omnifeedback
```

The core package has a single runtime dependency: **Zustand** (state management). Everything else is a peer dependency based on which adapter you choose.

## Step 2: Choose Your Adapter

OmniFeedback uses an **adapter pattern** to render feedback components using your preferred UI library. Choose the adapter that matches your existing stack:

| If your project uses...       | Install this adapter                  | Import path                          |
|-------------------------------|---------------------------------------|--------------------------------------|
| **Tailwind CSS** (no UI lib)  | No extra dependencies                 | `omnifeedback/adapters/headless`     |
| **shadcn/ui** (Radix)         | `@radix-ui/react-toast @radix-ui/react-dialog @radix-ui/react-alert-dialog @radix-ui/react-progress` | `omnifeedback/adapters/shadcn` |
| **Mantine** 7+                | `@mantine/core @mantine/hooks`        | `omnifeedback/adapters/mantine`      |
| **Chakra UI** 2.8+            | `@chakra-ui/react`                    | `omnifeedback/adapters/chakra`       |
| **MUI (Material UI)** 5+      | `@mui/material @emotion/react @emotion/styled` | `omnifeedback/adapters/mui` |
| **Ant Design** 5+             | `antd`                                | `omnifeedback/adapters/antd`         |

Install the peer dependencies for your chosen adapter:

```bash
# Headless (pure Tailwind) - no extra dependencies
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

> **Tip:** If you are unsure which adapter to use, start with `headless`. It has zero external UI dependencies and works with any Tailwind CSS setup. See the [Adapter System Overview](./adapters/overview.md) for a detailed comparison.

## Step 3: Set Up FeedbackProvider

Wrap your application root with `FeedbackProvider`. This component creates a React context that all hooks read from and renders the necessary container elements for toasts, modals, loading overlays, and more.

### Basic Setup

```tsx
import { FeedbackProvider } from 'omnifeedback';

function App() {
  return (
    <FeedbackProvider>
      <YourApp />
    </FeedbackProvider>
  );
}
```

### With Toast Position

```tsx
<FeedbackProvider toastPosition="top-right">
  <YourApp />
</FeedbackProvider>
```

### With Global Configuration

```tsx
<FeedbackProvider
  toastPosition="bottom-right"
  toastGap={16}
  config={{
    defaultDuration: 4000,
    enableAnimations: true,
    maxVisible: {
      toast: 5,
      modal: 1,
      loading: 3,
    },
  }}
>
  <YourApp />
</FeedbackProvider>
```

For a full list of provider props and configuration options, see the [Configuration Guide](./configuration.md).

## Step 4: Use Your First Hook

### Show a Toast Notification

The simplest way to get started is with `useToast`:

```tsx
import { useToast } from 'omnifeedback';

function SaveButton() {
  const toast = useToast();

  const handleSave = () => {
    toast.success('Document saved successfully!');
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Confirm Before Delete (Toast + Confirm Flow)

Combine `useConfirm` and `useToast` for a common confirmation pattern:

```tsx
import { useFeedback } from 'omnifeedback';

function DeleteButton({ itemId }: { itemId: string }) {
  const { confirm, toast } = useFeedback();

  const handleDelete = async () => {
    const confirmed = await confirm.show({
      title: 'Delete Item',
      message: 'Are you sure? This action cannot be undone.',
      confirmVariant: 'danger',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      await deleteItem(itemId);
      toast.success('Item deleted successfully');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Step 5: Customize

### Default Overrides

Every hook call accepts options that override global defaults:

```tsx
toast.show({
  message: 'Custom toast',
  duration: 10000,         // Override default duration
  position: 'bottom-left', // Override default position
  dismissible: true,
  variant: 'info',
});
```

### Position Options

Toasts support six screen positions:

| Position         | Description               |
|------------------|---------------------------|
| `top-left`       | Top-left corner           |
| `top-center`     | Top-center of the screen  |
| `top-right`      | Top-right corner (default)|
| `bottom-left`    | Bottom-left corner        |
| `bottom-center`  | Bottom-center of screen   |
| `bottom-right`   | Bottom-right corner       |

### Animation Control

Animations are enabled by default. You can configure timing globally:

```tsx
<FeedbackProvider
  config={{
    enableAnimations: true,
    enterAnimationDuration: 200,
    exitAnimationDuration: 200,
  }}
>
  <YourApp />
</FeedbackProvider>
```

## Common Patterns

### Loading State During API Call

```tsx
import { useFeedback } from 'omnifeedback';

function SubmitForm() {
  const { loading, toast } = useFeedback();

  const handleSubmit = async (data: FormData) => {
    const loadingId = loading.show({ message: 'Submitting form...' });

    try {
      await submitFormData(data);
      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.error('Submission failed. Please try again.');
    } finally {
      loading.hide(loadingId);
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

### Wrapping Async Functions

The `loading.wrap()` helper automatically manages the loading indicator lifecycle:

```tsx
const data = await loading.wrap(
  () => fetchDashboardData(),
  { message: 'Loading dashboard...' }
);
```

### Promise Toast

Track async operations with automatic loading, success, and error states:

```tsx
await toast.promise(saveDocument(), {
  loading: 'Saving document...',
  success: (result) => `Saved "${result.title}" successfully`,
  error: (err) => `Failed to save: ${err.message}`,
});
```

### Delete with Confirmation and Loading

```tsx
const handleDelete = async () => {
  const confirmed = await confirm.show({
    title: 'Confirm Deletion',
    message: 'This will permanently remove the record.',
    confirmVariant: 'danger',
  });

  if (!confirmed) return;

  await loading.wrap(
    async () => {
      await api.deleteRecord(recordId);
      toast.success('Record deleted');
    },
    { message: 'Deleting...' }
  );
};
```

## Next Steps

- **[Configuration Guide](./configuration.md)** -- Deep dive into all provider props, global config fields, and per-call overrides.
- **[Adapter System Overview](./adapters/overview.md)** -- Compare adapters, understand the interface, and learn how to create a custom adapter.
- **[Testing with OmniFeedback](./guides/testing.md)** -- Set up test wrappers, test hooks, and avoid common pitfalls.
- **[API Reference (README)](../README.md)** -- Full hook API reference for all 14 feedback types.
