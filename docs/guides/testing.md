# Testing with OmniFeedback

OmniFeedback is designed to be fully testable. This guide covers test environment setup, wrapper utilities, hook testing patterns, and common pitfalls.

## Setup

### Vitest Configuration

OmniFeedback uses Vitest with a DOM environment. Here is the recommended `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom'
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@providers': resolve(__dirname, 'src/providers'),
    },
  },
});
```

### Required Dev Dependencies

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react happy-dom
```

You can substitute `jsdom` for `happy-dom` if you prefer. Both work correctly with OmniFeedback.

### Setup File

Create a `tests/setup.ts` file for global test configuration:

```ts
import '@testing-library/jest-dom';
```

## Test Wrapper

All OmniFeedback hooks require a `FeedbackProvider` ancestor. Create a reusable wrapper for `renderHook` and `render` calls.

### Basic Wrapper

```tsx
import type { ReactNode } from 'react';
import { FeedbackProvider } from 'omnifeedback';

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

Setting all `render*` flags to `false` disables UI container rendering. This isolates hook logic from DOM rendering, making tests faster and more focused.

### Wrapper with Custom Config

```tsx
function createConfiguredWrapper(config?: Partial<IFeedbackConfig>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider
        config={config}
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

### Helper Function: renderWithProviders

For component testing where you need the full DOM:

```tsx
import { render } from '@testing-library/react';
import { FeedbackProvider } from 'omnifeedback';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <FeedbackProvider>
      {ui}
    </FeedbackProvider>
  );
}
```

## Testing Toast Hooks

### Show a Toast and Verify Store

```tsx
import { renderHook, act } from '@testing-library/react';
import { useToast } from 'omnifeedback';
import { FeedbackManager } from 'omnifeedback';

describe('useToast', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
  });

  it('should show a toast and return an ID', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: createWrapper(),
    });

    let id: string;
    act(() => {
      id = result.current.show({ message: 'Test toast' });
    });

    expect(id!).toBeTruthy();
    expect(typeof id!).toBe('string');
  });

  it('should show variant toasts', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.success('Success message');
      result.current.error('Error message');
      result.current.warning('Warning message');
      result.current.info('Info message');
    });
  });
});
```

### Dismiss a Toast

```tsx
it('should dismiss a toast and transition to exiting status', () => {
  const { result } = renderHook(() => useToast(), {
    wrapper: createWrapper(),
  });

  vi.useFakeTimers();

  const manager = FeedbackManager.getInstance();
  const config = manager.getConfig();

  let id: string;
  act(() => {
    id = result.current.show({ message: 'Dismissable toast' });
  });

  // Wait for entering -> visible transition
  act(() => {
    vi.advanceTimersByTime(config.enterAnimationDuration);
  });

  act(() => {
    result.current.dismiss(id!);
  });

  vi.useRealTimers();
});
```

### Dismiss All Toasts

```tsx
it('should dismiss all toasts', () => {
  const { result } = renderHook(() => useToast(), {
    wrapper: createWrapper(),
  });

  vi.useFakeTimers();

  const config = FeedbackManager.getInstance().getConfig();

  act(() => {
    result.current.show({ message: 'Toast A' });
    result.current.show({ message: 'Toast B' });
    result.current.show({ message: 'Toast C' });
  });

  act(() => {
    vi.advanceTimersByTime(config.enterAnimationDuration);
  });

  act(() => {
    result.current.dismissAll();
  });

  vi.useRealTimers();
});
```

## Testing Confirm and Prompt

Confirm and prompt hooks return **promises** that resolve when the user confirms or cancels. In tests, you trigger the confirm/cancel by calling the callbacks stored in the feedback store.

### Confirm Resolves True on Confirm

```tsx
import { renderHook, act } from '@testing-library/react';
import { useConfirm } from 'omnifeedback';
import { useFeedbackStore } from 'omnifeedback';

