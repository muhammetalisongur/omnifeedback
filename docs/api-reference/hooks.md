# Hooks API Reference

Complete API reference for all OmniFeedback React hooks. Every hook must be used within a `<FeedbackProvider>`.

---

## useFeedback

Combined hook providing access to all 14 feedback sub-systems through a single import.

### Import

```typescript
import { useFeedback } from 'omnifeedback';
```

### Signature

```typescript
function useFeedback(options?: IUseFeedbackOptions): IUseFeedbackReturn;
```

### IUseFeedbackOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `connection` | `IConnectionOptions` | `undefined` | Connection monitoring options passed to `useConnection` |

### Return Type: `IUseFeedbackReturn`

| Property | Type | Description |
|----------|------|-------------|
| `toast` | `IUseToastReturn` | Toast notification methods |
| `modal` | `IUseModalReturn` | Modal dialog methods |
| `loading` | `IUseLoadingReturn` | Loading indicator methods |
| `alert` | `IUseAlertReturn` | Alert message methods |
| `progress` | `IUseProgressReturn` | Progress indicator methods |
| `confirm` | `IUseConfirmReturn` | Confirmation dialog methods |
| `banner` | `IUseBannerReturn` | Banner announcement methods |
| `drawer` | `IUseDrawerReturn` | Drawer panel methods |
| `popconfirm` | `IUsePopconfirmReturn` | Popconfirm dialog methods |
| `skeleton` | `IUseSkeletonReturn` | Skeleton loader methods |
| `result` | `IUseResultReturn` | Result page methods |
| `connection` | `IUseConnectionReturn` | Connection status methods |
| `prompt` | `IUsePromptReturn` | Prompt dialog methods |
| `sheet` | `IUseSheetReturn` | Bottom sheet methods |

### Examples

```tsx
// Destructure only what you need
const { toast, confirm, loading } = useFeedback();

toast.success('Saved!');
```

```tsx
// With connection monitoring
const { connection, toast } = useFeedback({
  connection: {
    onOffline: () => console.log('Lost connection'),
    onOnline: () => toast.success('Back online!'),
  },
});
```

---

## useToast

Toast notifications with variant shortcuts, update-in-place, and promise-based lifecycle.

### Import

```typescript
import { useToast } from 'omnifeedback';
```

### Return Type: `IUseToastReturn`

| Method | Parameters | Return | Description |
|--------|-----------|--------|-------------|
| `show` | `options: IToastOptions` | `string` | Show toast with full options, returns ID |
| `success` | `message: string, options?: Partial<IToastOptions>` | `string` | Show success toast |
| `error` | `message: string, options?: Partial<IToastOptions>` | `string` | Show error toast |
| `warning` | `message: string, options?: Partial<IToastOptions>` | `string` | Show warning toast |
| `info` | `message: string, options?: Partial<IToastOptions>` | `string` | Show info toast |
| `loading` | `message: string, options?: Partial<IToastOptions>` | `string` | Show persistent loading toast (duration: 0) |
| `dismiss` | `id: string` | `void` | Dismiss a specific toast by ID |
| `dismissAll` | — | `void` | Dismiss all toasts |
| `update` | `id: string, options: Partial<IToastOptions>` | `void` | Update an existing toast |
| `promise` | `promise: Promise<T>, options: IToastPromiseOptions<T>` | `Promise<T>` | Show loading then success/error based on promise result |

### IToastOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string` | **required** | Toast content |
| `title` | `string` | `undefined` | Optional title |
| `variant` | `FeedbackVariant` | `'default'` | `'success' \| 'error' \| 'warning' \| 'info' \| 'default'` |
| `duration` | `number` | Config default | Duration in ms (`0` = infinite) |
| `position` | `ToastPosition` | `'top-right'` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` |
| `dismissible` | `boolean` | `true` | Show close button |
| `icon` | `ReactNode` | `undefined` | Custom icon element |
| `action` | `IToastAction` | `undefined` | Action button `{ label: string; onClick: () => void }` |
| `onDismiss` | `() => void` | `undefined` | Callback when dismissed |
| `onShow` | `() => void` | `undefined` | Callback when shown |
| `showProgress` | `boolean` | `false` | Show countdown progress bar |
| `progressPosition` | `'top' \| 'bottom'` | `'bottom'` | Progress bar position |
| `progressColor` | `string` | variant color | Custom progress bar color |
| `pauseOnHover` | `boolean` | `false` | Pause countdown on hover |
| `pauseOnFocusLoss` | `boolean` | `false` | Pause countdown when window loses focus |

### IToastPromiseOptions\<T\>

| Property | Type | Description |
|----------|------|-------------|
| `loading` | `string` | Message shown while promise is pending |
| `success` | `string \| ((data: T) => string)` | Message on resolve |
| `error` | `string \| ((error: Error) => string)` | Message on reject |
| `options` | `Partial<IToastOptions>` | Additional toast options applied to all states |

### Examples

```tsx
const toast = useToast();

