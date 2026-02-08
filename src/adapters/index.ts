/**
 * Adapters module exports
 * Provides UI library adapters for OmniFeedback
 */

// Adapter types
export type {
  IFeedbackAdapter,
  IAdapterAnimations,
  // Base types
  IAdapterBaseProps,
  FeedbackVariant,
  SizeVariant,
  ButtonVariant,
  // Component props
  IAdapterToastProps,
  IAdapterToastContainerProps,
  IAdapterModalProps,
  IAdapterLoadingProps,
  IAdapterAlertProps,
  IAdapterProgressProps,
  IAdapterConfirmProps,
  IAdapterBannerProps,
  IAdapterDrawerProps,
  IAdapterPopconfirmProps,
  IAdapterSkeletonProps,
  IAdapterResultProps,
  IAdapterPromptProps,
  IAdapterSheetProps,
  IAdapterActionSheetProps,
  IAdapterConnectionProps,
  // Additional types
  ModalSize,
  ModalScrollBehavior,
  SpinnerType,
  LoadingVariant,
  IAlertAction,
  ProgressVariant,
  ConfirmVariant,
  BannerPosition,
  DrawerPlacement,
  DrawerSize,
  PopconfirmPlacement,
  SkeletonShape,
  ResultStatus,
  IResultAction,
  PromptInputType,
  IActionSheetItem,
} from './types';

// Headless adapter (default)
export { headlessAdapter, default as defaultAdapter } from './headless';
export {
  HeadlessToast,
  HeadlessToastContainer,
  HeadlessModal,
  HeadlessLoading,
  HeadlessAlert,
  HeadlessProgress,
  HeadlessConfirm,
  HeadlessBanner,
  HeadlessDrawer,
  HeadlessPopconfirm,
  HeadlessSkeleton,
  HeadlessResult,
  HeadlessPrompt,
  HeadlessSheet,
  HeadlessActionSheet,
  HeadlessConnection,
} from './headless';

// shadcn/ui adapter
export { shadcnAdapter } from './shadcn';
export {
  ShadcnToast,
  ShadcnToastContainer,
  ShadcnModal,
  ShadcnLoading,
  ShadcnAlert,
  ShadcnProgress,
  ShadcnConfirm,
  ShadcnBanner,
  ShadcnDrawer,
  ShadcnPopconfirm,
  ShadcnSkeleton,
  ShadcnResult,
  ShadcnPrompt,
  ShadcnSheet,
  ShadcnActionSheet,
  ShadcnConnection,
} from './shadcn';

// Mantine adapter
export { mantineAdapter } from './mantine';
export {
  MantineToast,
  MantineToastContainer,
  MantineModal,
  MantineLoading,
  MantineAlert,
  MantineProgress,
  MantineConfirm,
  MantineBanner,
  MantineDrawer,
  MantinePopconfirm,
  MantineSkeleton,
  MantineResult,
  MantinePrompt,
  MantineSheet,
  MantineActionSheet,
  MantineConnection,
} from './mantine';

// Chakra UI adapter
export { chakraAdapter } from './chakra';
export {
  ChakraToast,
  ChakraToastContainer,
  ChakraModal,
  ChakraLoading,
  ChakraAlert,
  ChakraProgress,
  ChakraConfirm,
  ChakraBanner,
  ChakraDrawer,
  ChakraPopconfirm,
  ChakraSkeleton,
  ChakraResult,
  ChakraPrompt,
  ChakraSheet,
  ChakraActionSheet,
  ChakraConnection,
} from './chakra';

// Material UI adapter
export { muiAdapter } from './mui';
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
} from './mui';

// Ant Design adapter
export { antdAdapter } from './antd';
export {
  AntdToast,
  AntdToastContainer,
  AntdModal,
  AntdLoading,
  AntdAlert,
  AntdProgress,
  AntdConfirm,
  AntdBanner,
  AntdDrawer,
  AntdPopconfirm,
  AntdSkeleton,
  AntdResult,
  AntdPrompt,
  AntdSheet,
  AntdActionSheet,
  AntdConnection,
} from './antd';
