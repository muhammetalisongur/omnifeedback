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
 * Toast animation style
 */
export type ToastAnimation =
  | 'slide'   // Position-based slide animation (default)
  | 'fade'    // Fade in/out only
  | 'scale'   // Scale + fade effect
  | 'bounce'  // Bounce animation
  | 'none';   // No animation

/**
 * Toast theme style
 */
export type ToastTheme =
  | 'light'    // White background, variant color only on icon/border
  | 'dark'     // Dark background
  | 'colored'  // Variant-colored background (default)
  | 'auto';    // Auto-detect system preference (resolves to light or dark)

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Drawer position
 */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

/**
 * Drawer size variants
 */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Spinner animation type
 */
export type SpinnerType = 'default' | 'dots' | 'bars' | 'ring' | 'pulse';

/**
 * Button variant for actions
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';

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

  // ===== ANIMATION =====
  /** Animation style (default: 'slide') */
  animation?: ToastAnimation;

  // ===== STYLING =====
  /** Show left border with variant color */
  showLeftBorder?: boolean;
  /** Toast theme style (default: 'colored') */
  theme?: ToastTheme;
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
 * Alert action button variant
 */
export type AlertActionVariant = 'primary' | 'secondary' | 'link';

/**
 * Action button for alerts
 */
export interface IAlertAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: AlertActionVariant;
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
  /** Hide default icon */
  hideIcon?: boolean;
  /** Auto dismiss duration (0 = never) */
  duration?: number;
  /** Action buttons */
  actions?: IAlertAction[];
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Show border */
  bordered?: boolean;
  /** Use filled background style */
  filled?: boolean;
}

// ==================== PROGRESS OPTIONS ====================

/**
 * Progress indicator type
 */
export type ProgressType = 'linear' | 'circular';

/**
 * Progress size variants
 */
export type ProgressSize = 'sm' | 'md' | 'lg';

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
  size?: ProgressSize;
  /** Progress type (linear or circular) */
  type?: ProgressType;
  /** Enable animation */
  animated?: boolean;
  /** Show striped pattern (linear only) */
  striped?: boolean;
  /** Custom color (overrides variant) */
  color?: string;
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
  /** Custom icon */
  icon?: ReactNode;
}

// ==================== POPCONFIRM OPTIONS ====================

/**
 * Popconfirm placement options
 */
export type PopconfirmPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Options for popconfirm dialogs
 */
export interface IPopconfirmOptions extends IBaseFeedbackOptions {
  /** Target element to attach to */
  target: HTMLElement | React.RefObject<HTMLElement>;
  /** Confirmation message */
  message: string;
  /** Title (optional) */
  title?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'danger';
  /** Placement relative to target */
  placement?: PopconfirmPlacement;
  /** Custom icon */
  icon?: ReactNode;
  /** Show arrow pointing to target */
  showArrow?: boolean;
  /** Offset from target (pixels) */
  offset?: number;
  /** Close when clicking outside */
  closeOnClickOutside?: boolean;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel?: () => void;
}

// ==================== BANNER OPTIONS ====================

/**
 * Banner visual variant
 */
export type BannerVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'announcement';

/**
 * Banner action button
 */
export interface IBannerAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'link';
}

/**
 * Options for banner announcements
 */
export interface IBannerOptions extends IBaseFeedbackOptions {
  /** Banner message (required) */
  message: string;
  /** Banner title */
  title?: string;
  /** Visual variant */
  variant?: BannerVariant;
  /** Banner position */
  position?: 'top' | 'bottom';
  /** Sticky positioning */
  sticky?: boolean;
  /** Show close button */
  dismissible?: boolean;
  /** Remember dismiss in localStorage (key name) */
  rememberDismiss?: string;
  /** Custom icon */
  icon?: ReactNode;
  /** Hide default icon */
  hideIcon?: boolean;
  /** Action buttons */
  actions?: IBannerAction[];
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Full width banner */
  fullWidth?: boolean;
  /** Auto dismiss duration (0 = never) */
  duration?: number;
  /** Center content */
  centered?: boolean;
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
  position?: DrawerPlacement;
  /** Drawer size preset */
  size?: DrawerSize;
  /** Custom width/height (overrides size) */
  customSize?: string | number;
  /** Show overlay backdrop */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Close when clicking overlay */
  closeOnOverlayClick?: boolean;
  /** Close when pressing ESC */
  closeOnEscape?: boolean;
  /** Show close button */
  closable?: boolean;
  /** Footer content */
  footer?: ReactNode;
  /** Prevent body scroll */
  preventScroll?: boolean;
  /** Push main content instead of overlay (future feature) */
  push?: boolean;
  /** Callback when closed */
  onClose?: () => void;
  /** Callback when opened */
  onOpen?: () => void;
}

