# Design: Mantine Adapter

## Overview
Implement the Mantine adapter using @mantine/core components.

## Dependencies

```json
{
  "peerDependencies": {
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0"
  }
}
```

## Adapter Structure

```typescript
// src/adapters/mantine/index.ts

import type { IFeedbackAdapter } from '../types';
import { MantineToast } from './Toast';
import { MantineToastContainer } from './ToastContainer';
import { MantineModal } from './Modal';
import { MantineLoading } from './Loading';
import { MantineLoadingOverlay } from './LoadingOverlay';
import { MantineAlert } from './Alert';
import { MantineProgress } from './Progress';
import { MantineConfirm } from './Confirm';

export const mantineAdapter: IFeedbackAdapter = {
  name: 'mantine',
  version: '1.0.0',
  
  ToastComponent: MantineToast,
  ToastContainerComponent: MantineToastContainer,
  ModalComponent: MantineModal,
  LoadingComponent: MantineLoading,
  LoadingOverlayComponent: MantineLoadingOverlay,
  AlertComponent: MantineAlert,
  ProgressComponent: MantineProgress,
  ConfirmComponent: MantineConfirm,
  
  isDarkMode: () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-mantine-color-scheme') === 'dark';
  },
  
  animations: {
    enter: 'mantine-slide-in',
    exit: 'mantine-slide-out',
    duration: 200,
  },
};

export default mantineAdapter;
```

## Toast Component

```typescript
// src/adapters/mantine/Toast.tsx

import React, { memo, forwardRef } from 'react';
import { Notification, CloseButton } from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconAlertTriangle, 
  IconInfoCircle 
} from '@tabler/icons-react';
import type { IToastProps } from '../../components/Toast/Toast';

const variantConfig = {
  success: { color: 'green', icon: IconCheck },
  error: { color: 'red', icon: IconX },
  warning: { color: 'yellow', icon: IconAlertTriangle },
  info: { color: 'blue', icon: IconInfoCircle },
  default: { color: 'gray', icon: null },
};

export const MantineToast = memo(
  forwardRef<HTMLDivElement, IToastProps>(function MantineToast(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      action,
      onDismiss,
    } = props;

    const config = variantConfig[variant];
    const IconComponent = config.icon;
    const displayIcon = icon ?? (IconComponent ? <IconComponent size={18} /> : undefined);

    return (
      <Notification
        ref={ref}
        title={title}
        color={config.color}
        icon={displayIcon}
        withCloseButton={dismissible}
        onClose={onDismiss}
        withBorder
      >
        {message}
        {action && (
          <Button 
            variant="subtle" 
            size="xs" 
            mt="xs"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </Notification>
    );
  })
);
```

## Modal Component

```typescript
// src/adapters/mantine/Modal.tsx

import React, { memo, forwardRef } from 'react';
import { Modal as MantineModalPrimitive } from '@mantine/core';
import type { IModalProps } from '../../components/Modal/Modal';

const sizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  full: '100%',
};

export const MantineModal = memo(
  forwardRef<HTMLDivElement, IModalProps>(function MantineModal(props, ref) {
    const {
      title,
      content,
      size = 'md',
      closable = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
      status,
      onRequestClose,
      centered,
    } = props;

    const isOpen = status !== 'removed' && status !== 'exiting';

    return (
      <MantineModalPrimitive
        opened={isOpen}
        onClose={onRequestClose}
        title={title}
        size={sizeMap[size]}
        centered={centered}
        withCloseButton={closable}
        closeOnClickOutside={closeOnBackdropClick}
        closeOnEscape={closeOnEscape}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {content}
        {footer && (
          <div style={{ marginTop: 16 }}>
            {footer}
          </div>
        )}
      </MantineModalPrimitive>
    );
  })
);
```

## Loading Component

```typescript
// src/adapters/mantine/Loading.tsx

import React, { memo, forwardRef } from 'react';
import { Loader, Text, Stack } from '@mantine/core';
import type { ILoadingProps } from '../../components/Loading/Loading';

const sizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const spinnerMap = {
  default: 'oval',
  dots: 'dots',
  bars: 'bars',
  ring: 'oval',
  pulse: 'dots',
};

export const MantineLoading = memo(
  forwardRef<HTMLDivElement, ILoadingProps>(function MantineLoading(props, ref) {
    const {
      message,
      spinner = 'default',
      size = 'md',
    } = props;

    return (
      <Stack ref={ref} align="center" gap="xs">
        <Loader 
          type={spinnerMap[spinner]} 
          size={sizeMap[size]} 
        />
        {message && (
          <Text size="sm" c="dimmed">
            {message}
          </Text>
        )}
      </Stack>
    );
  })
);
```

## LoadingOverlay Component

