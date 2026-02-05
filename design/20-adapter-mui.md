# Design: MUI (Material UI) Adapter

## Overview

The MUI adapter implements all 16 feedback components using Material Design
styling principles. Unlike a traditional MUI integration that wraps
`@mui/material` components, this adapter **recreates Material Design visual
patterns** using Tailwind CSS utilities. This means the adapter has **zero
runtime dependency** on `@mui/material` while maintaining faithful visual
fidelity to Material Design 3 specifications.

The adapter provides Paper-like elevation (shadows), standard MUI color palette
mappings, 225ms transition durations with MUI timing functions, z-index layering
(1200-1500), and dark mode support via the `dark:` Tailwind prefix.

**Key files:**

| File | Purpose |
|------|---------|
| `src/adapters/mui/index.ts` | Adapter entry, component mapping, utilities |
| `src/adapters/mui/Mui*.tsx` | 16 individual component implementations |
| `src/adapters/types.ts` | `IFeedbackAdapter` interface and all prop types |

---

## Goals

- Provide Material Design styled feedback components
- Implement all 16 slots of the `IFeedbackAdapter` interface
- Zero external dependency on `@mui/material` (Tailwind CSS only)
- Follow MUI design tokens: elevation, color palette, typography, spacing
- Support dark mode via Tailwind `dark:` prefix and `isDarkMode()` utility
- Match MUI transition timing (225ms enter, 195ms exit, cubic-bezier curves)
- Inject custom keyframe animations via `injectStyles()`
- Provide proper ARIA semantics and keyboard accessibility

---

## Dependencies

The MUI adapter is self-contained. It does **not** require `@mui/material` as a
peer dependency. All styling is done with Tailwind CSS.

```json
{
  "dependencies": {
    "tailwindcss": "^3.0.0"
  }
}
```

Internal dependencies (from omnifeedback core):

- `cn()` utility for class merging
- `useFocusTrap` hook for focus management
- `useScrollLock` hook for scroll prevention
- `useDrag` hook for sheet drag gestures
- `FeedbackStatus` type for animation lifecycle

---

## Adapter Structure

### Entry Point (`src/adapters/mui/index.ts`)

```typescript
import type { IFeedbackAdapter } from '../types';

export const MUI_ADAPTER_VERSION = '1.0.0';

export const muiAdapter: IFeedbackAdapter = {
  name: 'mui',
  version: MUI_ADAPTER_VERSION,

  // Notification Components
  ToastComponent: MuiToast,
  ToastContainerComponent: MuiToastContainer,
  BannerComponent: MuiBanner,

  // Dialog Components
  ModalComponent: MuiModal,
  ConfirmComponent: MuiConfirm,
  PromptComponent: MuiPrompt,
  DrawerComponent: MuiDrawer,
  PopconfirmComponent: MuiPopconfirm,

  // Sheet Components
  SheetComponent: MuiSheet,
  ActionSheetComponent: MuiActionSheet,

  // Feedback Components
  AlertComponent: MuiAlert,
  LoadingComponent: MuiLoading,
  ProgressComponent: MuiProgress,
  SkeletonComponent: MuiSkeleton,
  ResultComponent: MuiResult,

  // Status Components
  ConnectionComponent: MuiConnection,

  // Utility Functions
  isDarkMode,
  injectStyles,

  // Animation configuration
  animations: {
    enter: 'mui-transition-entering',
    exit: 'mui-transition-leaving',
    duration: 225,
  },
};
```

### Component Mapping Table

