# OmniFeedback

> 🔔 Universal React Feedback Management - Toast, Modal, Loading, Alert & More

[![npm version](https://img.shields.io/npm/v/omnifeedback.svg)](https://www.npmjs.com/package/omnifeedback)
[![bundle size](https://img.shields.io/bundlephobia/minzip/omnifeedback)](https://bundlephobia.com/package/omnifeedback)
[![license](https://img.shields.io/npm/l/omnifeedback.svg)](https://github.com/yourusername/omnifeedback/blob/main/LICENSE)

One API. Every UI library. Zero headaches.

## ✨ Features

- 🎯 **Unified API** - Same interface for Toast, Modal, Loading, Alert, Progress, Confirm
- 🎨 **Multi-Library Support** - Works with shadcn/ui, Mantine, Chakra UI, MUI, Ant Design, or pure Tailwind
- 🔧 **Fully Parametric** - Every behavior, style, and animation is customizable
- 🐛 **Zero Bugs** - No layout shifts, z-index conflicts, or memory leaks
- ♿ **Accessible** - ARIA compliant, keyboard navigation, screen reader support
- 📦 **Tree-Shakeable** - Only bundle what you use
- 🎭 **Animations** - Smooth enter/exit animations with CSS transforms
- 🌍 **RTL Support** - Right-to-left language support built-in

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm add omnifeedback

# Using npm
npm install omnifeedback

# Using yarn
yarn add omnifeedback
```

### Install an adapter (pick one)

```bash
# For shadcn/ui projects
pnpm add omnifeedback @radix-ui/react-toast @radix-ui/react-dialog

# For Mantine projects
pnpm add omnifeedback @mantine/core @mantine/hooks

# For Chakra UI projects
pnpm add omnifeedback @chakra-ui/react

# For MUI projects
pnpm add omnifeedback @mui/material @emotion/react @emotion/styled

# For Ant Design projects
pnpm add omnifeedback antd

# For pure Tailwind (no UI library)
pnpm add omnifeedback
```

## 🚀 Quick Start

### 1. Wrap your app with FeedbackProvider

```tsx
import { FeedbackProvider } from 'omnifeedback';
import { shadcnAdapter } from 'omnifeedback/adapters/shadcn';
// Or: import { headlessAdapter } from 'omnifeedback/adapters/headless';

function App() {
  return (
    <FeedbackProvider adapter={shadcnAdapter}>
      <YourApp />
    </FeedbackProvider>
  );
}
```

### 2. Use the hooks anywhere

```tsx
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { toast, modal, loading, confirm } = useFeedback();

  const handleSubmit = async () => {
    // Show loading
    const loadingId = loading.show({ message: 'Saving...' });

    try {
      await saveData();
      loading.hide(loadingId);
      toast.success('Saved successfully!');
    } catch (error) {
      loading.hide(loadingId);
      toast.error('Failed to save');
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm.show({
      title: 'Delete Item',
      message: 'Are you sure? This cannot be undone.',
      confirmVariant: 'danger',
    });

    if (confirmed) {
      await deleteItem();
      toast.success('Item deleted');
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

## 📖 API Reference

### useFeedback

The main hook that provides access to all feedback methods.

```tsx
const { toast, modal, loading, alert, progress, confirm, clearAll } = useFeedback();
```

### Toast

```tsx
// Simple variants
toast.success('Operation successful!');
toast.error('Something went wrong');
toast.warning('Please check your input');
toast.info('New update available');

// Full options
toast.show({
  message: 'File uploaded',
  title: 'Upload Complete',
  variant: 'success',
  duration: 5000,        // ms, 0 = infinite
  position: 'top-right', // top-left, top-center, bottom-left, etc.
  dismissible: true,
  icon: <CustomIcon />,
  action: {
    label: 'View',
    onClick: () => navigate('/files'),
  },
  onDismiss: () => console.log('Toast dismissed'),
});

// Promise toast
const result = await toast.promise(fetchData(), {
  loading: 'Loading data...',
  success: (data) => `Loaded ${data.count} items`,
  error: (err) => `Error: ${err.message}`,
});

// Update existing toast
const id = toast.show({ message: 'Processing...' });
toast.update(id, { message: 'Almost done...' });
toast.dismiss(id);

// Dismiss all toasts
toast.dismissAll();
```

### Modal

```tsx
// Open modal
const modalId = modal.open({
  title: 'Edit Profile',
  content: <ProfileForm />,
  size: 'lg',              // sm, md, lg, xl, full
  closable: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
  footer: (
    <>
      <Button onClick={() => modal.close(modalId)}>Cancel</Button>
      <Button variant="primary">Save</Button>
    </>
  ),
  onClose: () => console.log('Modal closed'),
});

// Close modal
modal.close(modalId);

// Close all modals
modal.closeAll();
```

### Loading

```tsx
// Simple loading
const id = loading.show({ message: 'Loading...' });
// Later...
loading.hide(id);

// Full overlay
loading.show({
  message: 'Please wait...',
  overlay: true,
  overlayOpacity: 0.5,
  blur: true,
  spinner: 'dots', // default, dots, bars, ring, pulse
  cancellable: true,
  onCancel: () => abortController.abort(),
});

// Wrap async function
const result = await loading.wrap(
  async () => {
    return await fetchData();
  },
  { message: 'Fetching data...' }
);

// Hide all loading indicators
loading.hideAll();
```

### Alert

```tsx
// Simple alert
alert.show({
  message: 'Your session will expire in 5 minutes',
  variant: 'warning',
});

// With actions
alert.show({
  title: 'Update Available',
  message: 'A new version is available. Would you like to update?',
  variant: 'info',
  dismissible: true,
  actions: [
    { label: 'Later', onClick: () => {}, variant: 'secondary' },
    { label: 'Update Now', onClick: () => updateApp(), variant: 'primary' },
  ],
});
```

### Progress

```tsx
// Start progress
const id = progress.show({
  value: 0,
  label: 'Uploading files...',
  showPercentage: true,
});

// Update progress
progress.update(id, { value: 50 });
progress.update(id, { value: 100, label: 'Upload complete!' });

// Indeterminate progress
progress.show({
  indeterminate: true,
  label: 'Processing...',
});
```

### Confirm

```tsx
// Basic confirm
const confirmed = await confirm.show({
  message: 'Are you sure you want to proceed?',
});

if (confirmed) {
  // User clicked confirm
}

// Danger confirm
const shouldDelete = await confirm.danger(
  'This will permanently delete the item.',
  { title: 'Delete Item' }
);

// Full options
const result = await confirm.show({
  title: 'Confirm Action',
  message: 'This action cannot be undone.',
  confirmText: 'Yes, proceed',
  cancelText: 'No, go back',
  confirmVariant: 'danger',
});
```

## 🎨 Adapters

### Available Adapters

| Adapter | Import | UI Library |
|---------|--------|------------|
| shadcn | `omnifeedback/adapters/shadcn` | Radix + Tailwind |
| Mantine | `omnifeedback/adapters/mantine` | @mantine/core |
| Chakra | `omnifeedback/adapters/chakra` | @chakra-ui/react |
| MUI | `omnifeedback/adapters/mui` | @mui/material |
| Ant Design | `omnifeedback/adapters/antd` | antd |
| Headless | `omnifeedback/adapters/headless` | Pure Tailwind |

### Using Headless Adapter

The headless adapter uses only Tailwind CSS with no external UI library:

```tsx
import { FeedbackProvider } from 'omnifeedback';
import { headlessAdapter } from 'omnifeedback/adapters/headless';
import 'omnifeedback/styles'; // Import default styles

function App() {
  return (
    <FeedbackProvider adapter={headlessAdapter}>
      <YourApp />
    </FeedbackProvider>
  );
}
```

## ⚙️ Configuration

```tsx
<FeedbackProvider
  adapter={shadcnAdapter}
  config={{
    defaultDuration: 5000,
    defaultPosition: 'top-right',
    maxVisible: {
      toast: 5,
      modal: 1,
      loading: 3,
    },
    enableAnimations: true,
    rtl: false,
  }}
>
  {children}
</FeedbackProvider>
```

## 🎯 TypeScript Support

OmniFeedback is written in TypeScript with full type definitions:

```tsx
import type { 
  IToastOptions, 
  IModalOptions,
  ILoadingOptions,
  ToastPosition,
  FeedbackVariant,
} from 'omnifeedback';
```

## 🧪 Testing

```tsx
import { renderHook } from '@testing-library/react';
import { FeedbackProvider, useFeedback } from 'omnifeedback';
import { headlessAdapter } from 'omnifeedback/adapters/headless';

const wrapper = ({ children }) => (
  <FeedbackProvider adapter={headlessAdapter}>
    {children}
  </FeedbackProvider>
);

test('shows toast', () => {
  const { result } = renderHook(() => useFeedback(), { wrapper });
  
  const id = result.current.toast.success('Test message');
  
  expect(id).toBeDefined();
});
```

## 📝 Requirements

- React 18.0.0 or higher
- Node.js 18.0.0 or higher

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

MIT © [Your Name](https://github.com/yourusername)

---

<p align="center">
  Made with ❤️ for the React community
</p>
