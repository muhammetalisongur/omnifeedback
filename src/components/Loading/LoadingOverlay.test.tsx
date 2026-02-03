/**
 * @vitest-environment jsdom
 */

/**
 * LoadingOverlay component unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LoadingOverlay } from './LoadingOverlay';
import type { FeedbackStatus } from '../../core/types';

describe('LoadingOverlay', () => {
  const defaultProps = {
    status: 'visible' as FeedbackStatus,
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
    it('should render overlay content', () => {
      render(<LoadingOverlay {...defaultProps} testId="overlay" />);
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    it('should render message when provided', () => {
      render(<LoadingOverlay {...defaultProps} message="Processing..." />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should render backdrop', () => {
      render(<LoadingOverlay {...defaultProps} testId="overlay" />);
      expect(screen.getByTestId('overlay-backdrop')).toBeInTheDocument();
    });
  });

  describe('Cancel Button', () => {
    it('should render cancel button when cancellable with onCancel', () => {
      const onCancel = vi.fn();
      render(
        <LoadingOverlay
          {...defaultProps}
          cancellable
          onCancel={onCancel}
          testId="overlay"
        />
      );
      expect(screen.getByTestId('overlay-cancel')).toBeInTheDocument();
    });

    it('should call onCancel when clicked', () => {
      const onCancel = vi.fn();
      render(
        <LoadingOverlay
          {...defaultProps}
          cancellable
          onCancel={onCancel}
          testId="overlay"
        />
      );

      fireEvent.click(screen.getByTestId('overlay-cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not render when not cancellable', () => {
      render(
        <LoadingOverlay
          {...defaultProps}
          cancellable={false}
          testId="overlay"
        />
      );
      expect(screen.queryByTestId('overlay-cancel')).not.toBeInTheDocument();
    });

    it('should display custom cancel text', () => {
      const onCancel = vi.fn();
      render(
        <LoadingOverlay
          {...defaultProps}
          cancellable
          onCancel={onCancel}
          cancelText="Stop"
        />
      );
      expect(screen.getByText('Stop')).toBeInTheDocument();
    });
  });

  describe('Status Animation', () => {
    it('should be visible when status is visible', () => {
      render(<LoadingOverlay status="visible" testId="overlay" />);
      expect(screen.getByTestId('overlay')).toHaveClass('opacity-100');
    });

    it('should be hidden when status is exiting', () => {
      render(<LoadingOverlay status="exiting" testId="overlay" />);
      const overlay = screen.getByTestId('overlay');
      expect(overlay).toHaveClass('opacity-0');
      expect(overlay).toHaveClass('pointer-events-none');
    });

    it('should have data-status attribute', () => {
      render(<LoadingOverlay status="visible" testId="overlay" />);
      expect(screen.getByTestId('overlay')).toHaveAttribute('data-status', 'visible');
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(<LoadingOverlay {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<LoadingOverlay {...defaultProps} testId="overlay" />);
      expect(screen.getByTestId('overlay')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-busy="true"', () => {
      render(<LoadingOverlay {...defaultProps} testId="overlay" />);
      expect(screen.getByTestId('overlay')).toHaveAttribute('aria-busy', 'true');
    });

    it('should have aria-label', () => {
      render(<LoadingOverlay {...defaultProps} message="Loading..." testId="overlay" />);
      expect(screen.getByTestId('overlay')).toHaveAttribute('aria-label', 'Loading...');
    });
  });

  describe('Backdrop Configuration', () => {
    it('should apply overlay opacity style', () => {
      render(<LoadingOverlay {...defaultProps} overlayOpacity={0.7} testId="overlay" />);
      const backdrop = screen.getByTestId('overlay-backdrop');
      // Use getAttribute for style check due to jsdom limitations with toHaveStyle
      expect(backdrop.getAttribute('style')).toContain('opacity');
    });

    it('should apply blur when enabled', () => {
      render(<LoadingOverlay {...defaultProps} blur testId="overlay" />);
      const backdrop = screen.getByTestId('overlay-backdrop');
      // Check data-blur attribute since jsdom doesn't render backdropFilter properly
      expect(backdrop).toHaveAttribute('data-blur', 'true');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<LoadingOverlay {...defaultProps} className="custom-class" testId="overlay" />);
      expect(screen.getByTestId('overlay')).toHaveClass('custom-class');
    });
  });
});