| Adapter Slot | Component | Props Interface | Description |
|-------------|-----------|----------------|-------------|
| `ToastComponent` | `MuiToast` | `IAdapterToastProps` | Paper-like toast with border-left variant |
| `ToastContainerComponent` | `MuiToastContainer` | `IAdapterToastContainerProps` | Fixed position stacker with 24px padding |
| `BannerComponent` | `MuiBanner` | `IAdapterBannerProps` | Full-width sticky banner notification |
| `ModalComponent` | `MuiModal` | `IAdapterModalProps` | Dialog with elevation and focus trap |
| `ConfirmComponent` | `MuiConfirm` | `IAdapterConfirmProps` | AlertDialog with confirm/cancel buttons |
| `PromptComponent` | `MuiPrompt` | `IAdapterPromptProps` | Dialog with TextField input |
| `DrawerComponent` | `MuiDrawer` | `IAdapterDrawerProps` | Side panel with 4 anchor positions |
| `PopconfirmComponent` | `MuiPopconfirm` | `IAdapterPopconfirmProps` | Positioned popover confirmation |
| `SheetComponent` | `MuiSheet` | `IAdapterSheetProps` | Bottom sheet with snap points |
| `ActionSheetComponent` | `MuiActionSheet` | `IAdapterActionSheetProps` | Action list bottom sheet |
| `AlertComponent` | `MuiAlert` | `IAdapterAlertProps` | Inline alert with standard severity colors |
| `LoadingComponent` | `MuiLoading` | `IAdapterLoadingProps` | Circular progress spinner |
| `ProgressComponent` | `MuiProgress` | `IAdapterProgressProps` | Linear progress bar |
| `SkeletonComponent` | `MuiSkeleton` | `IAdapterSkeletonProps` | Skeleton loader with wave animation |
| `ResultComponent` | `MuiResult` | `IAdapterResultProps` | Result/status page |
| `ConnectionComponent` | `MuiConnection` | `IAdapterConnectionProps` | Online/offline indicator |

---

## Installation and Usage

### Basic Setup

```tsx
import { FeedbackProvider } from 'omnifeedback';
import { muiAdapter } from 'omnifeedback/adapters/mui';

function App() {
  return (
    <FeedbackProvider adapter={muiAdapter}>
      <MyApplication />
    </FeedbackProvider>
  );
}
```

### Direct Component Import

Individual components can be imported for custom compositions:

```tsx
import { MuiToast, MuiModal, MuiAlert } from 'omnifeedback/adapters/mui';
```

---

## Utility Functions

### `isDarkMode()`

Detects whether dark mode is active by checking:

1. If `document.documentElement` has the `dark` class (Tailwind convention).
2. If `window.matchMedia('(prefers-color-scheme: dark)')` matches.

Returns `false` during SSR (when `window` is undefined).

```typescript
function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains('dark')) return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

### `injectStyles()`

Injects custom CSS keyframe animations required by the adapter. Called once
during adapter initialization. Creates a `<style>` element with
`id="mui-adapter-styles"` and appends it to `document.head`.

**Injected animations:**

| Animation | Class | Usage |
|-----------|-------|-------|
| `mui-indeterminate` | `.animate-mui-indeterminate` | Indeterminate progress bar |
| `mui-wave` | `.animate-wave::before` | Skeleton wave animation |

**Injected utility classes:**

| Class | Purpose |
|-------|---------|
| `.mui-focus-visible` | Focus ring with `#1976d2` outline |
| `.mui-ripple` | Ripple effect positioning |
| `.mui-transition-standard` | 225ms standard transition |
| `.mui-transition-entering` | 225ms enter transition |
| `.mui-transition-leaving` | 195ms exit transition |

---

## MUI Design Tokens

### Z-Index Layering

Following Material Design z-index conventions:

| Layer | Z-Index | Components |
|-------|---------|------------|
| Drawer / Sheet | `1200` | `MuiDrawer`, `MuiSheet`, `MuiActionSheet` |
| Modal / Dialog | `1300` | `MuiModal`, `MuiConfirm`, `MuiPrompt` |
| Toast / Banner | `1400` | `MuiToastContainer`, `MuiBanner`, `MuiConnection` |
| Popconfirm | `1500` | `MuiPopconfirm` |

### Transition Timing

| Transition | Duration | Timing Function |
|-----------|----------|-----------------|
| Standard | 225ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Enter | 225ms | `cubic-bezier(0.0, 0, 0.2, 1)` |
| Exit | 195ms | `cubic-bezier(0.4, 0, 1, 1)` |

Most components use the Tailwind class `duration-225` for transitions.

### Color Palette

All components use Tailwind's default color scale mapped to MUI semantic roles:

