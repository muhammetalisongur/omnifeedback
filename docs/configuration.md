# Configuration Guide

OmniFeedback provides a layered configuration system. Global defaults are set via `FeedbackProvider` props and the `config` object, while individual hook calls can override any option on a per-call basis.

This guide covers every configuration surface in detail.

## FeedbackProvider Props

The `FeedbackProvider` component accepts the following props. These control both the global behavior and which container elements are rendered.

| Prop                | Type                       | Default        | Description                                      |
|---------------------|----------------------------|----------------|--------------------------------------------------|
| `children`          | `ReactNode`                | **(required)** | Child components to wrap                         |
| `config`            | `Partial<IFeedbackConfig>` | `{}`           | Global feedback configuration (see below)        |
| `toastPosition`     | `ToastPosition`            | `'top-right'`  | Default position for toast notifications         |
| `toastGap`          | `number`                   | `12`           | Gap in pixels between stacked toasts             |
| `renderToasts`      | `boolean`                  | `true`         | Whether to render the toast container            |
| `renderModals`      | `boolean`                  | `true`         | Whether to render the modal container            |
| `renderLoadings`    | `boolean`                  | `true`         | Whether to render the loading container          |
| `renderConfirms`    | `boolean`                  | `true`         | Whether to render the confirm dialog container   |
| `renderBanners`     | `boolean`                  | `true`         | Whether to render the banner container           |
| `renderDrawers`     | `boolean`                  | `true`         | Whether to render the drawer container           |
| `renderPopconfirms` | `boolean`                  | `true`         | Whether to render the popconfirm container       |
| `renderSheets`      | `boolean`                  | `true`         | Whether to render the sheet container            |
| `renderPrompts`     | `boolean`                  | `true`         | Whether to render the prompt dialog container    |

### Example: Full Provider Setup

```tsx
import { FeedbackProvider } from 'omnifeedback';

function App() {
  return (
    <FeedbackProvider
      toastPosition="bottom-right"
      toastGap={16}
      renderPopconfirms={false}
      config={{
        defaultDuration: 4000,
        enableAnimations: true,
        maxVisible: { toast: 3 },
      }}
    >
      <YourApp />
    </FeedbackProvider>
  );
}
```

## IFeedbackConfig

The `config` prop accepts a partial `IFeedbackConfig` object. Any fields you omit will use the defaults shown below.

| Field                    | Type                                          | Default         | Description                                         |
|--------------------------|-----------------------------------------------|-----------------|-----------------------------------------------------|
| `defaultDuration`        | `number`                                      | `5000`          | Default auto-dismiss duration for toasts/alerts (ms). Set `0` for infinite. |
| `exitAnimationDuration`  | `number`                                      | `200`           | Duration of exit animations in milliseconds         |
| `enterAnimationDuration` | `number`                                      | `200`           | Duration of enter animations in milliseconds        |
| `maxVisible`             | `Partial<Record<FeedbackType, number>>`       | *(see below)*   | Maximum simultaneously visible items per type       |
| `defaultPosition`        | `ToastPosition`                               | `'top-right'`   | Default toast position (also settable via prop)      |
| `enableAnimations`       | `boolean`                                     | `true`          | Enable or disable all enter/exit animations         |
| `rtl`                    | `boolean`                                     | `false`         | Enable right-to-left layout support                 |
| `queue`                  | `IQueueConfig`                                | *(see below)*   | Queue overflow configuration                        |

### Default `maxVisible` Values

```ts
maxVisible: {
  toast: 5,
  modal: 1,
  loading: 3,
  alert: 5,
  progress: 3,
  confirm: 1,
  banner: 1,
  drawer: 1,
  popconfirm: 1,
  prompt: 1,
  sheet: 1,
}
```

When the visible count for a type exceeds `maxVisible`, the oldest items are automatically dismissed (exit animation triggered, then removed) to make room.

### IQueueConfig

| Field      | Type                               | Default  | Description                                           |
|------------|------------------------------------|----------|-------------------------------------------------------|
| `maxSize`  | `number`                           | `100`    | Maximum number of items in the internal queue         |
| `strategy` | `'fifo' \| 'priority' \| 'reject'` | `'fifo'` | Overflow strategy when queue is full                  |

- **`fifo`** -- First-in, first-out. Oldest items are removed to make room.
- **`priority`** -- Items with lower `priority` values are removed first.
- **`reject`** -- New items are rejected when the queue is full (emits `queue:overflow` event).

### Full Configuration Example

```tsx
<FeedbackProvider
  toastPosition="top-center"
  toastGap={8}
  config={{
    defaultDuration: 3000,
    enterAnimationDuration: 250,
    exitAnimationDuration: 150,
    enableAnimations: true,
    rtl: false,
    maxVisible: {
      toast: 3,
      modal: 1,
      loading: 2,
      alert: 3,
      confirm: 1,
      banner: 2,
      drawer: 1,
    },
    queue: {
      maxSize: 50,
      strategy: 'fifo',
    },
  }}
>
  <YourApp />
</FeedbackProvider>
```

## Per-Call Overrides

Every feedback hook accepts options that override the global configuration for that specific call. This is the primary mechanism for customizing individual feedback items without changing global behavior.

### Toast Example

```tsx
const toast = useToast();

// Uses global defaults
toast.success('Saved!');

// Overrides duration and position for this single toast
toast.show({
  message: 'Important notice',
  variant: 'warning',
  duration: 10000,            // Override defaultDuration
  position: 'bottom-center',  // Override defaultPosition
  dismissible: true,
  showProgress: true,
  progressPosition: 'bottom',
  pauseOnHover: true,
});
```

### Loading Example

