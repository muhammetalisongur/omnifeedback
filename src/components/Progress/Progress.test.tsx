/**
 * @vitest-environment jsdom
 */

/**
 * Progress component unit tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  describe('Linear mode (default)', () => {
    it('should render linear progress by default', () => {
      render(<Progress value={50} testId="progress" />);

      const progress = screen.getByTestId('progress');
      expect(progress).toBeInTheDocument();
    });

    it('should pass animated prop to linear progress', () => {
      render(<Progress value={50} animated testId="progress" />);

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should pass striped prop to linear progress', () => {
      render(<Progress value={50} striped testId="progress" />);

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });
  });

  describe('Circular mode', () => {
    it('should render circular progress when type is circular', () => {
      render(<Progress value={75} type="circular" testId="progress" />);

      const progress = screen.getByTestId('progress');
      expect(progress).toBeInTheDocument();
    });

    it('should pass strokeWidth to circular progress', () => {
      render(
        <Progress value={75} type="circular" strokeWidth={4} testId="progress" />
      );

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });
  });

  describe('Common props', () => {
    it('should forward ref', () => {
      const ref = { current: null };
      render(<Progress ref={ref} value={50} testId="progress" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should pass value prop', () => {
      render(<Progress value={75} showPercentage testId="progress" />);

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should pass label prop', () => {
      render(<Progress value={50} label="Loading..." testId="progress" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should pass variant prop', () => {
      render(<Progress value={50} variant="success" testId="progress" />);

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should render indeterminate mode', () => {
      render(<Progress value={0} indeterminate testId="progress" />);

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should render circular with showPercentage', () => {
      render(
        <Progress value={75} type="circular" showPercentage testId="progress" />
      );

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should render circular with custom color', () => {
      render(
        <Progress value={50} type="circular" color="rgb(0, 128, 0)" testId="progress" />
      );

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should render circular indeterminate mode', () => {
      render(
        <Progress value={0} type="circular" indeterminate testId="progress" />
      );

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should render circular with label', () => {
      render(
        <Progress value={50} type="circular" label="Uploading..." testId="progress" />
      );

      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });

    it('should render without testId', () => {
      const { container } = render(<Progress value={50} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render linear with custom color', () => {
      render(
        <Progress value={50} color="rgb(0, 128, 0)" testId="progress" />
      );

      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });
  });
});