| MUI Role | Tailwind Color | Usage |
|----------|---------------|-------|
| Primary | `blue-600` / `blue-400` (dark) | Buttons, links, active states |
| Secondary | `purple-600` / `purple-400` (dark) | Loading variant |
| Error | `red-600` / `red-500` | Destructive actions, error states |
| Warning | `orange-500` / `orange-600` | Warning alerts and progress |
| Success | `green-500` / `green-600` | Success alerts and progress |
| Info | `blue-500` / `blue-600` | Info alerts |

### Elevation (Shadows)

| Level | Tailwind Class | Usage |
|-------|---------------|-------|
| Low | `shadow` | Cards, alerts |
| Medium | `shadow-md` | Toast notifications |
| High | `shadow-xl` | Sheets, popconfirm |
| Highest | `shadow-2xl` | Modals, drawers, dialogs |

---

## Component Details

### MuiToast

Paper-like toast notification with left border variant indicator.

**Styling:**
- White background with `border-l-4` colored by variant
- Shadow-md elevation
- 225ms slide-in transition (`translate-x-4` to `translate-x-0`)
- MUI IconButton style close button (rounded-full, hover bg)
- Action button with uppercase text and tracking-wide

**Variant styles:**

| Variant | Border Color |
|---------|-------------|
| `default` | `border-l-gray-500` |
| `success` | `border-l-green-500` |
| `error` | `border-l-red-500` |
| `warning` | `border-l-orange-500` |
| `info` | `border-l-blue-500` |

**ARIA:** `role="alert"`, `aria-live="assertive"` (error) or `"polite"`, `aria-atomic="true"`

### MuiToastContainer

Fixed position container for stacking toasts.

**Styling:**
- Fixed positioning with 24px padding (`p-6`)
- Flex column layout with configurable gap
- Bottom positions use `flex-col-reverse` for natural stacking
- `pointer-events-none` on container, `pointer-events-auto` on toasts
- z-index: `1400`

**Positions:** `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`

### MuiBanner

Full-width sticky banner notification in MUI app bar style.

**Styling:**
- Fixed full-width with `z-[1400]`
- Solid background colors (not outlined) for each variant
- Slide-in from top (`-translate-y-full` to `translate-y-0`) or bottom
- MUI text button style for action (uppercase, tracking-wide, `hover:bg-white/10`)
- Max-width container (`max-w-screen-xl mx-auto`)

**Positions:** `top`, `bottom`

### MuiModal

Material Design dialog with Paper elevation and focus trap.

**Styling:**
- Fixed overlay with `bg-black/50` backdrop
- White Paper surface with `shadow-2xl` and rounded corners
- Scale transition (`scale-95` to `scale-100`) with opacity
- MUI DialogTitle header with close IconButton
- MUI DialogContent with padding and scroll behavior
- MUI DialogActions footer area
- z-index: `1300`

**Size variants:**

| Size | Tailwind Class |
|------|---------------|
| `sm` | `max-w-sm` |
| `md` | `max-w-lg` |
| `lg` | `max-w-2xl` |
| `xl` | `max-w-4xl` |
| `full` | `max-w-full h-full m-0 rounded-none` |

**Hooks:** `useFocusTrap`, `useScrollLock`, ESC key handler

### MuiConfirm

Confirmation dialog styled as MUI AlertDialog.

**Styling:**
- Same backdrop and Paper as MuiModal
- `role="alertdialog"` with `aria-describedby` for message
- Auto-focus on confirm button
- MUI Button text variant for cancel (blue text, hover bg)
- MUI Button contained variant for confirm (blue or red bg, shadow)
- Loading state shows "Loading..." text
- z-index: `1300`

**Confirm variants:** `primary` (blue-600) and `danger` (red-600)

### MuiPrompt

Dialog with Material Design TextField (outlined variant).

**Styling:**
- Same backdrop and Paper as MuiModal
- MUI TextField outlined: `border-2`, blue focus ring, red on error
- Supports `text`, `textarea`, `email`, `number`, `password`, `tel`, `url` types
- Error helper text below input (`text-xs text-red-600`)
- Enter key submits (except textarea)
- Auto-focus on input after 100ms delay
- z-index: `1300`

**Hooks:** `useFocusTrap`, `useScrollLock`, ESC key handler

### MuiDrawer

Side panel with MUI Drawer Paper styling and 4 anchor positions.

