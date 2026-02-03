/**
 * Hooks module exports
 * Contains all React hooks for feedback management
 */

// Main feedback hook
// export { useFeedback } from './useFeedback';

// Individual component hooks
export { useToast } from './useToast';
export type { IUseToastReturn, IToastPromiseOptions } from './useToast';
export { useModal } from './useModal';
export type { IUseModalReturn } from './useModal';

// Loading hook
export { useLoading } from './useLoading';
export type { IUseLoadingReturn } from './useLoading';

// Alert hook
export { useAlert } from './useAlert';
export type { IUseAlertReturn, IAlertItem } from './useAlert';

// Progress hook
export { useProgress } from './useProgress';
export type { IUseProgressReturn, IProgressItem } from './useProgress';

// Confirm hook
export { useConfirm } from './useConfirm';
export type { IUseConfirmReturn, IConfirmShowOptions } from './useConfirm';

// Utility hooks
export { useFocusTrap } from './useFocusTrap';
export type { IFocusTrapOptions } from './useFocusTrap';
export { useScrollLock, getActiveScrollLocks, resetScrollLockState } from './useScrollLock';
// export { useBanner } from './useBanner';
// export { useDrawer } from './useDrawer';
// export { usePopconfirm } from './usePopconfirm';
// export { useSkeleton } from './useSkeleton';
// export { useConnection } from './useConnection';
// export { usePrompt } from './usePrompt';
// export { useSheet } from './useSheet';

// Placeholder export to prevent empty module errors
export const HOOKS_VERSION = '0.1.0';
