/**
 * FeedbackProvider - React context provider for feedback management
 * Provides access to FeedbackManager and configuration across the app
 */

import type React from 'react';
import {
  createContext,
  useContext,
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
import type { IFeedbackConfig, ToastPosition } from '../core/types';

/**
 * Feedback context value interface
 */
export interface IFeedbackContext {
  /** FeedbackManager instance */
  manager: FeedbackManager;
  /** Current configuration */
  config: IFeedbackConfig;
}

/**
 * React context for feedback system
 */
export const FeedbackContext = createContext<IFeedbackContext | null>(null);

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
  toastGap = 12,
  renderToasts = true,
  renderModals = true,
  renderLoadings = true,
  renderConfirms = true,
  renderBanners = true,
  renderDrawers = true,
  renderPopconfirms = true,
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't destroy the singleton on unmount to support
      // multiple providers and HMR. Use FeedbackManager.resetInstance()
      // explicitly if needed.
    };
  }, []);

  // Memoize context value
  const contextValue = useMemo<IFeedbackContext>(
    () => ({
      manager,
      config: manager.getConfig(),
    }),
    [manager]
  );

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
      {renderToasts && (
        <ToastContainer position={toastPosition} gap={toastGap} />
      )}
      {renderModals && <ModalContainer />}
      {renderLoadings && <LoadingContainer />}
      {renderConfirms && <ConfirmContainer />}
      {renderBanners && <BannerContainer />}
      {renderDrawers && <DrawerContainer />}
      {renderPopconfirms && <PopconfirmContainer />}
    </FeedbackContext.Provider>
  );
}

/**
 * Hook to access feedback context
 * Throws if used outside FeedbackProvider
 *
 * @returns Feedback context value
 * @throws Error if used outside FeedbackProvider
 */
export function useFeedbackContext(): IFeedbackContext {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error(
      'useFeedbackContext must be used within a FeedbackProvider. ' +
        'Wrap your app with <FeedbackProvider> to use feedback features.'
    );
  }

  return context;
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
