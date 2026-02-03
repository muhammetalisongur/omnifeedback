/**
 * Core type definitions for OmniFeedback
 * Contains all TypeScript types, interfaces, and type utilities
 * @packageDocumentation
 */

import type { CSSProperties, ReactNode } from 'react';

// ==================== FEEDBACK TYPES ====================

/**
 * Available feedback component types
 */
export type FeedbackType =
  | 'toast'
  | 'modal'
  | 'loading'
  | 'alert'
  | 'progress'
  | 'confirm'
  | 'banner'
  | 'drawer'
  | 'popconfirm'
  | 'skeleton'
  | 'empty'
  | 'result'
  | 'connection'
  | 'prompt'
  | 'sheet';

/**
 * Visual variant for feedback components
 */
export type FeedbackVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default';

/**
 * Lifecycle status of a feedback item
 */
export type FeedbackStatus =
  | 'pending'   // Waiting to be shown
  | 'entering'  // Enter animation in progress
  | 'visible'   // Fully visible
  | 'exiting'   // Exit animation in progress
  | 'removed';  // Removed from DOM

/**
 * Toast position on screen
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Drawer position
 */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Spinner animation type
 */
export type SpinnerType = 'default' | 'dots' | 'bars' | 'ring' | 'pulse';

/**
 * Button variant for actions
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

// ==================== BASE OPTIONS ====================

/**
 * Base options shared by all feedback types
 */
export interface IBaseFeedbackOptions {
  /** Unique ID - auto-generated if not provided */
  id?: string;
  /** Priority level (higher = more important) */
  priority?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Data attributes */
  data?: Record<string, string>;
  /** Test ID for testing */
  testId?: string;
}

// ==================== TOAST OPTIONS ====================

/**
 * Action button configuration for toast
 */
export interface IToastAction {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
}

/**
 * Options for toast notifications
 */
export interface IToastOptions extends IBaseFeedbackOptions {
  /** Toast message (required) */
  message: string;
  /** Optional title */
  title?: string;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Duration in ms (0 = infinite) */
  duration?: number;
  /** Screen position */
  position?: ToastPosition;
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** Action button */
  action?: IToastAction;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Callback when shown */
  onShow?: () => void;

  // ===== COUNTDOWN PROGRESS BAR =====
  /** Show countdown progress bar */
  showProgress?: boolean;
  /** Progress bar position */
  progressPosition?: 'top' | 'bottom';
  /** Custom progress bar color (defaults to variant color) */
  progressColor?: string;
  /** Pause countdown on hover */
  pauseOnHover?: boolean;
  /** Pause countdown when window loses focus */
  pauseOnFocusLoss?: boolean;
}

// ==================== MODAL OPTIONS ====================

/**
 * Options for modal dialogs
 */
export interface IModalOptions extends IBaseFeedbackOptions {
  /** Modal title */
  title?: ReactNode;
  /** Modal content (required) */
  content: ReactNode;
  /** Modal size */
  size?: ModalSize;
  /** Show close button */
  closable?: boolean;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on ESC key */
  closeOnEscape?: boolean;
  /** Footer content */
  footer?: ReactNode;
  /** Custom header */
  header?: ReactNode;
  /** Callback when closed */
  onClose?: () => void;
  /** Callback when opened */
  onOpen?: () => void;
  /** Prevent body scroll when open */
  preventScroll?: boolean;
  /** Initial focus element selector */
  initialFocus?: string;
  /** Return focus to trigger element on close */
  returnFocus?: boolean;
  /** Center modal vertically */
  centered?: boolean;
  /** Scroll behavior */
  scrollBehavior?: 'inside' | 'outside';
}

// ==================== LOADING OPTIONS ====================

/**
 * Loading indicator size
 */
export type LoadingSize = 'sm' | 'md' | 'lg';

/**
 * Loading color variant
 */
export type LoadingVariant = 'primary' | 'secondary' | 'white';

/**
 * Options for loading indicators
 */
