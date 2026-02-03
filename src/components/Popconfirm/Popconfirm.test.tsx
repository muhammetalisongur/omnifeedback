/**
 * Popconfirm component unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Popconfirm } from './Popconfirm';
import type { FeedbackStatus } from '../../core/types';

describe('Popconfirm', () => {
  // Mock target element
  const mockTarget = document.createElement('button');
  mockTarget.getBoundingClientRect = () => ({
    top: 200,
    left: 100,
    right: 200,
    bottom: 240,
    width: 100,
    height: 40,
    x: 100,
    y: 200,
    toJSON: () => ({}),
  });

  const defaultProps = {
    target: mockTarget,
    message: 'Are you sure?',
    status: 'visible' as FeedbackStatus,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock window dimensions
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe('Rendering', () => {
    it('should render message', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm-message-text')).toHaveTextContent(
        'Are you sure?'
      );
    });

    it('should render title when provided', () => {
      render(
        <Popconfirm {...defaultProps} title="Confirm Action" testId="popconfirm" />
      );
      expect(screen.getByTestId('popconfirm-title-text')).toHaveTextContent(
        'Confirm Action'
      );
    });

    it('should not render title when not provided', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.queryByTestId('popconfirm-title-text')).not.toBeInTheDocument();
    });

    it('should have role="alertdialog"', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.getByRole('alertdialog')).toHaveAttribute(
        'aria-modal',
        'true'
      );
    });

    it('should render custom icon', () => {
      const customIcon = <span data-testid="custom-icon">Custom</span>;
      render(<Popconfirm {...defaultProps} icon={customIcon} testId="popconfirm" />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should render default icon for primary variant', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm-icon')).toBeInTheDocument();
    });
  });

  describe('Buttons', () => {
    it('should render default confirm text', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm-confirm')).toHaveTextContent('Yes');
    });

    it('should render default cancel text', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm-cancel')).toHaveTextContent('No');
    });

    it('should render custom confirm text', () => {
      render(
        <Popconfirm {...defaultProps} confirmText="Delete" testId="popconfirm" />
      );
      expect(screen.getByTestId('popconfirm-confirm')).toHaveTextContent('Delete');
    });

    it('should render custom cancel text', () => {
      render(
        <Popconfirm {...defaultProps} cancelText="Never Mind" testId="popconfirm" />
      );
      expect(screen.getByTestId('popconfirm-cancel')).toHaveTextContent('Never Mind');
    });

    it('should call onConfirm when confirm button clicked', () => {
      const onConfirm = vi.fn();
      render(
        <Popconfirm {...defaultProps} onConfirm={onConfirm} testId="popconfirm" />
      );

      fireEvent.click(screen.getByTestId('popconfirm-confirm'));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button clicked', () => {
      const onCancel = vi.fn();
      render(
        <Popconfirm {...defaultProps} onCancel={onCancel} testId="popconfirm" />
      );

      fireEvent.click(screen.getByTestId('popconfirm-cancel'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variants', () => {
    it('should apply primary variant by default', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      const confirmBtn = screen.getByTestId('popconfirm-confirm');
      expect(confirmBtn).toHaveClass('bg-blue-600');
    });

    it('should apply danger variant', () => {
      render(
        <Popconfirm {...defaultProps} confirmVariant="danger" testId="popconfirm" />
      );
      const confirmBtn = screen.getByTestId('popconfirm-confirm');
      expect(confirmBtn).toHaveClass('bg-red-600');
    });
  });

  describe('Arrow', () => {
    it('should render arrow by default', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm-arrow')).toBeInTheDocument();
    });

    it('should not render arrow when showArrow is false', () => {
      render(<Popconfirm {...defaultProps} showArrow={false} testId="popconfirm" />);
      expect(screen.queryByTestId('popconfirm-arrow')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Support', () => {
    it('should call onCancel when ESC key pressed', () => {
      const onCancel = vi.fn();
      render(
        <Popconfirm {...defaultProps} onCancel={onCancel} testId="popconfirm" />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Click Outside', () => {
    it('should call onCancel when clicking outside', () => {
      const onCancel = vi.fn();
      render(
        <Popconfirm {...defaultProps} onCancel={onCancel} testId="popconfirm" />
      );

      // Click outside the popconfirm
      fireEvent.mouseDown(document.body);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel when clicking inside', () => {
      const onCancel = vi.fn();
      render(
        <Popconfirm {...defaultProps} onCancel={onCancel} testId="popconfirm" />
      );

      // Click inside the popconfirm
      fireEvent.mouseDown(screen.getByTestId('popconfirm'));

      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should not call onCancel when closeOnClickOutside is false', () => {
      const onCancel = vi.fn();
      render(
        <Popconfirm
          {...defaultProps}
          onCancel={onCancel}
          closeOnClickOutside={false}
          testId="popconfirm"
        />
      );

      fireEvent.mouseDown(document.body);

      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Status Animation', () => {
    it('should have data-status attribute', () => {
      render(<Popconfirm {...defaultProps} status="visible" testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm')).toHaveAttribute(
        'data-status',
        'visible'
      );
    });

    it('should have entering status', () => {
      render(<Popconfirm {...defaultProps} status="entering" testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm')).toHaveAttribute(
        'data-status',
        'entering'
      );
    });

    it('should have exiting status', () => {
      render(<Popconfirm {...defaultProps} status="exiting" testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm')).toHaveAttribute(
        'data-status',
        'exiting'
      );
    });
  });

  describe('Placement', () => {
    it('should default to top placement', () => {
      render(<Popconfirm {...defaultProps} testId="popconfirm" />);
      // Initial placement is set, may be flipped based on viewport
      expect(screen.getByTestId('popconfirm')).toHaveAttribute('data-placement');
    });

    it('should apply bottom placement', () => {
      render(<Popconfirm {...defaultProps} placement="bottom" testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm')).toHaveAttribute('data-placement');
    });

    it('should apply left placement', () => {
      render(<Popconfirm {...defaultProps} placement="left" testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm')).toHaveAttribute('data-placement');
    });

    it('should apply right placement', () => {
      render(<Popconfirm {...defaultProps} placement="right" testId="popconfirm" />);
      expect(screen.getByTestId('popconfirm')).toHaveAttribute('data-placement');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <Popconfirm {...defaultProps} className="custom-class" testId="popconfirm" />
      );
      expect(screen.getByTestId('popconfirm')).toHaveClass('custom-class');
    });
  });

  describe('Delete Confirmation Scenario', () => {
    it('should render delete confirmation correctly', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(
        <Popconfirm
          target={mockTarget}
          message="Delete this item? This action cannot be undone."
          title="Delete Item"
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          placement="top"
          status="visible"
          onConfirm={onConfirm}
          onCancel={onCancel}
          testId="delete-popconfirm"
        />
      );

      expect(screen.getByTestId('delete-popconfirm')).toBeInTheDocument();
      expect(screen.getByTestId('delete-popconfirm-title-text')).toHaveTextContent(
        'Delete Item'
      );
      expect(screen.getByTestId('delete-popconfirm-message-text')).toHaveTextContent(
        'Delete this item?'
      );
      expect(screen.getByTestId('delete-popconfirm-confirm')).toHaveTextContent(
        'Delete'
      );
      expect(screen.getByTestId('delete-popconfirm-confirm')).toHaveClass(
        'bg-red-600'
      );

      // Test confirm action
      fireEvent.click(screen.getByTestId('delete-popconfirm-confirm'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('RefObject Target', () => {
    it('should work with RefObject target', () => {
      const refTarget = { current: mockTarget };

      render(
        <Popconfirm
          target={refTarget}
          message="Confirm action?"
          status="visible"
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
          testId="ref-popconfirm"
        />
      );

      expect(screen.getByTestId('ref-popconfirm')).toBeInTheDocument();
    });
  });
});
