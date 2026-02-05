/**
 * shadcn/ui adapter exports
 * Provides components styled with shadcn/ui design language
 *
 * This adapter uses Radix UI primitives with Tailwind CSS styling
 * following the shadcn/ui patterns.
 */

import type { IFeedbackAdapter } from '../types';

// Component imports
import { ShadcnToast } from './ShadcnToast';
import { ShadcnToastContainer } from './ShadcnToastContainer';
import { ShadcnModal } from './ShadcnModal';
import { ShadcnLoading } from './ShadcnLoading';
import { ShadcnAlert } from './ShadcnAlert';
import { ShadcnProgress } from './ShadcnProgress';
import { ShadcnConfirm } from './ShadcnConfirm';
import { ShadcnBanner } from './ShadcnBanner';
import { ShadcnDrawer } from './ShadcnDrawer';
import { ShadcnPopconfirm } from './ShadcnPopconfirm';
import { ShadcnSkeleton } from './ShadcnSkeleton';
import { ShadcnResult } from './ShadcnResult';
import { ShadcnPrompt } from './ShadcnPrompt';
import { ShadcnSheet } from './ShadcnSheet';
import { ShadcnActionSheet } from './ShadcnActionSheet';
import { ShadcnConnection } from './ShadcnConnection';

/**
 * shadcn/ui adapter implementation
 * Uses Radix UI primitives with Tailwind CSS
 */
export const shadcnAdapter: IFeedbackAdapter = {
  name: 'shadcn',
  version: '1.0.0',

  // Notification Components
  ToastComponent: ShadcnToast,
  ToastContainerComponent: ShadcnToastContainer,
  BannerComponent: ShadcnBanner,

  // Dialog Components
  ModalComponent: ShadcnModal,
  ConfirmComponent: ShadcnConfirm,
  PromptComponent: ShadcnPrompt,
  DrawerComponent: ShadcnDrawer,
  PopconfirmComponent: ShadcnPopconfirm,

  // Sheet Components
  SheetComponent: ShadcnSheet,
  ActionSheetComponent: ShadcnActionSheet,

  // Feedback Components
  AlertComponent: ShadcnAlert,
  LoadingComponent: ShadcnLoading,
  ProgressComponent: ShadcnProgress,
  SkeletonComponent: ShadcnSkeleton,
  ResultComponent: ShadcnResult,

  // Status Components
  ConnectionComponent: ShadcnConnection,

  // Utility Functions
  isDarkMode: () => {
    if (typeof document === 'undefined') {return false;}
    return document.documentElement.classList.contains('dark');
  },

  injectStyles: () => {
    if (typeof document === 'undefined') {return;}

    const styleId = 'omnifeedback-shadcn-styles';
    if (document.getElementById(styleId)) {return;}

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* shadcn/ui animation keyframes */
      @keyframes accordion-down {
        from { height: 0; }
        to { height: var(--radix-accordion-content-height); }
      }

      @keyframes accordion-up {
        from { height: var(--radix-accordion-content-height); }
        to { height: 0; }
      }

      @keyframes indeterminate {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }

      .animate-accordion-down {
        animation: accordion-down 0.2s ease-out;
      }

      .animate-accordion-up {
        animation: accordion-up 0.2s ease-out;
      }

      .animate-indeterminate {
        animation: indeterminate 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  },

  animations: {
    enter: 'animate-in slide-in-from-right fade-in',
    exit: 'animate-out slide-out-to-right fade-out',
    duration: 200,
  },
};

// Default export
export default shadcnAdapter;

// Re-export individual components for customization
export { ShadcnToast } from './ShadcnToast';
export { ShadcnToastContainer } from './ShadcnToastContainer';
export { ShadcnModal } from './ShadcnModal';
export { ShadcnLoading } from './ShadcnLoading';
export { ShadcnAlert } from './ShadcnAlert';
export { ShadcnProgress } from './ShadcnProgress';
export { ShadcnConfirm } from './ShadcnConfirm';
export { ShadcnBanner } from './ShadcnBanner';
export { ShadcnDrawer } from './ShadcnDrawer';
export { ShadcnPopconfirm } from './ShadcnPopconfirm';
export { ShadcnSkeleton } from './ShadcnSkeleton';
export { ShadcnResult } from './ShadcnResult';
export { ShadcnPrompt } from './ShadcnPrompt';
export { ShadcnSheet } from './ShadcnSheet';
export { ShadcnActionSheet } from './ShadcnActionSheet';
export { ShadcnConnection } from './ShadcnConnection';
