/**
 * Toast component exports
 * Provides toast/notification feedback functionality
 */

// Toast component
export { Toast } from './Toast';
export type { IToastProps } from './Toast';

// Toast container for rendering toasts
export { ToastContainer } from './ToastContainer';
export type { IToastContainerProps } from './ToastContainer';

// Toast icons
export {
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
  CloseIcon,
  LoadingIcon,
} from './icons';

// Version
export const TOAST_VERSION = '0.1.0';
