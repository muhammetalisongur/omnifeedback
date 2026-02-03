/**
 * usePrompt hook
 * Provides promise-based input dialog functionality
 * Similar to browser's prompt() but with more features
 */

import { useCallback, useContext, useState } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import type { IPromptOptions } from '../core/types';

/**
 * Options for showing a prompt (without onConfirm/onCancel)
 */
export type IPromptShowOptions = Omit<IPromptOptions, 'onConfirm' | 'onCancel'>;

/**
 * Return type for usePrompt hook
 */
export interface IUsePromptReturn {
  /** Show prompt and await result */
  show: (options: IPromptShowOptions) => Promise<string | null>;
  /** Show text prompt (shorthand) */
  text: (title: string, options?: Partial<IPromptShowOptions>) => Promise<string | null>;
  /** Show textarea prompt */
  textarea: (title: string, options?: Partial<IPromptShowOptions>) => Promise<string | null>;
  /** Show email prompt */
  email: (title: string, options?: Partial<IPromptShowOptions>) => Promise<string | null>;
  /** Show number prompt - returns number or null */
  number: (title: string, options?: Partial<IPromptShowOptions>) => Promise<number | null>;
  /** Show password prompt */
  password: (title: string, options?: Partial<IPromptShowOptions>) => Promise<string | null>;
  /** Close prompt without result */
  close: () => void;
  /** Check if prompt is open */
  isOpen: boolean;
}

/**
 * usePrompt hook
 * Provides promise-based input dialog functionality
 *
 * @returns Prompt management methods
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { text, email, number } = usePrompt();
 *
 *   const handleRename = async () => {
 *     const newName = await text('New file name', {
 *       defaultValue: 'document.pdf',
 *       placeholder: 'Enter file name',
 *     });
 *
 *     if (newName) {
 *       await renameFile(newName);
 *     }
 *   };
 *
 *   const handleEmail = async () => {
 *     const email = await email('Your email', {
 *       placeholder: 'example@mail.com',
 *       validate: (value) => {
 *         if (!value.includes('@')) return 'Invalid email';
 *         return true;
 *       },
 *     });
 *   };
 * }
 * ```
 */
export function usePrompt(): IUsePromptReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('usePrompt must be used within FeedbackProvider');
  }

  const { manager } = context;
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Show prompt dialog and return promise
   */
  const show = useCallback(
    (options: IPromptShowOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        setIsOpen(true);

        const promptId = manager.add('prompt', {
          inputType: 'text',
          confirmText: 'OK',
          cancelText: 'Cancel',
          autoFocus: true,
          selectOnFocus: false,
          ...options,
          onConfirm: (value: string) => {
            manager.remove(promptId);
            setIsOpen(false);
            resolve(value);
          },
          onCancel: () => {
            manager.remove(promptId);
            setIsOpen(false);
            resolve(null);
          },
        });
      });
    },
    [manager]
  );

  /**
   * Show text prompt (shorthand)
   */
  const text = useCallback(
    (title: string, options?: Partial<IPromptShowOptions>): Promise<string | null> => {
      return show({ title, inputType: 'text', ...options });
    },
    [show]
  );

  /**
   * Show textarea prompt
   */
  const textarea = useCallback(
    (title: string, options?: Partial<IPromptShowOptions>): Promise<string | null> => {
      return show({ title, inputType: 'textarea', rows: 4, ...options });
    },
    [show]
  );

  /**
   * Show email prompt
   */
  const email = useCallback(
    (title: string, options?: Partial<IPromptShowOptions>): Promise<string | null> => {
      return show({ title, inputType: 'email', ...options });
    },
    [show]
  );

  /**
   * Show number prompt - returns parsed number or null
   */
  const number = useCallback(
    async (title: string, options?: Partial<IPromptShowOptions>): Promise<number | null> => {
      const result = await show({ title, inputType: 'number', ...options });
      if (result === null) return null;
      const parsed = parseFloat(result);
      return isNaN(parsed) ? null : parsed;
    },
    [show]
  );

  /**
   * Show password prompt
   */
  const password = useCallback(
    (title: string, options?: Partial<IPromptShowOptions>): Promise<string | null> => {
      return show({ title, inputType: 'password', ...options });
    },
    [show]
  );

  /**
   * Close prompt without result
   */
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
    password,
    close,
    isOpen,
  };
}
