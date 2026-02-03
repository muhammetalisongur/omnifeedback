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
// Skeleton hook
export { useSkeleton } from './useSkeleton';
export type { IUseSkeletonReturn, ISkeletonItem } from './useSkeleton';

// Result hook
export { useResult } from './useResult';
export type { IUseResultReturn, IResultItem, IResultShowOptions } from './useResult';

// Connection hook
export { useConnection } from './useConnection';
export type { IUseConnectionReturn, QueuedAction } from './useConnection';

// Prompt hook
export { usePrompt } from './usePrompt';
export type { IUsePromptReturn, IPromptShowOptions } from './usePrompt';

// Sheet hook
export { useSheet } from './useSheet';
export type {
  IUseSheetReturn,
  ISheetShowOptions,
  IActionSheetOptions,
  ISheetConfirmOptions,
  ISheetItem,
} from './useSheet';

// Drag hook
export { useDrag } from './useDrag';
export type { IDragState, IUseDragOptions, IUseDragReturn } from './useDrag';

// Placeholder export to prevent empty module errors
export const HOOKS_VERSION = '0.1.0';
