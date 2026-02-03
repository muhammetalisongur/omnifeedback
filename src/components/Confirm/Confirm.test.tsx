/**
 * Confirm component unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Confirm } from './Confirm';
import type { FeedbackStatus } from '../../core/types';

describe('Confirm', () => {
  const defaultProps = {
    message: 'Are you sure?',
    status: 'visible' as FeedbackStatus,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render message', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByTestId('confirm-message')).toHaveTextContent(
        'Are you sure?'
      );
    });

    it('should render title when provided', () => {
      render(
        <Confirm {...defaultProps} title="Confirm Action" testId="confirm" />
      );
      expect(screen.getByTestId('confirm-title')).toHaveTextContent(
        'Confirm Action'
      );
    });

    it('should not render title when not provided', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.queryByTestId('confirm-title')).not.toBeInTheDocument();
    });

    it('should have role="alertdialog"', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByRole('alertdialog')).toHaveAttribute(
        'aria-modal',
        'true'
      );
    });

    it('should render custom icon', () => {
      const customIcon = <span data-testid="custom-icon">Custom</span>;
      render(<Confirm {...defaultProps} icon={customIcon} testId="confirm" />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Buttons', () => {
    it('should render default confirm text', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByTestId('confirm-confirm')).toHaveTextContent(
        'Confirm'
      );
    });

    it('should render default cancel text', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByTestId('confirm-cancel')).toHaveTextContent('Cancel');
    });

    it('should render custom confirm text', () => {
      render(
        <Confirm {...defaultProps} confirmText="Delete" testId="confirm" />
      );
      expect(screen.getByTestId('confirm-confirm')).toHaveTextContent('Delete');
    });

    it('should render custom cancel text', () => {
      render(
        <Confirm {...defaultProps} cancelText="Never Mind" testId="confirm" />
      );
      expect(screen.getByTestId('confirm-cancel')).toHaveTextContent(
        'Never Mind'
      );
    });

    it('should call onConfirm when confirm button clicked', async () => {
      const onConfirm = vi.fn();
      render(
        <Confirm {...defaultProps} onConfirm={onConfirm} testId="confirm" />
      );

      fireEvent.click(screen.getByTestId('confirm-confirm'));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button clicked', () => {
      const onCancel = vi.fn();
      render(
        <Confirm {...defaultProps} onCancel={onCancel} testId="confirm" />
      );

      fireEvent.click(screen.getByTestId('confirm-cancel'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variants', () => {
    it('should apply primary variant by default', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      const confirmBtn = screen.getByTestId('confirm-confirm');
      expect(confirmBtn).toHaveClass('bg-blue-600');
    });

    it('should apply danger variant', () => {
      render(
        <Confirm {...defaultProps} confirmVariant="danger" testId="confirm" />
      );
      const confirmBtn = screen.getByTestId('confirm-confirm');
      expect(confirmBtn).toHaveClass('bg-red-600');
    });
  });

  describe('Keyboard Support', () => {
    it('should call onCancel when ESC key pressed', () => {
      const onCancel = vi.fn();
      render(
        <Confirm {...defaultProps} onCancel={onCancel} testId="confirm" />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel when ESC pressed during loading', async () => {
      const onCancel = vi.fn();
      const onConfirm = vi.fn(
        (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      render(
        <Confirm
          {...defaultProps}
          onConfirm={onConfirm}
          onCancel={onCancel}
          testId="confirm"
        />
      );

      // Start loading
      fireEvent.click(screen.getByTestId('confirm-confirm'));

      // Try to cancel with ESC
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Backdrop', () => {
    it('should render backdrop', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByTestId('confirm-backdrop')).toBeInTheDocument();
    });

    it('should call onCancel when backdrop clicked', () => {
      const onCancel = vi.fn();
      render(
        <Confirm {...defaultProps} onCancel={onCancel} testId="confirm" />
      );

      fireEvent.click(screen.getByTestId('confirm'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel when dialog content clicked', () => {
      const onCancel = vi.fn();
      render(
        <Confirm {...defaultProps} onCancel={onCancel} testId="confirm" />
      );

      fireEvent.click(screen.getByTestId('confirm-dialog'));

      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when confirmLoading is true', () => {
      render(
        <Confirm {...defaultProps} confirmLoading={true} testId="confirm" />
      );

      expect(screen.getByTestId('confirm-confirm')).toHaveTextContent(
        'Loading...'
      );
    });

    it('should disable buttons when loading', () => {
      render(
        <Confirm {...defaultProps} confirmLoading={true} testId="confirm" />
      );

      expect(screen.getByTestId('confirm-confirm')).toBeDisabled();
      expect(screen.getByTestId('confirm-cancel')).toBeDisabled();
    });

    it('should show loading state during async onConfirm', async () => {
      const onConfirm = vi.fn(
        (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      render(
        <Confirm {...defaultProps} onConfirm={onConfirm} testId="confirm" />
      );

      fireEvent.click(screen.getByTestId('confirm-confirm'));

      expect(screen.getByTestId('confirm-confirm')).toHaveTextContent(
        'Loading...'
      );
    });
  });

  describe('Status Animation', () => {
    it('should have data-status attribute', () => {
      render(<Confirm {...defaultProps} status="visible" testId="confirm" />);
      expect(screen.getByTestId('confirm')).toHaveAttribute(
        'data-status',
        'visible'
      );
    });

    it('should have entering status', () => {
      render(<Confirm {...defaultProps} status="entering" testId="confirm" />);
      expect(screen.getByTestId('confirm')).toHaveAttribute(
        'data-status',
        'entering'
      );
    });

    it('should have exiting status', () => {
      render(<Confirm {...defaultProps} status="exiting" testId="confirm" />);
      expect(screen.getByTestId('confirm')).toHaveAttribute(
        'data-status',
        'exiting'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have aria-labelledby when title is provided', () => {
      render(
        <Confirm {...defaultProps} title="Test Title" testId="confirm" />
      );
      expect(screen.getByRole('alertdialog')).toHaveAttribute(
        'aria-labelledby',
        'confirm-title'
      );
    });

    it('should not have aria-labelledby when no title', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByRole('alertdialog')).not.toHaveAttribute(
        'aria-labelledby'
      );
    });

    it('should have aria-describedby', () => {
      render(<Confirm {...defaultProps} testId="confirm" />);
      expect(screen.getByRole('alertdialog')).toHaveAttribute(
        'aria-describedby',
        'confirm-message'
      );
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <Confirm {...defaultProps} className="custom-class" testId="confirm" />
      );
      expect(screen.getByTestId('confirm-dialog')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(
        <Confirm
          {...defaultProps}
          style={{ margin: '10px' }}
          testId="confirm"
        />
      );
      const confirm = screen.getByTestId('confirm');
      expect(confirm.getAttribute('style')).toContain('margin');
    });
  });
});
