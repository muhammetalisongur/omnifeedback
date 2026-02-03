/**
 * useToast hook - Provides toast notification functionality
 * Convenient wrapper around FeedbackManager for toast operations
 */

import { useCallback } from 'react';
import { useFeedbackContext } from '../providers/FeedbackProvider';
import type { IToastOptions } from '../core/types';

/**
 * Promise toast options
 */
export interface IToastPromiseOptions<T> {
  /** Message shown while loading */
  loading: string;
  /** Message on success (can be function that receives result) */
  success: string | ((data: T) => string);
  /** Message on error (can be function that receives error) */
  error: string | ((error: Error) => string);
  /** Additional toast options */
  options?: Partial<IToastOptions>;
}

/**
 * useToast return type
 */
export interface IUseToastReturn {
  /** Show toast with full options */
  show: (options: IToastOptions) => string;
  /** Show success toast */
  success: (message: string, options?: Partial<IToastOptions>) => string;
  /** Show error toast */
  error: (message: string, options?: Partial<IToastOptions>) => string;
  /** Show warning toast */
  warning: (message: string, options?: Partial<IToastOptions>) => string;
  /** Show info toast */
  info: (message: string, options?: Partial<IToastOptions>) => string;
  /** Show loading toast */
  loading: (message: string, options?: Partial<IToastOptions>) => string;
  /** Dismiss specific toast by ID */
  dismiss: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
  /** Update existing toast options */
  update: (id: string, options: Partial<IToastOptions>) => void;
  /** Promise-based toast (shows loading, then success/error) */
  promise: <T>(
    promise: Promise<T>,
    options: IToastPromiseOptions<T>
  ) => Promise<T>;
}

/**
 * useToast hook
 *
 * Provides methods to show, dismiss, and update toast notifications.
 * Must be used within FeedbackProvider.
 *
 * @returns Toast methods
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleSuccess = () => {
 *     toast.success('Operation completed!');
 *   };
 *
 *   const handleError = () => {
 *     toast.error('Something went wrong');
 *   };
 *
 *   const handlePromise = async () => {
 *     await toast.promise(saveData(), {
 *       loading: 'Saving...',
 *       success: 'Saved!',
 *       error: (err) => `Failed: ${err.message}`,
 *     });
 *   };
 *
 *   return <button onClick={handleSuccess}>Show Toast</button>;
 * }
 * ```
 */
export function useToast(): IUseToastReturn {
  const { manager } = useFeedbackContext();

  /**
   * Show toast with full options
   */
  const show = useCallback(
    (options: IToastOptions): string => {
      return manager.add('toast', options);
    },
    [manager]
  );

  /**
   * Show success toast
   */
  const success = useCallback(
    (message: string, options?: Partial<IToastOptions>): string =>
      show({ message, variant: 'success', ...options }),
    [show]
  );

  /**
   * Show error toast
   */
  const error = useCallback(
    (message: string, options?: Partial<IToastOptions>): string =>
      show({ message, variant: 'error', ...options }),
    [show]
  );

  /**
   * Show warning toast
   */
  const warning = useCallback(
    (message: string, options?: Partial<IToastOptions>): string =>
      show({ message, variant: 'warning', ...options }),
    [show]
  );

  /**
   * Show info toast
   */
  const info = useCallback(
    (message: string, options?: Partial<IToastOptions>): string =>
      show({ message, variant: 'info', ...options }),
    [show]
  );

  /**
   * Show loading toast (no auto-dismiss)
   */
  const loading = useCallback(
    (message: string, options?: Partial<IToastOptions>): string =>
      show({
        message,
        variant: 'default',
        duration: 0,
        dismissible: false,
        icon: undefined, // Will use loading icon
        ...options,
      }),
    [show]
  );

  /**
   * Dismiss specific toast
   */
  const dismiss = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  /**
   * Dismiss all toasts
   */
  const dismissAll = useCallback((): void => {
    manager.removeAll('toast');
  }, [manager]);

  /**
   * Update existing toast
   */
  const update = useCallback(
    (id: string, options: Partial<IToastOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  /**
   * Promise-based toast
   * Shows loading toast, then success or error based on promise result
   */
  const promiseToast = useCallback(
    async <T>(
      promiseToResolve: Promise<T>,
      options: IToastPromiseOptions<T>
    ): Promise<T> => {
      const loadingId = show({
        message: options.loading,
        variant: 'default',
        duration: 0,
        dismissible: false,
        ...options.options,
      });

      try {
        const result = await promiseToResolve;
        dismiss(loadingId);

        const successMessage =
          typeof options.success === 'function'
            ? options.success(result)
            : options.success;

        success(successMessage, options.options);
        return result;
      } catch (err) {
        dismiss(loadingId);

        const errorMessage =
          typeof options.error === 'function'
            ? options.error(err as Error)
            : options.error;

        error(errorMessage, options.options);
        throw err;
      }
    },
    [show, dismiss, success, error]
  );

  return {
    show,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
    update,
    promise: promiseToast,
  };
}
