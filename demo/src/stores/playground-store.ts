/**
 * Playground state management.
 * Tracks selected adapter, feedback type, and configuration.
 */

import { create } from 'zustand';

// Types
export type AdapterType = 'headless' | 'shadcn' | 'mantine' | 'chakra' | 'mui' | 'antd';
export type FeedbackType = 'toast' | 'confirm' | 'alert' | 'prompt' | 'loading' | 'progress' | 'modal' | 'drawer' | 'banner' | 'popconfirm';
export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type VariantType = 'default' | 'info' | 'success' | 'warning' | 'error';

// Animation types
export type ToastAnimationType = 'slide' | 'fade' | 'scale' | 'bounce' | 'none';

// Theme types
export type ToastThemeType = 'light' | 'dark' | 'colored' | 'auto';

// Config interfaces
interface ToastConfig {
  message: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
  // Progress bar options
  showProgress: boolean;
  progressPosition: 'top' | 'bottom';
  // Visibility options
  dismissible: boolean;
  pauseOnHover: boolean;
  // Persistent mode (duration: 0, only close button dismisses)
  persistent: boolean;
  // Animation options
  animation: ToastAnimationType;
  // Stacking options
  stacked: boolean;
  maxVisible: number;
  // Styling options
  showLeftBorder: boolean;
  theme: ToastThemeType;
}

interface ConfirmConfig {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: VariantType;
}

interface AlertConfig {
  title: string;
  message: string;
  variant: VariantType;
}

interface PromptConfig {
  title: string;
  message: string;
  placeholder: string;
  defaultValue: string;
}

interface LoadingConfig {
  message: string;
  type: 'spinner' | 'overlay' | 'inline';
}

interface ProgressConfig {
  label: string;
  value: number;
  showPercentage: boolean;
  indeterminate: boolean;
}

interface ModalConfig {
  title: string;
  content: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick: boolean;
}

interface DrawerConfig {
  title: string;
  content: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  size: 'sm' | 'md' | 'lg';
}

interface BannerConfig {
  message: string;
  variant: VariantType;
  dismissible: boolean;
  position: 'top' | 'bottom';
}

interface PopconfirmConfig {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

// Store state
interface PlaygroundState {
  // Adapter
  adapterType: AdapterType;
  setAdapterType: (adapter: AdapterType) => void;

  // Active feedback type
  activeFeedbackType: FeedbackType;
  setActiveFeedbackType: (type: FeedbackType) => void;

  // Toast config
  toastConfig: ToastConfig;
  updateToastConfig: (config: Partial<ToastConfig>) => void;

  // Confirm config
  confirmConfig: ConfirmConfig;
  updateConfirmConfig: (config: Partial<ConfirmConfig>) => void;

  // Alert config
  alertConfig: AlertConfig;
  updateAlertConfig: (config: Partial<AlertConfig>) => void;

  // Prompt config
  promptConfig: PromptConfig;
  updatePromptConfig: (config: Partial<PromptConfig>) => void;

  // Loading config
  loadingConfig: LoadingConfig;
  updateLoadingConfig: (config: Partial<LoadingConfig>) => void;

  // Progress config
  progressConfig: ProgressConfig;
  updateProgressConfig: (config: Partial<ProgressConfig>) => void;

  // Modal config
  modalConfig: ModalConfig;
  updateModalConfig: (config: Partial<ModalConfig>) => void;

  // Drawer config
  drawerConfig: DrawerConfig;
  updateDrawerConfig: (config: Partial<DrawerConfig>) => void;

  // Banner config
  bannerConfig: BannerConfig;
  updateBannerConfig: (config: Partial<BannerConfig>) => void;

  // Popconfirm config
  popconfirmConfig: PopconfirmConfig;
  updatePopconfirmConfig: (config: Partial<PopconfirmConfig>) => void;

  // Result log
  resultLog: string[];
  addResult: (result: string) => void;
  clearResults: () => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  // Adapter
  adapterType: 'headless',
  setAdapterType: (adapter) => set({ adapterType: adapter }),

  // Active feedback type
  activeFeedbackType: 'toast',
  setActiveFeedbackType: (type) => set({ activeFeedbackType: type }),

  // Toast config
  toastConfig: {
    message: 'This is a toast notification!',
    type: 'success',
    position: 'top-right',
    duration: 4000,
    // Progress bar options
    showProgress: true,
    progressPosition: 'bottom',
    // Visibility options
    dismissible: true,
    pauseOnHover: true,
    // Persistent mode
    persistent: false,
    // Animation options
    animation: 'slide',
    // Stacking options
    stacked: false,
    maxVisible: 5,
    // Styling options
    showLeftBorder: true,
    theme: 'colored' as ToastThemeType,
  },
  updateToastConfig: (config) =>
    set((state) => ({
      toastConfig: { ...state.toastConfig, ...config },
    })),

  // Confirm config
  confirmConfig: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'default',
  },
  updateConfirmConfig: (config) =>
    set((state) => ({
      confirmConfig: { ...state.confirmConfig, ...config },
    })),

  // Alert config
  alertConfig: {
    title: 'Alert',
    message: 'Something important happened!',
    variant: 'info',
  },
  updateAlertConfig: (config) =>
    set((state) => ({
      alertConfig: { ...state.alertConfig, ...config },
    })),

  // Prompt config
  promptConfig: {
    title: 'Enter Value',
    message: 'Please enter your name:',
    placeholder: 'Type here...',
    defaultValue: '',
  },
  updatePromptConfig: (config) =>
    set((state) => ({
      promptConfig: { ...state.promptConfig, ...config },
    })),

  // Loading config
  loadingConfig: {
    message: 'Loading, please wait...',
    type: 'overlay',
  },
  updateLoadingConfig: (config) =>
    set((state) => ({
      loadingConfig: { ...state.loadingConfig, ...config },
    })),

  // Progress config
  progressConfig: {
    label: 'Uploading...',
    value: 0,
    showPercentage: true,
    indeterminate: false,
  },
  updateProgressConfig: (config) =>
    set((state) => ({
      progressConfig: { ...state.progressConfig, ...config },
    })),

  // Modal config
  modalConfig: {
    title: 'Modal Title',
    content: 'This is the modal content. You can put any content here.',
    size: 'md',
    closeOnOverlayClick: true,
  },
  updateModalConfig: (config) =>
    set((state) => ({
      modalConfig: { ...state.modalConfig, ...config },
    })),

  // Drawer config
  drawerConfig: {
    title: 'Drawer Title',
    content: 'This is the drawer content.',
    position: 'right',
    size: 'md',
  },
  updateDrawerConfig: (config) =>
    set((state) => ({
      drawerConfig: { ...state.drawerConfig, ...config },
    })),

  // Banner config
  bannerConfig: {
    message: 'This is an important announcement!',
    variant: 'info',
    dismissible: true,
    position: 'top',
  },
  updateBannerConfig: (config) =>
    set((state) => ({
      bannerConfig: { ...state.bannerConfig, ...config },
    })),

  // Popconfirm config
  popconfirmConfig: {
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
  updatePopconfirmConfig: (config) =>
    set((state) => ({
      popconfirmConfig: { ...state.popconfirmConfig, ...config },
    })),

  // Result log
  resultLog: [],
  addResult: (result) =>
    set((state) => ({
      resultLog: [...state.resultLog.slice(-19), `[${new Date().toLocaleTimeString()}] ${result}`],
    })),
  clearResults: () => set({ resultLog: [] }),
}));
