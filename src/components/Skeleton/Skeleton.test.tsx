/**
 * @vitest-environment jsdom
 */

/**
 * Skeleton component unit tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import { SkeletonAvatar } from './SkeletonAvatar';
import { SkeletonCard } from './SkeletonCard';
import { SkeletonTable } from './SkeletonTable';

describe('Skeleton', () => {
  describe('Base Skeleton', () => {
    it('should render with default props', () => {
      render(<Skeleton testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render with custom dimensions', () => {
      render(<Skeleton width={200} height={40} testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.style.width).toBe('200px');
      expect(skeleton.style.height).toBe('40px');
    });

    it('should render as circle', () => {
      render(<Skeleton width={50} height={50} circle testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.style.borderRadius).toBe('50%');
    });

    it('should render inline', () => {
      render(<Skeleton inline testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('inline-block');
    });

    it('should render as block by default', () => {
      render(<Skeleton testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('block');
    });

    it('should apply pulse animation by default', () => {
      render(<Skeleton testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should apply wave animation', () => {
      render(<Skeleton animation="wave" testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('skeleton-wave');
    });

    it('should apply no animation', () => {
      render(<Skeleton animation="none" testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).not.toHaveClass('animate-pulse');
      expect(skeleton).not.toHaveClass('skeleton-wave');
    });

    it('should apply custom base color', () => {
      render(<Skeleton baseColor="rgb(255, 0, 0)" testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('should render multiple skeletons with count prop', () => {
      render(<Skeleton count={3} testId="skeleton" />);

      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-2')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Skeleton className="custom-class" testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('custom-class');
    });

    it('should apply custom borderRadius', () => {
      render(<Skeleton borderRadius={8} testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.style.borderRadius).toBe('8px');
    });
  });

  describe('Skeleton.Text', () => {
    it('should render single line by default', () => {
      render(<SkeletonText testId="text" />);

      const container = screen.getByTestId('text');
      expect(container.children).toHaveLength(1);
    });

    it('should render multiple lines', () => {
      render(<SkeletonText lines={4} testId="text" />);

      const container = screen.getByTestId('text');
      expect(container.children).toHaveLength(4);
    });

    it('should apply shorter width to last line', () => {
      render(<SkeletonText lines={3} lastLineWidth="50%" testId="text" />);

      const lastLine = screen.getByTestId('text-line-2');
      expect(lastLine.style.width).toBe('50%');
    });

    it('should apply custom line height', () => {
      render(<SkeletonText lineHeight={24} testId="text" />);

      const line = screen.getByTestId('text-line-0');
      expect(line.style.height).toBe('24px');
    });

    it('should apply custom gap', () => {
      render(<SkeletonText lines={2} gap={16} testId="text" />);

      const container = screen.getByTestId('text');
      expect(container.style.gap).toBe('16px');
    });

    it('should apply custom base and highlight colors', () => {
      render(
        <SkeletonText
          lines={2}
          baseColor="rgb(200, 200, 200)"
          highlightColor="rgb(220, 220, 220)"
          testId="text"
        />
      );

      expect(screen.getByTestId('text')).toBeInTheDocument();
    });
  });

  describe('Skeleton.Avatar', () => {
    it('should render medium size by default', () => {
      render(<SkeletonAvatar testId="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar.style.width).toBe('40px');
      expect(avatar.style.height).toBe('40px');
    });

    it('should render small size', () => {
      render(<SkeletonAvatar size="sm" testId="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar.style.width).toBe('32px');
      expect(avatar.style.height).toBe('32px');
    });

    it('should render large size', () => {
      render(<SkeletonAvatar size="lg" testId="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar.style.width).toBe('56px');
      expect(avatar.style.height).toBe('56px');
    });

    it('should render extra large size', () => {
      render(<SkeletonAvatar size="xl" testId="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar.style.width).toBe('80px');
      expect(avatar.style.height).toBe('80px');
    });

    it('should render custom pixel size', () => {
      render(<SkeletonAvatar size={100} testId="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar.style.width).toBe('100px');
      expect(avatar.style.height).toBe('100px');
    });

    it('should be circular', () => {
      render(<SkeletonAvatar testId="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar.style.borderRadius).toBe('50%');
    });

    it('should apply custom base and highlight colors', () => {
      render(
        <SkeletonAvatar
          baseColor="rgb(200, 200, 200)"
          highlightColor="rgb(220, 220, 220)"
          className="custom-avatar"
          testId="avatar"
        />
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Skeleton.Card', () => {
    it('should render with image by default', () => {
      render(<SkeletonCard testId="card" />);

      expect(screen.getByTestId('card-image')).toBeInTheDocument();
    });

    it('should render without image when hasImage is false', () => {
      render(<SkeletonCard hasImage={false} testId="card" />);

      expect(screen.queryByTestId('card-image')).not.toBeInTheDocument();
    });

    it('should render title placeholder', () => {
      render(<SkeletonCard testId="card" />);

      expect(screen.getByTestId('card-title')).toBeInTheDocument();
    });

    it('should render text lines', () => {
      render(<SkeletonCard lines={3} testId="card" />);

      const textContainer = screen.getByTestId('card-text');
      expect(textContainer.children).toHaveLength(3);
    });

    it('should render button placeholder by default', () => {
      render(<SkeletonCard testId="card" />);

      expect(screen.getByTestId('card-button')).toBeInTheDocument();
    });

    it('should render without button when hasButton is false', () => {
      render(<SkeletonCard hasButton={false} testId="card" />);

      expect(screen.queryByTestId('card-button')).not.toBeInTheDocument();
    });

    it('should apply custom image height', () => {
      render(<SkeletonCard imageHeight={300} testId="card" />);

      const image = screen.getByTestId('card-image');
      expect(image.style.height).toBe('300px');
    });

    it('should apply custom base and highlight colors', () => {
      render(
        <SkeletonCard
          baseColor="rgb(200, 200, 200)"
          highlightColor="rgb(220, 220, 220)"
          className="custom-card"
          testId="card"
        />
      );

      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('Skeleton.Table', () => {
    it('should render 5 rows by default', () => {
      render(<SkeletonTable testId="table" />);

      expect(screen.getByTestId('table-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('table-row-4')).toBeInTheDocument();
      expect(screen.queryByTestId('table-row-5')).not.toBeInTheDocument();
    });

    it('should render custom number of rows', () => {
      render(<SkeletonTable rows={3} testId="table" />);

      expect(screen.getByTestId('table-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('table-row-2')).toBeInTheDocument();
      expect(screen.queryByTestId('table-row-3')).not.toBeInTheDocument();
    });

    it('should render 4 columns by default', () => {
      render(<SkeletonTable testId="table" />);

      expect(screen.getByTestId('table-cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('table-cell-0-3')).toBeInTheDocument();
      expect(screen.queryByTestId('table-cell-0-4')).not.toBeInTheDocument();
    });

    it('should render custom number of columns', () => {
      render(<SkeletonTable columns={6} testId="table" />);

      expect(screen.getByTestId('table-cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('table-cell-0-5')).toBeInTheDocument();
      expect(screen.queryByTestId('table-cell-0-6')).not.toBeInTheDocument();
    });

    it('should render header by default', () => {
      render(<SkeletonTable testId="table" />);

      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });

    it('should hide header when showHeader is false', () => {
      render(<SkeletonTable showHeader={false} testId="table" />);

      expect(screen.queryByTestId('table-header')).not.toBeInTheDocument();
    });

    it('should render header cells', () => {
      render(<SkeletonTable columns={3} testId="table" />);

      expect(screen.getByTestId('table-header-0')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-1')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-2')).toBeInTheDocument();
    });

    it('should use custom column widths and colors', () => {
      render(
        <SkeletonTable
          columns={3}
          columnWidths={['30%', '40%', '30%']}
          baseColor="rgb(200, 200, 200)"
          highlightColor="rgb(220, 220, 220)"
          className="custom-table"
          testId="table"
        />
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });

  describe('Rendering without testId', () => {
    it('should render Skeleton without testId', () => {
      const { container } = render(<Skeleton />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render SkeletonText without testId', () => {
      const { container } = render(<SkeletonText lines={2} />);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild?.childNodes).toHaveLength(2);
    });

    it('should render SkeletonAvatar without testId', () => {
      const { container } = render(<SkeletonAvatar />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render SkeletonCard without testId', () => {
      const { container } = render(<SkeletonCard />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render SkeletonTable without testId', () => {
      const { container } = render(<SkeletonTable rows={2} columns={2} />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on all skeletons', () => {
      render(<Skeleton testId="skeleton" />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden on skeleton text lines', () => {
      render(<SkeletonText testId="text" />);

      const line = screen.getByTestId('text-line-0');
      expect(line).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden on skeleton avatar', () => {
      render(<SkeletonAvatar testId="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
