/**
 * Mantine adapter exports
 * Provides integration with Mantine UI components and design system
 *
 * This adapter uses Mantine CSS variables for consistent theming.
 */

import type { IFeedbackAdapter } from '../types';

// Component imports
import { MantineToast } from './MantineToast';
import { MantineToastContainer } from './MantineToastContainer';
import { MantineModal } from './MantineModal';
import { MantineLoading } from './MantineLoading';
import { MantineAlert } from './MantineAlert';
import { MantineProgress } from './MantineProgress';
import { MantineConfirm } from './MantineConfirm';
import { MantineBanner } from './MantineBanner';
import { MantineDrawer } from './MantineDrawer';
import { MantinePopconfirm } from './MantinePopconfirm';
import { MantineSkeleton } from './MantineSkeleton';
import { MantineResult } from './MantineResult';
import { MantinePrompt } from './MantinePrompt';
import { MantineSheet } from './MantineSheet';
import { MantineActionSheet } from './MantineActionSheet';
import { MantineConnection } from './MantineConnection';

/**
 * Styles injection flag to prevent multiple injections
 */
let stylesInjected = false;

/**
 * Mantine adapter version
 */
export const MANTINE_ADAPTER_VERSION = '1.0.0';

/**
 * Mantine adapter implementation
 * Uses Mantine CSS variables for theming
 */
export const mantineAdapter: IFeedbackAdapter = {
  name: 'mantine',
  version: MANTINE_ADAPTER_VERSION,

  // Notification Components
  ToastComponent: MantineToast,
  ToastContainerComponent: MantineToastContainer,
  BannerComponent: MantineBanner,

  // Dialog Components
  ModalComponent: MantineModal,
  ConfirmComponent: MantineConfirm,
  PromptComponent: MantinePrompt,
  DrawerComponent: MantineDrawer,
  PopconfirmComponent: MantinePopconfirm,

  // Sheet Components
  SheetComponent: MantineSheet,
  ActionSheetComponent: MantineActionSheet,

  // Feedback Components
  AlertComponent: MantineAlert,
  LoadingComponent: MantineLoading,
  ProgressComponent: MantineProgress,
  SkeletonComponent: MantineSkeleton,
  ResultComponent: MantineResult,

  // Status Components
  ConnectionComponent: MantineConnection,

  // Utility Functions
  isDarkMode: () => {
    if (typeof document === 'undefined') {return false;}
    return (
      document.documentElement.getAttribute('data-mantine-color-scheme') === 'dark' ||
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  },

  injectStyles: () => {
    if (stylesInjected || typeof document === 'undefined') {return;}

    const styleId = 'omnifeedback-mantine-styles';
    if (document.getElementById(styleId)) {
      stylesInjected = true;
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Indeterminate progress animation */
      @keyframes indeterminate {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }

      /* Shimmer animation for skeletons */
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .animate-indeterminate {
        animation: indeterminate 1.5s ease-in-out infinite;
      }

      .animate-shimmer {
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.2) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
      }

      /* Mantine CSS variable fallbacks */
      :root {
        --mantine-z-index-app: 100;
        --mantine-z-index-modal: 200;
        --mantine-z-index-popover: 300;
        --mantine-z-index-overlay: 400;
      }
    `;
    document.head.appendChild(style);
    stylesInjected = true;
  },

  animations: {
    enter: 'animate-slide-in-right',
    exit: 'animate-slide-out-right',
    duration: 200,
  },
};

// Default export
export default mantineAdapter;

// Re-export individual components for customization
export { MantineToast } from './MantineToast';
export { MantineToastContainer } from './MantineToastContainer';
export { MantineModal } from './MantineModal';
export { MantineLoading } from './MantineLoading';
export { MantineAlert } from './MantineAlert';
export { MantineProgress } from './MantineProgress';
export { MantineConfirm } from './MantineConfirm';
export { MantineBanner } from './MantineBanner';
export { MantineDrawer } from './MantineDrawer';
export { MantinePopconfirm } from './MantinePopconfirm';
export { MantineSkeleton } from './MantineSkeleton';
export { MantineResult } from './MantineResult';
export { MantinePrompt } from './MantinePrompt';
export { MantineSheet } from './MantineSheet';
export { MantineActionSheet } from './MantineActionSheet';
export { MantineConnection } from './MantineConnection';
