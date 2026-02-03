# Design: Ant Design Adapter

## Overview
Implement the Ant Design adapter using antd components.

## Dependencies

```json
{
  "peerDependencies": {
    "antd": "^5.0.0"
  }
}
```

## Adapter Structure

```typescript
// src/adapters/antd/index.ts

import type { IFeedbackAdapter } from '../types';
import { AntdToast } from './Toast';
import { AntdToastContainer } from './ToastContainer';
import { AntdModal } from './Modal';
import { AntdLoading } from './Loading';
import { AntdLoadingOverlay } from './LoadingOverlay';
import { AntdAlert } from './Alert';
import { AntdProgress } from './Progress';
import { AntdConfirm } from './Confirm';

export const antdAdapter: IFeedbackAdapter = {
  name: 'antd',
  version: '1.0.0',
  
  ToastComponent: AntdToast,
  ToastContainerComponent: AntdToastContainer,
  ModalComponent: AntdModal,
  LoadingComponent: AntdLoading,
  LoadingOverlayComponent: AntdLoadingOverlay,
  AlertComponent: AntdAlert,
  ProgressComponent: AntdProgress,
  ConfirmComponent: AntdConfirm,
  
  isDarkMode: () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-theme') === 'dark';
  },
  
  animations: {
    enter: 'ant-slide-up-enter',
    exit: 'ant-slide-up-leave',
    duration: 200,
  },
};

export default antdAdapter;
```

## Toast Component (using notification API style)

```typescript
// src/adapters/antd/Toast.tsx

import React, { memo, forwardRef } from 'react';
import { Alert, Button, Space } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { IToastProps } from '../../components/Toast/Toast';

const typeMap = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  default: 'info',
} as const;

const iconMap = {
  success: <CheckCircleOutlined />,
  error: <CloseCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
  info: <InfoCircleOutlined />,
  default: <InfoCircleOutlined />,
};

export const AntdToast = memo(
  forwardRef<HTMLDivElement, IToastProps>(function AntdToast(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      action,
      onDismiss,
    } = props;

    return (
      <Alert
        ref={ref}
        message={title || message}
        description={title ? message : undefined}
        type={typeMap[variant]}
        showIcon
        icon={icon || iconMap[variant]}
        closable={dismissible}
        onClose={onDismiss}
        action={
          action && (
            <Button size="small" type="link" onClick={action.onClick}>
              {action.label}
            </Button>
          )
        }
        style={{ width: 350 }}
      />
    );
  })
);
```

## Modal Component

```typescript
// src/adapters/antd/Modal.tsx

import React, { memo, forwardRef } from 'react';
import { Modal as AntdModalPrimitive } from 'antd';
import type { IModalProps } from '../../components/Modal/Modal';

const widthMap = {
  sm: 400,
  md: 520,
  lg: 720,
  xl: 1000,
  full: '100%',
};

export const AntdModal = memo(
  forwardRef<HTMLDivElement, IModalProps>(function AntdModal(props, ref) {
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
      centered = true,
    } = props;

    const isOpen = status !== 'removed' && status !== 'exiting';

    return (
      <AntdModalPrimitive
        open={isOpen}
        title={title}
        onCancel={onRequestClose}
        width={widthMap[size]}
        centered={centered}
        closable={closable}
        maskClosable={closeOnBackdropClick}
        keyboard={closeOnEscape}
        footer={footer}
        destroyOnClose
      >
        {content}
      </AntdModalPrimitive>
    );
  })
);
```

## Loading Component

```typescript
// src/adapters/antd/Loading.tsx

import React, { memo, forwardRef } from 'react';
import { Spin, Typography, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { ILoadingProps } from '../../components/Loading/Loading';

const sizeMap = {
  sm: 'small',
  md: 'default',
  lg: 'large',
} as const;

export const AntdLoading = memo(
  forwardRef<HTMLDivElement, ILoadingProps>(function AntdLoading(props, ref) {
    const {
      message,
      size = 'md',
    } = props;

    return (
      <Space ref={ref} direction="vertical" align="center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: size === 'lg' ? 48 : 24 }} spin />}
          size={sizeMap[size]}
        />
        {message && (
          <Typography.Text type="secondary">{message}</Typography.Text>
        )}
      </Space>
    );
  })
);
```

## LoadingOverlay Component

