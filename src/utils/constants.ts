/**
 * Global constants for OmniFeedback
 * Centralized values for z-index, durations, and other settings
 */

/**
 * Z-index constants for layering UI elements
 * Uses a consistent scale to prevent conflicts
 */
export const Z_INDEX = {
  /** Modal content */
  MODAL: 1050,
  /** Toast notifications */
  TOAST: 1080,
  /** Loading overlay */
  LOADING: 1090,
} as const;

/**
 * Default animation durations in milliseconds
 */
export const DURATIONS = {
  /** Very fast animations (hover effects) */
  FAST: 100,
  /** Standard transition duration */
  NORMAL: 200,
  /** Slower animations (modals, complex transitions) */
  SLOW: 300,
  /** Enter animation duration */
  ENTER: 200,
  /** Exit animation duration */
  EXIT: 150,
  /** Toast default display duration */
  TOAST_DEFAULT: 4000,
} as const;

/**
 * Default positions
 */
export const POSITIONS = {
  TOAST_DEFAULT: 'top-right',
} as const;

/**
 * Maximum visible items per type
 */
export const MAX_VISIBLE = {
  TOAST: 5,
  MODAL: 1,
  LOADING: 3,
  ALERT: 5,
  PROGRESS: 3,
  CONFIRM: 1,
  BANNER: 1,
  DRAWER: 1,
  POPCONFIRM: 1,
  PROMPT: 1,
  SHEET: 1,
} as const;

/**
 * Default toast container settings
 */
export const TOAST_DEFAULTS = {
  /** Gap between toasts in pixels */
  GAP: 12,
  /** Visible peek per background toast in card-stack mode (px) */
  STACK_PEEK: 10,
  /** Scale reduction per toast in card-stack mode (e.g., 0.05 = 5% per step) */
  STACK_SCALE_STEP: 0.05,
  /** Opacity reduction per toast in card-stack mode */
  STACK_OPACITY_STEP: 0.08,
  /** Fallback height for first render before ref measurement (px) */
  STACK_FALLBACK_HEIGHT: 64,
  /** Default animation type */
  ANIMATION: 'slide' as const,
  /** Default theme */
  THEME: 'colored' as const,
  /** Default progress bar position */
  PROGRESS_POSITION: 'bottom' as const,
} as const;