// Variant shortcuts
toast.success('Changes saved.');
toast.error('Something went wrong', { duration: 5000 });

// Promise-based lifecycle
await toast.promise(fetch('/api/data'), {
  loading: 'Fetching data...',
  success: 'Data loaded!',
  error: (err) => `Failed: ${err.message}`,
});
```

```tsx
// Update in place
const id = toast.loading('Uploading...');
// ...later
toast.update(id, { message: 'Almost done...' });
toast.dismiss(id);
```

---

## useModal

Modal dialogs with open/close lifecycle and reactive state.

### Import

```typescript
import { useModal } from 'omnifeedback';
```

### Return Type: `IUseModalReturn`

| Member | Type | Description |
|--------|------|-------------|
| `open` | `(options: IModalOptions) => string` | Open a modal, returns ID |
| `close` | `(id: string) => void` | Close a specific modal |
| `closeAll` | `() => void` | Close all open modals |
| `update` | `(id: string, options: Partial<IModalOptions>) => void` | Update modal options |
| `isOpen` | `boolean` | Whether any modal is currently open |
| `openModals` | `string[]` | Array of currently open modal IDs |

### IModalOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `ReactNode` | **required** | Modal body content |
| `title` | `ReactNode` | `undefined` | Modal title |
| `size` | `ModalSize` | `'md'` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` |
| `closable` | `boolean` | `true` | Show close button |
| `closeOnBackdropClick` | `boolean` | `true` | Close when backdrop is clicked |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `footer` | `ReactNode` | `undefined` | Footer content |
| `header` | `ReactNode` | `undefined` | Custom header content |
| `onClose` | `() => void` | `undefined` | Called when modal closes |
| `onOpen` | `() => void` | `undefined` | Called when modal opens |
| `preventScroll` | `boolean` | `true` | Lock body scroll while open |
| `initialFocus` | `string` | `undefined` | CSS selector for initial focus element |
| `returnFocus` | `boolean` | `true` | Return focus to trigger on close |
| `centered` | `boolean` | `false` | Vertically center the modal |
| `scrollBehavior` | `'inside' \| 'outside'` | `'inside'` | Where the scroll bar appears |

### Examples

```tsx
const modal = useModal();

const id = modal.open({
  title: 'Edit Profile',
  content: <ProfileForm />,
  size: 'lg',
  onClose: () => console.log('closed'),
});

// Later
modal.close(id);
```

```tsx
// Check reactive state
if (modal.isOpen) {
  console.log('Open modals:', modal.openModals);
}
```

---

## useLoading

Loading indicators with manual show/hide and an async `wrap()` helper.

### Import

```typescript
import { useLoading } from 'omnifeedback';
```

### Return Type: `IUseLoadingReturn`

| Member | Type | Description |
|--------|------|-------------|
| `show` | `(options?: ILoadingOptions) => string` | Show loading indicator, returns ID |
| `hide` | `(id: string) => void` | Hide a specific loading indicator |
| `hideAll` | `() => void` | Hide all loading indicators |
| `update` | `(id: string, options: Partial<ILoadingOptions>) => void` | Update loading options |
| `wrap` | `<T>(fn: () => Promise<T>, options?: ILoadingOptions) => Promise<T>` | Wrap async fn with auto show/hide |
| `isLoading` | `boolean` | Whether any loading is active |
| `activeLoadings` | `string[]` | Array of active loading IDs |

### ILoadingOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string` | `undefined` | Loading message text |
| `spinner` | `SpinnerType` | `'default'` | `'default' \| 'dots' \| 'bars' \| 'ring' \| 'pulse'` |
| `overlay` | `boolean` | `false` | Full screen overlay |
| `overlayOpacity` | `number` | `0.5` | Overlay opacity (0-1) |
| `blur` | `boolean` | `false` | Blur background content |
| `blurAmount` | `string` | `'4px'` | CSS blur value |
| `cancellable` | `boolean` | `false` | Show cancel button |
| `onCancel` | `() => void` | `undefined` | Cancel callback |
| `cancelText` | `string` | `undefined` | Cancel button text |
| `size` | `LoadingSize` | `'md'` | `'sm' \| 'md' \| 'lg'` |
| `variant` | `LoadingVariant` | `'primary'` | `'primary' \| 'secondary' \| 'white'` |

### Examples

```tsx
const loading = useLoading();

// Manual show/hide
const id = loading.show({ message: 'Saving...', overlay: true });
await saveData();
loading.hide(id);
```

```tsx
// Wrap helper — auto show/hide with try/finally
const data = await loading.wrap(
  () => fetchUsers(),
  { message: 'Loading users...' }
);
```

---

## useAlert

Inline alert messages with variant shortcuts and reactive list.

### Import

```typescript
import { useAlert } from 'omnifeedback';
```

### Return Type: `IUseAlertReturn`

| Member | Type | Description |
|--------|------|-------------|
| `show` | `(options: IAlertOptions) => string` | Show alert with full options, returns ID |
| `success` | `(message: string, options?: Partial<IAlertOptions>) => string` | Show success alert |
| `error` | `(message: string, options?: Partial<IAlertOptions>) => string` | Show error alert |
| `warning` | `(message: string, options?: Partial<IAlertOptions>) => string` | Show warning alert |
| `info` | `(message: string, options?: Partial<IAlertOptions>) => string` | Show info alert |
| `dismiss` | `(id: string) => void` | Dismiss a specific alert |
| `dismissAll` | `() => void` | Dismiss all alerts |
| `update` | `(id: string, options: Partial<IAlertOptions>) => void` | Update an existing alert |
| `alerts` | `IAlertItem[]` | Reactive array of active alerts |

### IAlertOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string` | **required** | Alert message |
| `title` | `string` | `undefined` | Alert title |
| `variant` | `FeedbackVariant` | `'default'` | Visual variant |
| `dismissible` | `boolean` | `true` | Show close button |
| `icon` | `ReactNode` | `undefined` | Custom icon |
| `hideIcon` | `boolean` | `false` | Hide the default icon |
| `duration` | `number` | `0` | Auto-dismiss in ms (`0` = never) |
| `actions` | `IAlertAction[]` | `undefined` | Action buttons `{ label, onClick, variant? }` |
| `onDismiss` | `() => void` | `undefined` | Callback when dismissed |
| `bordered` | `boolean` | `true` | Show border |
| `filled` | `boolean` | `false` | Use filled background style |

### Examples

```tsx
const alert = useAlert();

alert.success('Your changes have been saved.');
alert.error('Failed to save.', { title: 'Error', duration: 5000 });
```

```tsx
// Alert with action buttons
const id = alert.show({
  message: 'New version available.',
  variant: 'info',
  actions: [
    { label: 'Update Now', onClick: handleUpdate, variant: 'primary' },
    { label: 'Later', onClick: () => alert.dismiss(id) },
  ],
});
```

---

## useProgress

Progress indicators (linear and circular) with value updates and completion callback.

### Import

```typescript
import { useProgress } from 'omnifeedback';
```

### Return Type: `IUseProgressReturn`

| Member | Type | Description |
|--------|------|-------------|
| `show` | `(options: IProgressOptions) => string` | Show progress indicator, returns ID |
| `update` | `(id: string, value: number, options?: Partial<IProgressOptions>) => void` | Update progress value |
| `complete` | `(id: string) => void` | Set to 100% and auto-remove after 500ms |
| `remove` | `(id: string) => void` | Remove progress immediately |
| `removeAll` | `() => void` | Remove all progress indicators |
| `setIndeterminate` | `(id: string, indeterminate: boolean) => void` | Toggle indeterminate mode |
| `indicators` | `IProgressItem[]` | Reactive array of active indicators |

### IProgressOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `number` | **required** | Progress value (0-100) |
| `max` | `number` | `100` | Maximum value |
| `label` | `string` | `undefined` | Progress label text |
| `showPercentage` | `boolean` | `false` | Display percentage text |
| `variant` | `FeedbackVariant` | `'info'` | Visual variant |
| `indeterminate` | `boolean` | `false` | Indeterminate mode |
| `size` | `ProgressSize` | `'md'` | `'sm' \| 'md' \| 'lg'` |
| `type` | `ProgressType` | `'linear'` | `'linear' \| 'circular'` |
| `animated` | `boolean` | `false` | Enable animation |
| `striped` | `boolean` | `false` | Striped pattern (linear only) |
| `color` | `string` | `undefined` | Custom color (overrides variant) |
| `onComplete` | `() => void` | `undefined` | Called when value reaches max |

### Examples

```tsx
const progress = useProgress();

// Incremental upload progress
const id = progress.show({ value: 0, label: 'Uploading...' });
for (let i = 0; i <= 100; i += 10) {
  await delay(200);
  progress.update(id, i);
}
progress.complete(id);
```

```tsx
// Circular indeterminate
progress.show({
  value: 0,
  type: 'circular',
  indeterminate: true,
  label: 'Processing...',
});
```

---

## useConfirm

Promise-based confirmation dialogs. Resolves `true` when confirmed, `false` when cancelled.

### Import

```typescript
import { useConfirm } from 'omnifeedback';
```

### Return Type: `IUseConfirmReturn`

| Method | Parameters | Return | Description |
|--------|-----------|--------|-------------|
| `show` | `options: IConfirmShowOptions` | `Promise<boolean>` | Show confirm dialog |
| `danger` | `message: string, options?: Partial<IConfirmShowOptions>` | `Promise<boolean>` | Danger-styled confirm for destructive actions |
| `close` | `id: string` | `void` | Close dialog without triggering callbacks |

### IConfirmShowOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string` | **required** | Confirmation message |
| `title` | `string` | `undefined` | Dialog title |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `confirmVariant` | `'primary' \| 'danger'` | `'primary'` | Confirm button style |
| `icon` | `ReactNode` | `undefined` | Custom icon |

### Examples

```tsx
const confirm = useConfirm();

const ok = await confirm.show({
  title: 'Unsaved Changes',
  message: 'Discard your changes?',
  confirmText: 'Discard',
});
if (ok) navigateAway();
```

```tsx
// Danger variant for destructive actions
const confirmed = await confirm.danger(
  'This will permanently delete your account.',
  { title: 'Delete Account', confirmText: 'Delete Forever' }
);
if (confirmed) await deleteAccount();
```

---

## useBanner

Page-level banners with variant shortcuts, persistent dismiss via localStorage, and reactive list.

### Import

```typescript
import { useBanner } from 'omnifeedback';
```

### Return Type: `IUseBannerReturn`

| Member | Type | Description |
|--------|------|-------------|
| `show` | `(options: IBannerOptions) => string` | Show banner, returns ID (empty string if already dismissed) |
| `info` | `(message: string, options?: Partial<IBannerOptions>) => string` | Show info banner |
| `success` | `(message: string, options?: Partial<IBannerOptions>) => string` | Show success banner |
| `warning` | `(message: string, options?: Partial<IBannerOptions>) => string` | Show warning banner |
| `error` | `(message: string, options?: Partial<IBannerOptions>) => string` | Show error banner |
| `announcement` | `(message: string, options?: Partial<IBannerOptions>) => string` | Show announcement banner |
| `hide` | `(id: string) => void` | Hide a specific banner |
| `hideAll` | `() => void` | Hide all banners |
| `update` | `(id: string, options: Partial<IBannerOptions>) => void` | Update banner |
| `banners` | `IBannerItem[]` | Reactive array of active banners |
| `isDismissed` | `(key: string) => boolean` | Check if a `rememberDismiss` key was dismissed |
| `clearDismissed` | `(key: string) => void` | Clear a persisted dismiss so banner can show again |

### IBannerOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string` | **required** | Banner message |
| `title` | `string` | `undefined` | Banner title |
| `variant` | `BannerVariant` | `'default'` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error' \| 'announcement'` |
| `position` | `'top' \| 'bottom'` | `'top'` | Banner position |
| `sticky` | `boolean` | `true` | Sticky positioning |
| `dismissible` | `boolean` | `true` | Show close button |
| `rememberDismiss` | `string` | `undefined` | localStorage key to persist dismiss |
| `icon` | `ReactNode` | `undefined` | Custom icon |
| `hideIcon` | `boolean` | `false` | Hide the default icon |
| `actions` | `IBannerAction[]` | `undefined` | Action buttons `{ label, onClick, variant? }` |
| `onDismiss` | `() => void` | `undefined` | Callback when dismissed |
| `fullWidth` | `boolean` | `true` | Full width banner |
| `duration` | `number` | `0` | Auto-dismiss in ms (`0` = never) |
| `centered` | `boolean` | `true` | Center content |

