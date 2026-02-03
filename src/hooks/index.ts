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

// Banner hook
export { useBanner } from './useBanner';
export type { IUseBannerReturn, IBannerItem } from './useBanner';

// Drawer hook
export { useDrawer } from './useDrawer';
export type { IUseDrawerReturn, IDrawerItem } from './useDrawer';

// Popconfirm hook
export { usePopconfirm } from './usePopconfirm';
export type { IUsePopconfirmReturn, IPopconfirmItem, IPopconfirmShowOptions } from './usePopconfirm';

// Utility hooks
export { useFocusTrap } from './useFocusTrap';
export type { IFocusTrapOptions } from './useFocusTrap';
export { useScrollLock, getActiveScrollLocks, resetScrollLockState } from './useScrollLock';
// useBanner is now exported above
// useDrawer is now exported above
// usePopconfirm is now exported above
// export { useSkeleton } from './useSkeleton';
// export { useConnection } from './useConnection';
// export { usePrompt } from './usePrompt';
// export { useSheet } from './useSheet';

// Placeholder export to prevent empty module errors
export const HOOKS_VERSION = '0.1.0';
