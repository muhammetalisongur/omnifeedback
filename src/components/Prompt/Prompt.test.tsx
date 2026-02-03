/**
 * @vitest-environment jsdom
 */

/**
 * Prompt component unit tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Prompt } from './Prompt';

describe('Prompt', () => {
  const defaultProps = {
    title: 'Test Prompt',
    status: 'visible' as const,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    testId: 'prompt',
  };

  describe('Rendering', () => {
    it('should render title', () => {
      render(<Prompt {...defaultProps} />);

      expect(screen.getByTestId('prompt-title')).toHaveTextContent('Test Prompt');
    });

    it('should render description when provided', () => {
      render(<Prompt {...defaultProps} description="Enter your input" />);

      expect(screen.getByTestId('prompt-description')).toHaveTextContent('Enter your input');
    });

    it('should not render description when not provided', () => {
      render(<Prompt {...defaultProps} />);

      expect(screen.queryByTestId('prompt-description')).not.toBeInTheDocument();
    });

    it('should render custom icon', () => {
      render(
        <Prompt
          {...defaultProps}
          icon={<span data-testid="custom-icon">Icon</span>}
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should render input with placeholder', () => {
      render(<Prompt {...defaultProps} placeholder="Enter text here" />);

      const input = screen.getByTestId('prompt-input');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });

    it('should render default value', () => {
      render(<Prompt {...defaultProps} defaultValue="default text" />);

      const input = screen.getByTestId('prompt-input') as HTMLInputElement;
      expect(input.value).toBe('default text');
    });

    it('should render label', () => {
      render(<Prompt {...defaultProps} label="File name" />);

      expect(screen.getByText('File name')).toBeInTheDocument();
    });

    it('should render required asterisk with label', () => {
      render(<Prompt {...defaultProps} label="File name" required />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render confirm button text', () => {
      render(<Prompt {...defaultProps} confirmText="Save" />);

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('should render cancel button text', () => {
      render(<Prompt {...defaultProps} cancelText="Dismiss" />);

      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    it('should render character count when maxLength is set', () => {
      render(<Prompt {...defaultProps} maxLength={100} />);

      expect(screen.getByTestId('prompt-char-count')).toHaveTextContent('0/100');
    });
  });

  describe('Input Types', () => {
    it('should render text input by default', () => {
      render(<Prompt {...defaultProps} />);

      const input = screen.getByTestId('prompt-input') as HTMLInputElement;
      expect(input.tagName).toBe('INPUT');
      expect(input.type).toBe('text');
    });

    it('should render email input', () => {
      render(<Prompt {...defaultProps} inputType="email" />);

      const input = screen.getByTestId('prompt-input') as HTMLInputElement;
      expect(input.type).toBe('email');
    });

    it('should render password input', () => {
      render(<Prompt {...defaultProps} inputType="password" />);

      const input = screen.getByTestId('prompt-input') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('should render number input', () => {
      render(<Prompt {...defaultProps} inputType="number" />);

      const input = screen.getByTestId('prompt-input') as HTMLInputElement;
      expect(input.type).toBe('number');
    });

    it('should render textarea', () => {
      render(<Prompt {...defaultProps} inputType="textarea" />);

      const input = screen.getByTestId('prompt-input');
      expect(input.tagName).toBe('TEXTAREA');
    });

    it('should render textarea with custom rows', () => {
      render(<Prompt {...defaultProps} inputType="textarea" rows={6} />);

      const input = screen.getByTestId('prompt-input') as HTMLTextAreaElement;
      expect(input.rows).toBe(6);
    });
  });

  describe('User Interaction', () => {
    it('should update value on input change', () => {
      render(<Prompt {...defaultProps} />);

      const input = screen.getByTestId('prompt-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(input.value).toBe('new value');
    });

    it('should call onConfirm with value on submit', () => {
      const onConfirm = vi.fn();
      render(<Prompt {...defaultProps} onConfirm={onConfirm} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'test value' } });

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledWith('test value');
    });

    it('should call onCancel when cancel button clicked', () => {
      const onCancel = vi.fn();
      render(<Prompt {...defaultProps} onCancel={onCancel} />);

      const cancelButton = screen.getByTestId('prompt-cancel');
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should submit on Enter key for text input', () => {
      const onConfirm = vi.fn();
      render(<Prompt {...defaultProps} onConfirm={onConfirm} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onConfirm).toHaveBeenCalledWith('test');
    });

    it('should update character count on input', () => {
      render(<Prompt {...defaultProps} maxLength={100} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'hello' } });

      expect(screen.getByTestId('prompt-char-count')).toHaveTextContent('5/100');
    });
  });

  describe('Validation', () => {
    it('should show error for required empty field', () => {
      render(<Prompt {...defaultProps} required />);

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      expect(screen.getByTestId('prompt-error')).toBeInTheDocument();
    });

    it('should show error for minLength validation', () => {
      render(<Prompt {...defaultProps} minLength={5} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'abc' } });

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      expect(screen.getByTestId('prompt-error')).toHaveTextContent('at least 5');
    });

    it('should show error for maxLength validation', () => {
      render(<Prompt {...defaultProps} maxLength={5} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'abcdefgh' } });

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      expect(screen.getByTestId('prompt-error')).toHaveTextContent('at most 5');
    });

    it('should show error for pattern validation', () => {
      render(<Prompt {...defaultProps} pattern={/^[a-z]+$/} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'ABC123' } });

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      expect(screen.getByTestId('prompt-error')).toHaveTextContent('Invalid format');
    });

    it('should show error from custom validate function', () => {
      const validate = vi.fn().mockReturnValue('Custom error message');
      render(<Prompt {...defaultProps} validate={validate} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'test' } });

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      expect(screen.getByTestId('prompt-error')).toHaveTextContent('Custom error message');
    });

    it('should pass validation when validate returns true', () => {
      const onConfirm = vi.fn();
      const validate = vi.fn().mockReturnValue(true);
      render(<Prompt {...defaultProps} onConfirm={onConfirm} validate={validate} />);

      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'valid' } });

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledWith('valid');
    });

    it('should clear error on input change', () => {
      render(<Prompt {...defaultProps} required />);

      // Trigger error
      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);
      expect(screen.getByTestId('prompt-error')).toBeInTheDocument();

      // Change input should clear error
      const input = screen.getByTestId('prompt-input');
      fireEvent.change(input, { target: { value: 'a' } });

      expect(screen.queryByTestId('prompt-error')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have dialog role', () => {
      render(<Prompt {...defaultProps} />);

      const dialog = screen.getByTestId('prompt');
      expect(dialog).toHaveAttribute('role', 'dialog');
    });

    it('should have aria-modal attribute', () => {
      render(<Prompt {...defaultProps} />);

      const dialog = screen.getByTestId('prompt');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(<Prompt {...defaultProps} />);

      const dialog = screen.getByTestId('prompt');
      expect(dialog).toHaveAttribute('aria-labelledby', 'prompt-title');
    });

    it('should have aria-invalid when error exists', () => {
      render(<Prompt {...defaultProps} required />);

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      const input = screen.getByTestId('prompt-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have error message with alert role', () => {
      render(<Prompt {...defaultProps} required />);

      const confirmButton = screen.getByTestId('prompt-confirm');
      fireEvent.click(confirmButton);

      const error = screen.getByTestId('prompt-error');
      expect(error).toHaveAttribute('role', 'alert');
    });
  });

  describe('Visibility States', () => {
    it('should be visible when status is visible', () => {
      render(<Prompt {...defaultProps} status="visible" />);

      const dialog = screen.getByTestId('prompt');
      expect(dialog).toHaveClass('opacity-100');
    });

    it('should be visible when status is entering', () => {
      render(<Prompt {...defaultProps} status="entering" />);

      const dialog = screen.getByTestId('prompt');
      expect(dialog).toHaveClass('opacity-100');
    });

    it('should be hidden when status is exiting', () => {
      render(<Prompt {...defaultProps} status="exiting" />);

      const dialog = screen.getByTestId('prompt');
      expect(dialog).toHaveClass('opacity-0');
    });
  });
});
