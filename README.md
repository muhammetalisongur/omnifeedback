# OmniFeedback

> 🔔 Universal React Feedback Management - Toast, Modal, Loading, Alert & More

[![npm version](https://img.shields.io/npm/v/omnifeedback.svg)](https://www.npmjs.com/package/omnifeedback)
[![bundle size](https://img.shields.io/bundlephobia/minzip/omnifeedback)](https://bundlephobia.com/package/omnifeedback)
[![license](https://img.shields.io/npm/l/omnifeedback.svg)](https://github.com/muhammetalisongur/omnifeedback/blob/main/LICENSE)

One API. Every UI library. Zero headaches.

## ✨ Features

- 🎯 **Unified API** - Same interface for Toast, Modal, Loading, Alert, Progress, Confirm, Banner, Drawer, Prompt, Sheet & more
- 🎨 **Multi-Library Support** - Works with shadcn/ui, Mantine, Chakra UI, MUI, Ant Design, or pure Tailwind
- 🔧 **Fully Parametric** - Every behavior, style, and animation is customizable
- 🐛 **Zero Bugs** - No layout shifts, z-index conflicts, or memory leaks
- ♿ **Accessible** - ARIA compliant, keyboard navigation, screen reader support
- 📦 **Tree-Shakeable** - Only bundle what you use
- 🎭 **Animations** - Smooth enter/exit animations with CSS transforms

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

function App() {
  return (
    <FeedbackProvider toastPosition="top-right">
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
const {
  toast,        // Toast notifications
  modal,        // Modal dialogs
  loading,      // Loading indicators
  alert,        // Inline alerts
  progress,     // Progress bars
  confirm,      // Confirmation dialogs
  banner,       // Full-width banners
  drawer,       // Side panel drawers
  popconfirm,   // Popover confirmations
  skeleton,     // Skeleton placeholders
  result,       // Result/status pages
  connection,   // Connection status monitoring
  prompt,       // Input prompt dialogs
  sheet,        // Bottom sheets
} = useFeedback();
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

### Banner

```tsx
// Show a banner announcement
banner.show({
  message: 'We use cookies to improve your experience.',
  variant: 'info',
  position: 'top',
  dismissible: true,
  rememberDismiss: 'cookie-consent', // Remember in localStorage
  actions: [
    { label: 'Accept', onClick: () => acceptCookies(), variant: 'primary' },
    { label: 'Learn More', onClick: () => openPolicy(), variant: 'link' },
  ],
});

// Dismiss banner
banner.dismiss(id);
```

### Drawer

```tsx
// Open a drawer/side panel
const drawerId = drawer.open({
  title: 'Settings',
  content: <SettingsPanel />,
  position: 'right', // left, right, top, bottom
  size: 'md',        // sm, md, lg, xl, full
  overlay: true,
  closeOnEscape: true,
  footer: <Button onClick={() => drawer.close(drawerId)}>Close</Button>,
});

// Close drawer
drawer.close(drawerId);
```

### Prompt

```tsx
// Promise-based input dialog
const name = await prompt.show({
  title: 'Rename File',
  placeholder: 'Enter new file name...',
  defaultValue: 'document.pdf',
  validate: (value) => value.length < 3 ? 'Name must be at least 3 characters' : true,
});

if (name !== null) {
  // User entered a value and confirmed
  renameFile(name);
}
```

### Sheet

```tsx
// Open a bottom sheet
sheet.open({
  title: 'Share Options',
  content: <ShareMenu />,
  snapPoints: [30, 60, 90],  // Percentage snap points
  defaultSnapPoint: 1,        // Start at 60%
  showHandle: true,            // Drag handle
  closeOnBackdropClick: true,
});
```

### Popconfirm

```tsx
// Popover confirmation near a trigger element
popconfirm.show({
  target: buttonRef,
  message: 'Delete this item?',
  confirmText: 'Delete',
  confirmVariant: 'danger',
  placement: 'top',
  onConfirm: () => deleteItem(),
});
```

### Skeleton

```tsx
// Show skeleton loading placeholders
const skeletonId = skeleton.show({ animation: 'pulse' });

// Hide when data is loaded
skeleton.hide(skeletonId);
```

### Result

```tsx
// Show a result/status page
result.show({
  status: 'success', // success, error, info, warning, 404, 403, 500
  title: 'Payment Successful',
  description: 'Your order has been placed.',
  primaryAction: { label: 'View Order', onClick: () => navigate('/orders') },
  secondaryAction: { label: 'Go Home', onClick: () => navigate('/') },
});
```

### Connection

```tsx
import { useConnection } from 'omnifeedback';

// Monitor connection status (auto-detects online/offline)
const { isOnline, isReconnecting, offlineDuration } = useConnection();
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
import 'omnifeedback/styles'; // Import default styles

function App() {
  return (
    <FeedbackProvider>
      <YourApp />
    </FeedbackProvider>
  );
}
```

## ⚙️ Configuration

```tsx
<FeedbackProvider
  toastPosition="top-right"
  config={{
    defaultDuration: 5000,
    maxVisible: {
      toast: 5,
      modal: 1,
      loading: 3,
    },
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

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT © [Muhammet Ali Songur](https://github.com/muhammetalisongur)

---

<p align="center">
  Made with ❤️ for the React community
</p>
