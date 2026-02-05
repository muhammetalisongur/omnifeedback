/**
 * Headless/Tailwind adapter exports
 * Provides pure Tailwind CSS implementation without external UI library dependencies
 *
 * This is the default adapter and reference implementation for other adapters.
 */

import type { IFeedbackAdapter } from '../types';

// Component imports
import { HeadlessToast } from './HeadlessToast';
import { HeadlessToastContainer } from './HeadlessToastContainer';
import { HeadlessModal } from './HeadlessModal';
import { HeadlessLoading } from './HeadlessLoading';
import { HeadlessAlert } from './HeadlessAlert';
import { HeadlessProgress } from './HeadlessProgress';
import { HeadlessConfirm } from './HeadlessConfirm';
import { HeadlessBanner } from './HeadlessBanner';
import { HeadlessDrawer } from './HeadlessDrawer';
import { HeadlessPopconfirm } from './HeadlessPopconfirm';
import { HeadlessSkeleton } from './HeadlessSkeleton';
import { HeadlessResult } from './HeadlessResult';
import { HeadlessPrompt } from './HeadlessPrompt';
import { HeadlessSheet } from './HeadlessSheet';
import { HeadlessActionSheet } from './HeadlessActionSheet';
import { HeadlessConnection } from './HeadlessConnection';

/**
 * Headless adapter implementation
 * Pure Tailwind CSS with zero external dependencies
 */
export const headlessAdapter: IFeedbackAdapter = {
  name: 'headless',
  version: '1.0.0',

  // Notification Components
  ToastComponent: HeadlessToast,
  ToastContainerComponent: HeadlessToastContainer,
  BannerComponent: HeadlessBanner,

  // Dialog Components
  ModalComponent: HeadlessModal,
  ConfirmComponent: HeadlessConfirm,
  PromptComponent: HeadlessPrompt,
  DrawerComponent: HeadlessDrawer,
  PopconfirmComponent: HeadlessPopconfirm,

  // Sheet Components
  SheetComponent: HeadlessSheet,
  ActionSheetComponent: HeadlessActionSheet,

  // Feedback Components
  AlertComponent: HeadlessAlert,
  LoadingComponent: HeadlessLoading,
  ProgressComponent: HeadlessProgress,
  SkeletonComponent: HeadlessSkeleton,
  ResultComponent: HeadlessResult,

  // Status Components
  ConnectionComponent: HeadlessConnection,

  // Utility Functions
  isDarkMode: () => {
    if (typeof document === 'undefined') {return false;}
    return (
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  },

  injectStyles: () => {
    if (typeof document === 'undefined') {return;}

    const styleId = 'omnifeedback-headless-styles';
    if (document.getElementById(styleId)) {return;}

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
    `;
    document.head.appendChild(style);
  },

  animations: {
    enter: 'animate-slide-in-right',
    exit: 'animate-slide-out-right',
    duration: 200,
  },
};

// Default export
export default headlessAdapter;

// Re-export individual components for customization
export { HeadlessToast } from './HeadlessToast';
export { HeadlessToastContainer } from './HeadlessToastContainer';
export { HeadlessModal } from './HeadlessModal';
export { HeadlessLoading } from './HeadlessLoading';
export { HeadlessAlert } from './HeadlessAlert';
export { HeadlessProgress } from './HeadlessProgress';
export { HeadlessConfirm } from './HeadlessConfirm';
export { HeadlessBanner } from './HeadlessBanner';
export { HeadlessDrawer } from './HeadlessDrawer';
export { HeadlessPopconfirm } from './HeadlessPopconfirm';
export { HeadlessSkeleton } from './HeadlessSkeleton';
export { HeadlessResult } from './HeadlessResult';
export { HeadlessPrompt } from './HeadlessPrompt';
export { HeadlessSheet } from './HeadlessSheet';
export { HeadlessActionSheet } from './HeadlessActionSheet';
export { HeadlessConnection } from './HeadlessConnection';