export interface ILoadingOptions extends IBaseFeedbackOptions {
  /** Loading message */
  message?: string;
  /** Spinner type */
  spinner?: SpinnerType;
  /** Full screen overlay */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Blur background */
  blur?: boolean;
  /** Blur amount (CSS value) */
  blurAmount?: string;
  /** Can be cancelled */
  cancellable?: boolean;
  /** Cancel callback */
  onCancel?: () => void;
  /** Cancel button text */
  cancelText?: string;
  /** Size of spinner */
  size?: LoadingSize;
  /** Color variant */
  variant?: LoadingVariant;
}

// ==================== ALERT OPTIONS ====================

/**
 * Action button for alerts
 */
export interface IAlertAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: ButtonVariant;
}

/**
 * Options for alert messages
 */
export interface IAlertOptions extends IBaseFeedbackOptions {
  /** Alert message (required) */
  message: string;
  /** Alert title */
  title?: string;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** Auto dismiss duration (0 = never) */
  duration?: number;
  /** Action buttons */
  actions?: IAlertAction[];
  /** Callback when dismissed */
  onDismiss?: () => void;
}

// ==================== PROGRESS OPTIONS ====================

/**
 * Options for progress indicators
 */
export interface IProgressOptions extends IBaseFeedbackOptions {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Progress label */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Indeterminate mode */
  indeterminate?: boolean;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Callback when complete */
  onComplete?: () => void;
}

// ==================== CONFIRM OPTIONS ====================

/**
 * Options for confirmation dialogs
 */
export interface IConfirmOptions extends IBaseFeedbackOptions {
  /** Confirm message (required) */
  message: string;
  /** Dialog title */
  title?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button style */
  confirmVariant?: 'primary' | 'danger';
  /** Loading state on confirm */
  confirmLoading?: boolean;
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
}

// ==================== BANNER OPTIONS ====================

/**
 * Options for banner announcements
 */
export interface IBannerOptions extends IBaseFeedbackOptions {
  /** Banner message (required) */
  message: string;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Show close button */
  dismissible?: boolean;
  /** Banner position */
  position?: 'top' | 'bottom';
  /** Custom icon */
  icon?: ReactNode;
  /** Action button */
  action?: IToastAction;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

// ==================== DRAWER OPTIONS ====================

/**
 * Options for drawer/side panels
 */
export interface IDrawerOptions extends IBaseFeedbackOptions {
  /** Drawer title */
  title?: ReactNode;
  /** Drawer content (required) */
  content: ReactNode;
  /** Drawer position */
  position?: DrawerPosition;
  /** Drawer width/height */
  size?: string | number;
  /** Show close button */
  closable?: boolean;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on ESC key */
  closeOnEscape?: boolean;
  /** Footer content */
  footer?: ReactNode;
  /** Callback when closed */
  onClose?: () => void;
  /** Prevent body scroll */
  preventScroll?: boolean;
}

// ==================== PROMPT OPTIONS ====================

/**
 * Options for prompt dialogs
 */
export interface IPromptOptions extends IBaseFeedbackOptions {
  /** Prompt message (required) */
  message: string;
  /** Dialog title */
  title?: string;
  /** Default input value */
  defaultValue?: string;
  /** Input placeholder */
  placeholder?: string;
  /** Input type */
  inputType?: 'text' | 'password' | 'email' | 'number' | 'textarea';
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Callback when confirmed */
  onConfirm: (value: string) => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Input validation */
  validate?: (value: string) => string | null;
}

// ==================== SHEET OPTIONS ====================

/**
 * Options for bottom sheets
 */
export interface ISheetOptions extends IBaseFeedbackOptions {
  /** Sheet content (required) */
  content: ReactNode;
  /** Sheet title */
  title?: ReactNode;
  /** Snap points (percentages) */
  snapPoints?: number[];
  /** Default snap point index */
  defaultSnapPoint?: number;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Show drag handle */
  showHandle?: boolean;
  /** Callback when closed */
  onClose?: () => void;
}

// ==================== FEEDBACK ITEM ====================

/**
 * Map of feedback types to their options
 */
export interface FeedbackOptionsMap {
  toast: IToastOptions;
  modal: IModalOptions;
  loading: ILoadingOptions;
  alert: IAlertOptions;
  progress: IProgressOptions;
  confirm: IConfirmOptions;
  banner: IBannerOptions;
  drawer: IDrawerOptions;
  popconfirm: IConfirmOptions;
  skeleton: IBaseFeedbackOptions;
  empty: IBaseFeedbackOptions;
  result: IBaseFeedbackOptions;
  connection: IBaseFeedbackOptions;
  prompt: IPromptOptions;
  sheet: ISheetOptions;
}

/**
 * A feedback item in the store
 */
export interface IFeedbackItem<T extends FeedbackType = FeedbackType> {
  /** Unique identifier */
  id: string;
  /** Feedback type */
  type: T;
  /** Current status */
  status: FeedbackStatus;
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Type-specific options */
  options: FeedbackOptionsMap[T];
}

// ==================== CONFIGURATION ====================

/**
 * Queue configuration
 */
export interface IQueueConfig {
  /** Maximum queue size */
  maxSize: number;
  /** Overflow strategy */
  strategy: 'fifo' | 'priority' | 'reject';
}

/**
 * Global feedback configuration
 */
export interface IFeedbackConfig {
  /** Default toast duration (ms) */
  defaultDuration: number;
  /** Exit animation duration (ms) */
  exitAnimationDuration: number;
  /** Enter animation duration (ms) */
  enterAnimationDuration: number;
  /** Max visible items per type */
  maxVisible: Partial<Record<FeedbackType, number>>;
  /** Default toast position */
  defaultPosition: ToastPosition;
  /** Enable animations */
  enableAnimations: boolean;
  /** RTL support */
  rtl: boolean;
  /** Queue config */
  queue: IQueueConfig;
}

// ==================== EVENTS ====================

/**
 * Event payloads for feedback system events
 */
export interface IFeedbackEvents {
  'feedback:added': IFeedbackItem;
  'feedback:updated': { id: string; updates: Partial<IFeedbackItem> };
  'feedback:statusChanged': { id: string; from: FeedbackStatus; to: FeedbackStatus };
  'feedback:removed': IFeedbackItem;
  'feedback:cleared': { type?: FeedbackType | undefined };
  'queue:overflow': { rejected: IFeedbackItem };
}

// ==================== MANAGER INTERFACE ====================

/**
 * Interface for the FeedbackManager
 */
export interface IFeedbackManager {
  /** Add feedback item */
  add<T extends FeedbackType>(type: T, options: FeedbackOptionsMap[T]): string;

