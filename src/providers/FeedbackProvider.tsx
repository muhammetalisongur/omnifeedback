/**
 * FeedbackProvider - React context provider for feedback management
 * Provides access to FeedbackManager and configuration across the app
 */

import type React from 'react';
import {
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { FeedbackManager } from '../core/FeedbackManager';
import { ToastContainer } from '../components/Toast/ToastContainer';
import { ModalContainer } from '../components/Modal/ModalContainer';
import { LoadingContainer } from '../components/Loading/LoadingContainer';
import { ConfirmContainer } from '../components/Confirm/ConfirmContainer';
import { BannerContainer } from '../components/Banner/BannerContainer';
import { DrawerContainer } from '../components/Drawer/DrawerContainer';
import { PopconfirmContainer } from '../components/Popconfirm/PopconfirmContainer';
import { SheetContainer } from '../components/Sheet/SheetContainer';
import { PromptContainer } from '../components/Prompt/PromptContainer';
import { AlertContainer } from '../components/Alert/AlertContainer';
import { ProgressContainer } from '../components/Progress/ProgressContainer';
import { TOAST_DEFAULTS, MAX_VISIBLE } from '../utils/constants';
import { FeedbackContext, useFeedbackContext } from './FeedbackContext';
import type { IFeedbackConfig, ToastPosition } from '../core/types';
import type { IFeedbackAdapter } from '../adapters/types';
import type { IFeedbackContext } from './FeedbackContext';

// Re-export context, interface and hook for backward compatibility
export { FeedbackContext, useFeedbackContext };
export type { IFeedbackContext };

/**
 * FeedbackProvider props
 */
export interface IFeedbackProviderProps {
  /** Child components */
  children: ReactNode;
  /** Custom configuration */
  config?: Partial<IFeedbackConfig>;
  /** Default toast position */
  toastPosition?: ToastPosition;
  /** Gap between toasts */
  toastGap?: number;
  /** Enable stacked/collapsed mode for toasts - auto expands on hover */
  toastStacked?: boolean;
  /** Maximum number of visible toasts per position */
  toastMaxVisible?: number;
  /** Render toast container */
  renderToasts?: boolean;
  /** Render modal container */
  renderModals?: boolean;
  /** Render loading container */
  renderLoadings?: boolean;
  /** Render confirm container */
  renderConfirms?: boolean;
  /** Render banner container */
  renderBanners?: boolean;
  /** Render drawer container */
  renderDrawers?: boolean;
  /** Render popconfirm container */
  renderPopconfirms?: boolean;
  /** Render sheet container */
  renderSheets?: boolean;
  /** Render prompt container */
  renderPrompts?: boolean;
  /** Render alert container */
  renderAlerts?: boolean;
  /** Render progress container */
  renderProgresses?: boolean;
  /** UI library adapter for component rendering */
  adapter?: IFeedbackAdapter;
}

/**
 * FeedbackProvider component
 *
 * Wraps your app to provide feedback functionality:
 * - Toast notifications
 * - Modals
 * - Loading indicators
 * - Alerts
 * - And more...
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <FeedbackProvider toastPosition="top-right">
 *       <MyApp />
 *     </FeedbackProvider>
 *   );
 * }
 * ```
 */
export function FeedbackProvider({
  children,
  config,
  toastPosition = 'top-right',
  toastGap = TOAST_DEFAULTS.GAP,
  toastStacked = false,
  toastMaxVisible = MAX_VISIBLE.TOAST,
  renderToasts = true,
  renderModals = true,
  renderLoadings = true,
  renderConfirms = true,
  renderBanners = true,
  renderDrawers = true,
  renderPopconfirms = true,
  renderSheets = true,
  renderPrompts = true,
  renderAlerts = true,
  renderProgresses = true,
  adapter,
}: IFeedbackProviderProps): React.ReactElement {
  // Initialize manager once and keep stable reference
  const managerRef = useRef<FeedbackManager | null>(null);

  if (managerRef.current === null) {
    managerRef.current = FeedbackManager.getInstance(config);
  }

  const manager = managerRef.current;

  // Update config if it changes
  useEffect(() => {
    if (config) {
      manager.updateConfig(config);
    }
  }, [manager, config]);

  // Sync toastMaxVisible to FeedbackManager config
  useEffect(() => {
    manager.updateConfig({
      maxVisible: { toast: toastMaxVisible },
    });
  }, [manager, toastMaxVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't destroy the singleton on unmount to support
      // multiple providers and HMR. Use FeedbackManager.resetInstance()
      // explicitly if needed.
    };
  }, []);

  // Inject adapter styles on mount
  useEffect(() => {
    if (adapter) {
      adapter.injectStyles();
    }
  }, [adapter]);

  // Memoize context value
  const contextValue = useMemo<IFeedbackContext>(
    () => ({
      manager,
      config: manager.getConfig(),
      adapter: adapter ?? null,
    }),
    [manager, adapter]
  );

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
      {renderToasts && (
        <ToastContainer
          position={toastPosition}
          gap={toastGap}
          stacked={toastStacked}
          maxVisibleToasts={toastMaxVisible}

        />
      )}
      {renderModals && <ModalContainer />}
      {renderLoadings && <LoadingContainer />}
      {renderConfirms && <ConfirmContainer />}
      {renderBanners && <BannerContainer />}
      {renderDrawers && <DrawerContainer />}
      {renderPopconfirms && <PopconfirmContainer />}
      {renderSheets && <SheetContainer />}
      {renderPrompts && <PromptContainer />}
      {renderAlerts && <AlertContainer />}
      {renderProgresses && <ProgressContainer />}
    </FeedbackContext.Provider>
  );
}

/**
 * Hook to get FeedbackManager instance
 * Throws if used outside FeedbackProvider
 *
 * @returns FeedbackManager instance
 */
export function useFeedbackManager(): FeedbackManager {
  const { manager } = useFeedbackContext();
  return manager;
}
