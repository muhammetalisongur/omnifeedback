/**
 * Code template generator for the Playground.
 * Generates copy-ready code snippets based on user configuration.
 */

import type { AdapterType } from '../stores/playground-store';
import {
  DURATIONS,
  POSITIONS,
  MAX_VISIBLE,
  TOAST_DEFAULTS,
} from 'omnifeedback';

// ============================================================================
// Types
// ============================================================================

interface ToastCodeParams {
  message: string;
  type: string;
  position: string;
  duration: number;
  // Progress bar options
  showProgress: boolean;
  progressPosition: 'top' | 'bottom';
  // Behavior options
  dismissible: boolean;
  pauseOnHover: boolean;
  // Persistent mode
  persistent: boolean;
  // Animation options
  animation: 'slide' | 'fade' | 'scale' | 'bounce' | 'none';
  // Stacking options
  stacked: boolean;
  maxVisible: number;
  // Styling options
  showLeftBorder: boolean;
  theme: 'light' | 'dark' | 'colored' | 'auto';
}

interface SetupCodeParams {
  adapter: AdapterType;
  toastPosition?: string;
  toastStacked?: boolean;
  toastMaxVisible?: number;
}

interface ConfirmCodeParams {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: string;
}

interface AlertCodeParams {
  title: string;
  message: string;
  variant: string;
}

interface PromptCodeParams {
  title: string;
  message: string;
  placeholder: string;
  defaultValue: string;
}

interface LoadingCodeParams {
  message: string;
  type: string;
}

interface ProgressCodeParams {
  label: string;
  value: number;
  showPercentage: boolean;
  indeterminate: boolean;
}

interface ModalCodeParams {
  title: string;
  content: string;
  size: string;
  closeOnOverlayClick: boolean;
}

interface DrawerCodeParams {
  title: string;
  content: string;
  position: string;
  size: string;
}

interface BannerCodeParams {
  message: string;
  variant: string;
  dismissible: boolean;
  position: string;
}

