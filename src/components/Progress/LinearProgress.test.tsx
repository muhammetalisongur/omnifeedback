/**
 * LinearProgress component unit tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinearProgress } from './LinearProgress';

describe('LinearProgress', () => {
  describe('Rendering', () => {
    it('should render progress bar', () => {
      render(<LinearProgress value={50} testId="progress" />);
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should render track and fill', () => {
      render(<LinearProgress value={50} testId="progress" />);
      expect(screen.getByTestId('progress-track')).toBeInTheDocument();
      expect(screen.getByTestId('progress-fill')).toBeInTheDocument();
    });

    it('should have role="progressbar"', () => {
      render(<LinearProgress value={50} testId="progress" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Value and Percentage', () => {
    it('should set correct width based on value', () => {
      render(<LinearProgress value={50} testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill.getAttribute('style')).toContain('width: 50%');
    });

    it('should calculate percentage based on max', () => {
      render(<LinearProgress value={25} max={50} testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill.getAttribute('style')).toContain('width: 50%');
    });

    it('should clamp value to 0-100%', () => {
      render(<LinearProgress value={150} testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill.getAttribute('style')).toContain('width: 100%');
    });

    it('should handle negative values', () => {
      render(<LinearProgress value={-10} testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill.getAttribute('style')).toContain('width: 0%');
    });

    it('should show percentage when showPercentage is true', () => {
      render(<LinearProgress value={75} showPercentage testId="progress" />);
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('75%');
    });

    it('should not show percentage when showPercentage is false', () => {
      render(<LinearProgress value={75} testId="progress" />);
      expect(screen.queryByTestId('progress-percentage')).not.toBeInTheDocument();
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      render(<LinearProgress value={50} label="Loading..." testId="progress" />);
      expect(screen.getByTestId('progress-label')).toHaveTextContent('Loading...');
    });

    it('should not render label when not provided', () => {
      render(<LinearProgress value={50} testId="progress" />);
      expect(screen.queryByTestId('progress-label')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply info variant by default', () => {
      render(<LinearProgress value={50} testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('bg-blue-500');
    });

    it('should apply success variant', () => {
      render(<LinearProgress value={50} variant="success" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('bg-green-500');
    });

    it('should apply error variant', () => {
      render(<LinearProgress value={50} variant="error" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('bg-red-500');
    });

    it('should apply warning variant', () => {
      render(<LinearProgress value={50} variant="warning" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('bg-yellow-500');
    });
  });

  describe('Sizes', () => {
    it('should apply md size by default', () => {
      render(<LinearProgress value={50} testId="progress" />);
      const track = screen.getByTestId('progress-track');
      expect(track).toHaveClass('h-2');
    });

    it('should apply sm size', () => {
      render(<LinearProgress value={50} size="sm" testId="progress" />);
      const track = screen.getByTestId('progress-track');
      expect(track).toHaveClass('h-1');
    });

    it('should apply lg size', () => {
      render(<LinearProgress value={50} size="lg" testId="progress" />);
      const track = screen.getByTestId('progress-track');
      expect(track).toHaveClass('h-4');
    });
  });

  describe('Indeterminate Mode', () => {
    it('should apply indeterminate animation', () => {
      render(<LinearProgress value={0} indeterminate testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('animate-indeterminate');
      expect(fill).toHaveAttribute('data-indeterminate', 'true');
    });

    it('should set fixed width for indeterminate', () => {
      render(<LinearProgress value={0} indeterminate testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill.getAttribute('style')).toContain('width: 50%');
    });

    it('should not show percentage in indeterminate mode', () => {
      render(<LinearProgress value={50} indeterminate showPercentage testId="progress" />);
      expect(screen.queryByTestId('progress-percentage')).not.toBeInTheDocument();
    });
  });

  describe('Striped', () => {
    it('should apply striped class when striped is true', () => {
      render(<LinearProgress value={50} striped testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('bg-striped');
      expect(fill).toHaveAttribute('data-striped', 'true');
    });

    it('should apply animated class when striped and animated', () => {
      render(<LinearProgress value={50} striped animated testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('animate-striped');
    });
  });

  describe('Custom Color', () => {
    it('should apply custom color', () => {
      render(<LinearProgress value={50} color="#ff0000" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      // Check for color in style (format may vary between test environments)
      const style = fill.getAttribute('style') ?? '';
      expect(style).toContain('background-color');
      expect(style.includes('#ff0000') || style.includes('rgb(255, 0, 0)')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-valuenow', () => {
      render(<LinearProgress value={50} testId="progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    });

    it('should have aria-valuemin and aria-valuemax', () => {
      render(<LinearProgress value={50} testId="progress" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should use custom max for aria-valuemax', () => {
      render(<LinearProgress value={25} max={50} testId="progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '50');
    });

    it('should have aria-label', () => {
      render(<LinearProgress value={50} label="Uploading files" testId="progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Uploading files');
    });

    it('should not have aria-valuenow in indeterminate mode', () => {
      render(<LinearProgress value={50} indeterminate testId="progress" />);
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<LinearProgress value={50} className="custom-class" testId="progress" />);
      expect(screen.getByTestId('progress')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(<LinearProgress value={50} style={{ margin: '10px' }} testId="progress" />);
      const progress = screen.getByTestId('progress');
      expect(progress.getAttribute('style')).toContain('margin');
    });
  });
});
