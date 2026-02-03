# Design: Prompt Dialog System

## Overview
Implement a promise-based input dialog similar to browser's `prompt()`. Used for quick user input without building a full form.

## Goals
- Promise-based API (await result)
- Multiple input types (text, email, number, textarea)
- Input validation support
- Default value support
- Cancel returns null
- Work with all UI library adapters

## Prompt vs Confirm

```
CONFIRM                          PROMPT
┌─────────────────────────┐     ┌─────────────────────────┐
│   Silmek istiyor        │     │   Yeni isim girin       │
│   musunuz?              │     │                         │
│                         │     │   ┌─────────────────┐   │
│   [Hayır]    [Evet]     │     │   │ document.pdf    │   │
│                         │     │   └─────────────────┘   │
└─────────────────────────┘     │                         │
                                │   [İptal]   [Kaydet]    │
   Returns: boolean             └─────────────────────────┘
                                
                                   Returns: string | null
```

## Prompt API

### usePrompt Hook Interface

```typescript
// src/hooks/usePrompt.ts

export interface IUsePromptReturn {
  /** Show prompt and await result */
  show: (options: IPromptOptions) => Promise<string | null>;
  
  /** Show text prompt (shorthand) */
  text: (title: string, options?: Partial<IPromptOptions>) => Promise<string | null>;
  
  /** Show textarea prompt */
  textarea: (title: string, options?: Partial<IPromptOptions>) => Promise<string | null>;
  
  /** Show email prompt */
  email: (title: string, options?: Partial<IPromptOptions>) => Promise<string | null>;
  
  /** Show number prompt */
  number: (title: string, options?: Partial<IPromptOptions>) => Promise<number | null>;
  
  /** Close prompt without result */
  close: () => void;
  
  /** Check if prompt is open */
  isOpen: boolean;
}
```

### Prompt Options