```typescript
// src/adapters/mantine/LoadingOverlay.tsx

import React, { memo, forwardRef } from 'react';
import { LoadingOverlay as MantineLoadingOverlayPrimitive, Button } from '@mantine/core';
import type { ILoadingOverlayProps } from '../../components/Loading/LoadingOverlay';

export const MantineLoadingOverlay = memo(
  forwardRef<HTMLDivElement, ILoadingOverlayProps>(function MantineLoadingOverlay(props, ref) {
    const {
      message,
      overlayOpacity = 0.5,
      blur = false,
      blurAmount = '4px',
      cancellable,
      onCancel,
      cancelText = 'Cancel',
      status,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';

    return (
      <MantineLoadingOverlayPrimitive
        visible={isVisible}
        overlayProps={{
          backgroundOpacity: overlayOpacity,
          blur: blur ? parseInt(blurAmount) : 0,
        }}
        loaderProps={{
          children: (
            <div style={{ textAlign: 'center' }}>
              <Loader size="lg" />
              {message && (
                <Text mt="md" c="white">{message}</Text>
              )}
              {cancellable && onCancel && (
                <Button mt="md" variant="white" onClick={onCancel}>
                  {cancelText}
                </Button>
              )}
            </div>
          ),
        }}
      />
    );
  })
);
```

## Alert Component

```typescript
// src/adapters/mantine/Alert.tsx

import React, { memo, forwardRef } from 'react';
import { Alert as MantineAlertPrimitive, Button, Group } from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconAlertTriangle, 
  IconInfoCircle 
} from '@tabler/icons-react';
import type { IAlertProps } from '../../components/Alert/Alert';

const variantConfig = {
  success: { color: 'green', icon: IconCheck },
  error: { color: 'red', icon: IconX },
  warning: { color: 'yellow', icon: IconAlertTriangle },
  info: { color: 'blue', icon: IconInfoCircle },
  default: { color: 'gray', icon: IconInfoCircle },
};

export const MantineAlert = memo(
  forwardRef<HTMLDivElement, IAlertProps>(function MantineAlert(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      actions,
      onRequestDismiss,
    } = props;

    const config = variantConfig[variant];
    const IconComponent = config.icon;
    const displayIcon = icon ?? <IconComponent size={18} />;

    return (
      <MantineAlertPrimitive
        ref={ref}
        title={title}
        color={config.color}
        icon={displayIcon}
        withCloseButton={dismissible}
        onClose={onRequestDismiss}
      >
        {message}
        {actions && actions.length > 0 && (
          <Group mt="md">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant === 'primary' ? 'filled' : 'subtle'}
                size="xs"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </Group>
        )}
      </MantineAlertPrimitive>
    );
  })
);
```

## Progress Component

```typescript
// src/adapters/mantine/Progress.tsx

import React, { memo, forwardRef } from 'react';
import { Progress as MantineProgressPrimitive, Text, Group } from '@mantine/core';
import type { IProgressProps } from '../../components/Progress/LinearProgress';

const variantColors = {
  default: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
};

export const MantineProgress = memo(
  forwardRef<HTMLDivElement, IProgressProps>(function MantineProgress(props, ref) {
    const {
      value,
      max = 100,
      label,
      showPercentage,
      variant = 'default',
      indeterminate,
      size = 'md',
      striped,
      animated,
    } = props;

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref}>
        {(label || showPercentage) && (
          <Group justify="space-between" mb="xs">
            {label && <Text size="sm">{label}</Text>}
            {showPercentage && !indeterminate && (
              <Text size="sm" c="dimmed">{Math.round(percentage)}%</Text>
            )}
          </Group>
        )}
        <MantineProgressPrimitive
          value={indeterminate ? 100 : percentage}
          color={variantColors[variant]}
          size={size}
          striped={striped}
          animated={animated || indeterminate}
        />
      </div>
    );
  })
);
```

## Confirm Component

```typescript
// src/adapters/mantine/Confirm.tsx

import React, { memo, forwardRef, useState } from 'react';
import { Modal, Button, Text, Group, Stack } from '@mantine/core';
import type { IConfirmProps } from '../../components/Confirm/Confirm';

export const MantineConfirm = memo(
  forwardRef<HTMLDivElement, IConfirmProps>(function MantineConfirm(props, ref) {
    const {
      message,
      title = 'Confirm',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      icon,
      onConfirm,
      onCancel,
      status,
    } = props;

    const [loading, setLoading] = useState(false);
    const isOpen = status !== 'removed' && status !== 'exiting';

    const handleConfirm = async () => {
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal
        opened={isOpen}
        onClose={onCancel || (() => {})}
        title={title}
        centered
        withCloseButton={false}
      >
        <Stack>
          {icon && (
            <div style={{ textAlign: 'center' }}>
              {icon}
            </div>
          )}
          
          <Text ta="center">{message}</Text>
          
          <Group justify="center" mt="md">
            <Button
              variant="default"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              color={confirmVariant === 'danger' ? 'red' : 'blue'}
              onClick={handleConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  })
);
```

## Implementation Checklist

- [ ] Create all component files in `src/adapters/mantine/`
- [ ] Create `src/adapters/mantine/index.ts`
- [ ] Write integration tests
- [ ] Test with MantineProvider
- [ ] Test dark mode
- [ ] Update IMPLEMENTATION.md

## Notes

- Requires @mantine/core and @mantine/hooks
- Uses Mantine's built-in components
- Follows Mantine design patterns
- @tabler/icons-react for default icons