**Styling:**
- Fixed overlay with `bg-black/50` backdrop
- Paper surface with `shadow-2xl`
- Transform-based slide animation per placement
- Default header with title and close IconButton
- Custom header/footer support
- z-index: `1200`

**Placement and transform:**

| Placement | Hidden | Visible |
|-----------|--------|---------|
| `left` | `-translate-x-full` | `translate-x-0` |
| `right` | `translate-x-full` | `translate-x-0` |
| `top` | `-translate-y-full` | `translate-y-0` |
| `bottom` | `translate-y-full` | `translate-y-0` |

**Size styles (horizontal):** `sm: w-64`, `md: w-80`, `lg: w-96`, `xl: w-[400px]`, `full: w-screen`
**Size styles (vertical):** `sm: h-48`, `md: h-64`, `lg: h-96`, `xl: h-[400px]`, `full: h-screen`

**Hooks:** `useFocusTrap`, `useScrollLock`, ESC key handler

### MuiPopconfirm

Positioned popover confirmation dialog.

**Styling:**
- No backdrop overlay (positioned near trigger element)
- Paper surface with `shadow-xl`, `rounded-lg`
- Scale transition (`scale-95` to `scale-100`)
- Dynamic positioning via `calculatePosition()` function
- Viewport boundary clamping (8px padding from edges)
- MUI-style compact buttons (uppercase, tracking-wide)
- z-index: `1500`

**Placements:** 12 positions - `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`

### MuiSheet

Material Design bottom sheet with snap points and drag support.

**Styling:**
- Fixed overlay with `bg-black/50` backdrop
- Paper surface with `rounded-t-2xl shadow-2xl`
- Drag handle: 8px wide, 1px tall, gray rounded pill
- Height-based snap (percentage of viewport)
- 225ms slide-up transition
- z-index: `1200`

**Key behaviors:**
- Drag-to-dismiss via `useDrag` hook
- ESC key close
- Backdrop click close
- Snap to lower point or dismiss on downward drag
- Snap to higher point on upward drag

**Hooks:** `useFocusTrap`, `useScrollLock`, `useDrag`

### MuiActionSheet

Material Design action list bottom sheet.

**Styling:**
- Fixed overlay with `bg-black/50` backdrop
- Separate Paper surfaces for action list and cancel button
- MUI List item styling with left-aligned text and icons
- Hover/active states: `hover:bg-gray-100`, `active:bg-gray-200`
- Destructive items in `text-red-600`
- Cancel button as separate `rounded-xl` Paper element
- 225ms slide-up transition
- z-index: `1200`

**Hooks:** `useFocusTrap`, `useScrollLock`, ESC key handler

### MuiAlert

Inline alert with MUI Alert standard severity colors.

**Styling:**
- Outlined variant with colored border and tinted background
- Default SVG icons per variant (filled icon style)
- Slide-in animation (`-translate-y-2` to `translate-y-0`)
- Dismiss button as circular IconButton
- Action buttons with variant styling (primary, secondary, danger, link)

**Variant backgrounds:**

| Variant | Background | Border |
|---------|-----------|--------|
| `default` | `bg-gray-100` | `border-gray-300` |
| `success` | `bg-green-50` | `border-green-300` |
| `error` | `bg-red-50` | `border-red-300` |
| `warning` | `bg-orange-50` | `border-orange-300` |
| `info` | `bg-blue-50` | `border-blue-300` |

### MuiLoading

Circular progress spinner with multiple spinner types.

**Styling:**
- Inline-flex column layout with gap
- SVG-based CircularProgress with `animate-spin`
- Screen-reader-only label (`sr-only`)
- Fullscreen mode with fixed backdrop and configurable opacity
- z-index: `1300` (fullscreen only)

**Spinner types:**

| Type | Component | Description |
|------|-----------|-------------|
| `default` | `CircularProgress` | SVG dual-circle with dasharray |
| `dots` | `DotsProgress` | 3 bouncing dots |
| `bars` | `BarsProgress` | 5 pulsing vertical bars |
| `ring` | `CircleSpinner` | CSS border-based spinner |
| `pulse` | `CircularProgress` | Same as default |

**Size styles:** `sm: w-5 h-5`, `md: w-10 h-10`, `lg: w-14 h-14`
**Variants:** `primary` (blue), `secondary` (purple), `white`

