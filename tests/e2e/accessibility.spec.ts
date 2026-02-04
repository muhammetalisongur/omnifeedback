/**
 * E2E Accessibility tests for OmniFeedback components
 *
 * Verifies ARIA roles, attributes, and focus management:
 * - Toast has role="alert" and aria-live
 * - Modal has role="dialog" and aria-modal="true"
 * - Confirm has role="alertdialog"
 * - Focus management (moves to modal, returns to trigger)
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility - Toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="trigger-toast-success"]');
  });

  test('should have role="alert" attribute', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-with-testid"]');

    const toast = page.locator('[data-testid="toast-tracked"]');
    await expect(toast).toBeVisible();

    // Verify role="alert"
    await expect(toast).toHaveAttribute('role', 'alert');
  });

  test('should have aria-live attribute for polite notifications', async ({ page }) => {
    // Success toast should use polite
    await page.click('[data-testid="trigger-toast-with-testid"]');

    const toast = page.locator('[data-testid="toast-tracked"]');
    await expect(toast).toBeVisible();

    // Non-error toasts should use "polite"
    await expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  test('should have aria-live="assertive" for error toasts', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-error"]');

    // Error toast should use assertive aria-live
    const errorToast = page.locator('role=alert').first();
    await expect(errorToast).toBeVisible();
    await expect(errorToast).toHaveAttribute('aria-live', 'assertive');
  });

  test('should have aria-atomic="true"', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-with-testid"]');

    const toast = page.locator('[data-testid="toast-tracked"]');
    await expect(toast).toBeVisible();

    // aria-atomic ensures the entire toast is announced
    await expect(toast).toHaveAttribute('aria-atomic', 'true');
  });

  test('dismiss button should have accessible label', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-with-testid"]');

    const toast = page.locator('[data-testid="toast-tracked"]');
    await expect(toast).toBeVisible();

    // Dismiss button should have aria-label
    const dismissButton = toast.locator('button[aria-label="Dismiss notification"]');
    await expect(dismissButton).toBeVisible();
    await expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss notification');
  });
});

test.describe('Accessibility - Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="trigger-modal-basic"]');
  });

  test('should have role="dialog"', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    await expect(modal).toHaveAttribute('role', 'dialog');
  });

  test('should have aria-modal="true"', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('should have aria-labelledby pointing to title', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // aria-labelledby should reference the title element
    const labelledBy = await modal.getAttribute('aria-labelledby');
    expect(labelledBy).toBe('modal-title');

    // The referenced element should exist and contain the title
    const titleElement = modal.locator(`#${labelledBy}`);
    await expect(titleElement).toBeVisible();
    await expect(titleElement).toContainText('Test Modal');
  });

  test('close button should have accessible label', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    const closeButton = modal.locator('button[aria-label="Close modal"]');
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
  });

  test('should move focus into modal when opened', async ({ page }) => {
    // Focus the trigger button first
    const triggerButton = page.locator('[data-testid="trigger-modal-basic"]');
    await triggerButton.focus();

    // Open modal
    await triggerButton.click();

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Wait for focus trap to activate
    await page.waitForTimeout(300);

    // Verify focus is inside the modal
    const isFocusInsideModal = await page.evaluate(() => {
      const active = document.activeElement;
      let current: Element | null = active;
      while (current) {
        if (current.getAttribute('role') === 'dialog') {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    });

    expect(isFocusInsideModal).toBe(true);
  });

  test('should return focus to trigger element when closed', async ({ page }) => {
    const triggerButton = page.locator('[data-testid="trigger-modal-basic"]');

    // Focus and click the trigger
    await triggerButton.focus();
    await triggerButton.click();

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Wait for focus trap
    await page.waitForTimeout(300);

    // Close via ESC
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden({ timeout: 3000 });

    // Wait for focus to return
    await page.waitForTimeout(200);

    // Focus should return to the trigger button
    const isTriggerFocused = await page.evaluate(() => {
      return document.activeElement?.getAttribute('data-testid') === 'trigger-modal-basic';
    });

    expect(isTriggerFocused).toBe(true);
  });
});

test.describe('Accessibility - Confirm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="trigger-confirm-basic"]');
  });

  test('should have role="alertdialog"', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    // Confirm uses role="alertdialog"
    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();
    await expect(confirm).toHaveAttribute('role', 'alertdialog');
  });

  test('should have aria-modal="true"', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();
    await expect(confirm).toHaveAttribute('aria-modal', 'true');
  });

  test('should have aria-describedby pointing to message', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();

    // aria-describedby should reference the message element
    const describedBy = await confirm.getAttribute('aria-describedby');
    expect(describedBy).toBe('confirm-message');

    // The referenced element should contain the message
    const messageElement = confirm.locator(`#${describedBy}`);
    await expect(messageElement).toBeVisible();
    await expect(messageElement).toContainText('Are you sure you want to proceed?');
  });

  test('should have aria-labelledby pointing to title when title exists', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();

    // aria-labelledby should reference the title
    const labelledBy = await confirm.getAttribute('aria-labelledby');
    expect(labelledBy).toBe('confirm-title');

    const titleElement = confirm.locator(`#${labelledBy}`);
    await expect(titleElement).toContainText('Confirm Action');
  });

  test('should move focus to confirm dialog when opened', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();

    // Wait for focus assignment
    await page.waitForTimeout(300);

    // Focus should be inside the confirm dialog
    const isFocusInsideConfirm = await page.evaluate(() => {
      const active = document.activeElement;
      let current: Element | null = active;
      while (current) {
        if (current.getAttribute('role') === 'alertdialog') {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    });

    expect(isFocusInsideConfirm).toBe(true);
  });

  test('should resolve with true when confirm button is clicked', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();

    // Click the confirm button (contains "Confirm" text)
    const confirmButton = confirm.locator('button', { hasText: 'Confirm' });
    await confirmButton.click();

    // Check the result
    const result = page.locator('[data-testid="confirm-result"]');
    await expect(result).toContainText('confirmed');
  });

  test('should resolve with false when cancel button is clicked', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();

    // Click the cancel button
    const cancelButton = confirm.locator('button', { hasText: 'Cancel' });
    await cancelButton.click();

    // Check the result
    const result = page.locator('[data-testid="confirm-result"]');
    await expect(result).toContainText('cancelled');
  });

  test('should close on ESC and resolve as cancelled', async ({ page }) => {
    await page.click('[data-testid="trigger-confirm-basic"]');

    const confirm = page.locator('[role="alertdialog"]');
    await expect(confirm).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Should resolve as cancelled
    const result = page.locator('[data-testid="confirm-result"]');
    await expect(result).toContainText('cancelled');
  });
});
