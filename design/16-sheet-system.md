# Design: Sheet (Bottom Sheet) System

## Overview

Bottom sheet component that slides up from the bottom of the viewport. Common in
mobile interfaces for contextual actions, menus, and confirmations. The sheet
system provides three modes: **custom content sheets** with snap points,
**iOS-style action sheets** with selectable action lists, and **confirmation
sheets** with accept/cancel semantics.

The core `Sheet` component handles drag-to-dismiss gestures, keyboard events,
backdrop interaction, snap-point-based height management, focus trapping, and
scroll locking. The `useSheet` hook offers a fully imperative, Promise-based API
for programmatic control.

**Key files:**

| File | Purpose |
|------|---------|
| `src/components/Sheet/Sheet.tsx` | Core sheet panel with snap points and drag |
| `src/components/Sheet/SheetContainer.tsx` | Portal container for active sheets |
| `src/components/Sheet/ActionSheetContent.tsx` | Action list and confirm content |
| `src/components/Sheet/index.ts` | Public exports |
| `src/hooks/useSheet.ts` | Imperative hook API |
| `src/core/types.ts` | `ISheetOptions` definition |

---

## Goals

- Slide up from the bottom with CSS transform animation
- Support multiple snap points (partial and full viewport height)
- Drag-to-dismiss via the `useDrag` hook (touch + mouse)
- Velocity-based and distance-based dismiss detection
- iOS-style action sheet variant with selectable items
- Confirmation sheet variant with Promise-based result
- Backdrop click and ESC key dismissal
- Focus trap for keyboard accessibility
- Scroll lock to prevent body scrolling while open
- Portal-based rendering (via `createPortal`) for correct stacking
- Mobile-first design that also works on desktop
- Compatible with all UI library adapters

---

## Sheet API

### `ISheetOptions` (core)

Defined in `src/core/types.ts`. This is the options interface stored in the
feedback store and passed through the manager.

```typescript
export interface ISheetOptions extends IBaseFeedbackOptions {
  /** Sheet content (required) */
  content: ReactNode;
  /** Sheet title */
  title?: ReactNode;
  /** Snap points (percentages 0-100) */
  snapPoints?: number[];
  /** Default snap point index */
  defaultSnapPoint?: number;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Show drag handle */
  showHandle?: boolean;
  /** Callback when closed */
  onClose?: () => void;
}
```

### `ISheetProps` (component)

Defined in `src/components/Sheet/Sheet.tsx`. These are the direct props accepted
by the presentational `Sheet` component.

```typescript
export interface ISheetProps {
  /** Sheet content (required) */
  content: React.ReactNode;
  /** Sheet title */
  title?: React.ReactNode;
  /** Snap points as percentages (0-100) */
  snapPoints?: number[];
  /** Default snap point index */
  defaultSnapPoint?: number;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on ESC key */
  closeOnEscape?: boolean;
  /** Show drag handle */
  showHandle?: boolean;
  /** Velocity threshold for dismiss (pixels/ms) */
  dismissVelocity?: number;
  /** Distance threshold for dismiss (percentage of height) */
  dismissThreshold?: number;
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when close requested */
  onRequestClose: () => void;
  /** Callback when snap point changes */
  onSnapPointChange?: (index: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}
```

**Default values:**

| Prop | Default |
|------|---------|
| `snapPoints` | `[50, 90]` |
| `defaultSnapPoint` | `0` |
| `closeOnBackdropClick` | `true` |
| `closeOnEscape` | `true` |
| `showHandle` | `true` |
| `dismissVelocity` | `0.5` (px/ms) |
| `dismissThreshold` | `25` (% of height) |

---

## `useSheet` Hook API

The `useSheet` hook (in `src/hooks/useSheet.ts`) provides the imperative
interface for managing sheets.

### Return Type

