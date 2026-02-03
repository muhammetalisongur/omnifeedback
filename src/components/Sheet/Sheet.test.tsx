/**
 * @vitest-environment jsdom
 */

/**
 * Sheet component unit tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sheet } from './Sheet';
import { ActionSheetContent, SheetConfirmContent } from './ActionSheetContent';

// Mock useDrag hook
vi.mock('../../hooks/useDrag', () => ({
  useDrag: () => ({
    dragState: {
      isDragging: false,
      offset: 0,
      velocity: 0,
      direction: 'none',
    },
    dragHandlers: {
      onMouseDown: vi.fn(),
      onTouchStart: vi.fn(),
    },
    reset: vi.fn(),
    isDragging: false,
  }),
}));

// Mock useFocusTrap hook
vi.mock('../../hooks/useFocusTrap', () => ({
  useFocusTrap: vi.fn(),
}));

// Mock useScrollLock hook
vi.mock('../../hooks/useScrollLock', () => ({
  useScrollLock: vi.fn(),
}));

describe('Sheet', () => {
  const defaultProps = {
    content: <div>Sheet Content</div>,
    status: 'visible' as const,
    onRequestClose: vi.fn(),
    testId: 'sheet',
  };

  describe('Rendering', () => {
    it('should render content', () => {
      render(<Sheet {...defaultProps} />);

      expect(screen.getByText('Sheet Content')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(<Sheet {...defaultProps} title="Sheet Title" />);

      expect(screen.getByTestId('sheet-title-text')).toHaveTextContent(
        'Sheet Title'
      );
    });

    it('should not render title when not provided', () => {
      render(<Sheet {...defaultProps} />);

      expect(screen.queryByTestId('sheet-title-text')).not.toBeInTheDocument();
    });

    it('should render drag handle by default', () => {
      render(<Sheet {...defaultProps} />);

      expect(screen.getByTestId('sheet-handle')).toBeInTheDocument();
    });

    it('should hide drag handle when showHandle is false', () => {
      render(<Sheet {...defaultProps} showHandle={false} />);

      expect(screen.queryByTestId('sheet-handle')).not.toBeInTheDocument();
    });

    it('should render backdrop', () => {
      render(<Sheet {...defaultProps} />);

      expect(screen.getByTestId('sheet-backdrop')).toBeInTheDocument();
    });

    it('should render panel with dialog role', () => {
      render(<Sheet {...defaultProps} />);

      const panel = screen.getByTestId('sheet-panel');
      expect(panel).toHaveAttribute('role', 'dialog');
      expect(panel).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Visibility states', () => {
    it('should be visible when status is visible', () => {
      render(<Sheet {...defaultProps} status="visible" />);

      const backdrop = screen.getByTestId('sheet-backdrop');
      expect(backdrop).toHaveClass('opacity-50');
    });

    it('should be visible when status is entering', () => {
      render(<Sheet {...defaultProps} status="entering" />);

      const backdrop = screen.getByTestId('sheet-backdrop');
      expect(backdrop).toHaveClass('opacity-50');
    });

    it('should be hidden when status is exiting', () => {
      render(<Sheet {...defaultProps} status="exiting" />);

      const backdrop = screen.getByTestId('sheet-backdrop');
      expect(backdrop).toHaveClass('opacity-0');
    });
  });

  describe('Backdrop interaction', () => {
    it('should call onRequestClose when backdrop is clicked', () => {
      const onRequestClose = vi.fn();
      render(<Sheet {...defaultProps} onRequestClose={onRequestClose} />);

      const backdrop = screen.getByTestId('sheet-backdrop');
      fireEvent.click(backdrop);

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onRequestClose when closeOnBackdropClick is false', () => {
      const onRequestClose = vi.fn();
      render(
        <Sheet
          {...defaultProps}
          onRequestClose={onRequestClose}
          closeOnBackdropClick={false}
        />
      );

      const backdrop = screen.getByTestId('sheet-backdrop');
      fireEvent.click(backdrop);

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard interaction', () => {
    it('should call onRequestClose on ESC key', () => {
      const onRequestClose = vi.fn();
      render(<Sheet {...defaultProps} onRequestClose={onRequestClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onRequestClose on ESC when closeOnEscape is false', () => {
      const onRequestClose = vi.fn();
      render(
        <Sheet
          {...defaultProps}
          onRequestClose={onRequestClose}
          closeOnEscape={false}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('Snap points', () => {
    it('should use default snap points', () => {
      render(<Sheet {...defaultProps} />);

      // Default snap points are [50, 90]
      const panel = screen.getByTestId('sheet-panel');
      expect(panel).toBeInTheDocument();
    });

    it('should accept custom snap points', () => {
      render(<Sheet {...defaultProps} snapPoints={[30, 60, 90]} />);

      const panel = screen.getByTestId('sheet-panel');
      expect(panel).toBeInTheDocument();
    });

    it('should use defaultSnapPoint', () => {
      render(
        <Sheet {...defaultProps} snapPoints={[30, 60, 90]} defaultSnapPoint={1} />
      );

      const panel = screen.getByTestId('sheet-panel');
      expect(panel).toBeInTheDocument();
    });
  });

  describe('Custom styling', () => {
    it('should apply className', () => {
      render(<Sheet {...defaultProps} className="custom-class" />);

      const panel = screen.getByTestId('sheet-panel');
      expect(panel).toHaveClass('custom-class');
    });

    it('should apply style prop', () => {
      render(<Sheet {...defaultProps} style={{ backgroundColor: 'red' }} />);

      const container = screen.getByTestId('sheet');
      expect(container.style.backgroundColor).toBe('red');
    });
  });

  describe('Data attributes', () => {
    it('should have data-status attribute', () => {
      render(<Sheet {...defaultProps} status="visible" />);

      const container = screen.getByTestId('sheet');
      expect(container).toHaveAttribute('data-status', 'visible');
    });
  });
});

describe('ActionSheetContent', () => {
  const defaultProps = {
    actions: [
      { key: 'option1', label: 'Option 1' },
      { key: 'option2', label: 'Option 2' },
    ],
    onSelect: vi.fn(),
    testId: 'action-sheet',
  };

  describe('Rendering', () => {
    it('should render all actions', () => {
      render(<ActionSheetContent {...defaultProps} />);

      expect(screen.getByTestId('action-sheet-action-option1')).toBeInTheDocument();
      expect(screen.getByTestId('action-sheet-action-option2')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(<ActionSheetContent {...defaultProps} title="Choose Option" />);

      expect(screen.getByTestId('action-sheet-title')).toHaveTextContent(
        'Choose Option'
      );
    });

    it('should render description when provided', () => {
      render(
        <ActionSheetContent {...defaultProps} description="Select an option below" />
      );

      expect(screen.getByTestId('action-sheet-description')).toHaveTextContent(
        'Select an option below'
      );
    });

    it('should render cancel button by default', () => {
      render(<ActionSheetContent {...defaultProps} />);

      expect(screen.getByTestId('action-sheet-cancel')).toBeInTheDocument();
    });

    it('should hide cancel button when showCancel is false', () => {
      render(<ActionSheetContent {...defaultProps} showCancel={false} />);

      expect(screen.queryByTestId('action-sheet-cancel')).not.toBeInTheDocument();
    });

    it('should use custom cancel text', () => {
      render(<ActionSheetContent {...defaultProps} cancelText="Dismiss" />);

      expect(screen.getByTestId('action-sheet-cancel')).toHaveTextContent(
        'Dismiss'
      );
    });

    it('should render action with icon', () => {
      const actionsWithIcon = [
        { key: 'camera', label: 'Camera', icon: <span data-testid="camera-icon">📷</span> },
      ];
      render(<ActionSheetContent {...defaultProps} actions={actionsWithIcon} />);

      expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    });

    it('should apply destructive style', () => {
      const destructiveActions = [
        { key: 'delete', label: 'Delete', destructive: true },
      ];
      render(<ActionSheetContent {...defaultProps} actions={destructiveActions} />);

      const button = screen.getByTestId('action-sheet-action-delete');
      expect(button).toHaveClass('text-red-600');
    });
  });

  describe('User interaction', () => {
    it('should call onSelect when action is clicked', () => {
      const onSelect = vi.fn();
      render(<ActionSheetContent {...defaultProps} onSelect={onSelect} />);

      fireEvent.click(screen.getByTestId('action-sheet-action-option1'));

      expect(onSelect).toHaveBeenCalledWith('option1');
    });

    it('should not call onSelect when disabled action is clicked', () => {
      const onSelect = vi.fn();
      const actionsWithDisabled = [
        { key: 'disabled', label: 'Disabled', disabled: true },
      ];
      render(
        <ActionSheetContent
          {...defaultProps}
          actions={actionsWithDisabled}
          onSelect={onSelect}
        />
      );

      fireEvent.click(screen.getByTestId('action-sheet-action-disabled'));

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should call onCancel when cancel is clicked', () => {
      const onCancel = vi.fn();
      render(<ActionSheetContent {...defaultProps} onCancel={onCancel} />);

      fireEvent.click(screen.getByTestId('action-sheet-cancel'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });
});

describe('SheetConfirmContent', () => {
  const defaultProps = {
    title: 'Confirm Action',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    testId: 'confirm-sheet',
  };

  describe('Rendering', () => {
    it('should render title', () => {
      render(<SheetConfirmContent {...defaultProps} />);

      expect(screen.getByTestId('confirm-sheet-title')).toHaveTextContent(
        'Confirm Action'
      );
    });

    it('should render description when provided', () => {
      render(
        <SheetConfirmContent {...defaultProps} description="Are you sure?" />
      );

      expect(screen.getByTestId('confirm-sheet-description')).toHaveTextContent(
        'Are you sure?'
      );
    });

    it('should render confirm button', () => {
      render(<SheetConfirmContent {...defaultProps} />);

      expect(screen.getByTestId('confirm-sheet-confirm')).toBeInTheDocument();
    });

    it('should render cancel button', () => {
      render(<SheetConfirmContent {...defaultProps} />);

      expect(screen.getByTestId('confirm-sheet-cancel')).toBeInTheDocument();
    });

    it('should use custom confirm text', () => {
      render(<SheetConfirmContent {...defaultProps} confirmText="Yes, Delete" />);

      expect(screen.getByTestId('confirm-sheet-confirm')).toHaveTextContent(
        'Yes, Delete'
      );
    });

    it('should use custom cancel text', () => {
      render(<SheetConfirmContent {...defaultProps} cancelText="No, Keep" />);

      expect(screen.getByTestId('confirm-sheet-cancel')).toHaveTextContent(
        'No, Keep'
      );
    });

    it('should apply destructive style', () => {
      render(<SheetConfirmContent {...defaultProps} destructive />);

      const button = screen.getByTestId('confirm-sheet-confirm');
      expect(button).toHaveClass('text-red-600');
    });
  });

  describe('User interaction', () => {
    it('should call onConfirm when confirm is clicked', () => {
      const onConfirm = vi.fn();
      render(<SheetConfirmContent {...defaultProps} onConfirm={onConfirm} />);

      fireEvent.click(screen.getByTestId('confirm-sheet-confirm'));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel is clicked', () => {
      const onCancel = vi.fn();
      render(<SheetConfirmContent {...defaultProps} onCancel={onCancel} />);

      fireEvent.click(screen.getByTestId('confirm-sheet-cancel'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
