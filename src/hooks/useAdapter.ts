/**
 * useAdapter hook
 * Provides access to the active UI library adapter from context
 */

import { useContext } from 'react';
import { FeedbackContext } from '../providers/FeedbackContext';
import type { IFeedbackAdapter } from '../adapters/types';

/**
 * Return type for useAdapter hook
 */
export interface IUseAdapterReturn {
  /** Active adapter instance (null when using built-in components) */
  adapter: IFeedbackAdapter | null;
  /** Whether an adapter is currently active */
  hasAdapter: boolean;
}

/**
 * Hook to access the active UI library adapter
 *
 * Returns the adapter from FeedbackProvider context.
 * When no adapter is configured or when used outside FeedbackProvider,
 * returns null (built-in components are used).
 *
 * Unlike useFeedbackContext(), this hook does NOT throw when used
 * outside FeedbackProvider — it gracefully falls back to null.
 * This allows container components to work both with and without
 * the provider (e.g., in tests or standalone usage).
 *
 * @returns Adapter access object
 *
 * @example
 * ```tsx
 * function MyContainer() {
 *   const { adapter, hasAdapter } = useAdapter();
 *
 *   if (hasAdapter) {
 *     const ToastComp = adapter!.ToastComponent;
 *     return <ToastComp {...mappedProps} />;
 *   }
 *
 *   return <DefaultToast {...props} />;
 * }
 * ```
 */
export function useAdapter(): IUseAdapterReturn {
  const context = useContext(FeedbackContext);

  return {
    adapter: context?.adapter ?? null,
    hasAdapter: context?.adapter !== null && context?.adapter !== undefined,
  };
}