### Examples

```tsx
const banner = useBanner();

// Cookie consent with persistent dismiss
banner.show({
  message: 'This site uses cookies.',
  variant: 'info',
  position: 'bottom',
  rememberDismiss: 'cookie-consent',
  actions: [
    { label: 'Accept', onClick: acceptCookies, variant: 'primary' },
  ],
});
```

```tsx
// Maintenance warning
banner.warning('Scheduled maintenance tonight 10 PM - 2 AM.', {
  dismissible: false,
});
```

---

## useDrawer

Slide-out drawer panels with position, size presets, and reactive state.

### Import

```typescript
import { useDrawer } from 'omnifeedback';
```

### Return Type: `IUseDrawerReturn`

| Member | Type | Description |
|--------|------|-------------|
| `open` | `(options: IDrawerOptions) => string` | Open a drawer, returns ID |
| `close` | `(id: string) => void` | Close a specific drawer |
| `closeAll` | `() => void` | Close all drawers |
| `update` | `(id: string, options: Partial<IDrawerOptions>) => void` | Update drawer options |
| `isOpen` | `boolean` | Whether any drawer is open |
| `openDrawers` | `string[]` | Array of open drawer IDs |
| `drawers` | `IDrawerItem[]` | Reactive array of active drawers |

### IDrawerOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `ReactNode` | **required** | Drawer body content |
| `title` | `ReactNode` | `undefined` | Drawer title |
| `position` | `DrawerPosition` | `'right'` | `'left' \| 'right' \| 'top' \| 'bottom'` |
| `size` | `DrawerSize` | `'md'` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` |
| `customSize` | `string \| number` | `undefined` | Custom width/height (overrides `size`) |
| `overlay` | `boolean` | `true` | Show backdrop overlay |
| `overlayOpacity` | `number` | `0.5` | Overlay opacity (0-1) |
| `closeOnOverlayClick` | `boolean` | `true` | Close on overlay click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `closable` | `boolean` | `true` | Show close button |
| `footer` | `ReactNode` | `undefined` | Footer content |
| `preventScroll` | `boolean` | `true` | Lock body scroll |
| `push` | `boolean` | `false` | Push main content (future feature) |
| `onClose` | `() => void` | `undefined` | Called when drawer closes |
| `onOpen` | `() => void` | `undefined` | Called when drawer opens |

### Examples

```tsx
const drawer = useDrawer();

const id = drawer.open({
  title: 'Settings',
  position: 'right',
  size: 'lg',
  content: <SettingsPanel />,
  footer: <Button onClick={() => drawer.close(id)}>Done</Button>,
});
```

```tsx
// Custom width drawer
drawer.open({
  content: <Sidebar />,
  position: 'left',
  customSize: '320px',
  overlay: false,
});
```

---

## usePopconfirm

Popover-based confirmation attached to a target element. Promise-based API.

### Import

```typescript
import { usePopconfirm } from 'omnifeedback';
```

### Return Type: `IUsePopconfirmReturn`

| Member | Type | Description |
|--------|------|-------------|
| `show` | `(options: IPopconfirmShowOptions) => Promise<boolean>` | Show popconfirm, resolves on user response |
| `danger` | `(target, message, options?) => Promise<boolean>` | Danger-styled popconfirm |
| `close` | `() => void` | Close popconfirm (resolves `false`) |
| `isOpen` | `boolean` | Whether a popconfirm is visible |

### IPopconfirmShowOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `target` | `HTMLElement \| RefObject<HTMLElement>` | **required** | Element to attach popover to |
| `message` | `string` | **required** | Confirmation message |
| `title` | `string` | `undefined` | Title text |
| `confirmText` | `string` | `'Yes'` | Confirm button text |
| `cancelText` | `string` | `'No'` | Cancel button text |
| `confirmVariant` | `'primary' \| 'danger'` | `'primary'` | Confirm button style |
| `placement` | `PopconfirmPlacement` | `'top'` | Popover placement (12 options) |
| `icon` | `ReactNode` | `undefined` | Custom icon |
| `showArrow` | `boolean` | `true` | Show arrow pointing to target |
| `offset` | `number` | `8` | Offset from target in pixels |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking outside |

### Examples

```tsx
const popconfirm = usePopconfirm();