it('should resolve with true when confirmed', async () => {
  const { result } = renderHook(() => useConfirm(), {
    wrapper: createWrapper(),
  });

  vi.useFakeTimers();

  let promise: Promise<boolean>;
  act(() => {
    promise = result.current.show({ message: 'Confirm this action?' });
  });

  // Get the confirm item from the store
  const store = useFeedbackStore.getState();
  const confirmItem = store.getByType('confirm')[0];
  const options = confirmItem?.options;

  // Trigger the onConfirm callback
  act(() => {
    options.onConfirm();
  });

  // Wait for exit animation
  act(() => {
    vi.advanceTimersByTime(500);
  });

  const resolved = await promise!;
  expect(resolved).toBe(true);

  vi.useRealTimers();
});
```

### Confirm Resolves False on Cancel

```tsx
it('should resolve with false when cancelled', async () => {
  const { result } = renderHook(() => useConfirm(), {
    wrapper: createWrapper(),
  });

  vi.useFakeTimers();

  let promise: Promise<boolean>;
  act(() => {
    promise = result.current.show({ message: 'Cancel this action?' });
  });

  const store = useFeedbackStore.getState();
  const confirmItem = store.getByType('confirm')[0];

  act(() => {
    confirmItem?.options.onCancel?.();
  });

  act(() => {
    vi.advanceTimersByTime(500);
  });

  const resolved = await promise!;
  expect(resolved).toBe(false);

  vi.useRealTimers();
});
```

## Testing Loading States

### Show and Hide Loading

```tsx
import { useLoading } from 'omnifeedback';

it('should track isLoading state correctly', () => {
  const { result } = renderHook(() => useLoading(), {
    wrapper: createWrapper(),
  });

  expect(result.current.isLoading).toBe(false);

  act(() => {
    result.current.show({ message: 'Processing...' });
  });

  expect(result.current.isLoading).toBe(true);
});
```

### Test loading.wrap Pattern

```tsx
it('should wrap async function with loading indicator', async () => {
  const { result } = renderHook(() => useLoading(), {
    wrapper: createWrapper(),
  });

  const asyncFn = vi.fn().mockResolvedValue('done');

  let returnValue: string;
  await act(async () => {
    returnValue = await result.current.wrap(asyncFn, {
      message: 'Working...',
    });
  });

  expect(returnValue!).toBe('done');
  expect(asyncFn).toHaveBeenCalledTimes(1);
});
```

## Mocking the Manager

For unit tests where you want to test components in isolation without the full provider tree, you can mock the `FeedbackManager`:

```tsx
import { vi } from 'vitest';
import { FeedbackManager } from 'omnifeedback';

const mockManager = {
  add: vi.fn().mockReturnValue('mock-id'),
  remove: vi.fn(),
  removeAll: vi.fn(),
  update: vi.fn(),
  updateStatus: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn().mockReturnValue([]),
  getByType: vi.fn().mockReturnValue([]),
  on: vi.fn().mockReturnValue(() => {}),
  getConfig: vi.fn().mockReturnValue({
    defaultDuration: 5000,
    exitAnimationDuration: 200,
    enterAnimationDuration: 200,
    maxVisible: {},
    defaultPosition: 'top-right',
    enableAnimations: true,
    rtl: false,
    queue: { maxSize: 100, strategy: 'fifo' },
  }),
  destroy: vi.fn(),
};