### MuiProgress

Linear progress bar with determinate and indeterminate modes.

**Styling:**
- Full-width rounded track with tinted background
- Colored fill bar with smooth width transition
- Indeterminate mode uses `mui-indeterminate` keyframe animation
- Label and percentage display above bar
- 225ms opacity transition for show/hide

**Size styles:** `sm: h-1`, `md: h-1.5`, `lg: h-2`

**Variant colors:**

| Variant | Bar Color | Track Color |
|---------|-----------|-------------|
| `default` | `bg-blue-600` | `bg-blue-200` |
| `success` | `bg-green-600` | `bg-green-200` |
| `warning` | `bg-orange-500` | `bg-orange-200` |
| `error` | `bg-red-600` | `bg-red-200` |

**ARIA:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`

### MuiSkeleton

Skeleton placeholder loader with wave animation.

**Styling:**
- Gray base color (`bg-gray-300 dark:bg-gray-700`)
- Wave animation via pseudo-element with gradient overlay
- Pulse animation via Tailwind `animate-pulse`

**Shapes:**

| Shape | Default Size | Description |
|-------|-------------|-------------|
| `text` | Full width, 16px height per line | Multi-line text placeholder |
| `circle` | 40x40px | Avatar/icon circle |
| `rectangle` | Full width, 100px height | Image/card rectangle |
| `avatar` | Combined | Circle + two text lines |
| `button` | 100x36px | Button placeholder |
| `card` | Full width | Image + title + text composite |

**Animation types:** `pulse`, `wave`, `none`

### MuiResult

Result/status page with MUI-style icons and layout.

**Styling:**
- Centered flex column with generous padding (`py-16 px-6`)
- Large SVG icons (80x80px) colored per status
- HTTP status codes (`404`, `403`, `500`) as large text
- MUI Button styling for actions (uppercase, shadow, tracking-wide)

**Status icons:**

| Status | Icon |
|--------|------|
| `success` | Green checkmark circle |
| `error` | Red exclamation circle |
| `info` | Blue info circle |
| `warning` | Orange warning triangle |
| `404` | Large "404" text |
| `403` | Large "403" text |
| `500` | Large "500" text |

### MuiConnection

Online/offline status indicator styled as MUI Snackbar/Chip.

**Styling:**
- Fixed bottom-center positioning with `z-[1400]`
- Pill-shaped indicator with shadow-lg
- Green background when online, dark gray when offline
- WiFi icon (online) and no-WiFi icon (offline)
- Auto-dismiss online message after 3 seconds
- Pulsing status dot

---

## Animation System

### Status Lifecycle

All adapter components receive a `status` prop with the following lifecycle:

```
pending -> entering -> visible -> exiting -> removed
```

Components check `isVisible = status === 'visible' || status === 'entering'`
and `isExiting = status === 'exiting'` to control CSS transitions.

### Common Pattern

```typescript
const isVisible = status === 'visible' || status === 'entering';
const isExiting = status === 'exiting';

// Container: opacity transition
className={cn(
  'transition-opacity duration-225',
  isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
)}

