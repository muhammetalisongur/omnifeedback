/**
 * Toast component unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, createEvent } from '@testing-library/react';
import { Toast } from './Toast';
import type { FeedbackStatus } from '../../core/types';

describe('Toast', () => {
  const defaultProps = {
    message: 'Test message',
    status: 'visible' as FeedbackStatus,
    onRemove: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render message', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(<Toast {...defaultProps} title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render action button when provided', () => {
      const onClick = vi.fn();
      render(
        <Toast
          {...defaultProps}
          action={{ label: 'Undo', onClick }}
        />
      );

      const button = screen.getByText('Undo');
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render dismiss button when dismissible', () => {
      render(<Toast {...defaultProps} dismissible />);
      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });

    it('should not render dismiss button when not dismissible', () => {
      render(<Toast {...defaultProps} dismissible={false} />);
      expect(screen.queryByLabelText('Dismiss notification')).not.toBeInTheDocument();
    });

    it('should apply testId', () => {
      render(<Toast {...defaultProps} testId="my-toast" />);
      expect(screen.getByTestId('my-toast')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply success variant styles', () => {
      render(<Toast {...defaultProps} variant="success" testId="toast" />);
      const toast = screen.getByTestId('toast');
      expect(toast.className).toContain('bg-green-50');
    });

    it('should apply error variant styles', () => {
      render(<Toast {...defaultProps} variant="error" testId="toast" />);
      const toast = screen.getByTestId('toast');
      expect(toast.className).toContain('bg-red-50');
    });

    it('should apply warning variant styles', () => {
      render(<Toast {...defaultProps} variant="warning" testId="toast" />);
      const toast = screen.getByTestId('toast');
      expect(toast.className).toContain('bg-yellow-50');
    });

    it('should apply info variant styles', () => {
      render(<Toast {...defaultProps} variant="info" testId="toast" />);
      const toast = screen.getByTestId('toast');
      expect(toast.className).toContain('bg-blue-50');
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert"', () => {
      render(<Toast {...defaultProps} testId="toast" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have aria-live="polite" for non-error variants', () => {
      render(<Toast {...defaultProps} variant="success" testId="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-live="assertive" for error variant', () => {
      render(<Toast {...defaultProps} variant="error" testId="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have aria-atomic="true"', () => {
      render(<Toast {...defaultProps} testId="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Dismiss', () => {
    it('should call onDismiss when dismiss button clicked', () => {
      const onDismiss = vi.fn();
      render(<Toast {...defaultProps} dismissible onDismiss={onDismiss} />);

      fireEvent.click(screen.getByLabelText('Dismiss notification'));

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should call onDismissRequest when dismiss button clicked', () => {
      const onDismissRequest = vi.fn();
      render(
        <Toast {...defaultProps} dismissible onDismissRequest={onDismissRequest} />
      );

      fireEvent.click(screen.getByLabelText('Dismiss notification'));

      expect(onDismissRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Progress Bar', () => {
    it('should render progress bar when showProgress is true', () => {
      render(
        <Toast
          {...defaultProps}
          showProgress
          duration={5000}
          testId="toast"
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should not render progress bar when showProgress is false', () => {
      render(
        <Toast
          {...defaultProps}
          showProgress={false}
          duration={5000}
          testId="toast"
        />
      );

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should not render progress bar when duration is 0', () => {
      render(
        <Toast
          {...defaultProps}
          showProgress
          duration={0}
          testId="toast"
        />
      );

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should apply progressPosition top', () => {
      const { container } = render(
        <Toast
          {...defaultProps}
          showProgress
          progressPosition="top"
          duration={5000}
        />
      );

      const progressWrapper = container.querySelector('[role="progressbar"]');
      expect(progressWrapper?.className).toContain('top-0');
    });

    it('should apply progressPosition bottom', () => {
      const { container } = render(
        <Toast
          {...defaultProps}
          showProgress
          progressPosition="bottom"
          duration={5000}
        />
      );

      const progressWrapper = container.querySelector('[role="progressbar"]');
      expect(progressWrapper?.className).toContain('bottom-0');
    });

    it('should apply custom progressColor', () => {
      const { container } = render(
        <Toast
          {...defaultProps}
          showProgress
          progressColor="#FF5733"
          duration={5000}
        />
      );

      const progressInner = container.querySelector('[role="progressbar"] > div');
      expect(progressInner).toHaveAttribute('style', expect.stringContaining('background-color'));
      expect(progressInner?.getAttribute('style')).toContain('#FF5733');
    });
  });

  describe('Pause on Hover', () => {
    it('should pause progress on mouse enter when pauseOnHover is true', () => {
      render(
        <Toast
          {...defaultProps}
          showProgress
          pauseOnHover
          duration={5000}
          testId="toast"
        />
      );

      const toast = screen.getByTestId('toast');

      // Advance some time
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Mouse enter should pause
      fireEvent.mouseEnter(toast);

      const progressBefore = screen.getByRole('progressbar');
      const widthBefore = progressBefore.querySelector('div')?.style.width;

      // Advance more time
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Width should not change while paused
      const widthAfter = progressBefore.querySelector('div')?.style.width;
      expect(widthBefore).toBe(widthAfter);
    });
  });

  describe('Animation Status', () => {
    it('should have data-status attribute', () => {
      render(<Toast {...defaultProps} status="entering" testId="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('data-status', 'entering');
    });

    it('should call onRemove on transition end when exiting', () => {
      const onRemove = vi.fn();
      render(<Toast {...defaultProps} status="exiting" onRemove={onRemove} testId="toast" />);

      const toast = screen.getByTestId('toast');

      // Create event with createEvent and set propertyName
      const transitionEvent = createEvent.transitionEnd(toast);
      Object.defineProperty(transitionEvent, 'propertyName', { value: 'opacity' });
      fireEvent(toast, transitionEvent);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('should not call onRemove for non-opacity transitions', () => {
      const onRemove = vi.fn();
      render(<Toast {...defaultProps} status="exiting" onRemove={onRemove} testId="toast" />);

      const toast = screen.getByTestId('toast');

      // Create event with createEvent and set propertyName to transform (should be ignored)
      const transitionEvent = createEvent.transitionEnd(toast);
      Object.defineProperty(transitionEvent, 'propertyName', { value: 'transform' });
      fireEvent(toast, transitionEvent);

      expect(onRemove).not.toHaveBeenCalled();
    });
  });
});
