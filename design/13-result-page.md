# Design: Result Page System

## Overview
Implement a result page component for displaying operation outcomes (success, error, info) with actions. Used after form submissions, payments, or important operations.

## Goals
- Clear success/error feedback
- Support for different result types
- Action buttons for next steps
- Extra content support
- Suitable for full pages or sections
- Work with all UI library adapters

## Result Types

```
SUCCESS                          ERROR
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │
│          ✅             │     │          ❌             │
│                         │     │                         │
│    Ödeme Başarılı!      │     │    Ödeme Başarısız      │
│                         │     │                         │
│  Siparişiniz #12345     │     │  Kartınız reddedildi.   │
│   oluşturuldu.          │     │  Farklı bir kart        │
│                         │     │  deneyin.               │
│ [Siparişi Gör] [Devam]  │     │                         │
│                         │     │ [Tekrar Dene] [İptal]   │
└─────────────────────────┘     └─────────────────────────┘

INFO                             WARNING
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │
│          ℹ️             │     │          ⚠️             │
│                         │     │                         │
│  E-posta Gönderildi     │     │    Dikkat Gerekiyor     │
│                         │     │                         │
│  Doğrulama bağlantısı   │     │  Hesabınızda olağan     │
│  gönderildi.            │     │  dışı aktivite          │
│                         │     │  tespit edildi.         │
│    [Anladım]            │     │                         │
│                         │     │  [Güvenliği İncele]     │
└─────────────────────────┘     └─────────────────────────┘
```

## Result API

### Component Interface

```typescript
// src/components/Result/Result.tsx

export interface IResultProps {
  /** Result status */
  status: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  /** Title */
  title: string;
  /** Description/subtitle */
  description?: string;
  /** Custom icon (overrides status icon) */
  icon?: React.ReactNode;
  /** Primary action */
  primaryAction?: IResultAction;
  /** Secondary action */
  secondaryAction?: IResultAction;
  /** Additional actions */
  extraActions?: IResultAction[];
  /** Extra content below actions */
  extra?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

export interface IResultAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon */
  icon?: React.ReactNode;
}
```

### useResult Hook Interface

```typescript
// src/hooks/useResult.ts

export interface IUseResultReturn {
  /** Show success result */
  success: (options: IResultShowOptions) => string;
  /** Show error result */
  error: (options: IResultShowOptions) => string;
  /** Show info result */
  info: (options: IResultShowOptions) => string;
  /** Show warning result */
  warning: (options: IResultShowOptions) => string;
  /** Show generic result */
  show: (options: IResultOptions) => string;
  /** Hide result */
  hide: (id: string) => void;
}

export interface IResultShowOptions {
  title: string;
  description?: string;
  primaryAction?: IResultAction;
  secondaryAction?: IResultAction;
}
```

## Usage Examples

```typescript
import { Result, useFeedback } from 'omnifeedback';

// ===== DECLARATIVE (Component) =====

function PaymentSuccess({ orderId }) {
  return (
    <Result
      status="success"
      title="Ödeme Başarılı!"
      description={`Siparişiniz #${orderId} başarıyla oluşturuldu.`}
      primaryAction={{
        label: 'Siparişi Görüntüle',
        onClick: () => navigate(`/orders/${orderId}`),
      }}
      secondaryAction={{
        label: 'Alışverişe Devam Et',
        onClick: () => navigate('/'),
      }}
      extra={
        <div className="mt-4 text-sm text-gray-500">
          Sipariş detayları e-posta adresinize gönderildi.
        </div>
      }
    />
  );
}

function PaymentError({ error, retry }) {
  return (
    <Result
      status="error"
      title="Ödeme Başarısız"
      description={error.message || 'Ödeme işlemi gerçekleştirilemedi.'}
      primaryAction={{
        label: 'Tekrar Dene',
        onClick: retry,
      }}
      secondaryAction={{
        label: 'İptal Et',
        onClick: () => navigate('/cart'),
      }}
    />
  );
}

function EmailSent() {
  return (
    <Result
      status="info"
      title="E-posta Gönderildi"
      description="Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
      primaryAction={{
        label: 'Giriş Sayfasına Dön',
        onClick: () => navigate('/login'),
      }}
    />
  );
}

// ===== HTTP ERROR PAGES =====

function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Sayfa Bulunamadı"
      description="Aradığınız sayfa mevcut değil veya taşınmış olabilir."
      primaryAction={{
        label: 'Ana Sayfaya Git',
        onClick: () => navigate('/'),
      }}
    />
  );
}

function ForbiddenPage() {
  return (
    <Result
      status="403"
      title="Erişim Engellendi"
      description="Bu sayfayı görüntüleme yetkiniz bulunmuyor."
      primaryAction={{
        label: 'Ana Sayfaya Git',
        onClick: () => navigate('/'),
      }}
      secondaryAction={{
        label: 'Yetki Talep Et',
        onClick: requestAccess,
      }}
    />
  );
}

function ServerErrorPage() {
  return (
    <Result
      status="500"
      title="Sunucu Hatası"
      description="Bir şeyler yanlış gitti. Lütfen daha sonra tekrar deneyin."
      primaryAction={{
        label: 'Yeniden Dene',
        onClick: () => window.location.reload(),
      }}
    />
  );
}

// ===== IMPERATIVE (Hook) =====

function FormSubmit() {
  const { result } = useFeedback();

  const handleSubmit = async () => {
    try {
      await submitForm();
      result.success({
        title: 'Form Gönderildi',
        description: 'Talebiniz başarıyla alındı.',
        primaryAction: {
          label: 'Tamam',
          onClick: () => navigate('/'),
        },
      });
    } catch (error) {
      result.error({
        title: 'Gönderim Başarısız',
        description: error.message,
        primaryAction: {
          label: 'Tekrar Dene',
          onClick: handleSubmit,
        },
      });
    }
  };
}

