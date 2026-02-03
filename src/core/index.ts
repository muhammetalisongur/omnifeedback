/**
 * Core module exports
 * Contains the core feedback management logic that is UI-library agnostic
 */

// Type definitions
export * from './types';

// FeedbackManager singleton
export { FeedbackManager, getFeedbackManager } from './FeedbackManager';

// Zustand store and selectors
export {
  useFeedbackStore,
  useToasts,
  useModals,
  useLoadings,
  useAlerts,
  useProgresses,
  useConfirms,
  useVisibleItems,
  useItemCount,
  useItem,
  useHasType,
  useToastsByPosition,
} from './FeedbackStore';

// Priority queue for feedback items
export { FeedbackQueue } from './FeedbackQueue';

// Event bus for pub/sub communication
export { EventBus } from './EventBus';

// Version
export const CORE_VERSION = '0.1.0';