```typescript
export interface IUseSheetReturn {
  /** Open a sheet with custom content. Returns sheet ID. */
  open: (options: ISheetShowOptions) => string;

  /** Show an iOS-style action sheet. Resolves with selected key or null. */
  showActions: (options: IActionSheetOptions) => Promise<string | null>;

  /** Show a confirmation sheet. Resolves to true if confirmed. */
  confirm: (options: ISheetConfirmOptions) => Promise<boolean>;

  /** Close a specific sheet by ID. */
  close: (id: string) => void;

  /** Close all active sheets. */
  closeAll: () => void;

  /** Whether any sheet is currently open. */
  isOpen: boolean;
}
```

### `ISheetShowOptions`

```typescript
export interface ISheetShowOptions extends Omit<ISheetOptions, 'content'> {
  /** Sheet content (required) */
  content: ReactNode;
}
```

### `IActionSheetOptions`

```typescript
export interface IActionSheetOptions extends IBaseFeedbackOptions {
  /** Title for the action sheet */
  title?: string;
  /** Description text */
  description?: string;
  /** List of actions */
  actions: IActionItem[];
  /** Show cancel button (default: true) */
  showCancel?: boolean;
  /** Cancel button text (default: 'Cancel') */
  cancelText?: string;
}
```

### `ISheetConfirmOptions`

```typescript
export interface ISheetConfirmOptions extends IBaseFeedbackOptions {
  /** Confirmation title */
  title: string;
  /** Description text */
  description?: string;
  /** Confirm button text (default: 'Confirm') */
  confirmText?: string;
  /** Cancel button text (default: 'Cancel') */
  cancelText?: string;
  /** Destructive action (renders confirm button in red) */
  destructive?: boolean;
}
```

---

## Action Item Interface

Defined in `src/components/Sheet/ActionSheetContent.tsx`.

```typescript
export interface IActionItem {
  /** Unique key for the action */
  key: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Destructive action (red color) */
  destructive?: boolean;
  /** Disabled state */
  disabled?: boolean;
}
```

---

## Usage Examples

### Custom Content Sheet

```tsx
import { useSheet } from 'omnifeedback';

function SettingsButton() {
  const sheet = useSheet();

  const handleOpen = () => {
    sheet.open({
      title: 'Settings',
      content: <SettingsPanel />,
      snapPoints: [50, 90],
      defaultSnapPoint: 0,
    });
  };

  return <button onClick={handleOpen}>Open Settings</button>;
}
```

### Action Sheet

```tsx
function PhotoPicker() {
  const sheet = useSheet();

  const handlePickPhoto = async () => {
    const action = await sheet.showActions({
      title: 'Choose Photo',
      actions: [
        { key: 'camera', label: 'Take Photo', icon: <CameraIcon /> },
        { key: 'gallery', label: 'Choose from Gallery', icon: <GalleryIcon /> },
        { key: 'delete', label: 'Delete Photo', destructive: true },
      ],
    });

    if (action === 'camera') openCamera();
    if (action === 'gallery') openGallery();
    if (action === 'delete') deletePhoto();
    // action === null when cancelled
  };

  return <button onClick={handlePickPhoto}>Pick Photo</button>;
}
```

### Confirmation Sheet

```tsx
function SignOutButton() {
  const sheet = useSheet();

  const handleSignOut = async () => {
    const confirmed = await sheet.confirm({
      title: 'Sign Out?',
      description: 'You will need to sign in again.',
      confirmText: 'Sign Out',
      destructive: true,
    });

    if (confirmed) {
      await signOut();
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

### Multiple Snap Points

```tsx
function FilterSheet() {
  const sheet = useSheet();

  const handleOpen = () => {
    const id = sheet.open({
      title: 'Filters',
      content: <FilterPanel />,
      snapPoints: [30, 60, 90],
      defaultSnapPoint: 1, // Start at 60%
    });

    // Close programmatically later
    setTimeout(() => sheet.close(id), 10000);
  };

  return <button onClick={handleOpen}>Filters</button>;
}
```

### Via `useFeedback` (unified API)

```tsx
import { useFeedback } from 'omnifeedback';