// ===== WITH EXTRA CONTENT =====

function SubscriptionSuccess() {
  return (
    <Result
      status="success"
      title="Abonelik Aktif!"
      description="Pro planına başarıyla geçiş yaptınız."
      primaryAction={{
        label: 'Kontrol Paneline Git',
        onClick: () => navigate('/dashboard'),
      }}
      extra={
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Yeni Özellikleriniz:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Sınırsız proje</li>
            <li>Öncelikli destek</li>
            <li>Gelişmiş analitik</li>
          </ul>
        </div>
      }
    />
  );
}
```

## Component Architecture

### Result Component

```typescript
// src/components/Result/Result.tsx

import React, { memo, forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { IResultProps, IResultAction } from './types';

const statusConfig = {
  success: {
    icon: <CheckCircleIcon className="w-16 h-16 text-green-500" />,
    iconBg: 'bg-green-100',
  },
  error: {
    icon: <XCircleIcon className="w-16 h-16 text-red-500" />,
    iconBg: 'bg-red-100',
  },
  info: {
    icon: <InformationCircleIcon className="w-16 h-16 text-blue-500" />,
    iconBg: 'bg-blue-100',
  },
  warning: {
    icon: <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500" />,
    iconBg: 'bg-yellow-100',
  },
  '404': {
    icon: <FileQuestionIcon className="w-16 h-16 text-gray-500" />,
    iconBg: 'bg-gray-100',
  },
  '403': {
    icon: <ShieldXIcon className="w-16 h-16 text-red-500" />,
    iconBg: 'bg-red-100',
  },
  '500': {
    icon: <ServerCrashIcon className="w-16 h-16 text-red-500" />,
    iconBg: 'bg-red-100',
  },
};

const sizeStyles = {
  sm: {
    container: 'py-8 px-4',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    container: 'py-12 px-6',
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    container: 'py-16 px-8',
    icon: 'w-20 h-20',
    title: 'text-2xl',
    description: 'text-lg',
  },
};

export const Result = memo(
  forwardRef<HTMLDivElement, IResultProps>(function Result(props, ref) {
    const {
      status,
      title,
      description,
      icon: customIcon,
      primaryAction,
      secondaryAction,
      extraActions,
      extra,
      size = 'md',
      className,
      testId,
    } = props;

    const config = statusConfig[status];
    const styles = sizeStyles[size];
    const displayIcon = customIcon ?? config.icon;

    return (
      <div
        ref={ref}
        role="status"
        data-testid={testId}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          styles.container,
          className
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'rounded-full p-4 mb-6',
            config.iconBg
          )}
        >
          {React.isValidElement(displayIcon)
            ? React.cloneElement(displayIcon as React.ReactElement, {
                className: cn(styles.icon, (displayIcon as React.ReactElement).props.className),
              })
            : displayIcon}
        </div>

        {/* Title */}
        <h1
          className={cn(
            'font-bold text-gray-900 dark:text-gray-100 mb-2',
            styles.title
          )}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            className={cn(
              'text-gray-500 dark:text-gray-400 max-w-md mb-8',
              styles.description
            )}
          >
            {description}
          </p>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {primaryAction && (
              <ResultButton action={primaryAction} variant="primary" />
            )}
            {secondaryAction && (
              <ResultButton action={secondaryAction} variant="secondary" />
            )}
          </div>
        )}

        {/* Extra Actions */}
        {extraActions && extraActions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {extraActions.map((action, index) => (
              <ResultButton key={index} action={action} variant="link" />
            ))}
          </div>
        )}

        {/* Extra Content */}
        {extra && <div className="w-full max-w-md">{extra}</div>}
      </div>
    );
  })
);

Result.displayName = 'Result';

// Action button component
function ResultButton({
  action,
  variant,
}: {
  action: IResultAction;
  variant: 'primary' | 'secondary' | 'link';
}) {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5',
    secondary: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2.5',
    link: 'text-blue-600 dark:text-blue-400 hover:underline',
  };

  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled || action.loading}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant]
      )}
    >
      {action.loading ? (
        <LoadingSpinner className="w-4 h-4" />
      ) : (
        action.icon
      )}
      {action.label}
    </button>
  );
}
```

## Accessibility

```typescript
role="status"
aria-live="polite"

// For error results:
role="alert"
```

## Testing Checklist

```typescript
describe('Result', () => {
  it('should render success status', () => {});
  it('should render error status', () => {});
  it('should render info status', () => {});
  it('should render warning status', () => {});
  it('should render 404 status', () => {});
  it('should render 403 status', () => {});
  it('should render 500 status', () => {});
  it('should render custom icon', () => {});
  it('should render primary action', () => {});
  it('should render secondary action', () => {});
  it('should render extra content', () => {});
  it('should apply size styles', () => {});
  it('should show loading state on action', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/components/Result/Result.tsx`
- [ ] Create `src/components/Result/types.ts`
- [ ] Create `src/components/Result/index.ts`
- [ ] Create `src/hooks/useResult.ts` (optional)
- [ ] Add icons for each status
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Missing Actions
❌ **Don't:** Show result without next step
✅ **Do:** Always provide at least one action

### 2. Vague Messages
❌ **Don't:** "Error occurred"
✅ **Do:** "Payment failed. Your card was declined."

### 3. No Error Details
❌ **Don't:** Hide error information
✅ **Do:** Show helpful error details in description

## Notes

- Result is primarily used for full-page outcomes
- Can be used in modals for smaller flows
- Consider using Empty for "no data" scenarios
- Result is for "operation completed" scenarios
