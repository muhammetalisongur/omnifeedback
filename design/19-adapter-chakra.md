# Design: Chakra UI Adapter

## Overview
Implement the Chakra UI adapter using @chakra-ui/react components.

## Dependencies

```json
{
  "peerDependencies": {
    "@chakra-ui/react": "^2.8.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  }
}
```

## Adapter Structure

```typescript
// src/adapters/chakra/index.ts

import type { IFeedbackAdapter } from '../types';
import { ChakraToast } from './Toast';
import { ChakraToastContainer } from './ToastContainer';
import { ChakraModal } from './Modal';
import { ChakraLoading } from './Loading';
import { ChakraLoadingOverlay } from './LoadingOverlay';
import { ChakraAlert } from './Alert';
import { ChakraProgress } from './Progress';
import { ChakraConfirm } from './Confirm';

export const chakraAdapter: IFeedbackAdapter = {
  name: 'chakra',
  version: '1.0.0',
  
  ToastComponent: ChakraToast,
  ToastContainerComponent: ChakraToastContainer,
  ModalComponent: ChakraModal,
  LoadingComponent: ChakraLoading,
  LoadingOverlayComponent: ChakraLoadingOverlay,
  AlertComponent: ChakraAlert,
  ProgressComponent: ChakraProgress,
  ConfirmComponent: ChakraConfirm,
  
  isDarkMode: () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.getAttribute('data-theme') === 'dark' ||
           document.body.classList.contains('chakra-ui-dark');
  },
  
  animations: {
    enter: 'chakra-slide-in',
    exit: 'chakra-slide-out',
    duration: 200,
  },
};

export default chakraAdapter;
```

## Toast Component

```typescript
// src/adapters/chakra/Toast.tsx

import React, { memo, forwardRef } from 'react';
import {
  Box,
  Flex,
  Text,
  CloseButton,
  Icon,
  Button,
} from '@chakra-ui/react';
import { 
  CheckCircleIcon, 
  WarningIcon, 
  InfoIcon,
  WarningTwoIcon,
} from '@chakra-ui/icons';
import type { IToastProps } from '../../components/Toast/Toast';

const variantConfig = {
  success: { 
    bg: 'green.100', 
    borderColor: 'green.500', 
    color: 'green.800',
    icon: CheckCircleIcon,
    iconColor: 'green.500',
  },
  error: { 
    bg: 'red.100', 
    borderColor: 'red.500', 
    color: 'red.800',
    icon: WarningTwoIcon,
    iconColor: 'red.500',
  },
  warning: { 
    bg: 'yellow.100', 
    borderColor: 'yellow.500', 
    color: 'yellow.800',
    icon: WarningIcon,
    iconColor: 'yellow.500',
  },
  info: { 
    bg: 'blue.100', 
    borderColor: 'blue.500', 
    color: 'blue.800',
    icon: InfoIcon,
    iconColor: 'blue.500',
  },
  default: { 
    bg: 'gray.100', 
    borderColor: 'gray.300', 
    color: 'gray.800',
    icon: InfoIcon,
    iconColor: 'gray.500',
  },
};

export const ChakraToast = memo(
  forwardRef<HTMLDivElement, IToastProps>(function ChakraToast(props, ref) {
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

    return (
      <Box
        ref={ref}
        bg={config.bg}
        borderLeft="4px solid"
        borderColor={config.borderColor}
        borderRadius="md"
        p={4}
        shadow="lg"
        maxW="sm"
        w="full"
      >
        <Flex>
          {(icon || config.icon) && (
            <Box flexShrink={0} mr={3}>
              {icon || <Icon as={config.icon} color={config.iconColor} boxSize={5} />}
            </Box>
          )}
          
          <Box flex={1}>
            {title && (
              <Text fontWeight="semibold" color={config.color} fontSize="sm">
                {title}
              </Text>
            )}
            <Text color={config.color} fontSize="sm">
              {message}
            </Text>
            
            {action && (
              <Button
                size="xs"
                variant="link"
                color={config.borderColor}
                mt={2}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
          </Box>

          {dismissible && (
            <CloseButton
              size="sm"
              onClick={onDismiss}
              ml={2}
            />
          )}
        </Flex>
      </Box>
    );
  })
);
```

## Modal Component

```typescript
// src/adapters/chakra/Modal.tsx

import React, { memo, forwardRef } from 'react';
import {
  Modal as ChakraModalPrimitive,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import type { IModalProps } from '../../components/Modal/Modal';

const sizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: '2xl',
  full: 'full',
};

export const ChakraModal = memo(
  forwardRef<HTMLDivElement, IModalProps>(function ChakraModal(props, ref) {
    const {
      title,
      content,
      size = 'md',
      closable = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
      header,
      status,
      onRequestClose,
      centered = true,
    } = props;

    const isOpen = status !== 'removed' && status !== 'exiting';

    return (
      <ChakraModalPrimitive
        isOpen={isOpen}
        onClose={onRequestClose}
        size={sizeMap[size]}
        isCentered={centered}
        closeOnOverlayClick={closeOnBackdropClick}
        closeOnEsc={closeOnEscape}
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent ref={ref}>
          {header !== undefined ? header : (
            title && <ModalHeader>{title}</ModalHeader>
          )}
          
          {closable && <ModalCloseButton />}
          
          <ModalBody>
            {content}
          </ModalBody>

          {footer && (
            <ModalFooter>
              {footer}
            </ModalFooter>
          )}
        </ModalContent>
      </ChakraModalPrimitive>
    );
  })
);
```

