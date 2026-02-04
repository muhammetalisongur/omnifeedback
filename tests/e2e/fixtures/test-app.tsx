/**
 * E2E Test Fixture Application
 *
 * Minimal React app that renders OmniFeedback components with
 * trigger buttons for Playwright E2E tests.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { FeedbackProvider } from '@providers/FeedbackProvider';
import { useToast } from '@hooks/useToast';
import { useModal } from '@hooks/useModal';
import { useConfirm } from '@hooks/useConfirm';

/**
 * Toast test controls
 */
function ToastControls(): React.ReactElement {
  const toast = useToast();

  return (
    <div className="section">
      <h2>Toast Controls</h2>
      <div className="controls">
        <button
          data-testid="trigger-toast-success"
          onClick={() => toast.success('Operation completed successfully')}
        >
          Success Toast
        </button>

        <button
          data-testid="trigger-toast-error"
          onClick={() => toast.error('An error occurred')}
        >
          Error Toast
        </button>

        <button
          data-testid="trigger-toast-warning"
          onClick={() => toast.warning('Please be careful')}
        >
          Warning Toast
        </button>

        <button
          data-testid="trigger-toast-info"
          onClick={() => toast.info('Here is some information')}
        >
          Info Toast
        </button>

        <button
          data-testid="trigger-toast-custom-duration"
          onClick={() =>
            toast.success('Short toast', {
              duration: 1000,
              testId: 'toast-custom-duration',
            })
          }
        >
          Short Duration (1s)
        </button>

        <button
          data-testid="trigger-toast-no-dismiss"
          onClick={() =>
            toast.show({
              message: 'Persistent toast',
              duration: 0,
              dismissible: false,
              testId: 'toast-no-dismiss',
            })
          }
        >
          No Auto-Dismiss
        </button>

        <button
          data-testid="trigger-toast-top-left"
          onClick={() =>
            toast.success('Top left toast', {
              position: 'top-left',
              testId: 'toast-top-left',
            })
          }
        >
          Top Left
        </button>

        <button
          data-testid="trigger-toast-bottom-left"
          onClick={() =>
            toast.success('Bottom left toast', {
              position: 'bottom-left',
              testId: 'toast-bottom-left',
            })
          }
        >
          Bottom Left
        </button>

        <button
          data-testid="trigger-toast-bottom-right"
          onClick={() =>
            toast.success('Bottom right toast', {
              position: 'bottom-right',
              testId: 'toast-bottom-right',
            })
          }
        >
          Bottom Right
        </button>

        <button
          data-testid="trigger-toast-with-testid"
          onClick={() =>
            toast.success('Tracked toast', {
              testId: 'toast-tracked',
              duration: 5000,
            })
          }
        >
          Toast with TestID
        </button>

        <button
          data-testid="trigger-multiple-toasts"
          onClick={() => {
            toast.success('First toast', { testId: 'toast-multi-1' });
            toast.error('Second toast', { testId: 'toast-multi-2' });
            toast.warning('Third toast', { testId: 'toast-multi-3' });
          }}
        >
          Multiple Toasts
        </button>

        <button data-testid="dismiss-all-toasts" onClick={() => toast.dismissAll()}>
          Dismiss All
        </button>
      </div>
    </div>
  );
}

/**
 * Modal test controls
 */
function ModalControls(): React.ReactElement {
  const modal = useModal();

  return (
    <div className="section">
      <h2>Modal Controls</h2>
      <div className="controls">
        <button
          data-testid="trigger-modal-basic"
          onClick={() => {
            const id = modal.open({
              title: 'Test Modal',
              content: (
                <div data-testid="modal-content">
                  <p>This is a test modal content.</p>
                  <input
                    type="text"
                    data-testid="modal-input"
                    placeholder="Focus test input"
                  />
                  <button
                    data-testid="modal-action-button"
                    onClick={() => modal.close(id)}
                  >
                    Close from inside
                  </button>
                </div>
              ),
              testId: 'modal-basic',
            });
          }}
        >
          Open Basic Modal
        </button>

        <button
          data-testid="trigger-modal-no-escape"
          onClick={() => {
            modal.open({
              title: 'No ESC Modal',
              content: <p data-testid="modal-no-esc-content">Cannot close with ESC</p>,
              closeOnEscape: false,
              testId: 'modal-no-escape',
            });
          }}
        >
          Modal (No ESC)
        </button>

        <button
          data-testid="trigger-modal-no-backdrop"
          onClick={() => {
            modal.open({
              title: 'No Backdrop Close',
              content: <p>Cannot close with backdrop click</p>,
              closeOnBackdropClick: false,
              testId: 'modal-no-backdrop',
            });
          }}
        >
          Modal (No Backdrop Close)
        </button>

        <button
          data-testid="trigger-modal-with-footer"
          onClick={() => {
            const id = modal.open({
              title: 'Modal with Footer',
              content: <p>Modal content here</p>,
              footer: (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button data-testid="modal-footer-cancel" onClick={() => modal.close(id)}>
                    Cancel
                  </button>
                  <button data-testid="modal-footer-save" onClick={() => modal.close(id)}>
                    Save
                  </button>
                </div>
              ),
              testId: 'modal-with-footer',
            });
          }}
        >
          Modal with Footer
        </button>

        <button data-testid="close-all-modals" onClick={() => modal.closeAll()}>
          Close All Modals
        </button>
      </div>
    </div>
  );
}

/**
 * Confirm test controls
 */
function ConfirmControls(): React.ReactElement {
  const confirm = useConfirm();

  return (
    <div className="section">
      <h2>Confirm Controls</h2>
      <div className="controls">
        <button
          data-testid="trigger-confirm-basic"
          onClick={async () => {
            const result = await confirm.show({
              message: 'Are you sure you want to proceed?',
              title: 'Confirm Action',
            });
            // Store result for test verification
            const el = document.getElementById('confirm-result');
            if (el) el.textContent = result ? 'confirmed' : 'cancelled';
          }}
        >
          Show Confirm
        </button>

        <button
          data-testid="trigger-confirm-danger"
          onClick={async () => {
            const result = await confirm.danger('This action cannot be undone.', {
              title: 'Delete Item',
              confirmText: 'Delete',
            });
            const el = document.getElementById('confirm-result');
            if (el) el.textContent = result ? 'confirmed' : 'cancelled';
          }}
        >
          Show Danger Confirm
        </button>
      </div>
      <p data-testid="confirm-result" id="confirm-result" style={{ marginTop: '8px' }}>
        (no result yet)
      </p>
    </div>
  );
}

/**
 * Main test application
 */
function TestApp(): React.ReactElement {
  return (
    <FeedbackProvider toastPosition="top-right">
      <h1>OmniFeedback E2E Test Fixture</h1>
      <ToastControls />
      <ModalControls />
      <ConfirmControls />
    </FeedbackProvider>
  );
}

/* Mount application */
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<TestApp />);
}