interface PopconfirmCodeParams {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

// ============================================================================
// Setup Code
// ============================================================================

export function getSetupCode(params: SetupCodeParams): string {
  // Build FeedbackProvider props string
  const providerProps: string[] = [];
  if (params.toastPosition && params.toastPosition !== POSITIONS.TOAST_DEFAULT) {
    providerProps.push(`toastPosition="${params.toastPosition}"`);
  }
  if (params.toastStacked) {
    providerProps.push(`toastStacked`);
  }
  if (params.toastMaxVisible !== undefined && params.toastMaxVisible !== MAX_VISIBLE.TOAST) {
    providerProps.push(`toastMaxVisible={${String(params.toastMaxVisible)}}`);
  }

  const hasProps = providerProps.length > 0;
  const providerOpen = hasProps
    ? `<FeedbackProvider\n        ${providerProps.join('\n        ')}\n      >`
    : '<FeedbackProvider>';

  const adapterImports: Record<AdapterType, string> = {
    headless: `import { FeedbackProvider } from 'omnifeedback';

function App() {
  return (
    ${providerOpen}
      <MyApplication />
    </FeedbackProvider>
  );
}`,
    shadcn: `import { FeedbackProvider } from 'omnifeedback';
// Ensure your Tailwind CSS is configured

function App() {
  return (
    ${providerOpen}
      <MyApplication />
    </FeedbackProvider>
  );
}`,
    mantine: `import { MantineProvider } from '@mantine/core';
import { FeedbackProvider } from 'omnifeedback';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      ${providerOpen}
        <MyApplication />
      </FeedbackProvider>
    </MantineProvider>
  );
}`,
    chakra: `import { ChakraProvider } from '@chakra-ui/react';
import { FeedbackProvider } from 'omnifeedback';

function App() {
  return (
    <ChakraProvider>
      ${providerOpen}
        <MyApplication />
      </FeedbackProvider>
    </ChakraProvider>
  );
}`,
    mui: `import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FeedbackProvider } from 'omnifeedback';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      ${providerOpen}
        <MyApplication />
      </FeedbackProvider>
    </ThemeProvider>
  );
}`,
    antd: `import { ConfigProvider } from 'antd';
import { FeedbackProvider } from 'omnifeedback';

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      ${providerOpen}
        <MyApplication />
      </FeedbackProvider>
    </ConfigProvider>
  );
}`,
  };

  return adapterImports[params.adapter];
}

// ============================================================================
// Toast Code
// ============================================================================

export function getToastCode(params: ToastCodeParams): string {
  const options: string[] = [];

  // Persistent mode: duration=0, dismissible=true, no progress
  if (params.persistent) {
    options.push(`    duration: 0,`);
    options.push(`    dismissible: true,`);
  } else {
    // Duration (default from library constants)
    if (params.duration !== DURATIONS.TOAST_DEFAULT) {
      options.push(`    duration: ${String(params.duration)},`);
    }

    // Progress bar options
    if (params.showProgress) {
      options.push(`    showProgress: true,`);
      if (params.progressPosition !== TOAST_DEFAULTS.PROGRESS_POSITION) {
        options.push(`    progressPosition: '${params.progressPosition}',`);
      }
    }

    // Behavior options
    if (!params.dismissible) {
      options.push(`    dismissible: false,`);
    }
    if (params.pauseOnHover) {
      options.push(`    pauseOnHover: true,`);
    }
  }

  // Position (default from library constants)
  if (params.position !== POSITIONS.TOAST_DEFAULT) {
    options.push(`    position: '${params.position}',`);
  }

  // Animation options (default from library constants)
  if (params.animation !== TOAST_DEFAULTS.ANIMATION) {
    options.push(`    animation: '${params.animation}',`);
  }

  // Styling options
  if (params.showLeftBorder) {
    options.push(`    showLeftBorder: true,`);
  }
  if (params.theme !== TOAST_DEFAULTS.THEME) {
    options.push(`    theme: '${params.theme}',`);
  }

  const typeMethod = params.type === 'info' ? 'info' : params.type;
  const hasOptions = options.length > 0;

  // Stacked mode is a provider-level setting — add a comment pointing to Setup tab
  const stackedComment = params.stacked
    ? '// Stacked mode is configured at the provider level (see Setup tab)\n'
    : '';

  return `${stackedComment}import { useToast } from 'omnifeedback';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.${typeMethod}('${params.message}'${hasOptions ? `, {
${options.join('\n')}
    }` : ''});
  };

  return <button onClick={handleClick}>Show Toast</button>;
}`;
}

// ============================================================================
// Confirm Code
// ============================================================================

export function getConfirmCode(params: ConfirmCodeParams): string {
  const options: string[] = [];

  if (params.title) options.push(`    title: '${params.title}',`);
  if (params.confirmText !== 'Confirm') options.push(`    confirmText: '${params.confirmText}',`);
  if (params.cancelText !== 'Cancel') options.push(`    cancelText: '${params.cancelText}',`);

  return `import { useConfirm, useToast } from 'omnifeedback';

function MyComponent() {
  const confirm = useConfirm();
  const toast = useToast();

  const handleDelete = async () => {
    const confirmed = await confirm.show({
      message: '${params.message}',
${options.join('\n')}
    });

    if (confirmed) {
      toast.success('Action confirmed!');
      // Proceed with action
    } else {
      toast.info('Action cancelled');
    }
  };

  return <button onClick={handleDelete}>Delete Item</button>;
}`;
}

// ============================================================================
// Alert Code
// ============================================================================

export function getAlertCode(params: AlertCodeParams): string {
  const options: string[] = [];

  if (params.title) options.push(`    title: '${params.title}',`);
  if (params.variant !== 'default') options.push(`    variant: '${params.variant}',`);

  return `import { useAlert } from 'omnifeedback';

function MyComponent() {
  const alert = useAlert();

  const showAlert = () => {
    alert.show({
      message: '${params.message}',
${options.join('\n')}
    });
  };

  return <button onClick={showAlert}>Show Alert</button>;
}`;
}

// ============================================================================
// Prompt Code
// ============================================================================

export function getPromptCode(params: PromptCodeParams): string {
  return `import { usePrompt, useToast } from 'omnifeedback';

function MyComponent() {
  const prompt = usePrompt();
  const toast = useToast();

  const handlePrompt = async () => {
    const value = await prompt.show({
      title: '${params.title}',
      message: '${params.message}',
      placeholder: '${params.placeholder}',${params.defaultValue ? `
      defaultValue: '${params.defaultValue}',` : ''}
    });

    if (value !== null) {
      toast.success(\`You entered: \${value}\`);
    } else {
      toast.info('Prompt cancelled');
    }
  };

  return <button onClick={handlePrompt}>Open Prompt</button>;
}`;
}

// ============================================================================
// Loading Code
// ============================================================================

export function getLoadingCode(params: LoadingCodeParams): string {
  return `import { useLoading, useToast } from 'omnifeedback';

function MyComponent() {
  const loading = useLoading();
  const toast = useToast();

  const handleSubmit = async () => {
    const id = loading.show({
      message: '${params.message}',
      type: '${params.type}',
    });

    try {
      // Simulate async work
      await new Promise(r => setTimeout(r, 2000));

      toast.success('Operation completed!');
    } finally {
      loading.hide(id);
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}`;
}

// ============================================================================
// Progress Code
// ============================================================================

export function getProgressCode(params: ProgressCodeParams): string {
  if (params.indeterminate) {
    return `import { useProgress, useToast } from 'omnifeedback';

function MyComponent() {
  const progress = useProgress();
  const toast = useToast();

  const handleProcess = async () => {
    const id = progress.show({
      value: 0,
      label: '${params.label}',
      indeterminate: true,
    });

    // Simulate work
    await new Promise(r => setTimeout(r, 3000));

    progress.complete(id);
    toast.success('Process complete!');
  };

  return <button onClick={handleProcess}>Start Process</button>;
}`;
  }

  return `import { useProgress, useToast } from 'omnifeedback';

function MyComponent() {
  const progress = useProgress();
  const toast = useToast();

  const handleUpload = async () => {
    const id = progress.show({
      value: 0,
      label: '${params.label}',${params.showPercentage ? `
      showPercentage: true,` : ''}
    });

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      progress.update(id, i);
      await new Promise(r => setTimeout(r, 200));
    }

    progress.complete(id);
    toast.success('Upload complete!');
  };

  return <button onClick={handleUpload}>Start Upload</button>;
}`;
}

// ============================================================================
// Modal Code
// ============================================================================

export function getModalCode(params: ModalCodeParams): string {
  return `import { useModal } from 'omnifeedback';

function MyComponent() {
  const modal = useModal();

  const openModal = () => {
    modal.show({
      title: '${params.title}',
      content: (
        <div>
          <p>${params.content}</p>
          <button onClick={() => modal.hide()}>Close</button>
        </div>
      ),
      size: '${params.size}',
      closeOnOverlayClick: ${params.closeOnOverlayClick},
    });
  };

  return <button onClick={openModal}>Open Modal</button>;
}`;
}

// ============================================================================
// Drawer Code
// ============================================================================

export function getDrawerCode(params: DrawerCodeParams): string {
  return `import { useDrawer } from 'omnifeedback';

function MyComponent() {
  const drawer = useDrawer();

  const openDrawer = () => {
    drawer.show({
      title: '${params.title}',
      content: <div>${params.content}</div>,
      position: '${params.position}',
      size: '${params.size}',
    });
  };

  return <button onClick={openDrawer}>Open Drawer</button>;
}`;
}

// ============================================================================
// Banner Code
// ============================================================================

export function getBannerCode(params: BannerCodeParams): string {
  return `import { useBanner } from 'omnifeedback';

function MyComponent() {
  const banner = useBanner();

  const showBanner = () => {
    banner.show({
      message: '${params.message}',
      variant: '${params.variant}',
      dismissible: ${params.dismissible},
      position: '${params.position}',
    });
  };

  return <button onClick={showBanner}>Show Banner</button>;
}`;
}

// ============================================================================
// Popconfirm Code
// ============================================================================

export function getPopconfirmCode(params: PopconfirmCodeParams): string {
  return `import { usePopconfirm, useToast } from 'omnifeedback';

function MyComponent() {
  const popconfirm = usePopconfirm();
  const toast = useToast();

  const handleDelete = async (event: React.MouseEvent) => {
    const confirmed = await popconfirm.show({
      target: event.currentTarget as HTMLElement,
      title: '${params.title}',
      message: '${params.message}',
      confirmText: '${params.confirmText}',
      cancelText: '${params.cancelText}',
    });

    if (confirmed) {
      toast.success('Item deleted!');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}`;
}
