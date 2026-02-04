/**
 * @vitest-environment jsdom
 */

/**
 * Empty component unit tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Empty } from './index';
import { emptyPresets } from './presets';

describe('Empty', () => {
  describe('Default Rendering', () => {
    it('should render with default no-data type', () => {
      render(<Empty testId="empty" />);

      const empty = screen.getByTestId('empty');
      expect(empty).toBeInTheDocument();
      expect(empty).toHaveAttribute('data-empty-type', 'no-data');
    });

    it('should have role="status" for accessibility', () => {
      render(<Empty testId="empty" />);

      const empty = screen.getByTestId('empty');
      expect(empty).toHaveAttribute('role', 'status');
    });

    it('should render default title from preset', () => {
      render(<Empty type="no-data" testId="empty" />);

      const title = screen.getByTestId('empty-title');
      expect(title).toHaveTextContent(emptyPresets['no-data'].title);
    });

    it('should render default description from preset', () => {
      render(<Empty type="no-data" testId="empty" />);

      const description = screen.getByTestId('empty-description');
      expect(description).toHaveTextContent(emptyPresets['no-data'].description);
    });

    it('should render default icon from preset', () => {
      render(<Empty type="no-data" testId="empty" />);

      const iconContainer = screen.getByTestId('empty-icon');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Custom Content', () => {
    it('should render custom title', () => {
      render(<Empty title="Custom Title" testId="empty" />);

      const title = screen.getByTestId('empty-title');
      expect(title).toHaveTextContent('Custom Title');
    });

    it('should render custom description', () => {
      render(<Empty description="Custom description text" testId="empty" />);

      const description = screen.getByTestId('empty-description');
      expect(description).toHaveTextContent('Custom description text');
    });

    it('should render custom icon', () => {
      render(
        <Empty
          icon={<span data-testid="custom-icon">Custom Icon</span>}
          testId="empty"
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should hide icon when hideIcon is true', () => {
      render(<Empty hideIcon testId="empty" />);

      expect(screen.queryByTestId('empty-icon')).not.toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Empty testId="empty">
          <div data-testid="custom-child">Custom Child</div>
        </Empty>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });
  });

  describe('Preset Types', () => {
    it('should render no-data preset', () => {
      render(<Empty type="no-data" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'no-data');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets['no-data'].title);
    });

    it('should render no-results preset', () => {
      render(<Empty type="no-results" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'no-results');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets['no-results'].title);
    });

    it('should render no-permission preset', () => {
      render(<Empty type="no-permission" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'no-permission');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets['no-permission'].title);
    });

    it('should render error preset', () => {
      render(<Empty type="error" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'error');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets.error.title);
    });

    it('should render offline preset', () => {
      render(<Empty type="offline" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'offline');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets.offline.title);
    });

    it('should render 404 preset', () => {
      render(<Empty type="404" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', '404');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets['404'].title);
    });

    it('should render 403 preset', () => {
      render(<Empty type="403" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', '403');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets['403'].title);
    });

    it('should render 500 preset', () => {
      render(<Empty type="500" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', '500');
      expect(screen.getByTestId('empty-title')).toHaveTextContent(emptyPresets['500'].title);
    });

    it('should render custom type without preset defaults', () => {
      render(<Empty type="custom" title="Custom" testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'custom');
      expect(screen.getByTestId('empty-title')).toHaveTextContent('Custom');
    });
  });

  describe('Actions', () => {
    it('should render single action button', () => {
      const onClick = vi.fn();
      render(
        <Empty
          action={{ label: 'Click Me', onClick }}
          testId="empty"
        />
      );

      const button = screen.getByRole('button', { name: 'Click Me' });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render multiple action buttons', () => {
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();
      render(
        <Empty
          action={[
            { label: 'Primary', onClick: onClick1, variant: 'primary' },
            { label: 'Secondary', onClick: onClick2, variant: 'secondary' },
          ]}
          testId="empty"
        />
      );

      expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
    });

    it('should render action with icon', () => {
      render(
        <Empty
          action={{
            label: 'With Icon',
            onClick: (): void => { /* noop */ },
            icon: <span data-testid="action-icon">+</span>,
          }}
          testId="empty"
        />
      );

      expect(screen.getByTestId('action-icon')).toBeInTheDocument();
    });

    it('should apply primary variant styles by default', () => {
      render(
        <Empty
          action={{ label: 'Primary', onClick: (): void => { /* noop */ } }}
          testId="empty"
        />
      );

      const button = screen.getByRole('button', { name: 'Primary' });
      expect(button).toHaveClass('bg-blue-600');
    });

    it('should apply secondary variant styles', () => {
      render(
        <Empty
          action={{ label: 'Secondary', onClick: (): void => { /* noop */ }, variant: 'secondary' }}
          testId="empty"
        />
      );

      const button = screen.getByRole('button', { name: 'Secondary' });
      expect(button).toHaveClass('bg-gray-100');
    });

    it('should apply link variant styles', () => {
      render(
        <Empty
          action={{ label: 'Link', onClick: (): void => { /* noop */ }, variant: 'link' }}
          testId="empty"
        />
      );

      const button = screen.getByRole('button', { name: 'Link' });
      expect(button).toHaveClass('text-blue-600');
    });
  });

  describe('Size Variants', () => {
    it('should apply small size styles', () => {
      render(<Empty size="sm" testId="empty" />);

      const empty = screen.getByTestId('empty');
      expect(empty).toHaveClass('py-8');
    });

    it('should apply medium size styles by default', () => {
      render(<Empty testId="empty" />);

      const empty = screen.getByTestId('empty');
      expect(empty).toHaveClass('py-12');
    });

    it('should apply large size styles', () => {
      render(<Empty size="lg" testId="empty" />);

      const empty = screen.getByTestId('empty');
      expect(empty).toHaveClass('py-16');
    });
  });

  describe('Compound Components', () => {
    it('should render Empty.NoData', () => {
      render(<Empty.NoData testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'no-data');
    });

    it('should render Empty.NoResults', () => {
      render(<Empty.NoResults testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'no-results');
    });

    it('should render Empty.NoPermission', () => {
      render(<Empty.NoPermission testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'no-permission');
    });

    it('should render Empty.Error', () => {
      render(<Empty.Error testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'error');
    });

    it('should render Empty.Offline', () => {
      render(<Empty.Offline testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', 'offline');
    });

    it('should render Empty.NotFound', () => {
      render(<Empty.NotFound testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', '404');
    });

    it('should render Empty.Forbidden', () => {
      render(<Empty.Forbidden testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', '403');
    });

    it('should render Empty.ServerError', () => {
      render(<Empty.ServerError testId="empty" />);

      expect(screen.getByTestId('empty')).toHaveAttribute('data-empty-type', '500');
    });

    it('should allow custom props on compound components', () => {
      render(
        <Empty.NoData
          title="Custom No Data Title"
          description="Custom description"
          testId="empty"
        />
      );

      expect(screen.getByTestId('empty-title')).toHaveTextContent('Custom No Data Title');
      expect(screen.getByTestId('empty-description')).toHaveTextContent('Custom description');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<Empty className="custom-class" testId="empty" />);

      const empty = screen.getByTestId('empty');
      expect(empty).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(<Empty style={{ backgroundColor: 'red' }} testId="empty" />);

      const empty = screen.getByTestId('empty');
      expect(empty.style.backgroundColor).toBe('red');
    });
  });
});
