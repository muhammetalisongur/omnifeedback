/**
 * Chakra UI adapter exports
 * Provides integration with Chakra UI components
 *
 * This adapter follows the Chakra UI design system patterns and styling conventions.
 */

import type { IFeedbackAdapter } from '../types';

// Component imports
import { ChakraToast } from './ChakraToast';
import { ChakraToastContainer } from './ChakraToastContainer';
import { ChakraModal } from './ChakraModal';
import { ChakraLoading } from './ChakraLoading';
import { ChakraAlert } from './ChakraAlert';
import { ChakraProgress } from './ChakraProgress';
import { ChakraConfirm } from './ChakraConfirm';
import { ChakraBanner } from './ChakraBanner';
import { ChakraDrawer } from './ChakraDrawer';
import { ChakraPopconfirm } from './ChakraPopconfirm';
import { ChakraSkeleton } from './ChakraSkeleton';
import { ChakraResult } from './ChakraResult';
import { ChakraPrompt } from './ChakraPrompt';
import { ChakraSheet } from './ChakraSheet';
import { ChakraActionSheet } from './ChakraActionSheet';
import { ChakraConnection } from './ChakraConnection';

/**
 * Styles injection flag to prevent multiple injections
 */
let stylesInjected = false;

/**
 * Chakra UI adapter implementation
 * Follows Chakra UI design patterns with custom CSS classes
 */
export const chakraAdapter: IFeedbackAdapter = {
  name: 'chakra',
  version: '1.0.0',

  // Notification Components
  ToastComponent: ChakraToast,
  ToastContainerComponent: ChakraToastContainer,
  BannerComponent: ChakraBanner,

  // Dialog Components
  ModalComponent: ChakraModal,
  ConfirmComponent: ChakraConfirm,
  PromptComponent: ChakraPrompt,
  DrawerComponent: ChakraDrawer,
  PopconfirmComponent: ChakraPopconfirm,

  // Sheet Components
  SheetComponent: ChakraSheet,
  ActionSheetComponent: ChakraActionSheet,

  // Feedback Components
  AlertComponent: ChakraAlert,
  LoadingComponent: ChakraLoading,
  ProgressComponent: ChakraProgress,
  SkeletonComponent: ChakraSkeleton,
  ResultComponent: ChakraResult,

  // Status Components
  ConnectionComponent: ChakraConnection,

  // Utility Functions
  isDarkMode: () => {
    if (typeof document === 'undefined') return false;
    return (
      document.documentElement.classList.contains('chakra-ui-dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.classList.contains('chakra-ui-dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  },

  injectStyles: () => {
    if (stylesInjected || typeof document === 'undefined') return;

    const styleId = 'omnifeedback-chakra-styles';
    if (document.getElementById(styleId)) {
      stylesInjected = true;
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Chakra UI Progress indeterminate animation */
      @keyframes chakra-progress-indeterminate {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }

      .chakra-progress-indeterminate {
        animation: chakra-progress-indeterminate 1.5s ease-in-out infinite;
      }

      /* Chakra UI Skeleton wave animation */
      @keyframes chakra-skeleton-wave {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .chakra-skeleton-wave {
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: chakra-skeleton-wave 1.5s ease-in-out infinite;
      }

      /* Chakra UI Modal/Drawer overlay z-index */
      .chakra-modal-overlay {
        z-index: 1400;
      }

      /* Chakra UI focus visible styles */
      .chakra-btn:focus-visible,
      .chakra-input:focus-visible {
        outline: 2px solid #3182ce;
        outline-offset: 2px;
      }

      /* Chakra UI spinner animation */
      .chakra-spinner {
        animation: spin 0.65s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    stylesInjected = true;
  },

  animations: {
    enter: 'chakra-slide-in',
    exit: 'chakra-slide-out',
    duration: 150,
  },
};

// Default export
export default chakraAdapter;

// Re-export individual components for customization
export { ChakraToast } from './ChakraToast';
export { ChakraToastContainer } from './ChakraToastContainer';
export { ChakraModal } from './ChakraModal';
export { ChakraLoading } from './ChakraLoading';
export { ChakraAlert } from './ChakraAlert';
export { ChakraProgress } from './ChakraProgress';
export { ChakraConfirm } from './ChakraConfirm';
export { ChakraBanner } from './ChakraBanner';
export { ChakraDrawer } from './ChakraDrawer';
export { ChakraPopconfirm } from './ChakraPopconfirm';
export { ChakraSkeleton } from './ChakraSkeleton';
export { ChakraResult } from './ChakraResult';
export { ChakraPrompt } from './ChakraPrompt';
export { ChakraSheet } from './ChakraSheet';
export { ChakraActionSheet } from './ChakraActionSheet';
export { ChakraConnection } from './ChakraConnection';

// Export version for compatibility checks
export const CHAKRA_ADAPTER_VERSION = '1.0.0';
