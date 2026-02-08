/**
 * Core module exports
 * Contains the core feedback management logic that is UI-library agnostic
 */

// Type definitions
export * from './types';

// FeedbackManager singleton
export { FeedbackManager, getFeedbackManager } from './FeedbackManager';

// Zustand store
export { useFeedbackStore } from './FeedbackStore';

// Priority queue for feedback items
export { FeedbackQueue } from './FeedbackQueue';

// Event bus for pub/sub communication
export { EventBus } from './EventBus';
