/**
 * MUI (Material-UI) adapter exports
 * Provides integration with Material Design styled components
 */

import type { IFeedbackAdapter } from '../types';

// Component imports
import { MuiToast } from './MuiToast';
import { MuiToastContainer } from './MuiToastContainer';
import { MuiModal } from './MuiModal';
import { MuiLoading } from './MuiLoading';
import { MuiAlert } from './MuiAlert';
import { MuiProgress } from './MuiProgress';
import { MuiConfirm } from './MuiConfirm';
import { MuiBanner } from './MuiBanner';
import { MuiDrawer } from './MuiDrawer';
import { MuiPopconfirm } from './MuiPopconfirm';
import { MuiSkeleton } from './MuiSkeleton';
import { MuiResult } from './MuiResult';
import { MuiPrompt } from './MuiPrompt';
import { MuiSheet } from './MuiSheet';
import { MuiActionSheet } from './MuiActionSheet';
import { MuiConnection } from './MuiConnection';

// Adapter version
export const MUI_ADAPTER_VERSION = '1.0.0';

/**
 * Detect if dark mode is active
 * Checks for dark class on html element or prefers-color-scheme
 */
function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;

  const htmlElement = document.documentElement;
  if (htmlElement.classList.contains('dark')) return true;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Inject required styles for MUI adapter
 * Adds custom animations and keyframes
 */
function injectStyles(): void {
  if (typeof document === 'undefined') return;

  const styleId = 'mui-adapter-styles';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    /* MUI Adapter Custom Animations */

    /* Indeterminate progress animation */
    @keyframes mui-indeterminate {
      0% {
        left: -35%;
        right: 100%;
      }
      60% {
        left: 100%;
        right: -90%;
      }
      100% {
        left: 100%;
        right: -90%;
      }
    }

    /* Wave animation for skeleton */
    @keyframes mui-wave {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .animate-mui-indeterminate {
      animation: mui-indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    .animate-wave::before {
      animation: mui-wave 1.6s linear 0.5s infinite;
    }

    /* MUI-style focus visible */
    .mui-focus-visible:focus-visible {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }

    /* MUI-style ripple placeholder */
    .mui-ripple {
      position: relative;
      overflow: hidden;
    }

    /* Smooth transitions matching MUI defaults */
    .mui-transition-standard {
      transition-duration: 225ms;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mui-transition-entering {
      transition-duration: 225ms;
      transition-timing-function: cubic-bezier(0.0, 0, 0.2, 1);
    }

    .mui-transition-leaving {
      transition-duration: 195ms;
      transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
    }
  `;

  document.head.appendChild(styleSheet);
}

/**
 * Material UI adapter implementation
 * Provides Material Design styled feedback components
 */
export const muiAdapter: IFeedbackAdapter = {
  name: 'mui',
  version: MUI_ADAPTER_VERSION,

  // Notification Components
  ToastComponent: MuiToast,
  ToastContainerComponent: MuiToastContainer,
  BannerComponent: MuiBanner,

  // Dialog Components
  ModalComponent: MuiModal,
  ConfirmComponent: MuiConfirm,
  PromptComponent: MuiPrompt,
  DrawerComponent: MuiDrawer,
  PopconfirmComponent: MuiPopconfirm,

  // Sheet Components
  SheetComponent: MuiSheet,
  ActionSheetComponent: MuiActionSheet,

  // Feedback Components
  AlertComponent: MuiAlert,
  LoadingComponent: MuiLoading,
  ProgressComponent: MuiProgress,
  SkeletonComponent: MuiSkeleton,
  ResultComponent: MuiResult,

  // Status Components
  ConnectionComponent: MuiConnection,

  // Utility Functions
  isDarkMode,
  injectStyles,

  // Animation configuration (MUI standard durations)
  animations: {
    enter: 'mui-transition-entering',
    exit: 'mui-transition-leaving',
    duration: 225,
  },
};

// Re-export individual components for direct import
export {
  MuiToast,
  MuiToastContainer,
  MuiModal,
  MuiLoading,
  MuiAlert,
  MuiProgress,
  MuiConfirm,
  MuiBanner,
  MuiDrawer,
  MuiPopconfirm,
  MuiSkeleton,
  MuiResult,
  MuiPrompt,
  MuiSheet,
  MuiActionSheet,
  MuiConnection,
};