```typescript
// From src/core/types.ts

export interface IPromptOptions extends IBaseFeedbackOptions {
  /** Dialog title */
  title: string;
  /** Description text */
  description?: string;
  /** Input type */
  inputType?: 'text' | 'email' | 'number' | 'password' | 'url' | 'tel' | 'textarea';
  /** Input placeholder */
  placeholder?: string;
  /** Default value */
  defaultValue?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Input label */
  label?: string;
  /** Validation function */
  validate?: (value: string) => string | true;
  /** Required field */
  required?: boolean;
  /** Min length */
  minLength?: number;
  /** Max length */
  maxLength?: number;
  /** Pattern (regex) */
  pattern?: RegExp;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Textarea rows (only for textarea type) */
  rows?: number;
  /** Auto-focus input */
  autoFocus?: boolean;
  /** Select all text on focus */
  selectOnFocus?: boolean;
}
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { prompt } = useFeedback();

  // ===== BASIC TEXT PROMPT =====
  const handleRename = async () => {
    const newName = await prompt.text('Yeni dosya adı', {
      defaultValue: 'document.pdf',
      placeholder: 'Dosya adını girin',
    });

    if (newName) {
      await renameFile(newName);
    }
  };

  // ===== WITH VALIDATION =====
  const handleEmail = async () => {
    const email = await prompt.email('E-posta adresiniz', {
      placeholder: 'ornek@mail.com',
      validate: (value) => {
        if (!value.includes('@')) {
          return 'Geçerli bir e-posta adresi girin';
        }
        return true;
      },
    });

    if (email) {
      await subscribe(email);
    }
  };

  // ===== TEXTAREA FOR FEEDBACK =====
  const handleFeedback = async () => {
    const feedback = await prompt.textarea('Geri bildiriminiz', {
      placeholder: 'Düşüncelerinizi yazın...',
      description: 'Deneyiminizi nasıl iyileştirebileceğimizi bize bildirin.',
      rows: 5,
      maxLength: 500,
    });

    if (feedback) {
      await submitFeedback(feedback);
    }
  };

  // ===== NUMBER INPUT =====
  const handleQuantity = async () => {
    const quantity = await prompt.number('Adet', {
      defaultValue: '1',
      placeholder: 'Miktar girin',
      validate: (value) => {
        const num = parseInt(value);
        if (num < 1 || num > 100) {
          return '1-100 arası bir değer girin';
        }
        return true;
      },
    });

    if (quantity !== null) {
      updateQuantity(quantity);
    }
  };

  // ===== FULL OPTIONS =====
  const handleCustom = async () => {
    const result = await prompt.show({
      title: 'Proje Adı',
      description: 'Projeniz için benzersiz bir ad seçin',
      inputType: 'text',
      placeholder: 'ornek-proje',
      defaultValue: '',
      label: 'Proje Adı',
      confirmText: 'Oluştur',
      cancelText: 'Vazgeç',
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-z0-9-]+$/,
      validate: (value) => {
        if (value.startsWith('-')) {
          return 'Tire ile başlayamaz';
        }
        if (existingProjects.includes(value)) {
          return 'Bu isim zaten kullanılıyor';
        }
        return true;
      },
      icon: <FolderIcon className="w-6 h-6 text-blue-500" />,
      autoFocus: true,
      selectOnFocus: true,
    });

    if (result) {
      await createProject(result);
    }
  };

  // ===== PASSWORD PROMPT =====
  const handlePassword = async () => {
    const password = await prompt.show({
      title: 'Şifre Doğrulama',
      description: 'Devam etmek için şifrenizi girin',
      inputType: 'password',
      placeholder: '••••••••',
      confirmText: 'Doğrula',
      required: true,
    });

    if (password) {
      await verifyPassword(password);
    }
  };

  return (
    <div>
      <button onClick={handleRename}>Yeniden Adlandır</button>
      <button onClick={handleEmail}>E-posta</button>
      <button onClick={handleFeedback}>Geri Bildirim</button>
      <button onClick={handleQuantity}>Adet Seç</button>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/usePrompt.ts

import { useCallback, useContext, useState } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import type { IPromptOptions } from '../core/types';

export function usePrompt(): IUsePromptReturn {
  const context = useContext(FeedbackContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!context) {
    throw new Error('usePrompt must be used within FeedbackProvider');
  }

  const { manager } = context;

  const show = useCallback(
    (options: IPromptOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        setIsOpen(true);

        const id = manager.add('prompt', {
          inputType: 'text',
          confirmText: 'Tamam',
          cancelText: 'İptal',
          autoFocus: true,
          selectOnFocus: false,
          ...options,
          onConfirm: (value: string) => {
            manager.remove(id);
            setIsOpen(false);
            resolve(value);
          },
          onCancel: () => {
            manager.remove(id);
            setIsOpen(false);
            resolve(null);
          },
        });
      });
    },
    [manager]
  );

  const text = useCallback(
    (title: string, options?: Partial<IPromptOptions>) =>
      show({ title, inputType: 'text', ...options }),
    [show]
  );

  const textarea = useCallback(
    (title: string, options?: Partial<IPromptOptions>) =>
      show({ title, inputType: 'textarea', rows: 4, ...options }),
    [show]
  );

  const email = useCallback(
    (title: string, options?: Partial<IPromptOptions>) =>
      show({ title, inputType: 'email', ...options }),
    [show]
  );

  const number = useCallback(
    async (title: string, options?: Partial<IPromptOptions>): Promise<number | null> => {
      const result = await show({ title, inputType: 'number', ...options });
      return result !== null ? parseFloat(result) : null;
    },
    [show]
  );

  const close = useCallback((): void => {
    manager.removeAll('prompt');
    setIsOpen(false);
  }, [manager]);

  return {
    show,
    text,
    textarea,
    email,
    number,
    close,
    isOpen,
  };
}
```

## Component Architecture

### Prompt Component