function Example() {
  const { sheet } = useFeedback();

  const handleOpen = () => {
    sheet.open({
      title: 'Quick Actions',
      content: <ActionsPanel />,
      snapPoints: [50, 90],
    });
  };

  return <button onClick={handleOpen}>Open</button>;
}
```

---

## Hook Implementation Details

### `open(options)`

Calls `manager.add('sheet', { ...defaults, ...options })` with default snap
points `[50, 90]`, `defaultSnapPoint: 0`, `closeOnBackdropClick: true`, and
`showHandle: true`. Returns the generated feedback ID.

### `showActions(options)`

Returns a `Promise<string | null>`. Internally:

1. Wraps the entire flow in a `new Promise`.
2. Creates an `idRef` to track the sheet ID.
3. Builds a `handleSelect(key)` callback that removes the sheet and resolves
   with the selected key.
4. Builds a `handleCancel()` callback that removes the sheet and resolves
   with `null`.
5. Uses `createElement(ActionSheetContent, ...)` to produce the content node.
6. Calculates snap height dynamically: `30 + actions.length * 8` percent.
7. Adds the sheet via `manager.add('sheet', ...)` with `onClose: handleCancel`.

### `confirm(options)`

Returns a `Promise<boolean>`. Internally:

1. Wraps the entire flow in a `new Promise`.
2. Creates `handleConfirm()` (resolves `true`) and `handleCancel()` (resolves
   `false`) callbacks that also remove the sheet.
3. Uses `createElement(SheetConfirmContent, ...)` to produce the content node.
4. Opens the sheet at snap point `[25]` (25% height).

### `close(id)` and `closeAll()`

Delegates to `manager.remove(id)` and `manager.removeAll('sheet')` respectively.

### `isOpen`

Derived from the Zustand store via `useMemo`. Checks if any item with
`type === 'sheet'` has a status other than `'removed'` or `'exiting'`.

---

## Component Architecture

### Sheet (main component)

```
Sheet
├── Backdrop (fixed overlay, opacity transition)
└── Sheet Panel (role="dialog", aria-modal="true")
    ├── Drag Handle (optional, touch-none, cursor-grab)
    ├── Header (optional title, h2 with aria-labelledby)
    └── Content (flex-1, overflow-y-auto, overscroll-contain)
```

**Key behaviors:**

| Behavior | Implementation |
|----------|---------------|
| Enter animation | `requestAnimationFrame` sets `translateY` from 100% to `100 - snapValue` |
| Exit animation | Sets `translateY` back to 100% |
| Drag tracking | `useDrag({ axis: 'y' })` with `dragHandlers` on handle element |
| Dismiss detection | Checks `velocity > 0.5 px/ms` OR `offsetPercentage > 25%` |
| Snap point finding | `findNearestSnapPoint()` via minimum distance calculation |
| Focus trap | `useFocusTrap(contentRef, { enabled: status === 'visible' })` |
| Scroll lock | `useScrollLock(isVisible)` |
| ESC key | `document.addEventListener('keydown', ...)` when `closeOnEscape` |
| Backdrop click | `onClick` on backdrop div when `closeOnBackdropClick` |

**CSS classes on the panel:**

```
fixed bottom-0 left-0 right-0
bg-white dark:bg-gray-900
rounded-t-2xl shadow-xl
flex flex-col
max-h-[95vh]
transition-transform duration-300 ease-out (when isAnimating)
```

**Transform calculation during drag:**

```typescript
// When dragging:
Math.max(0, 100 - currentSnapHeight + offsetPercentage)