```typescript
// src/adapters/antd/LoadingOverlay.tsx

import React, { memo, forwardRef } from 'react';
import { Spin, Typography, Button, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';
import { Z_INDEX } from '../../utils/constants';
import type { ILoadingOverlayProps } from '../../components/Loading/LoadingOverlay';

export const AntdLoadingOverlay = memo(
  forwardRef<HTMLDivElement, ILoadingOverlayProps>(function AntdLoadingOverlay(props, ref) {
    const {
      message,
      overlayOpacity = 0.5,
      blur,
      cancellable,
      onCancel,
      cancelText = 'Cancel',
      status,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';

    if (typeof document === 'undefined' || !isVisible) return null;

    return createPortal(
      <div
        ref={ref}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          backdropFilter: blur ? 'blur(4px)' : undefined,
          zIndex: Z_INDEX.LOADING_OVERLAY,
        }}
      >
        <Space direction="vertical" align="center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />} />
          {message && (
            <Typography.Text style={{ color: 'white' }}>{message}</Typography.Text>
          )}
          {cancellable && onCancel && (
            <Button ghost onClick={onCancel}>{cancelText}</Button>
          )}
        </Space>
      </div>,
      document.body
    );
  })
);
```

## Alert Component

```typescript
// src/adapters/antd/Alert.tsx

import React, { memo, forwardRef } from 'react';
import { Alert as AntdAlertPrimitive, Button, Space } from 'antd';
import type { IAlertProps } from '../../components/Alert/Alert';

const typeMap = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  default: 'info',
} as const;

export const AntdAlert = memo(
  forwardRef<HTMLDivElement, IAlertProps>(function AntdAlert(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      hideIcon,
      actions,
      onRequestDismiss,
    } = props;

    return (
      <AntdAlertPrimitive
        ref={ref}
        message={title || message}
        description={title ? message : undefined}
        type={typeMap[variant]}
        showIcon={!hideIcon}
        icon={icon}
        closable={dismissible}
        onClose={onRequestDismiss}
        action={
          actions && actions.length > 0 && (
            <Space>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="small"
                  type={action.variant === 'primary' ? 'primary' : 'default'}
                  danger={action.variant === 'danger'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          )
        }
      />
    );
  })
);
```

## Progress Component

```typescript
// src/adapters/antd/Progress.tsx

import React, { memo, forwardRef } from 'react';
import { Progress as AntdProgressPrimitive, Typography, Space } from 'antd';
import type { IProgressProps } from '../../components/Progress/LinearProgress';

const statusMap = {
  default: 'normal',
  success: 'success',
  error: 'exception',
  warning: 'normal',
} as const;

export const AntdProgress = memo(
  forwardRef<HTMLDivElement, IProgressProps>(function AntdProgress(props, ref) {
    const {
      value,
      max = 100,
      label,
      showPercentage = true,
      variant = 'default',
      indeterminate,
      type = 'linear',
      size = 'md',
    } = props;

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <Space ref={ref} direction="vertical" style={{ width: '100%' }}>
        {label && <Typography.Text>{label}</Typography.Text>}
        <AntdProgressPrimitive
          percent={indeterminate ? undefined : percentage}
          status={indeterminate ? 'active' : statusMap[variant]}
          type={type === 'circular' ? 'circle' : 'line'}
          showInfo={showPercentage && !indeterminate}
          size={size === 'sm' ? 'small' : 'default'}
          strokeColor={variant === 'warning' ? '#faad14' : undefined}
        />
      </Space>
    );
  })
);
```

## Confirm Component

```typescript
// src/adapters/antd/Confirm.tsx

import React, { memo, forwardRef, useState } from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { IConfirmProps } from '../../components/Confirm/Confirm';

export const AntdConfirm = memo(
  forwardRef<HTMLDivElement, IConfirmProps>(function AntdConfirm(props, ref) {
    const {
      message,
      title = 'Confirm',
      confirmText = 'OK',
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
        open={isOpen}
        title={
          <Space>
            {icon || <ExclamationCircleOutlined style={{ color: confirmVariant === 'danger' ? '#ff4d4f' : '#1890ff' }} />}
            <span>{title}</span>
          </Space>
        }
        onCancel={onCancel}
        centered
        footer={
          <Space>
            <Button onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button
              type="primary"
              danger={confirmVariant === 'danger'}
              onClick={handleConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </Space>
        }
      >
        <Typography.Paragraph style={{ textAlign: 'center', margin: 0 }}>
          {message}
        </Typography.Paragraph>
      </Modal>
    );
  })
);
```

## Implementation Checklist

- [ ] Create all component files in `src/adapters/antd/`
- [ ] Create `src/adapters/antd/index.ts`
- [ ] Write integration tests
- [ ] Test with ConfigProvider
- [ ] Test dark mode
- [ ] Update IMPLEMENTATION.md

## Notes

- Requires antd v5+
- Uses Ant Design's built-in components
- Follows Ant Design patterns
- @ant-design/icons for default icons