vi.spyOn(FeedbackManager, 'getInstance').mockReturnValue(
  mockManager as unknown as FeedbackManager
);
```

This approach is useful when testing components that consume feedback hooks but you do not want the side effects of the real manager (timers, store mutations).

## Integration Test Patterns

### Full Provider + Hook + Assertion

The OmniFeedback test suite uses a pattern where the provider is set up with all containers disabled, hooks are called via `renderHook`, and assertions are made against the Zustand store:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FeedbackProvider } from 'omnifeedback';
import { FeedbackManager } from 'omnifeedback';
import { useFeedbackStore } from 'omnifeedback';
import { useFeedback } from 'omnifeedback';

describe('Integration: Combined useFeedback hook', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  it('should allow using multiple hooks in the same flow', () => {
    const { result } = renderHook(() => useFeedback(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toast.success('Toast from combined hook');
      result.current.loading.show({ message: 'Loading from combined hook' });
    });

    const store = useFeedbackStore.getState();
    const toasts = store.getByType('toast');
    const loadings = store.getByType('loading');

    expect(toasts).toHaveLength(1);
    expect(loadings).toHaveLength(1);
  });

  it('should return all 14 hook namespaces', () => {
    const { result } = renderHook(() => useFeedback(), {
      wrapper: createWrapper(),
    });

    expect(result.current.toast).toBeDefined();
    expect(result.current.modal).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.alert).toBeDefined();
    expect(result.current.progress).toBeDefined();
    expect(result.current.confirm).toBeDefined();
    expect(result.current.banner).toBeDefined();
    expect(result.current.drawer).toBeDefined();
    expect(result.current.popconfirm).toBeDefined();
    expect(result.current.skeleton).toBeDefined();
    expect(result.current.result).toBeDefined();
    expect(result.current.connection).toBeDefined();
    expect(result.current.prompt).toBeDefined();
    expect(result.current.sheet).toBeDefined();
  });
});
```

### Testing Context Access

```tsx
it('should throw when used outside FeedbackProvider', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => {
    renderHook(() => useFeedbackContext());
  }).toThrow('useFeedbackContext must be used within a FeedbackProvider');

  consoleSpy.mockRestore();
});
```

## Common Pitfalls

### 1. `act()` Warnings

OmniFeedback uses timers for animation transitions (entering -> visible -> exiting -> removed). If you see `act()` warnings, ensure all state updates are wrapped:

```tsx
// Wrap timer advances in act()
act(() => {
  vi.advanceTimersByTime(200);
});
```

### 2. Forgetting to Reset the Singleton

`FeedbackManager` is a singleton. If you do not reset it between tests, state leaks across test cases:

```tsx
beforeEach(() => {
  FeedbackManager.resetInstance();
  useFeedbackStore.getState().clear();
});

afterEach(() => {
  FeedbackManager.resetInstance();
  useFeedbackStore.getState().clear();
});
```

### 3. Async State in Confirm/Prompt Tests

Confirm and prompt hooks return promises. You must trigger the callback (onConfirm/onCancel) from the store **and** advance timers to let exit animations complete before awaiting the promise:

```tsx
// 1. Show the confirm
let promise: Promise<boolean>;
act(() => {
  promise = result.current.show({ message: 'Are you sure?' });
});

// 2. Trigger the callback
act(() => {
  store.getByType('confirm')[0]?.options.onConfirm();
});

// 3. Advance timers for exit animation
act(() => {
  vi.advanceTimersByTime(500);
});

// 4. Now await the promise
const resolved = await promise!;
```

### 4. Cleanup After Each Test

Always clear both the manager and the store. The manager holds timers; the store holds items. Leaving either dirty will cause flaky tests:

```tsx
afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  FeedbackManager.resetInstance();
  useFeedbackStore.getState().clear();
});
```

### 5. Fake Timers and Promise Resolution

When using `vi.useFakeTimers()`, async operations that depend on real time (like `setTimeout`) need manual advancement. Always pair fake timers with `vi.advanceTimersByTime()` or `vi.runAllTimers()`.

### 6. Testing Components (Not Just Hooks)

When testing a component that uses feedback hooks, use `renderWithProviders` and assert against the DOM:

```tsx
it('should show toast when button is clicked', async () => {
  const { getByText } = renderWithProviders(<SaveButton />);

  const user = userEvent.setup();
  await user.click(getByText('Save'));

  // Assert toast appears in the DOM (if containers are rendered)
  expect(getByText('Document saved successfully!')).toBeInTheDocument();
});
```

## Related Guides

- **[Getting Started](../getting-started.md)** -- Installation and first usage.
- **[Configuration Guide](../configuration.md)** -- Provider props and global config.
- **[Adapter System Overview](../adapters/overview.md)** -- Adapter comparison and the IFeedbackAdapter interface.
