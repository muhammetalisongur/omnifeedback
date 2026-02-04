/**
 * PromptContainer - Renders prompt dialogs via portal
 * Only shows the most recent prompt (max: 1)
 */

import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { Prompt } from './Prompt';
import type { IFeedbackItem } from '../../core/types';

/**
 * Z-index for prompt dialogs (above modals)
 */
const Z_INDEX_PROMPT = 10000;

/**
 * PromptContainer component
 * Renders prompt dialogs using portal to document body
 * Only the most recent prompt is shown at a time
 *
 * @example
 * ```tsx
 * // Used internally by FeedbackProvider
 * <FeedbackProvider>
 *   <App />
 *   <PromptContainer />
 * </FeedbackProvider>
 * ```
 */
export const PromptContainer = memo(function PromptContainer() {
  // Get all prompt items from store
  const prompts = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'prompt'> =>
        item.type === 'prompt' && item.status !== 'removed'
    )
  );

  // Lock body scroll when prompt is visible
  useEffect(() => {
    if (prompts.length > 0) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [prompts.length]);

  // Don't render if no prompts
  if (prompts.length === 0) {
    return null;
  }

  // SSR safety check
  if (typeof document === 'undefined') {
    return null;
  }

  // Only show the most recent prompt (design spec: max 1 at a time)
  const latestPrompt = prompts[prompts.length - 1];

  // Safety check - should never happen due to length check above
  if (!latestPrompt) {
    return null;
  }

  const options = latestPrompt.options;

  // Build props with spread to handle exactOptionalPropertyTypes
  const promptProps = {
    title: options.title,
    status: latestPrompt.status,
    onConfirm: options.onConfirm,
    testId: options.testId ?? `prompt-${latestPrompt.id}`,
    ...(options.description !== undefined && { description: options.description }),
    ...(options.inputType !== undefined && { inputType: options.inputType }),
    ...(options.placeholder !== undefined && { placeholder: options.placeholder }),
    ...(options.defaultValue !== undefined && { defaultValue: options.defaultValue }),
    ...(options.confirmText !== undefined && { confirmText: options.confirmText }),
    ...(options.cancelText !== undefined && { cancelText: options.cancelText }),
    ...(options.label !== undefined && { label: options.label }),
    ...(options.validate !== undefined && { validate: options.validate }),
    ...(options.required !== undefined && { required: options.required }),
    ...(options.minLength !== undefined && { minLength: options.minLength }),
    ...(options.maxLength !== undefined && { maxLength: options.maxLength }),
    ...(options.pattern !== undefined && { pattern: options.pattern }),
    ...(options.icon !== undefined && { icon: options.icon }),
    ...(options.rows !== undefined && { rows: options.rows }),
    ...(options.autoFocus !== undefined && { autoFocus: options.autoFocus }),
    ...(options.selectOnFocus !== undefined && { selectOnFocus: options.selectOnFocus }),
    ...(options.onCancel !== undefined && { onCancel: options.onCancel }),
    ...(options.className !== undefined && { className: options.className }),
    ...(options.style !== undefined && { style: options.style }),
  };

  return createPortal(
    <div
      style={{ zIndex: Z_INDEX_PROMPT }}
      data-testid="prompt-container"
    >
      <Prompt key={latestPrompt.id} {...promptProps} />
    </div>,
    document.body
  );
});

PromptContainer.displayName = 'PromptContainer';
