/**
 * Adapter type definitions
 * Defines the interface that all UI library adapters must implement
 *
 * Adapters provide component implementations for different UI libraries.
 * Each adapter must implement all 16 feedback components.
 */

import type { ComponentType, ReactNode, CSSProperties } from 'react';
import type { FeedbackStatus } from '../core/types';

// =============================================================================
// Base Types
// =============================================================================

/**
 * Base props shared across all adapter components
 */
export interface IAdapterBaseProps {
  /** Current feedback status for animation control */
  status: FeedbackStatus;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Feedback variant types
 */
export type FeedbackVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

/**
 * Size variants
 */
export type SizeVariant = 'sm' | 'md' | 'lg';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

// =============================================================================
// Toast Adapter Types
// =============================================================================

/**
 * Toast adapter component props
 */
export interface IAdapterToastProps extends IAdapterBaseProps {
  /** Toast message content */
  message: ReactNode;
  /** Toast title */
  title?: string;
  /** Toast variant */
  variant: FeedbackVariant;
  /** Whether dismissible */
  dismissible: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Remove handler (after animation) */
  onRemove?: () => void;
}

/**
 * Toast container adapter props
 */
export interface IAdapterToastContainerProps {
  /** Container position */
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  /** Gap between toasts */
  gap: number;
  /** Toast elements */
  children: ReactNode;
}

// =============================================================================
// Modal Adapter Types
// =============================================================================

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal scroll behavior
 */
export type ModalScrollBehavior = 'inside' | 'outside';

/**
 * Modal adapter component props
 */
export interface IAdapterModalProps extends IAdapterBaseProps {
  /** Modal title */
  title?: ReactNode;
  /** Modal content */
  content: ReactNode;
  /** Modal size */
  size: ModalSize;
  /** Whether closable */
  closable: boolean;
  /** Close on backdrop click */
  closeOnBackdropClick: boolean;
  /** Close on escape key */
  closeOnEscape: boolean;
  /** Custom header */
  header?: ReactNode;
  /** Custom footer */
  footer?: ReactNode;
  /** Center modal vertically */
  centered: boolean;
  /** Scroll behavior */
  scrollBehavior: ModalScrollBehavior;
  /** Close request handler */
  onRequestClose: () => void;
}

// =============================================================================
// Loading Adapter Types
// =============================================================================

/**
 * Loading spinner type
 */
export type SpinnerType = 'default' | 'dots' | 'bars' | 'circle';

/**
 * Loading variant
 */
export type LoadingVariant = 'primary' | 'secondary' | 'white';

/**
 * Loading adapter component props
 */
export interface IAdapterLoadingProps extends IAdapterBaseProps {
  /** Loading message */
  message?: string;
  /** Spinner type */
  spinner: SpinnerType;
  /** Spinner size */
  size: SizeVariant;
  /** Spinner variant */
  variant: LoadingVariant;
  /** Whether fullscreen */
  fullscreen: boolean;
  /** Backdrop opacity */
  backdropOpacity: number;
}

// =============================================================================
// Alert Adapter Types
// =============================================================================

/**
 * Alert action button
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
 * Alert adapter component props
 */
export interface IAdapterAlertProps extends IAdapterBaseProps {
  /** Alert message */
  message: ReactNode;
  /** Alert title */
  title?: string;
  /** Alert variant */
  variant: FeedbackVariant;
  /** Whether dismissible */
  dismissible: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** Hide icon */
  hideIcon?: boolean;
  /** Action buttons */
  actions?: IAlertAction[];
  /** Dismiss handler */
  onRequestDismiss?: () => void;
}

// =============================================================================
// Progress Adapter Types
// =============================================================================

/**
 * Progress variant
 */
export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';

/**
 * Progress adapter component props
 */
export interface IAdapterProgressProps extends IAdapterBaseProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max: number;
  /** Progress label */
  label?: string;
  /** Show percentage */
  showPercentage: boolean;
  /** Progress variant */
  variant: ProgressVariant;
  /** Indeterminate mode */
  indeterminate: boolean;
  /** Progress size */
  size: SizeVariant;
}

// =============================================================================
// Confirm Adapter Types
// =============================================================================

/**
 * Confirm button variant
 */
export type ConfirmVariant = 'primary' | 'danger';

/**
 * Confirm adapter component props
 */
export interface IAdapterConfirmProps extends IAdapterBaseProps {
  /** Confirm message */
  message: ReactNode;
  /** Confirm title */
  title: string;
  /** Confirm button text */
  confirmText: string;
  /** Cancel button text */
  cancelText: string;
  /** Confirm button variant */
  confirmVariant: ConfirmVariant;
  /** Custom icon */
  icon?: ReactNode;
  /** Confirm handler */
  onConfirm: () => void | Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
}

// =============================================================================
// Banner Adapter Types
// =============================================================================

/**
 * Banner position
 */
export type BannerPosition = 'top' | 'bottom';

/**
 * Banner adapter component props
 */