```tsx
const loading = useLoading();

// Minimal call (uses all defaults)
loading.show();

// Full override
loading.show({
  message: 'Processing payment...',
  spinner: 'dots',
  overlay: true,
  overlayOpacity: 0.6,
  blur: true,
  blurAmount: '8px',
  size: 'lg',
  variant: 'primary',
  cancellable: true,
  cancelText: 'Abort',
  onCancel: () => controller.abort(),
});
```

### Confirm Example

```tsx
const confirm = useConfirm();

const result = await confirm.show({
  title: 'Confirm Deletion',
  message: 'This action is irreversible.',
  confirmText: 'Delete Permanently',
  cancelText: 'Keep It',
  confirmVariant: 'danger',
});
```

### Modal Example

```tsx
const modal = useModal();

modal.open({
  title: 'User Settings',
  content: <SettingsPanel />,
  size: 'lg',
  closable: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
  centered: true,
  scrollBehavior: 'inside',
  preventScroll: true,
});
```

## Selective Container Rendering

By default, `FeedbackProvider` renders container elements for all feedback types (toasts, modals, loadings, confirms, banners, drawers, popconfirms, sheets, prompts). Each container is a lightweight wrapper that only produces DOM nodes when items are actively displayed.

However, if you know certain feedback types will never be used in your application, you can disable their containers to reduce the component tree:

```tsx
<FeedbackProvider
  renderToasts={true}
  renderModals={true}
  renderLoadings={true}
  renderConfirms={true}
  renderBanners={false}      // Not using banners
  renderDrawers={false}      // Not using drawers
  renderPopconfirms={false}  // Not using popconfirms
  renderSheets={false}       // Not using sheets
  renderPrompts={false}      // Not using prompts
>
  <YourApp />
</FeedbackProvider>
```

### When to Disable Containers

- **Performance-critical applications:** Every container subscribes to the Zustand store. While the overhead is minimal, removing unused containers reduces subscription count.
- **Testing environments:** Disable all containers except the one under test to isolate behavior. This is the recommended approach in integration tests:

```tsx
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider
        renderToasts={false}
        renderModals={false}
        renderLoadings={false}
        renderConfirms={false}
        renderBanners={false}
        renderDrawers={false}
        renderPopconfirms={false}
        renderSheets={false}
        renderPrompts={false}
      >
        {children}
      </FeedbackProvider>
    );
  };
}
```

See the [Testing Guide](./guides/testing.md) for more patterns.

## Toast Position Configuration

The `toastPosition` prop (and per-call `position` option) accepts one of six values:

| Position         | Vertical | Horizontal | Visual Placement              |
|------------------|----------|------------|-------------------------------|
| `top-left`       | Top      | Left       | Upper-left corner of viewport |
| `top-center`     | Top      | Center     | Top-center of viewport        |
| `top-right`      | Top      | Right      | Upper-right corner (default)  |
| `bottom-left`    | Bottom   | Left       | Lower-left corner of viewport |
| `bottom-center`  | Bottom   | Center     | Bottom-center of viewport     |
| `bottom-right`   | Bottom   | Right      | Lower-right corner of viewport|

Toast containers use fixed positioning with appropriate z-index layering. When multiple toasts are visible, they stack vertically with the configured `toastGap` spacing.

```tsx
// Global position via provider
<FeedbackProvider toastPosition="bottom-right" toastGap={16}>
  <YourApp />
</FeedbackProvider>

// Per-toast position override
toast.show({
  message: 'This appears top-center',
  position: 'top-center',
});
```

## SSR Considerations

OmniFeedback is designed to work in server-side rendering environments (Next.js, Remix, etc.). The following patterns are used internally to ensure SSR safety:

### Document Checks

All adapter `isDarkMode()` and `injectStyles()` functions guard against server execution:

```ts
// Pattern used in every adapter
isDarkMode: () => {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
},

injectStyles: () => {
  if (typeof document === 'undefined') return;
  // ... inject styles only in browser
},
```

### Style Injection

Adapters inject their required CSS (animation keyframes, utility classes) via `injectStyles()`. This function:

1. Checks for browser environment (`typeof document !== 'undefined'`).
2. Checks if styles are already injected (idempotent via `document.getElementById`).
3. Creates a `<style>` element and appends it to `<head>`.

This means styles are injected once on the client, never during SSR.

### Provider Behavior

`FeedbackProvider` uses `useRef` to hold a stable `FeedbackManager` singleton. On the server, it will create the manager but no timers or DOM interactions will occur. The provider is safe to render during SSR.

## Environment Configuration Tips

### Development

```tsx
<FeedbackProvider
  config={{
    defaultDuration: 8000,  // Longer duration for debugging
    enableAnimations: true,
  }}
>
  <YourApp />
</FeedbackProvider>
```

### Production

```tsx
<FeedbackProvider
  config={{
    defaultDuration: 4000,    // Shorter, less intrusive
    enableAnimations: true,
    maxVisible: { toast: 3 }, // Limit visible toasts
    queue: {
      maxSize: 50,
      strategy: 'fifo',
    },
  }}
>
  <YourApp />
</FeedbackProvider>
```

### Conditional Configuration

```tsx
const isDev = process.env.NODE_ENV === 'development';

<FeedbackProvider
  config={{
    defaultDuration: isDev ? 8000 : 4000,
    maxVisible: {
      toast: isDev ? 10 : 3,
    },
  }}
>
  <YourApp />
</FeedbackProvider>
```

## Related Guides

- **[Getting Started](./getting-started.md)** -- Quick setup walkthrough.
- **[Adapter System Overview](./adapters/overview.md)** -- Adapter comparison and custom adapter creation.
- **[Testing with OmniFeedback](./guides/testing.md)** -- Test wrapper setup and hook testing patterns.