  /** Remove feedback item */
  remove(id: string): void;

  /** Remove all items (optionally by type) */
  removeAll(type?: FeedbackType): void;

  /** Update feedback item */
  update<T extends FeedbackType>(id: string, updates: Partial<FeedbackOptionsMap[T]>): void;

  /** Update item status */
  updateStatus(id: string, status: FeedbackStatus): void;

  /** Get item by ID */
  get(id: string): IFeedbackItem | undefined;

  /** Get all items */
  getAll(): IFeedbackItem[];

  /** Get items by type */
  getByType<T extends FeedbackType>(type: T): IFeedbackItem<T>[];

  /** Subscribe to events */
  on<E extends keyof IFeedbackEvents>(
    event: E,
    handler: (payload: IFeedbackEvents[E]) => void
  ): () => void;

  /** Get configuration */
  getConfig(): IFeedbackConfig;

  /** Destroy manager */
  destroy(): void;
}

// ==================== STORE INTERFACE ====================

/**
 * Interface for the Zustand store state
 */
export interface IFeedbackStoreState {
  /** All feedback items */
  items: Map<string, IFeedbackItem>;

  /** Add item to store */
  add: (item: IFeedbackItem) => void;

  /** Remove item from store */
  remove: (id: string) => void;

  /** Update item in store */
  update: (id: string, updates: Partial<IFeedbackItem>) => void;

  /** Clear all items */
  clear: () => void;

  /** Get item by ID */
  get: (id: string) => IFeedbackItem | undefined;

  /** Get all items */
  getAll: () => IFeedbackItem[];

  /** Get items by type */
  getByType: <T extends FeedbackType>(type: T) => IFeedbackItem<T>[];

  /** Get items by status */
  getByStatus: (status: FeedbackStatus) => IFeedbackItem[];
}

// ==================== UTILITY TYPES ====================

/**
 * Extract options type for a specific feedback type
 */
export type OptionsForType<T extends FeedbackType> = FeedbackOptionsMap[T];

/**
 * Make certain properties required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