export interface IAdapterBannerProps extends IAdapterBaseProps {
  /** Banner message */
  message: ReactNode;
  /** Banner title */
  title?: string;
  /** Banner variant */
  variant: FeedbackVariant;
  /** Banner position */
  position: BannerPosition;
  /** Whether dismissible */
  dismissible: boolean;
  /** Custom icon */
  icon?: ReactNode;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Dismiss handler */
  onDismiss?: () => void;
}

// =============================================================================
// Drawer Adapter Types
// =============================================================================

/**
 * Drawer placement
 */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

/**
 * Drawer size
 */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Drawer adapter component props
 */
export interface IAdapterDrawerProps extends IAdapterBaseProps {
  /** Drawer title */
  title?: ReactNode;
  /** Drawer content */
  content: ReactNode;
  /** Drawer placement */
  placement: DrawerPlacement;
  /** Drawer size */
  size: DrawerSize;
  /** Whether closable */
  closable: boolean;
  /** Close on backdrop click */
  closeOnBackdropClick: boolean;
  /** Close on escape key */
  closeOnEscape: boolean;
  /** Custom header */
  header?: ReactNode;
  /** Custom footer */
  footer?: ReactNode;
  /** Close request handler */
  onRequestClose: () => void;
}

// =============================================================================
// Popconfirm Adapter Types
// =============================================================================

/**
 * Popconfirm placement
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
 * Popconfirm adapter component props
 */
export interface IAdapterPopconfirmProps extends IAdapterBaseProps {
  /** Popconfirm message */
  message: ReactNode;
  /** Popconfirm title */
  title?: string;
  /** Confirm button text */
  confirmText: string;
  /** Cancel button text */
  cancelText: string;
  /** Confirm button variant */
  confirmVariant: ConfirmVariant;
  /** Custom icon */
  icon?: ReactNode;
  /** Placement relative to trigger */
  placement: PopconfirmPlacement;
  /** Trigger element ref */
  triggerRef: React.RefObject<HTMLElement>;
  /** Confirm handler */
  onConfirm: () => void | Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
}

// =============================================================================
// Skeleton Adapter Types
// =============================================================================

/**
 * Skeleton shape
 */
export type SkeletonShape = 'text' | 'circle' | 'rectangle' | 'avatar' | 'button' | 'card';

/**
 * Skeleton adapter component props
 */
export interface IAdapterSkeletonProps extends IAdapterBaseProps {
  /** Skeleton shape */
  shape: SkeletonShape;
  /** Width (CSS value) */
  width?: string | number;
  /** Height (CSS value) */
  height?: string | number;
  /** Number of lines (for text shape) */
  lines?: number;
  /** Enable animation */
  animate: boolean;
  /** Animation type */
  animationType: 'pulse' | 'wave' | 'none';
}

// =============================================================================
// Result Adapter Types
// =============================================================================

/**
 * Result status
 */
export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

/**
 * Result action button
 */
export interface IResultAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: ButtonVariant;
}

/**
 * Result adapter component props
 */
export interface IAdapterResultProps extends IAdapterBaseProps {
  /** Result status */
  resultStatus: ResultStatus;
  /** Result title */
  title: ReactNode;
  /** Result subtitle */
  subtitle?: ReactNode;
  /** Custom icon */
  icon?: ReactNode;
  /** Extra content below subtitle */
  extra?: ReactNode;
  /** Action buttons */
  actions?: IResultAction[];
}

// =============================================================================
// Prompt Adapter Types
// =============================================================================

/**
 * Prompt input type
 */
export type PromptInputType = 'text' | 'textarea' | 'email' | 'number' | 'password' | 'tel' | 'url';

/**
 * Prompt adapter component props
 */
export interface IAdapterPromptProps extends IAdapterBaseProps {
  /** Prompt title */
  title: string;
  /** Prompt message */
  message?: ReactNode;
  /** Input type */
  inputType: PromptInputType;
  /** Input placeholder */
  placeholder?: string;
  /** Default value */
  defaultValue?: string;
  /** Confirm button text */
  confirmText: string;
  /** Cancel button text */
  cancelText: string;
  /** Validation function */
  validate?: (value: string) => string | null | Promise<string | null>;
  /** Current input value */
  value: string;
  /** Value change handler */
  onValueChange: (value: string) => void;
  /** Current error message */
  error?: string;
  /** Confirm handler */
  onConfirm: () => void | Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
}

// =============================================================================
// Sheet Adapter Types
// =============================================================================

/**
 * Sheet adapter component props
 */
export interface IAdapterSheetProps extends IAdapterBaseProps {
  /** Sheet title */
  title?: string;
  /** Sheet content */
  content: ReactNode;
  /** Snap points (percentages) */
  snapPoints: number[];
  /** Default snap point index */
  defaultSnapPoint: number;
  /** Close on backdrop click */
  closeOnBackdropClick: boolean;
  /** Show drag handle */
  showHandle: boolean;
  /** Current snap index */
  currentSnapIndex: number;
  /** Snap change handler */
  onSnapChange?: (index: number) => void;
  /** Close request handler */
  onRequestClose: () => void;
}

/**
 * Action sheet item
 */
