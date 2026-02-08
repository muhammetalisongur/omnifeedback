/**
 * FeedbackContext - Shared React context for the feedback system
 * Extracted to a separate module to avoid circular dependencies
 * between FeedbackProvider and container components.
 */

import { createContext, useContext } from 'react';
import type { FeedbackManager } from '../core/FeedbackManager';
import type { IFeedbackConfig } from '../core/types';
import type { IFeedbackAdapter } from '../adapters/types';

/**
 * Feedback context value interface
 */
export interface IFeedbackContext {
  /** FeedbackManager instance */
  manager: FeedbackManager;
  /** Current configuration */
  config: IFeedbackConfig;
  /** Active UI library adapter (null = use built-in components) */
  adapter: IFeedbackAdapter | null;
}

/**
 * React context for feedback system
 */
export const FeedbackContext = createContext<IFeedbackContext | null>(null);

/**
 * Hook to access feedback context
 * Throws if used outside FeedbackProvider
 *
 * @returns Feedback context value
 * @throws Error if used outside FeedbackProvider
 */
export function useFeedbackContext(): IFeedbackContext {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error(
      'useFeedbackContext must be used within a FeedbackProvider. ' +
        'Wrap your app with <FeedbackProvider> to use feedback features.'
    );
  }

  return context;
}