```typescript
// src/components/Prompt/Prompt.tsx

import React, { memo, forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import type { IPromptOptions, FeedbackStatus } from '../../core/types';

export interface IPromptProps extends IPromptOptions {
  status: FeedbackStatus;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export const Prompt = memo(
  forwardRef<HTMLDivElement, IPromptProps>(function Prompt(props, ref) {
    const {
      title,
      description,
      inputType = 'text',
      placeholder,
      defaultValue = '',
      confirmText = 'Tamam',
      cancelText = 'İptal',
      label,
      validate,
      required,
      minLength,
      maxLength,
      pattern,
      icon,
      rows = 4,
      autoFocus = true,
      selectOnFocus = false,
      status,
      onConfirm,
      onCancel,
      className,
      testId,
    } = props;

    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    // Auto-focus input
    useEffect(() => {
      if (isVisible && autoFocus && inputRef.current) {
        inputRef.current.focus();
        if (selectOnFocus && defaultValue) {
          inputRef.current.select();
        }
      }
    }, [isVisible, autoFocus, selectOnFocus, defaultValue]);

    // ESC key handler
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    // Validation
    const validateValue = useCallback(
      (val: string): string | null => {
        if (required && !val.trim()) {
          return 'Bu alan zorunludur';
        }
        if (minLength && val.length < minLength) {
          return `En az ${minLength} karakter olmalıdır`;
        }
        if (maxLength && val.length > maxLength) {
          return `En fazla ${maxLength} karakter olabilir`;
        }
        if (pattern && !pattern.test(val)) {
          return 'Geçersiz format';
        }
        if (validate) {
          const result = validate(val);
          if (result !== true) {
            return result;
          }
        }
        return null;
      },
      [required, minLength, maxLength, pattern, validate]
    );

    // Handle submit
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateValue(value);
        if (validationError) {
          setError(validationError);
          return;
        }

        setIsSubmitting(true);
        onConfirm(value);
      },
      [value, validateValue, onConfirm]
    );

    // Handle change
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        
        // Clear error on change
        if (error) {
          setError(null);
        }
      },
      [error]
    );

    // Input component based on type
    const InputComponent = inputType === 'textarea' ? 'textarea' : 'input';
    const inputProps = {
      ref: inputRef as any,
      value,
      onChange: handleChange,
      placeholder,
      className: cn(
        'w-full px-3 py-2 border rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
        error && 'border-red-500 focus:ring-red-500',
        inputType === 'textarea' && 'resize-none'
      ),
      ...(inputType === 'textarea' ? { rows } : { type: inputType }),
      ...(maxLength && { maxLength }),
    };

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-title"
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 10000 }}
        onClick={onCancel}
      >
        <form
          onSubmit={handleSubmit}
          className={cn(
            'relative w-full max-w-md bg-white dark:bg-gray-800',
            'rounded-lg shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          {icon && (
            <div className="flex justify-center mb-4">{icon}</div>
          )}

          {/* Title */}
          <h2
            id="prompt-title"
            className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100 mb-2"
          >
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              {description}
            </p>
          )}

          {/* Input */}
          <div className="mb-4">
            {label && (
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <InputComponent {...inputProps} />
            
            {/* Character count */}
            {maxLength && (
              <div className="text-xs text-gray-400 text-right mt-1">
                {value.length}/{maxLength}
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-600',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'transition-colors disabled:opacity-50'
              )}
            >
              {cancelText}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium',
                'bg-blue-600 text-white hover:bg-blue-700',
                'transition-colors disabled:opacity-50'
              )}
            >
              {isSubmitting ? 'İşleniyor...' : confirmText}
            </button>
          </div>
        </form>
      </div>
    );
  })
);

Prompt.displayName = 'Prompt';
```

## Accessibility

```typescript
role="dialog"
aria-modal="true"
aria-labelledby="prompt-title"

// Input should have:
id="prompt-input"
aria-describedby="prompt-error" // if error exists
aria-invalid={!!error}

// Error message:
id="prompt-error"
role="alert"
```

## Testing Checklist

```typescript
describe('usePrompt', () => {
  it('should resolve with value on confirm', async () => {});
  it('should resolve with null on cancel', async () => {});
  it('should resolve with null on ESC', async () => {});
  it('should validate required field', () => {});
  it('should validate min/max length', () => {});
  it('should validate pattern', () => {});
  it('should validate custom function', () => {});
  it('should return number for number prompt', async () => {});
});

describe('Prompt', () => {
  it('should render title', () => {});
  it('should render description', () => {});
  it('should render text input', () => {});
  it('should render textarea', () => {});
  it('should render email input', () => {});
  it('should show error message', () => {});
  it('should auto-focus input', () => {});
  it('should select text on focus', () => {});
  it('should show character count', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/usePrompt.ts`
- [ ] Create `src/components/Prompt/Prompt.tsx`
- [ ] Create `src/components/Prompt/PromptContainer.tsx`
- [ ] Create `src/components/Prompt/index.ts`
- [ ] Add prompt to core types
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Missing Validation Feedback
❌ **Don't:** Silently fail validation
✅ **Do:** Show clear error message

### 2. No Default Focus
❌ **Don't:** Require user to click input
✅ **Do:** Auto-focus input on open

### 3. Form Submit on Enter
❌ **Don't:** Ignore Enter key in text input
✅ **Do:** Submit form on Enter (except textarea)

### 4. Backdrop Click
❌ **Don't:** Close and lose input on accidental click
✅ **Do:** Consider if backdrop click should close

## Notes

- Only 1 prompt visible at a time
- Enter key submits (except textarea)
- ESC key cancels
- Returns null on cancel (not undefined)
- number() returns number | null