// When not dragging:
translateY (100 - snapValue for current snap point)
```

### SheetContainer

Portal-based container that subscribes to the Zustand store and renders all
active sheets.

```typescript
const sheets = Array.from(items.values()).filter(
  (item) => item.type === 'sheet' && item.status !== 'removed'
);
```

- Uses `createPortal(..., document.body)` for correct z-index stacking.
- Returns `null` on SSR (`typeof document === 'undefined'`).
- Passes options from the store as props to `Sheet`.
- Handles close by calling `onClose?.()` then `manager.remove(id)`.

### ActionSheetContent

iOS-style action list content rendered inside a sheet.

```
ActionSheetContent
├── Header (optional title + description, bg-gray-50 rounded-xl)
├── Actions List (bg-gray-50 rounded-xl, divide-y)
│   ├── Action Button (per item, flex, centered, destructive red)
│   └── ...
└── Cancel Button (separate rounded-xl, font-semibold)
```

**Styling details:**

- Action buttons: `py-3.5`, `text-base font-medium`, blue or red (destructive)
- Disabled actions: `opacity-50 cursor-not-allowed`
- Cancel button: separated with gap, `font-semibold`, blue text
- Safe area padding: `pb-safe` class on container
- Active state: `active:bg-gray-100 dark:active:bg-gray-700`

### SheetConfirmContent

Confirmation dialog content rendered inside a sheet.

```
SheetConfirmContent
├── Header (title + optional description, bg-gray-50 rounded-xl)
├── Confirm Button (bg-gray-50 rounded-xl, font-semibold)
│   └── Destructive: text-red-600, Normal: text-blue-600
└── Cancel Button (bg-gray-50 rounded-xl, font-semibold, blue)
```

**Default values:**

| Prop | Default |
|------|---------|
| `confirmText` | `'Confirm'` |
| `cancelText` | `'Cancel'` |
| `destructive` | `false` |

---

## The `useDrag` Hook

The `useDrag` hook (in `src/hooks/useDrag.ts`) provides the drag gesture
handling for the sheet.

### Interface

```typescript
export interface IUseDragOptions {
  axis?: 'x' | 'y';         // Default: 'y'
  threshold?: number;        // Default: 5px
  enabled?: boolean;         // Default: true
  onDragStart?: () => void;
  onDrag?: (offset: number, velocity: number) => void;
  onDragEnd?: (offset: number, velocity: number) => void;
  bounds?: [number, number];
}

export interface IUseDragReturn {
  dragState: IDragState;
  dragHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  reset: () => void;
  isDragging: boolean;
}

export interface IDragState {
  isDragging: boolean;
  offset: number;
  velocity: number;
  direction: 'up' | 'down' | 'none';
}
```

### How it works

1. `onMouseDown` / `onTouchStart` records the start position and time.
2. Document-level `mousemove` / `touchmove` listeners track movement.
3. Movement below `threshold` (5px) is ignored to prevent accidental drags.
4. Once threshold is passed, `onDragStart` fires and state updates begin.
5. Velocity is calculated as `positionDelta / timeDelta` (px/ms).
6. On `mouseup` / `touchend`, `onDragEnd` fires with final offset and velocity.
7. Optional `bounds` constrain the offset range.

---

## Snap Point System

Snap points are specified as **percentages of viewport height** (0-100).

### Default snap points

```typescript
const DEFAULT_SNAP_POINTS = [50, 90]; // 50% and 90% of viewport
```

### How snap-to works

```typescript
const snapTo = (index: number) => {
  const clampedIndex = Math.max(0, Math.min(index, snapPoints.length - 1));
  setIsAnimating(true);
  setCurrentSnapIndex(clampedIndex);
  const snapValue = snapPoints[clampedIndex] ?? 50;
  setTranslateY(100 - snapValue);
  onSnapPointChange?.(clampedIndex);
  setTimeout(() => setIsAnimating(false), 300);
};
```

### Dismiss vs. snap decision on drag end

```typescript
const handleDragEnd = (offset: number, velocity: number) => {
  const offsetPercentage = (offset / viewportHeight) * 100;
  const currentPosition = currentSnapHeight - offsetPercentage;

  // Dismiss if fast swipe down or dragged past threshold
  if (velocity > dismissVelocity || offsetPercentage > dismissThreshold) {
    onRequestClose();
    return;
  }

  // Dismiss if dragged below half of minimum snap point
  if (currentPosition < (snapPoints[0] ?? 50) / 2) {
    onRequestClose();
    return;
  }

  // Otherwise snap to nearest point
  const nearestIndex = findNearestSnapPoint(currentPosition);
  snapTo(nearestIndex);
};
```

---

## Module Exports

From `src/components/Sheet/index.ts`:

```typescript
// Sheet component
export { Sheet } from './Sheet';
export type { ISheetProps } from './Sheet';