// Content: transform + opacity transition
className={cn(
  'transition-all duration-225 ease-out',
  isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
)}
```

### Injected Keyframes

```css
/* Indeterminate progress bar */
@keyframes mui-indeterminate {
  0%   { left: -35%; right: 100%; }
  60%  { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
}

/* Skeleton wave animation */
@keyframes mui-wave {
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}
```

---

## Shared Patterns

### Component Template

Every MUI adapter component follows a consistent pattern:

1. **`memo` + `forwardRef`** wrapper for performance and ref forwarding
2. **Props destructuring** with defaults matching MUI conventions
3. **`isVisible` / `isExiting`** derived from `status` prop
4. **ARIA attributes** appropriate to the component role
5. **Tailwind CSS** classes with `cn()` for conditional merging
6. **`data-testid`** prop for testing
7. **`displayName`** set for React DevTools

### Dialog Pattern (Modal, Confirm, Prompt)

```
Root (fixed inset-0, backdrop, z-1300)
└── Paper (max-w-*, shadow-2xl, scale transition)
    ├── Header (DialogTitle, close IconButton)
    ├── Content (DialogContent, overflow)
    └── Footer (DialogActions, flex justify-end)
```

Common hooks: `useFocusTrap`, `useScrollLock`, ESC key listener.

### Sheet Pattern (Sheet, ActionSheet)

```
Root (fixed inset-0, z-1200)
├── Backdrop (bg-black/50, opacity transition)
└── Panel (bottom-0, translate-y transition)
    ├── Handle (optional drag handle)
    ├── Title (optional)
    └── Content
```

Common hooks: `useFocusTrap`, `useScrollLock`, `useDrag` (Sheet only).

### Button Styling

Two main button styles are used across MUI adapter components:

**Text Button (cancel actions):**
```
px-4 py-2 min-w-[64px] rounded
text-sm font-medium uppercase tracking-wide
text-blue-600 dark:text-blue-400
hover:bg-blue-50 dark:hover:bg-blue-900/20
```

**Contained Button (confirm actions):**
```
px-4 py-2 min-w-[64px] rounded
text-sm font-medium uppercase tracking-wide
bg-blue-600 text-white hover:bg-blue-700
shadow hover:shadow-md
```

---

## Module Exports

From `src/adapters/mui/index.ts`:

```typescript
// Adapter object
export { muiAdapter } from './index';
export { MUI_ADAPTER_VERSION } from './index';

// Individual components
export { MuiToast } from './MuiToast';
export { MuiToastContainer } from './MuiToastContainer';
export { MuiModal } from './MuiModal';
export { MuiLoading } from './MuiLoading';
export { MuiAlert } from './MuiAlert';
export { MuiProgress } from './MuiProgress';
export { MuiConfirm } from './MuiConfirm';
export { MuiBanner } from './MuiBanner';
export { MuiDrawer } from './MuiDrawer';
export { MuiPopconfirm } from './MuiPopconfirm';
export { MuiSkeleton } from './MuiSkeleton';
export { MuiResult } from './MuiResult';
export { MuiPrompt } from './MuiPrompt';
export { MuiSheet } from './MuiSheet';
export { MuiActionSheet } from './MuiActionSheet';
export { MuiConnection } from './MuiConnection';
```

---

## Accessibility

All MUI adapter components implement proper ARIA attributes:

| Component | Role | Additional ARIA |
|-----------|------|----------------|
| `MuiToast` | `alert` | `aria-live`, `aria-atomic` |
| `MuiToastContainer` | - | `aria-live="polite"`, `aria-label` |
| `MuiBanner` | `banner` | `aria-live="polite"` |
| `MuiModal` | `dialog` | `aria-modal`, `aria-labelledby` |
| `MuiConfirm` | `alertdialog` | `aria-modal`, `aria-labelledby`, `aria-describedby` |
| `MuiPrompt` | `dialog` | `aria-modal`, `aria-labelledby`, `aria-invalid` |
| `MuiDrawer` | `dialog` | `aria-modal`, `aria-labelledby` |
| `MuiPopconfirm` | `alertdialog` | `aria-modal`, `aria-labelledby`, `aria-describedby` |
| `MuiSheet` | `dialog` | `aria-modal`, `aria-labelledby` |
| `MuiActionSheet` | `dialog` | `aria-modal`, `aria-labelledby` |
| `MuiAlert` | `alert` | - |
| `MuiLoading` | `status` | `aria-live="polite"`, `aria-busy` |
| `MuiProgress` | `progressbar` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` |
| `MuiSkeleton` | - | `aria-hidden="true"` |
| `MuiResult` | `status` | - |
| `MuiConnection` | `status` | `aria-live="polite"` |

---

## Testing Checklist

### Adapter Integration

- [ ] `muiAdapter` satisfies `IFeedbackAdapter` type
- [ ] All 16 component slots are populated
- [ ] `muiAdapter.name` is `'mui'`
- [ ] `muiAdapter.version` matches `MUI_ADAPTER_VERSION`
- [ ] `isDarkMode()` returns boolean
- [ ] `isDarkMode()` returns `false` during SSR
- [ ] `injectStyles()` creates style element in document head
- [ ] `injectStyles()` is idempotent (only creates one style element)

### Individual Components

- [ ] Each component renders with `data-testid` prop
- [ ] Each component responds to `status` prop transitions
- [ ] Each component applies dark mode classes correctly
- [ ] Dialogs (Modal, Confirm, Prompt) trap focus
- [ ] Dialogs lock scroll when open
- [ ] Dialogs close on ESC key
- [ ] Sheets animate from bottom
- [ ] Toast transitions use slide animation
- [ ] Progress bar shows correct percentage width
- [ ] Skeleton renders all 6 shape variants
- [ ] Connection indicator auto-hides after reconnection

### Visual Regression

- [ ] Toast matches MUI Snackbar with left border
- [ ] Modal matches MUI Dialog with elevation
- [ ] Button text is uppercase with letter spacing
- [ ] Colors match MUI default palette
- [ ] Transitions use 225ms duration
- [ ] Dark mode inverts colors correctly

---

## Implementation Checklist

- [x] Create `src/adapters/mui/index.ts` with adapter object and utilities
- [x] Create `src/adapters/mui/MuiToast.tsx`
- [x] Create `src/adapters/mui/MuiToastContainer.tsx`
- [x] Create `src/adapters/mui/MuiBanner.tsx`
- [x] Create `src/adapters/mui/MuiModal.tsx`
- [x] Create `src/adapters/mui/MuiConfirm.tsx`
- [x] Create `src/adapters/mui/MuiPrompt.tsx`
- [x] Create `src/adapters/mui/MuiDrawer.tsx`
- [x] Create `src/adapters/mui/MuiPopconfirm.tsx`
- [x] Create `src/adapters/mui/MuiSheet.tsx`
- [x] Create `src/adapters/mui/MuiActionSheet.tsx`
- [x] Create `src/adapters/mui/MuiAlert.tsx`
- [x] Create `src/adapters/mui/MuiLoading.tsx`
- [x] Create `src/adapters/mui/MuiProgress.tsx`
- [x] Create `src/adapters/mui/MuiSkeleton.tsx`
- [x] Create `src/adapters/mui/MuiResult.tsx`
- [x] Create `src/adapters/mui/MuiConnection.tsx`
- [x] Implement `isDarkMode()` utility
- [x] Implement `injectStyles()` with keyframe animations
- [ ] Write unit tests for each component
- [ ] Write integration test with FeedbackProvider
- [ ] Test dark mode styling
- [ ] Visual regression testing
- [ ] Update IMPLEMENTATION.md

---

## Common Pitfalls

1. **No `@mui/material` dependency**: This adapter does not wrap actual MUI
   components. It recreates the visual design using Tailwind CSS. Do not import
   from `@mui/material`.

2. **`injectStyles()` must be called**: The adapter includes an `injectStyles`
   method that must be called during initialization to inject keyframe
   animations. Without it, indeterminate progress and skeleton wave animations
   will not work.

3. **Duration class `duration-225`**: Tailwind does not include `duration-225`
   by default. This must be configured in `tailwind.config.js` or the styles
   will fall back to no transition.

4. **Z-index conflicts**: MUI adapter uses z-index values 1200-1500. Ensure your
   application does not use conflicting z-index values in this range.

5. **Dark mode detection**: The `isDarkMode()` function checks for the `dark`
   class on `document.documentElement`. This follows the Tailwind dark mode
   convention (`darkMode: 'class'`). It will not work with `darkMode: 'media'`
   unless the system preference matches.

6. **SSR safety**: All components guard against SSR by checking `typeof window`
   and `typeof document` before accessing browser APIs.

---

## Notes

- All components use `memo` and `forwardRef` for optimal React performance.
- The adapter is designed to be tree-shakeable: unused components are not
  bundled if only the adapter object is imported.
- Button styling follows MUI conventions: uppercase text, `tracking-wide`
  letter spacing, `min-w-[64px]`, and `text-sm font-medium`.
- The adapter version (`MUI_ADAPTER_VERSION`) is exported separately for
  programmatic version checking.
- For a `@mui/material`-based adapter that wraps actual MUI components, a
  separate `mui-native` adapter could be created in the future.
- The shadcn adapter (`design/17-adapter-shadcn.md`) follows the same
  architectural pattern and can be used as a reference for creating additional
  adapters.