// Attach to click target
const handleDelete = async (e: React.MouseEvent) => {
  const confirmed = await popconfirm.show({
    target: e.currentTarget as HTMLElement,
    message: 'Delete this item?',
    placement: 'bottom',
  });
  if (confirmed) await deleteItem();
};
```

```tsx
// Danger variant with ref
const btnRef = useRef<HTMLButtonElement>(null);

const handlePermanentDelete = async () => {
  const confirmed = await popconfirm.danger(
    btnRef.current!,
    'This cannot be undone!',
    { title: 'Warning' }
  );
  if (confirmed) await permanentDelete();
};
```

---

## useSkeleton

Imperative skeleton loading states, identified by string keys.

### Import

```typescript
import { useSkeleton } from 'omnifeedback';
```

### Return Type: `IUseSkeletonReturn`

| Method | Parameters | Return | Description |
|--------|-----------|--------|-------------|
| `show` | `id: string, options?: Partial<ISkeletonOptions>` | `void` | Show skeleton (no-op if already visible) |
| `hide` | `id: string` | `void` | Hide skeleton by ID |
| `hideAll` | — | `void` | Hide all skeletons |
| `isVisible` | `id: string` | `boolean` | Check if a skeleton is currently visible |
| `wrap` | `id: string, fn: () => Promise<T>, options?: Partial<ISkeletonOptions>` | `Promise<T>` | Show skeleton during async fn |

### ISkeletonOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `animation` | `SkeletonAnimation` | `'pulse'` | `'pulse' \| 'wave' \| 'none'` |
| `baseColor` | `string` | `undefined` | Base skeleton color |
| `highlightColor` | `string` | `undefined` | Highlight color (wave animation) |
| `borderRadius` | `string \| number` | `undefined` | Border radius |
| `duration` | `number` | `undefined` | Animation duration in ms |

### Examples

```tsx
const skeleton = useSkeleton();

// Manual show/hide
useEffect(() => {
  skeleton.show('user-profile');
  fetchProfile()
    .then(setProfile)
    .finally(() => skeleton.hide('user-profile'));
}, []);
```

```tsx
// Wrap helper
const users = await skeleton.wrap('user-list', () => fetchUsers());
setUsers(users);
```

---

## useResult

Imperative result/outcome pages for success, error, and status-code screens.

### Import

```typescript
import { useResult } from 'omnifeedback';
```

### Return Type: `IUseResultReturn`

| Method | Parameters | Return | Description |
|--------|-----------|--------|-------------|
| `show` | `status: ResultStatusType, options: IResultShowOptions` | `string` | Show result with any status, returns ID |
| `success` | `options: IResultShowOptions` | `string` | Show success result |
| `error` | `options: IResultShowOptions` | `string` | Show error result |
| `info` | `options: IResultShowOptions` | `string` | Show info result |
| `warning` | `options: IResultShowOptions` | `string` | Show warning result |
| `hide` | `id: string` | `void` | Hide result by ID |
| `hideAll` | — | `void` | Hide all results |
| `isVisible` | `id: string` | `boolean` | Check if result is visible |

### ResultStatusType

`'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'`

### IResultShowOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | **required** | Main title text |
| `description` | `string` | `undefined` | Subtitle / description |
| `icon` | `ReactNode` | `undefined` | Custom icon |
| `primaryAction` | `IResultActionOptions` | `undefined` | Primary action button |
| `secondaryAction` | `IResultActionOptions` | `undefined` | Secondary action button |
| `extra` | `ReactNode` | `undefined` | Extra content below actions |
| `size` | `'sm' \| 'md' \| 'lg'` | `undefined` | Size variant |
| `id` | `string` | auto-generated | Custom ID |

### IResultActionOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | **required** | Button label |
| `onClick` | `() => void` | **required** | Click handler |
| `loading` | `boolean` | `false` | Show spinner and disable |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `ReactNode` | `undefined` | Icon before label |

### Examples

```tsx
const result = useResult();

