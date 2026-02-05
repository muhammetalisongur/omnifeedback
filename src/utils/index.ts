/**
 * Utilities module exports
 * Contains helper functions used across the library
 */

// ID generation
export { generateId, resetIdCounter, getIdCounter } from './generateId';

// CSS class name utilities
export { cn, classNames } from './cn';

// Constants (z-index, durations, etc.)
export * from './constants';

// Positioning utilities
export * from './positioning';

// Version
export const UTILS_VERSION = '0.1.0';
