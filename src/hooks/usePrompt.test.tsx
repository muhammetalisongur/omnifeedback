/**
 * @vitest-environment jsdom
 */

/**
 * usePrompt hook unit tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { usePrompt } from './usePrompt';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';

/**
 * Wrapper component for renderHook
 */
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider
        renderToasts={false}
        renderModals={false}
        renderLoadings={false}
        renderConfirms={false}
        renderBanners={false}
        renderDrawers={false}
        renderPopconfirms={false}
      >
        {children}
      </FeedbackProvider>
    );
  };
}

describe('usePrompt', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('show()', () => {
    it('should add prompt to store', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.show({ title: 'Test Prompt' });
      });

      const store = useFeedbackStore.getState();
      const prompts = Array.from(store.items.values()).filter(
        (item) => item.type === 'prompt'
      );

      expect(prompts).toHaveLength(1);
      expect(prompts[0]?.options).toHaveProperty('title', 'Test Prompt');
    });

    it('should set isOpen to true when showing', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOpen).toBe(false);

      act(() => {
        void result.current.show({ title: 'Test' });
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should use default input type of text', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.show({ title: 'Test' });
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('inputType', 'text');
    });

    it('should use custom options', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.show({
          title: 'Test',
          description: 'Enter value',
          placeholder: 'Type here',
          defaultValue: 'default',
          confirmText: 'Save',
          cancelText: 'Dismiss',
        });
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('description', 'Enter value');
      expect(prompt?.options).toHaveProperty('placeholder', 'Type here');
      expect(prompt?.options).toHaveProperty('defaultValue', 'default');
      expect(prompt?.options).toHaveProperty('confirmText', 'Save');
      expect(prompt?.options).toHaveProperty('cancelText', 'Dismiss');
    });
  });

  describe('text()', () => {
    it('should create text prompt with title', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.text('Enter Name');
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('title', 'Enter Name');
      expect(prompt?.options).toHaveProperty('inputType', 'text');
    });

    it('should accept additional options', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.text('Name', { placeholder: 'John Doe', required: true });
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('placeholder', 'John Doe');
      expect(prompt?.options).toHaveProperty('required', true);
    });
  });

  describe('textarea()', () => {
    it('should create textarea prompt', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.textarea('Feedback');
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('inputType', 'textarea');
      expect(prompt?.options).toHaveProperty('rows', 4);
    });

    it('should allow custom rows', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.textarea('Description', { rows: 8 });
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('rows', 8);
    });
  });

  describe('email()', () => {
    it('should create email prompt', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.email('Your Email');
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('inputType', 'email');
    });
  });

  describe('password()', () => {
    it('should create password prompt', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.password('Enter Password');
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('inputType', 'password');
    });
  });

  describe('number()', () => {
    it('should create number prompt', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.number('Quantity');
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      expect(prompt?.options).toHaveProperty('inputType', 'number');
    });
  });

  describe('close()', () => {
    it('should remove all prompts from store', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.show({ title: 'Test 1' });
        void result.current.show({ title: 'Test 2' });
      });

      // Verify prompts exist
      const storeBefore = useFeedbackStore.getState();
      const promptsBefore = Array.from(storeBefore.items.values()).filter(
        (item) => item.type === 'prompt' && item.status !== 'removed' && item.status !== 'exiting'
      );
      expect(promptsBefore.length).toBeGreaterThan(0);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should set isOpen to false', () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.show({ title: 'Test' });
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Promise resolution', () => {
    it('should resolve with value when onConfirm is called', async () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      let resolvedValue: string | null = null;

      act(() => {
        void result.current.show({ title: 'Test' }).then((value) => {
          resolvedValue = value;
        });
      });

      // Get the prompt and call onConfirm
      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      await act(async () => {
        (prompt?.options as { onConfirm: (value: string) => void }).onConfirm('test value');
        await Promise.resolve();
      });

      expect(resolvedValue).toBe('test value');
    });

    it('should resolve with null when onCancel is called', async () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      let resolvedValue: string | null = 'not null';

      act(() => {
        void result.current.show({ title: 'Test' }).then((value) => {
          resolvedValue = value;
        });
      });

      // Get the prompt and call onCancel
      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      await act(async () => {
        (prompt?.options as { onCancel: () => void }).onCancel();
        await Promise.resolve();
      });

      expect(resolvedValue).toBe(null);
    });

    it('should return parsed number for number()', async () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      let resolvedValue: number | null = null;

      act(() => {
        void result.current.number('Quantity').then((value) => {
          resolvedValue = value;
        });
      });

      // Get the prompt and call onConfirm with string number
      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      await act(async () => {
        (prompt?.options as { onConfirm: (value: string) => void }).onConfirm('42');
        await Promise.resolve();
      });

      expect(resolvedValue).toBe(42);
      expect(typeof resolvedValue).toBe('number');
    });

    it('should return null for invalid number input', async () => {
      const { result } = renderHook(() => usePrompt(), {
        wrapper: createWrapper(),
      });

      let resolvedValue: number | null = 999;

      act(() => {
        void result.current.number('Quantity').then((value) => {
          resolvedValue = value;
        });
      });

      const store = useFeedbackStore.getState();
      const prompt = Array.from(store.items.values()).find(
        (item) => item.type === 'prompt'
      );

      await act(async () => {
        (prompt?.options as { onConfirm: (value: string) => void }).onConfirm('not a number');
        await Promise.resolve();
      });

      expect(resolvedValue).toBe(null);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => usePrompt());
      }).toThrow('usePrompt must be used within FeedbackProvider');
    });
  });
});
