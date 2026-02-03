/**
 * useFeedback - Combined hook providing access to all feedback functionality
 * Single entry point for all OmniFeedback features
 */

import { useMemo } from 'react';
import { useToast } from './useToast';
import { useModal } from './useModal';
import { useLoading } from './useLoading';
import { useAlert } from './useAlert';
import { useProgress } from './useProgress';
import { useConfirm } from './useConfirm';
import { useBanner } from './useBanner';
import { useDrawer } from './useDrawer';
import { usePopconfirm } from './usePopconfirm';
import { useSkeleton } from './useSkeleton';
import { useResult } from './useResult';
import { useConnection } from './useConnection';
import { usePrompt } from './usePrompt';
import { useSheet } from './useSheet';
import type { IUseToastReturn } from './useToast';
import type { IUseModalReturn } from './useModal';
import type { IUseLoadingReturn } from './useLoading';
import type { IUseAlertReturn } from './useAlert';
import type { IUseProgressReturn } from './useProgress';
import type { IUseConfirmReturn } from './useConfirm';
import type { IUseBannerReturn } from './useBanner';
import type { IUseDrawerReturn } from './useDrawer';
import type { IUsePopconfirmReturn } from './usePopconfirm';
import type { IUseSkeletonReturn } from './useSkeleton';
import type { IUseResultReturn } from './useResult';
import type { IUseConnectionReturn } from './useConnection';
import type { IUsePromptReturn } from './usePrompt';
import type { IUseSheetReturn } from './useSheet';
import type { IConnectionOptions } from '../core/types';

/**
 * Options for useFeedback hook
 */
export interface IUseFeedbackOptions {
  /** Connection monitoring options */
  connection?: IConnectionOptions;
}

/**
 * Return type for useFeedback hook
 */
export interface IUseFeedbackReturn {
  /** Toast notifications */
  toast: IUseToastReturn;
  /** Modal dialogs */
  modal: IUseModalReturn;
  /** Loading indicators */
  loading: IUseLoadingReturn;
  /** Alert messages */
  alert: IUseAlertReturn;
  /** Progress indicators */
  progress: IUseProgressReturn;
  /** Confirmation dialogs */
  confirm: IUseConfirmReturn;
  /** Banner announcements */
  banner: IUseBannerReturn;
  /** Drawer panels */
  drawer: IUseDrawerReturn;
  /** Popconfirm dialogs */
  popconfirm: IUsePopconfirmReturn;
  /** Skeleton loaders */
  skeleton: IUseSkeletonReturn;
  /** Result pages */
  result: IUseResultReturn;
  /** Connection status */
  connection: IUseConnectionReturn;
  /** Prompt dialogs */
  prompt: IUsePromptReturn;
  /** Bottom sheets */
  sheet: IUseSheetReturn;
}

/**
 * Combined hook providing access to all feedback functionality
 *
 * This hook combines all individual feedback hooks into a single,
 * convenient interface. Use this when you need access to multiple
 * feedback types in a component.
 *
 * @param options - Optional configuration options
 * @returns Object containing all feedback hooks
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     toast,
 *     modal,
 *     loading,
 *     alert,
 *     progress,
 *     confirm,
 *     banner,
 *     drawer,
 *     popconfirm,
 *     skeleton,
 *     result,
 *     connection,
 *     prompt,
 *     sheet,
 *   } = useFeedback();
 *
 *   // Toast notifications
 *   const handleSuccess = () => {
 *     toast.success('Operation completed!');
 *   };
 *
 *   // Modal dialogs
 *   const handleOpenModal = () => {
 *     modal.open({
 *       title: 'Settings',
 *       content: <SettingsPanel />,
 *     });
 *   };
 *
 *   // Confirmation
 *   const handleDelete = async () => {
 *     const confirmed = await confirm.show({
 *       title: 'Delete Item',
 *       message: 'Are you sure you want to delete this item?',
 *       confirmVariant: 'danger',
 *     });
 *     if (confirmed) {
 *       deleteItem();
 *     }
 *   };
 *
 *   // Loading indicator
 *   const handleSubmit = async () => {
 *     const id = loading.show({ message: 'Saving...' });
 *     try {
 *       await saveData();
 *       toast.success('Saved!');
 *     } finally {
 *       loading.hide(id);
 *     }
 *   };
 *
 *   // Prompt for user input
 *   const handleRename = async () => {
 *     const newName = await prompt.text('Enter new name');
 *     if (newName) {
 *       rename(newName);
 *     }
 *   };
 *
 *   // Action sheet
 *   const handleShowOptions = async () => {
 *     const action = await sheet.showActions({
 *       title: 'Choose Option',
 *       actions: [
 *         { key: 'edit', label: 'Edit' },
 *         { key: 'delete', label: 'Delete', destructive: true },
 *       ],
 *     });
 *     if (action === 'edit') editItem();
 *     if (action === 'delete') deleteItem();
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSuccess}>Show Toast</button>
 *       <button onClick={handleOpenModal}>Open Modal</button>
 *       <button onClick={handleDelete}>Delete</button>
 *       <button onClick={handleSubmit}>Submit</button>
 *       <button onClick={handleRename}>Rename</button>
 *       <button onClick={handleShowOptions}>Options</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With connection monitoring options
 * function App() {
 *   const { connection, toast } = useFeedback({
 *     connection: {
 *       onOffline: () => console.log('Lost connection'),
 *       onOnline: () => toast.success('Back online!'),
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       Status: {connection.isOnline ? 'Online' : 'Offline'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFeedback(options?: IUseFeedbackOptions): IUseFeedbackReturn {
  // Initialize all hooks
  const toast = useToast();
  const modal = useModal();
  const loadingHook = useLoading();
  const alert = useAlert();
  const progress = useProgress();
  const confirmHook = useConfirm();
  const banner = useBanner();
  const drawer = useDrawer();
  const popconfirm = usePopconfirm();
  const skeleton = useSkeleton();
  const result = useResult();
  const connectionHook = useConnection(options?.connection);
  const prompt = usePrompt();
  const sheet = useSheet();

  // Memoize the combined return object
  return useMemo(
    () => ({
      toast,
      modal,
      loading: loadingHook,
      alert,
      progress,
      confirm: confirmHook,
      banner,
      drawer,
      popconfirm,
      skeleton,
      result,
      connection: connectionHook,
      prompt,
      sheet,
    }),
    [
      toast,
      modal,
      loadingHook,
      alert,
      progress,
      confirmHook,
      banner,
      drawer,
      popconfirm,
      skeleton,
      result,
      connectionHook,
      prompt,
      sheet,
    ]
  );
}