// ==================== SKELETON OPTIONS ====================

/**
 * Skeleton animation type
 */
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

/**
 * Skeleton avatar size presets
 */
export type SkeletonAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Options for skeleton loading indicators
 */
export interface ISkeletonOptions extends IBaseFeedbackOptions {
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Base color */
  baseColor?: string;
  /** Highlight color (for wave animation) */
  highlightColor?: string;
  /** Border radius */
  borderRadius?: string | number;
  /** Animation duration (ms) */
  duration?: number;
}

// ==================== RESULT OPTIONS ====================

/**
 * Result status type
 */
export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

/**
 * Result action button configuration
 */
export interface IResultActionOptions {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to display before label */
  icon?: ReactNode;
}

/**
 * Options for result pages
 */
export interface IResultOptions extends IBaseFeedbackOptions {
  /** Result status */
  status: ResultStatus;
  /** Main title text */
  title: string;
  /** Description or subtitle text */
  description?: string;
  /** Custom icon */
  icon?: ReactNode;
  /** Primary action button */
  primaryAction?: IResultActionOptions;
  /** Secondary action button */
  secondaryAction?: IResultActionOptions;
  /** Extra content */
  extra?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

// ==================== PROMPT OPTIONS ====================

/**
 * Input type for prompt dialogs
 */
export type PromptInputType = 'text' | 'password' | 'email' | 'number' | 'url' | 'tel' | 'textarea';

/**
 * Options for prompt dialogs
 */
export interface IPromptOptions extends IBaseFeedbackOptions {
  /** Dialog title (required) */
  title: string;
  /** Description text below title */
  description?: string;
  /** Input type */
  inputType?: PromptInputType;
  /** Input placeholder */
  placeholder?: string;
  /** Default input value */
  defaultValue?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Input label */
  label?: string;
  /** Validation function - return error string or true if valid */
  validate?: (value: string) => string | true;
  /** Required field */
  required?: boolean;
  /** Minimum length */
  minLength?: number;
  /** Maximum length */
  maxLength?: number;
  /** Pattern validation (regex) */
  pattern?: RegExp;
  /** Custom icon */
  icon?: ReactNode;
  /** Textarea rows (only for textarea type) */
  rows?: number;
  /** Auto-focus input on open */
  autoFocus?: boolean;
  /** Select all text on focus */
  selectOnFocus?: boolean;
  /** Callback when confirmed */
  onConfirm: (value: string) => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
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

// ==================== CONNECTION OPTIONS ====================

/**
 * Connection status type
 */
export type ConnectionStatusType = 'online' | 'offline' | 'reconnecting';

/**
 * Options for connection status monitoring (Provider level)
 */
export interface IConnectionOptions {
  /** Enable connection monitoring */
  enabled?: boolean;
  /** Custom offline message */
  offlineMessage?: string;
  /** Custom online message */
  onlineMessage?: string;
  /** Custom reconnecting message */
  reconnectingMessage?: string;
  /** Banner position */
  position?: 'top' | 'bottom';
  /** Auto-dismiss online banner (ms, 0 = no auto-dismiss) */
  onlineDismissDelay?: number;
  /** Show reconnecting state */
  showReconnecting?: boolean;
  /** Ping URL for connection check */
  pingUrl?: string;
  /** Ping interval when offline (ms) */
  pingInterval?: number;
  /** Maximum queue size for pending actions */
  maxQueueSize?: number;
  /** Callback when going offline */
  onOffline?: () => void;
  /** Callback when coming back online */
  onOnline?: () => void;
  /** Callback when reconnecting */
  onReconnecting?: () => void;
}

/**
 * Options for connection status feedback item
 */
export interface IConnectionStatusOptions extends IBaseFeedbackOptions {
  /** Connection status */
  status: ConnectionStatusType;
  /** Status message */
  message?: string;
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
  popconfirm: IPopconfirmOptions;
  skeleton: ISkeletonOptions;
  empty: IBaseFeedbackOptions;
  result: IResultOptions;
  connection: IConnectionStatusOptions;
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
