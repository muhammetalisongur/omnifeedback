/**
 * Ant Design adapter exports
 * Provides integration with Ant Design style components
 *
 * This adapter implements the IFeedbackAdapter interface using
 * Ant Design's design language and styling conventions.
 */

import type { IFeedbackAdapter } from '../types';

// Component imports
import { AntdToast } from './AntdToast';
import { AntdToastContainer } from './AntdToastContainer';
import { AntdModal } from './AntdModal';
import { AntdLoading } from './AntdLoading';
import { AntdAlert } from './AntdAlert';
import { AntdProgress } from './AntdProgress';
import { AntdConfirm } from './AntdConfirm';
import { AntdBanner } from './AntdBanner';
import { AntdDrawer } from './AntdDrawer';
import { AntdPopconfirm } from './AntdPopconfirm';
import { AntdSkeleton } from './AntdSkeleton';
import { AntdResult } from './AntdResult';
import { AntdPrompt } from './AntdPrompt';
import { AntdSheet } from './AntdSheet';
import { AntdActionSheet } from './AntdActionSheet';
import { AntdConnection } from './AntdConnection';

/**
 * Styles injection flag to prevent multiple injections
 */
let stylesInjected = false;

/**
 * Ant Design adapter version
 */
export const ANTD_ADAPTER_VERSION = '1.0.0';

/**
 * Ant Design adapter implementation
 * Provides Ant Design styled feedback components
 */
export const antdAdapter: IFeedbackAdapter = {
  name: 'antd',
  version: ANTD_ADAPTER_VERSION,

  // Notification Components
  ToastComponent: AntdToast,
  ToastContainerComponent: AntdToastContainer,
  BannerComponent: AntdBanner,

  // Dialog Components
  ModalComponent: AntdModal,
  ConfirmComponent: AntdConfirm,
  PromptComponent: AntdPrompt,
  DrawerComponent: AntdDrawer,
  PopconfirmComponent: AntdPopconfirm,

  // Sheet Components
  SheetComponent: AntdSheet,
  ActionSheetComponent: AntdActionSheet,

  // Feedback Components
  AlertComponent: AntdAlert,
  LoadingComponent: AntdLoading,
  ProgressComponent: AntdProgress,
  SkeletonComponent: AntdSkeleton,
  ResultComponent: AntdResult,

  // Status Components
  ConnectionComponent: AntdConnection,

  // Utility Functions
  isDarkMode: () => {
    if (typeof document === 'undefined') {return false;}
    return (
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  },

  injectStyles: () => {
    if (stylesInjected || typeof document === 'undefined') {return;}

    const styleId = 'omnifeedback-antd-styles';
    if (document.getElementById(styleId)) {
      stylesInjected = true;
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Ant Design adapter custom styles */

      /* Indeterminate progress animation */
      @keyframes antd-progress-indeterminate {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(300%); }
      }

      .of-antd-progress-indeterminate {
        animation: antd-progress-indeterminate 1.5s ease-in-out infinite;
      }

      /* Skeleton wave animation */
      @keyframes antd-skeleton-wave {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .of-antd-skeleton-wave {
        background: linear-gradient(
          90deg,
          rgba(190, 190, 190, 0.2) 25%,
          rgba(129, 129, 129, 0.24) 37%,
          rgba(190, 190, 190, 0.2) 63%
        );
        background-size: 400% 100%;
        animation: antd-skeleton-wave 1.4s ease infinite;
      }

      /* Toast entrance animation */
      @keyframes antd-toast-slide-in {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Modal scale animation */
      @keyframes antd-modal-zoom {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Drawer slide animations */
      @keyframes antd-drawer-left {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }

      @keyframes antd-drawer-right {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }

      @keyframes antd-drawer-top {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }

      @keyframes antd-drawer-bottom {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }

      /* Button hover effects */
      .of-antd-btn {
        transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      .of-antd-btn:not(:disabled):hover {
        opacity: 0.85;
      }

      .of-antd-btn:not(:disabled):active {
        opacity: 1;
      }

      /* Input focus ring */
      .of-antd-input:focus {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }

      .of-antd-input.error:focus {
        box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
      }
    `;
    document.head.appendChild(style);
    stylesInjected = true;
  },

  animations: {
    enter: 'antd-fade-in',
    exit: 'antd-fade-out',
    duration: 200,
  },
};

// Default export
export default antdAdapter;

// Re-export individual components for customization
export { AntdToast } from './AntdToast';
export { AntdToastContainer } from './AntdToastContainer';
export { AntdModal } from './AntdModal';
export { AntdLoading } from './AntdLoading';
export { AntdAlert } from './AntdAlert';
export { AntdProgress } from './AntdProgress';
export { AntdConfirm } from './AntdConfirm';
export { AntdBanner } from './AntdBanner';
export { AntdDrawer } from './AntdDrawer';
export { AntdPopconfirm } from './AntdPopconfirm';
export { AntdSkeleton } from './AntdSkeleton';
export { AntdResult } from './AntdResult';
export { AntdPrompt } from './AntdPrompt';
export { AntdSheet } from './AntdSheet';
export { AntdActionSheet } from './AntdActionSheet';
export { AntdConnection } from './AntdConnection';