## Loading Component

```typescript
// src/adapters/chakra/Loading.tsx

import React, { memo, forwardRef } from 'react';
import { Spinner, Text, VStack } from '@chakra-ui/react';
import type { ILoadingProps } from '../../components/Loading/Loading';

const sizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

export const ChakraLoading = memo(
  forwardRef<HTMLDivElement, ILoadingProps>(function ChakraLoading(props, ref) {
    const {
      message,
      size = 'md',
      variant = 'primary',
    } = props;

    const colorScheme = variant === 'white' ? 'whiteAlpha' : 'blue';

    return (
      <VStack ref={ref} spacing={3}>
        <Spinner
          size={sizeMap[size]}
          color={`${colorScheme}.500`}
          thickness="3px"
        />
        {message && (
          <Text fontSize="sm" color={variant === 'white' ? 'white' : 'gray.600'}>
            {message}
          </Text>
        )}
      </VStack>
    );
  })
);
```

## Alert Component

```typescript
// src/adapters/chakra/Alert.tsx

import React, { memo, forwardRef } from 'react';
import {
  Alert as ChakraAlertPrimitive,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  Button,
  HStack,
} from '@chakra-ui/react';
import type { IAlertProps } from '../../components/Alert/Alert';

const statusMap = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  default: 'info',
};

export const ChakraAlert = memo(
  forwardRef<HTMLDivElement, IAlertProps>(function ChakraAlert(props, ref) {
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
      <ChakraAlertPrimitive
        ref={ref}
        status={statusMap[variant]}
        variant="left-accent"
        borderRadius="md"
      >
        {!hideIcon && (icon || <AlertIcon />)}
        
        <Box flex={1}>
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{message}</AlertDescription>
          
          {actions && actions.length > 0 && (
            <HStack mt={3}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant === 'primary' ? 'solid' : 'ghost'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </HStack>
          )}
        </Box>

        {dismissible && (
          <CloseButton
            position="absolute"
            right={2}
            top={2}
            onClick={onRequestDismiss}
          />
        )}
      </ChakraAlertPrimitive>
    );
  })
);
```

## Progress Component

```typescript
// src/adapters/chakra/Progress.tsx

import React, { memo, forwardRef } from 'react';
import { Progress as ChakraProgressPrimitive, Text, Flex, Box } from '@chakra-ui/react';
import type { IProgressProps } from '../../components/Progress/LinearProgress';

const colorSchemeMap = {
  default: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
};

export const ChakraProgress = memo(
  forwardRef<HTMLDivElement, IProgressProps>(function ChakraProgress(props, ref) {
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
      <Box ref={ref} w="full">
        {(label || showPercentage) && (
          <Flex justify="space-between" mb={2}>
            {label && <Text fontSize="sm">{label}</Text>}
            {showPercentage && !indeterminate && (
              <Text fontSize="sm" color="gray.500">{Math.round(percentage)}%</Text>
            )}
          </Flex>
        )}
        <ChakraProgressPrimitive
          value={indeterminate ? undefined : percentage}
          isIndeterminate={indeterminate}
          colorScheme={colorSchemeMap[variant]}
          size={size}
          hasStripe={striped}
          isAnimated={animated}
          borderRadius="full"
        />
      </Box>
    );
  })
);
```

## Confirm Component

```typescript
// src/adapters/chakra/Confirm.tsx

import React, { memo, forwardRef, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';
import type { IConfirmProps } from '../../components/Confirm/Confirm';

export const ChakraConfirm = memo(
  forwardRef<HTMLDivElement, IConfirmProps>(function ChakraConfirm(props, ref) {
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
    const cancelRef = useRef<HTMLButtonElement>(null);
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
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCancel || (() => {})}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack spacing={4}>
                {icon && <Box>{icon}</Box>}
                <Text textAlign="center">{message}</Text>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onCancel}
                isDisabled={loading}
              >
                {cancelText}
              </Button>
              <Button
                colorScheme={confirmVariant === 'danger' ? 'red' : 'blue'}
                onClick={handleConfirm}
                isLoading={loading}
                ml={3}
              >
                {confirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  })
);
```

## Implementation Checklist

- [ ] Create all component files in `src/adapters/chakra/`
- [ ] Create `src/adapters/chakra/index.ts`
- [ ] Write integration tests
- [ ] Test with ChakraProvider
- [ ] Test dark mode
- [ ] Update IMPLEMENTATION.md

## Notes

- Requires @chakra-ui/react
- Uses Chakra's built-in components
- Follows Chakra design patterns
- @chakra-ui/icons for default icons
