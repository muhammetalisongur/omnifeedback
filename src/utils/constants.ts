/**
 * Global constants for OmniFeedback
 * Centralized values for z-index, durations, and other settings
 */

/**
 * Z-index constants for layering UI elements
 * Uses a consistent scale to prevent conflicts
 */
export const Z_INDEX = {
  /** Base content layer */
  BASE: 0,
  /** Dropdowns and menus */
  DROPDOWN: 1000,
  /** Sticky headers */
  STICKY: 1020,
  /** Fixed elements */
  FIXED: 1030,
  /** Modal backdrop */
  MODAL_BACKDROP: 1040,
  /** Modal content */
  MODAL: 1050,
  /** Popconfirm and popovers */
  POPOVER: 1060,
  /** Tooltips */
  TOOLTIP: 1070,
  /** Toast notifications */
  TOAST: 1080,
  /** Loading overlay */
  LOADING: 1090,
  /** Maximum z-index for critical alerts */
  MAX: 9999,
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
  TOAST_DEFAULT: 5000,
} as const;

/**
 * Default positions
 */
export const POSITIONS = {
  TOAST_DEFAULT: 'top-right',
  MODAL_DEFAULT: 'center',
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
} as const;

/**
 * Breakpoints for responsive behavior
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

/**
 * CSS variable names for theming
 */
export const CSS_VARS = {
  PRIMARY: '--of-primary',
  SUCCESS: '--of-success',
  ERROR: '--of-error',
  WARNING: '--of-warning',
  INFO: '--of-info',
  BACKGROUND: '--of-background',
  FOREGROUND: '--of-foreground',
  BORDER: '--of-border',
  RING: '--of-ring',
} as const;
