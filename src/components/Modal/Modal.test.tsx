/**
 * Modal component unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { Modal } from './Modal';
import type { FeedbackStatus } from '../../core/types';
import { resetScrollLockState } from '../../hooks/useScrollLock';

describe('Modal', () => {
  const defaultProps = {
    content: <p>Modal content</p>,
    status: 'visible' as FeedbackStatus,
    onRequestClose: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    resetScrollLockState();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetScrollLockState();
  });

  describe('Rendering', () => {
    it('should render content', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(<Modal {...defaultProps} title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render footer', () => {
      render(
        <Modal
          {...defaultProps}
          footer={<button>Footer Button</button>}
        />
      );
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });

    it('should render custom header', () => {
      render(
        <Modal
          {...defaultProps}
          header={<div>Custom Header</div>}
        />
      );
      expect(screen.getByText('Custom Header')).toBeInTheDocument();
    });

    it('should not render footer when null', () => {
      render(<Modal {...defaultProps} footer={null} />);
      // Footer section should not be present
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
    });

    it('should apply testId', () => {
      render(<Modal {...defaultProps} testId="my-modal" />);
      expect(screen.getByTestId('my-modal')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button when closable and has title', () => {
      render(<Modal {...defaultProps} title="Title" closable />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should render close button in corner when closable without title', () => {
      render(<Modal {...defaultProps} closable />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should not render close button when not closable', () => {
      render(<Modal {...defaultProps} closable={false} />);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('should call onRequestClose when close button clicked', () => {
      const onRequestClose = vi.fn();
      render(
        <Modal {...defaultProps} title="Title" closable onRequestClose={onRequestClose} />
      );

      fireEvent.click(screen.getByLabelText('Close modal'));

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Backdrop Click', () => {
    it('should close on backdrop click when closeOnBackdropClick is true', () => {
      const onRequestClose = vi.fn();
      render(
        <Modal
          {...defaultProps}
          closeOnBackdropClick
          onRequestClose={onRequestClose}
          testId="modal"
        />
      );

      // Click on backdrop (the modal container div)
      const backdrop = screen.getByTestId('modal');
      fireEvent.click(backdrop);

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on backdrop click when closeOnBackdropClick is false', () => {
      const onRequestClose = vi.fn();
      render(
        <Modal
          {...defaultProps}
          closeOnBackdropClick={false}
          onRequestClose={onRequestClose}
          testId="modal"
        />
      );

      const backdrop = screen.getByTestId('modal');
      fireEvent.click(backdrop);

      expect(onRequestClose).not.toHaveBeenCalled();
    });

    it('should not close when clicking modal content', () => {
      const onRequestClose = vi.fn();
      render(
        <Modal
          {...defaultProps}
          closeOnBackdropClick
          onRequestClose={onRequestClose}
        />
      );

      fireEvent.click(screen.getByText('Modal content'));

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('Escape Key', () => {
    it('should close on ESC key when closeOnEscape is true', () => {
      const onRequestClose = vi.fn();
      render(
        <Modal
          {...defaultProps}
          closeOnEscape
          onRequestClose={onRequestClose}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on ESC key when closeOnEscape is false', () => {
      const onRequestClose = vi.fn();
      render(
        <Modal
          {...defaultProps}
          closeOnEscape={false}
          onRequestClose={onRequestClose}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRequestClose).not.toHaveBeenCalled();
    });

    it('should not close on ESC when not visible', () => {
      const onRequestClose = vi.fn();
      render(
        <Modal
          {...defaultProps}
          status="entering"
          closeOnEscape
          onRequestClose={onRequestClose}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(<Modal {...defaultProps} testId="modal" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<Modal {...defaultProps} testId="modal" />);
      expect(screen.getByTestId('modal')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby when title is provided', () => {
      render(<Modal {...defaultProps} title="Modal Title" testId="modal" />);
      expect(screen.getByTestId('modal')).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should not have aria-labelledby when no title', () => {
      render(<Modal {...defaultProps} testId="modal" />);
      expect(screen.getByTestId('modal')).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('Size Variants', () => {
    it('should apply sm size', () => {
      const { container } = render(<Modal {...defaultProps} size="sm" />);
      const panel = container.querySelector('.max-w-sm');
      expect(panel).toBeInTheDocument();
    });

    it('should apply md size', () => {
      const { container } = render(<Modal {...defaultProps} size="md" />);
      const panel = container.querySelector('.max-w-md');
      expect(panel).toBeInTheDocument();
    });

    it('should apply lg size', () => {
      const { container } = render(<Modal {...defaultProps} size="lg" />);
      const panel = container.querySelector('.max-w-lg');
      expect(panel).toBeInTheDocument();
    });

    it('should apply xl size', () => {
      const { container } = render(<Modal {...defaultProps} size="xl" />);
      const panel = container.querySelector('.max-w-xl');
      expect(panel).toBeInTheDocument();
    });

    it('should apply full size', () => {
      const { container } = render(<Modal {...defaultProps} size="full" />);
      const panel = container.querySelector('.max-w-full');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Animation Status', () => {
    it('should have data-status attribute', () => {
      render(<Modal {...defaultProps} status="entering" testId="modal" />);
      expect(screen.getByTestId('modal')).toHaveAttribute('data-status', 'entering');
    });

    it('should call onRemove on transition end when exiting', () => {
      const onRemove = vi.fn();
      render(
        <Modal {...defaultProps} status="exiting" onRemove={onRemove} testId="modal" />
      );

      const modal = screen.getByTestId('modal');

      // Create event with createEvent and set propertyName
      const transitionEvent = createEvent.transitionEnd(modal);
      Object.defineProperty(transitionEvent, 'propertyName', { value: 'opacity' });
      fireEvent(modal, transitionEvent);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('should not call onRemove for non-opacity transitions', () => {
      const onRemove = vi.fn();
      render(
        <Modal {...defaultProps} status="exiting" onRemove={onRemove} testId="modal" />
      );

      const modal = screen.getByTestId('modal');

      const transitionEvent = createEvent.transitionEnd(modal);
      Object.defineProperty(transitionEvent, 'propertyName', { value: 'transform' });
      fireEvent(modal, transitionEvent);

      expect(onRemove).not.toHaveBeenCalled();
    });
  });

  describe('Scroll Behavior', () => {
    it('should apply inside scroll behavior', () => {
      const { container } = render(
        <Modal {...defaultProps} scrollBehavior="inside" />
      );
      const contentDiv = container.querySelector('.overflow-y-auto');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should apply max-h when scrollBehavior is inside', () => {
      const { container } = render(
        <Modal {...defaultProps} scrollBehavior="inside" size="md" />
      );
      const panel = container.querySelector('.max-h-\\[90vh\\]');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Centered', () => {
    it('should apply centered styles when centered is true', () => {
      const { container } = render(<Modal {...defaultProps} centered />);
      const backdrop = container.querySelector('.items-center');
      expect(backdrop).toBeInTheDocument();
    });
  });
});
