/**
 * Adapter type definitions
 * Defines the interface that all UI library adapters must implement
 */

import type { ReactNode } from 'react';

/**
 * Base props shared across all feedback components
 */
export interface IBaseFeedbackProps {
  /** Unique identifier for the feedback item */
  id: string;
  /** Whether the feedback is currently visible */
  visible: boolean;
  /** Callback when the feedback is dismissed */
  onDismiss?: () => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Toast adapter interface
 */
export interface IToastAdapter {
  /** Render a toast notification */
  renderToast: (props: IToastAdapterProps) => ReactNode;
  /** Render the toast container */
  renderContainer: (props: IToastContainerAdapterProps) => ReactNode;
}

export interface IToastAdapterProps extends IBaseFeedbackProps {
  /** Toast message content */
  message: ReactNode;
  /** Toast title (optional) */
  title?: string;
  /** Toast variant type */
  variant: 'success' | 'error' | 'warning' | 'info' | 'default';
  /** Duration in milliseconds (0 = persistent) */
  duration: number;
  /** Whether the toast can be dismissed by user */
  dismissible: boolean;
  /** Custom action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface IToastContainerAdapterProps {
  /** Position of the toast container */
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /** Children (toast elements) */
  children: ReactNode;
}

/**
 * Modal adapter interface
 */
export interface IModalAdapter {
  /** Render a modal dialog */
  renderModal: (props: IModalAdapterProps) => ReactNode;
}

export interface IModalAdapterProps extends IBaseFeedbackProps {
  /** Modal title */
  title?: ReactNode;
  /** Modal content */
  children: ReactNode;
  /** Modal size variant */
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether clicking backdrop closes modal */
  closeOnBackdropClick: boolean;
  /** Whether pressing ESC closes modal */
  closeOnEsc: boolean;
  /** Whether to show close button */
  showCloseButton: boolean;
  /** Footer content */
  footer?: ReactNode;
}

/**
 * Loading adapter interface
 */
export interface ILoadingAdapter {
  /** Render a loading spinner */
  renderLoading: (props: ILoadingAdapterProps) => ReactNode;
  /** Render a loading overlay */
  renderOverlay: (props: ILoadingOverlayAdapterProps) => ReactNode;
}

export interface ILoadingAdapterProps {
  /** Loading spinner size */
  size: 'sm' | 'md' | 'lg';
  /** Loading text */
  text?: string;
  /** Additional CSS class names */
  className?: string;
}

export interface ILoadingOverlayAdapterProps extends IBaseFeedbackProps {
  /** Loading spinner size */
  size: 'sm' | 'md' | 'lg';
  /** Loading text */
  text?: string;
  /** Whether the overlay is fullscreen */
  fullscreen: boolean;
  /** Overlay opacity (0-1) */
  opacity: number;
}

/**
 * Complete adapter interface
 * Each UI library adapter must implement all component adapters
 */
export interface IFeedbackAdapter {
  /** Adapter name for identification */
  name: string;
  /** Toast adapter */
  toast: IToastAdapter;
  /** Modal adapter */
  modal: IModalAdapter;
  /** Loading adapter */
  loading: ILoadingAdapter;
  // Future adapters:
  // alert: IAlertAdapter;
  // progress: IProgressAdapter;
  // confirm: IConfirmAdapter;
  // banner: IBannerAdapter;
  // drawer: IDrawerAdapter;
  // popconfirm: IPopconfirmAdapter;
  // skeleton: ISkeletonAdapter;
  // empty: IEmptyAdapter;
  // result: IResultAdapter;
  // connection: IConnectionAdapter;
  // prompt: IPromptAdapter;
  // sheet: ISheetAdapter;
}
