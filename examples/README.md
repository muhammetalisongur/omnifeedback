# OmniFeedback Examples

A collection of self-contained, copy-paste-ready examples demonstrating the core features of OmniFeedback.

## Prerequisites

All examples assume your app is wrapped with `<FeedbackProvider>` from `omnifeedback`:

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

## Basic Examples

| # | File | Description | Difficulty |
|---|------|-------------|------------|
| 01 | [Toast Variants](./basic/01-toast-variants.tsx) | All toast methods: success, error, warning, info, loading. Custom duration, position, action buttons, dismiss, dismissAll, and update. | Beginner |
| 02 | [Modal with Form](./basic/02-modal-with-form.tsx) | Opening modals with form content, managing form state, closing on submit, custom footer buttons, and modal sizes. | Beginner |
| 03 | [Loading & Wrap Async](./basic/03-loading-wrap-async.tsx) | Manual show/hide pattern, `wrap()` auto pattern, loading with message and overlay, cancellable loading, and reactive `isLoading` state. | Beginner |
| 04 | [Confirm Delete](./basic/04-confirm-delete.tsx) | Basic `confirm.show()`, `confirm.danger()` for destructive actions, custom button text, conditional logic, and confirm with icon. | Beginner |
| 05 | [Combined Workflow](./basic/05-combined-workflow.tsx) | Realistic user profile component combining loading, toast, confirm, and progress hooks via `useFeedback()`. Includes save, delete, avatar upload, and error recovery. | Intermediate |

## Pattern Examples

| # | File | Description | Difficulty |
|---|------|-------------|------------|
| 06 | [Promise Toast](./patterns/06-promise-toast.tsx) | `toast.promise()` for real API calls: basic fetch, POST with dynamic success message, custom error formatter, concurrent promises, and custom options. | Intermediate |
| 07 | [Form Submission](./patterns/07-form-submission.tsx) | Complete form workflow: client-side validation, `loading.wrap()` around API call, success/error toast, form reset, and disabled submit during loading. | Intermediate |
| 08 | [CRUD Operations](./patterns/08-crud-operations.tsx) | Full CRUD with modal create, drawer edit, confirm delete, toast feedback after each operation, and loading during API calls. | Intermediate |
| 09 | [Connection-Aware Save](./patterns/09-connection-aware-save.tsx) | Offline-aware saving with `useConnection`: queue actions when offline, show queue size, auto-execute on reconnect, and manual connection check. | Intermediate |
| 10 | [Nested Modals](./patterns/10-nested-modals.tsx) | Modal-inside-modal pattern: parent modal opens child modal, independent close, confirm before closing with unsaved changes, and `openModals` tracking. | Intermediate |

## Advanced Examples

| # | File | Description | Difficulty |
|---|------|-------------|------------|
| 11 | [Custom Adapter](./advanced/11-custom-adapter-minimal.tsx) | Minimal custom `IFeedbackAdapter` implementation with custom toast, modal, and loading components. Shows how to create your own adapter. | Advanced |
| 12 | [Event Bus Listeners](./advanced/12-event-bus-listeners.tsx) | EventBus subscription for analytics and logging: listen to feedback events, display live event log, and clean up subscriptions. | Advanced |
| 13 | [Drawer Settings Panel](./advanced/13-drawer-settings-panel.tsx) | Settings panel in a drawer with dirty state tracking, confirm on close with unsaved changes, save with loading, and reset to defaults. | Advanced |
| 14 | [Sheet Action Menu](./advanced/14-sheet-action-menu.tsx) | Mobile-style bottom sheets: `showActions()` for photo/share menus, `confirm()` for destructive actions, and custom sheet content with `open()`. | Advanced |
| 15 | [Progress File Upload](./advanced/15-progress-file-upload.tsx) | File upload with chunked progress tracking, percentage updates, cancel mid-upload support, multiple file uploads, and completion toast. | Advanced |

## Running the Examples

1. Copy any example file into your project's `src/` directory.
2. Import and render the default-exported component.
3. Make sure `<FeedbackProvider>` wraps your application root.

```tsx
import ToastVariants from './01-toast-variants';

function App() {
  return (
    <FeedbackProvider>
      <ToastVariants />
    </FeedbackProvider>
  );
}
```

## Hooks Reference

| Hook | Purpose | Used in Examples |
|------|---------|------------------|
| `useToast()` | Toast notifications (success, error, warning, info, loading, promise) | 01, 06, 07, 08 |
| `useModal()` | Modal dialogs with custom content, footer, and sizes | 02, 08, 10 |
| `useLoading()` | Loading indicators with manual and `wrap()` patterns | 03, 07, 08 |
| `useConfirm()` | Promise-based confirmation dialogs | 04, 08, 10, 13 |
| `useProgress()` | Determinate and indeterminate progress indicators | 05, 15 |
| `useDrawer()` | Slide-out drawer panels with position and size | 08, 13 |
| `useConnection()` | Network connectivity monitoring and offline queue | 09 |
| `useSheet()` | Bottom sheets, action sheets, and confirm sheets | 14 |
| `usePrompt()` | Promise-based input dialogs with validation | — |
| `useBanner()` | Page-level banners with persistent dismiss | — |
| `useFeedback()` | Combined hook providing access to all of the above | 05 |

## Notes

- Every example imports exclusively from `'omnifeedback'` and `'react'`.
- No external UI libraries are required; all examples use plain HTML elements for layout.
- TypeScript types are used throughout for clarity and IDE support.