result.success({
  title: 'Payment Complete',
  description: 'Your order has been placed.',
  primaryAction: { label: 'View Order', onClick: () => navigate('/orders') },
  secondaryAction: { label: 'Continue Shopping', onClick: () => navigate('/') },
});
```

```tsx
// HTTP error page
result.show('404', {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  primaryAction: { label: 'Go Home', onClick: () => navigate('/') },
});
```

---

## usePrompt

Promise-based input dialogs with type-specific shortcuts and validation.

### Import

```typescript
import { usePrompt } from 'omnifeedback';
```

### Return Type: `IUsePromptReturn`

| Member | Type | Description |
|--------|------|-------------|
| `show` | `(options: IPromptShowOptions) => Promise<string \| null>` | Show prompt, resolves to value or `null` if cancelled |
| `text` | `(title: string, options?) => Promise<string \| null>` | Text input shorthand |
| `textarea` | `(title: string, options?) => Promise<string \| null>` | Textarea shorthand (default 4 rows) |
| `email` | `(title: string, options?) => Promise<string \| null>` | Email input shorthand |
| `number` | `(title: string, options?) => Promise<number \| null>` | Number input (returns parsed number) |
| `password` | `(title: string, options?) => Promise<string \| null>` | Password input shorthand |
| `close` | `() => void` | Close prompt (resolves `null`) |
| `isOpen` | `boolean` | Whether a prompt is currently open |

### IPromptShowOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | **required** | Dialog title |
| `description` | `string` | `undefined` | Description text below title |
| `inputType` | `PromptInputType` | `'text'` | `'text' \| 'password' \| 'email' \| 'number' \| 'url' \| 'tel' \| 'textarea'` |
| `placeholder` | `string` | `undefined` | Input placeholder |
| `defaultValue` | `string` | `undefined` | Initial input value |
| `confirmText` | `string` | `'OK'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `label` | `string` | `undefined` | Input label |
| `validate` | `(value: string) => string \| true` | `undefined` | Validator, return error string or `true` |
| `required` | `boolean` | `undefined` | Required field |
| `minLength` | `number` | `undefined` | Minimum length |
| `maxLength` | `number` | `undefined` | Maximum length |
| `pattern` | `RegExp` | `undefined` | Regex pattern validation |
| `icon` | `ReactNode` | `undefined` | Custom icon |
| `rows` | `number` | `undefined` | Textarea rows (textarea only) |
| `autoFocus` | `boolean` | `true` | Auto-focus input on open |
| `selectOnFocus` | `boolean` | `false` | Select all text on focus |

### Examples

```tsx
const prompt = usePrompt();

// Simple text input
const name = await prompt.text('Enter your name', {
  placeholder: 'John Doe',
  required: true,
});
if (name) updateName(name);
```

```tsx
// Validated email
const email = await prompt.email('Your email', {
  validate: (v) => v.includes('@') ? true : 'Please enter a valid email',
});

// Number input returns parsed number
const amount = await prompt.number('Enter amount', {
  defaultValue: '100',
  validate: (v) => Number(v) > 0 ? true : 'Must be positive',
});
```

---

## useSheet

Bottom sheets with custom content, iOS-style action sheets, and confirm sheets.

### Import

```typescript
import { useSheet } from 'omnifeedback';
```

### Return Type: `IUseSheetReturn`

| Method | Parameters | Return | Description |
|--------|-----------|--------|-------------|
| `open` | `options: ISheetShowOptions` | `string` | Open sheet with custom content, returns ID |
| `showActions` | `options: IActionSheetOptions` | `Promise<string \| null>` | iOS-style action sheet, resolves to action key or `null` |
| `confirm` | `options: ISheetConfirmOptions` | `Promise<boolean>` | Confirm sheet, resolves `true`/`false` |
| `close` | `id: string` | `void` | Close a specific sheet |
| `closeAll` | — | `void` | Close all sheets |
| `isOpen` | — | `boolean` | Whether any sheet is open |

### ISheetShowOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `ReactNode` | **required** | Sheet body content |
| `title` | `ReactNode` | `undefined` | Sheet title |
| `snapPoints` | `number[]` | `[50, 90]` | Snap points as percentages |
| `defaultSnapPoint` | `number` | `0` | Index of initial snap point |
| `closeOnBackdropClick` | `boolean` | `true` | Close on backdrop click |
| `showHandle` | `boolean` | `true` | Show drag handle |
| `onClose` | `() => void` | `undefined` | Called when sheet closes |

### IActionSheetOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `actions` | `IActionItem[]` | **required** | List of action items `{ key, label, icon?, destructive? }` |
| `title` | `string` | `undefined` | Sheet title |
| `description` | `string` | `undefined` | Description text |
| `showCancel` | `boolean` | `true` | Show cancel button |
| `cancelText` | `string` | `undefined` | Cancel button text |

### ISheetConfirmOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | **required** | Confirmation title |
| `description` | `string` | `undefined` | Description text |
| `confirmText` | `string` | `undefined` | Confirm button text |
| `cancelText` | `string` | `undefined` | Cancel button text |
| `destructive` | `boolean` | `undefined` | Destructive action styling |

### Examples

```tsx
const sheet = useSheet();

// Custom content sheet
sheet.open({
  title: 'Filters',
  content: <FilterPanel />,
  snapPoints: [40, 80],
});
```

```tsx
// iOS-style action sheet
const action = await sheet.showActions({
  title: 'Choose Photo',
  actions: [
    { key: 'camera', label: 'Take Photo' },
    { key: 'gallery', label: 'Choose from Gallery' },
    { key: 'remove', label: 'Remove Photo', destructive: true },
  ],
});
if (action === 'camera') openCamera();
```

```tsx
// Confirm sheet
const ok = await sheet.confirm({
  title: 'Sign Out?',
  description: 'You will need to sign in again.',
  destructive: true,
});
if (ok) signOut();
```

---

## useConnection

Network connectivity monitoring with automatic banners and an offline action queue.

### Import

```typescript
import { useConnection } from 'omnifeedback';
```

### Signature

```typescript
function useConnection(options?: Partial<IConnectionOptions>): IUseConnectionReturn;
```

### Return Type: `IUseConnectionReturn`

| Member | Type | Description |
|--------|------|-------------|
| `isOnline` | `boolean` | Current connection status |
| `isReconnecting` | `boolean` | Whether a reconnection check is in progress |
| `offlineDuration` | `number \| null` | Milliseconds since going offline (`null` if online) |
| `showOffline` | `(message?: string) => void` | Manually show offline banner |
| `showOnline` | `(message?: string) => void` | Manually show online banner |
| `showReconnecting` | `(message?: string) => void` | Manually show reconnecting banner |
| `checkConnection` | `() => Promise<boolean>` | Trigger a manual connection check |
| `queueAction` | `(action: QueuedAction) => void` | Queue an async action for when back online |
| `getQueueSize` | `() => number` | Get current queue size |
| `clearQueue` | `() => void` | Clear the action queue |

### IConnectionOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable monitoring |
| `offlineMessage` | `string` | `'You are offline...'` | Offline banner message |
| `onlineMessage` | `string` | `'Connection restored!'` | Online banner message |
| `reconnectingMessage` | `string` | `'Reconnecting...'` | Reconnecting banner message |
| `position` | `'top' \| 'bottom'` | `'top'` | Banner position |
| `onlineDismissDelay` | `number` | `3000` | Auto-dismiss online banner (ms, `0` = never) |
| `showReconnecting` | `boolean` | `true` | Show reconnecting state |
| `pingUrl` | `string` | `undefined` | URL to ping for connection check |
| `pingInterval` | `number` | `5000` | Ping interval when offline (ms) |
| `maxQueueSize` | `number` | `100` | Maximum queued actions |
| `onOffline` | `() => void` | `undefined` | Called when going offline |
| `onOnline` | `() => void` | `undefined` | Called when coming back online |
| `onReconnecting` | `() => void` | `undefined` | Called on each reconnection attempt |

### Examples

```tsx
const { isOnline, queueAction } = useConnection();

const handleSave = async () => {
  if (!isOnline) {
    queueAction(async () => await saveData());
    showNotification('Will save when back online');
    return;
  }
  await saveData();
};
```

```tsx
// Custom ping endpoint
const connection = useConnection({
  pingUrl: '/api/health',
  pingInterval: 10000,
  onOffline: () => analytics.track('went_offline'),
  onOnline: () => analytics.track('back_online'),
});
```

---

## Shared Base Options

All option interfaces extend `IBaseFeedbackOptions`:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto-generated | Custom unique ID |
| `priority` | `number` | `undefined` | Priority level (higher = more important) |
| `className` | `string` | `undefined` | Additional CSS classes |
| `style` | `CSSProperties` | `undefined` | Inline styles |
| `data` | `Record<string, string>` | `undefined` | Data attributes |
| `testId` | `string` | `undefined` | Test ID for testing frameworks |