export interface IActionSheetItem {
  /** Unique key */
  key: string;
  /** Item label */
  label: ReactNode;
  /** Item icon */
  icon?: ReactNode;
  /** Whether destructive (red) */
  destructive?: boolean;
  /** Whether disabled */
  disabled?: boolean;
}

/**
 * Action sheet adapter component props
 */
export interface IAdapterActionSheetProps extends IAdapterBaseProps {
  /** Sheet title */
  title?: string;
  /** Description text */
  description?: string;
  /** Action items */
  actions: IActionSheetItem[];
  /** Show cancel button */
  showCancel: boolean;
  /** Cancel button text */
  cancelText: string;
  /** Selection handler */
  onSelect: (key: string | null) => void;
}

// =============================================================================
// Connection Adapter Types
// =============================================================================

/**
 * Connection status indicator adapter props
 */
export interface IAdapterConnectionProps extends IAdapterBaseProps {
  /** Whether online */
  isOnline: boolean;
  /** Offline message */
  offlineMessage: string;
  /** Online message */
  onlineMessage: string;
  /** Show indicator */
  showIndicator: boolean;
}

// =============================================================================
// Adapter Animation Config
// =============================================================================

/**
 * Animation configuration for adapter
 */
export interface IAdapterAnimations {
  /** Enter animation class */
  enter: string;
  /** Exit animation class */
  exit: string;
  /** Animation duration in ms */
  duration: number;
}

// =============================================================================
// Complete Adapter Interface
// =============================================================================

/**
 * Complete feedback adapter interface
 *
 * Each UI library adapter must implement all component types.
 * Components receive standardized props and render using their library's components.
 *
 * @example
 * ```typescript
 * const myAdapter: IFeedbackAdapter = {
 *   name: 'my-adapter',
 *   version: '1.0.0',
 *   ToastComponent: MyToast,
 *   ToastContainerComponent: MyToastContainer,
 *   // ... other components
 * };
 * ```
 */
export interface IFeedbackAdapter {
  /** Adapter name for identification */
  name: string;

  /** Adapter version */
  version: string;

  // -------------------------------------------------------------------------
  // Notification Components
  // -------------------------------------------------------------------------

  /** Toast notification component */
  ToastComponent: ComponentType<IAdapterToastProps>;

  /** Toast container component */
  ToastContainerComponent: ComponentType<IAdapterToastContainerProps>;

  /** Banner notification component */
  BannerComponent: ComponentType<IAdapterBannerProps>;

  // -------------------------------------------------------------------------
  // Dialog Components
  // -------------------------------------------------------------------------

  /** Modal dialog component */
  ModalComponent: ComponentType<IAdapterModalProps>;

  /** Confirm dialog component */
  ConfirmComponent: ComponentType<IAdapterConfirmProps>;

  /** Prompt dialog component */
  PromptComponent: ComponentType<IAdapterPromptProps>;

  /** Drawer panel component */
  DrawerComponent: ComponentType<IAdapterDrawerProps>;

  /** Popconfirm component */
  PopconfirmComponent: ComponentType<IAdapterPopconfirmProps>;

  // -------------------------------------------------------------------------
  // Sheet Components
  // -------------------------------------------------------------------------

  /** Bottom sheet component */
  SheetComponent: ComponentType<IAdapterSheetProps>;

  /** Action sheet component */
  ActionSheetComponent: ComponentType<IAdapterActionSheetProps>;

  // -------------------------------------------------------------------------
  // Feedback Components
  // -------------------------------------------------------------------------

  /** Alert component */
  AlertComponent: ComponentType<IAdapterAlertProps>;

  /** Loading indicator component */
  LoadingComponent: ComponentType<IAdapterLoadingProps>;

  /** Progress indicator component */
  ProgressComponent: ComponentType<IAdapterProgressProps>;

  /** Skeleton loader component */
  SkeletonComponent: ComponentType<IAdapterSkeletonProps>;

  /** Result page component */
  ResultComponent: ComponentType<IAdapterResultProps>;

  // -------------------------------------------------------------------------
  // Status Components
  // -------------------------------------------------------------------------

  /** Connection status component */
  ConnectionComponent: ComponentType<IAdapterConnectionProps>;

  // -------------------------------------------------------------------------
  // Utility Functions
  // -------------------------------------------------------------------------

  /**
   * Check if dark mode is active
   * @returns Whether dark mode is enabled
   */
  isDarkMode: () => boolean;

  /**
   * Inject required styles into document
   * Called once when adapter is initialized
   */
  injectStyles: () => void;

  /**
   * Animation configuration
   */
  animations: IAdapterAnimations;
}

// =============================================================================
// Adapter Factory Types
// =============================================================================

/**
 * Adapter configuration options
 */
export interface IAdapterConfig {
  /** Custom CSS prefix */
  cssPrefix?: string;
  /** Enable dark mode detection */
  detectDarkMode?: boolean;
  /** Custom animations */
  animations?: Partial<IAdapterAnimations>;
}

/**
 * Adapter factory function type
 */
export type AdapterFactory = (config?: IAdapterConfig) => IFeedbackAdapter;

// =============================================================================
// Re-exports for convenience
// =============================================================================

export type {
  FeedbackStatus,
} from '../core/types';
