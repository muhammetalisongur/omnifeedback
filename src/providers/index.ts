/**
 * Providers module exports
 * Contains React context providers for feedback management
 */

// Main feedback provider
export {
  FeedbackProvider,
  FeedbackContext,
  useFeedbackContext,
  useFeedbackManager,
} from './FeedbackProvider';
export type { IFeedbackContext, IFeedbackProviderProps } from './FeedbackProvider';