// Sheet content components
export { ActionSheetContent, SheetConfirmContent } from './ActionSheetContent';
export type {
  IActionItem,
  IActionSheetContentProps,
  ISheetConfirmContentProps,
} from './ActionSheetContent';

// Sheet container
export { SheetContainer } from './SheetContainer';
```

From `src/hooks/useSheet.ts`:

```typescript
export type {
  ISheetShowOptions,
  IActionSheetOptions,
  ISheetConfirmOptions,
  ISheetItem,
  IUseSheetReturn,
};
export { useSheet };
```

---

## Accessibility

| Feature | Implementation |
|---------|---------------|
| Dialog role | `role="dialog"` on sheet panel |
| Modal semantics | `aria-modal="true"` |
| Title label | `aria-labelledby` linked to title `id` |
| Focus trap | `useFocusTrap` keeps tab focus within the sheet |
| Scroll lock | `useScrollLock` prevents background scrolling |
| ESC to close | Keyboard handler on `document.keydown` |
| Backdrop hidden | `aria-hidden="true"` on backdrop element |
| Action buttons | Native `<button>` elements with `type="button"` |
| Disabled state | `disabled` attribute and `aria-disabled` on actions |

---

## Testing Checklist

### Sheet Component

- [ ] Renders with `data-status` attribute reflecting current status
- [ ] Shows drag handle when `showHandle` is true
- [ ] Hides drag handle when `showHandle` is false
- [ ] Displays title in header when provided
- [ ] Renders custom content in content area
- [ ] Applies backdrop with opacity transition
- [ ] Closes on backdrop click when `closeOnBackdropClick` is true
- [ ] Does not close on backdrop click when `closeOnBackdropClick` is false
- [ ] Closes on ESC key when `closeOnEscape` is true
- [ ] Does not close on ESC when `closeOnEscape` is false
- [ ] Applies enter animation (translateY from 100% to snap value)
- [ ] Applies exit animation (translateY back to 100%)
- [ ] Has `role="dialog"` and `aria-modal="true"`
- [ ] Links `aria-labelledby` to title element

### ActionSheetContent

- [ ] Renders title when provided
- [ ] Renders description when provided
- [ ] Renders all action buttons with correct labels
- [ ] Calls `onSelect(key)` when an action is clicked
- [ ] Shows destructive actions in red
- [ ] Disables actions with `disabled` flag
- [ ] Shows cancel button when `showCancel` is true
- [ ] Hides cancel button when `showCancel` is false
- [ ] Calls `onCancel` when cancel button is clicked
- [ ] Renders action icons when provided

### SheetConfirmContent

- [ ] Renders title (required)
- [ ] Renders description when provided
- [ ] Calls `onConfirm` when confirm button is clicked
- [ ] Calls `onCancel` when cancel button is clicked
- [ ] Shows destructive confirm button in red when `destructive` is true
- [ ] Uses custom `confirmText` and `cancelText` when provided

### useSheet Hook

- [ ] `open()` returns a string ID
- [ ] `showActions()` returns a `Promise<string | null>`
- [ ] `showActions()` resolves with action key on selection
- [ ] `showActions()` resolves with `null` on cancel
- [ ] `confirm()` returns a `Promise<boolean>`
- [ ] `confirm()` resolves `true` on confirm
- [ ] `confirm()` resolves `false` on cancel
- [ ] `close(id)` removes a specific sheet
- [ ] `closeAll()` removes all sheets
- [ ] `isOpen` is `true` when any sheet is active
- [ ] `isOpen` is `false` when no sheets are active

### SheetContainer

- [ ] Renders sheets from the feedback store
- [ ] Filters only sheet-type items
- [ ] Excludes items with `status === 'removed'`
- [ ] Returns `null` when no sheets are active
- [ ] Returns `null` during SSR (no `document`)
- [ ] Uses `createPortal` to render into `document.body`

### useDrag Hook

- [ ] Tracks vertical drag offset
- [ ] Reports velocity in pixels/ms
- [ ] Does not fire `onDragStart` below threshold (5px)
- [ ] Fires `onDragEnd` with final offset and velocity
- [ ] Supports both mouse and touch events
- [ ] Respects `enabled` flag
- [ ] Applies `bounds` constraints
- [ ] `reset()` clears all drag state

---

## Implementation Checklist

- [x] Create `src/hooks/useSheet.ts` with `open`, `showActions`, `confirm`, `close`, `closeAll`, `isOpen`
- [x] Create `src/components/Sheet/Sheet.tsx` with snap points, drag handle, backdrop, ESC
- [x] Create `src/components/Sheet/ActionSheetContent.tsx` with action list and cancel
- [x] Create `src/components/Sheet/ActionSheetContent.tsx` (includes `SheetConfirmContent`)
- [x] Create `src/components/Sheet/SheetContainer.tsx` with portal rendering
- [x] Create `src/components/Sheet/index.ts` barrel exports
- [x] Implement `useDrag` hook for gesture handling
- [x] Implement `useFocusTrap` integration
- [x] Implement `useScrollLock` integration
- [ ] Write unit tests for Sheet component
- [ ] Write unit tests for ActionSheetContent
- [ ] Write unit tests for SheetConfirmContent
- [ ] Write unit tests for useSheet hook
- [ ] Write unit tests for useDrag hook
- [ ] Write integration tests for SheetContainer
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test with screen readers (VoiceOver, TalkBack)
- [ ] Update IMPLEMENTATION.md

---

## Common Pitfalls

1. **Snap point percentages**: Snap points are 0-100 numbers representing
   viewport height percentage, not pixel values. `[50, 90]` means 50% and 90%
   of the viewport.

2. **Dismiss vs. snap**: The dismiss check runs before the snap check. If the
   user swipes down with velocity > 0.5 px/ms, the sheet always dismisses
   regardless of snap proximity.

3. **Dynamic snap height for actions**: The `showActions` method calculates snap
   height as `30 + actions.length * 8`. With many actions, this can exceed 100
   and should be capped.

4. **Promise resolution on close**: Both `showActions` and `confirm` register an
   `onClose` callback that resolves the promise (with `null` / `false`). This
   ensures the promise resolves even when closed via backdrop click.

5. **SSR safety**: `SheetContainer` checks `typeof document === 'undefined'`
   before calling `createPortal`. The `useDrag` hook references `window` which
   must also be guarded.

6. **Multiple sheets**: Multiple sheets can be open simultaneously. Each gets its
   own portal entry. The backdrop stacking may require z-index management.

7. **`isAnimating` timing**: The 300ms `setTimeout` that clears `isAnimating`
   must match the CSS `duration-300` transition. If these drift, the sheet may
   jump.

---

## Notes

- Mobile-first but fully functional on desktop with mouse drag.
- For desktop-first side-panel UIs, use the Drawer system instead.
- Both touch and mouse events are supported via the `useDrag` hook.
- The Sheet component uses `memo` and `forwardRef` for performance.
- The `ActionSheetContent` and `SheetConfirmContent` are exported separately for
  use in adapter components.
- The `pb-safe` class on action sheet content accounts for iOS safe area
  (home indicator).
- Adapter components (`MuiSheet`, `MuiActionSheet`, etc.) implement the same
  visual behavior with their own design language (z-index 1200, 225ms
  transitions for MUI).
