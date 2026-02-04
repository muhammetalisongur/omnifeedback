/**
 * E2E tests for Modal dialogs
 *
 * Verifies core modal functionality including:
 * - Opening when triggered
 * - Closing on ESC key
 * - Closing on backdrop click
 * - Focus trapping (Tab key stays within modal)
 * - Correct ARIA attributes
 */

import { test, expect } from '@playwright/test';

test.describe('Modal Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="trigger-modal-basic"]');
  });

  test('should open when triggered', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    // Modal should be visible with the correct content
    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Title should be displayed
    await expect(modal.locator('#modal-title')).toContainText('Test Modal');

    // Content should be present
    const content = page.locator('[data-testid="modal-content"]');
    await expect(content).toBeVisible();
    await expect(content).toContainText('This is a test modal content.');
  });

  test('should close on ESC key', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should be hidden after exit animation
    await expect(modal).toBeHidden({ timeout: 3000 });
  });

  test('should NOT close on ESC when closeOnEscape is false', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-no-escape"]');

    const modal = page.locator('[data-testid="modal-no-escape"]');
    await expect(modal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should still be visible
    await expect(modal).toBeVisible();

    // Cleanup: close via close-all button
    // First need to click outside or use close button
    await page.click('[data-testid="close-all-modals"]', { force: true });
  });

  test('should close on backdrop click', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Click on the backdrop (the outer dialog element itself acts as backdrop)
    // We click at a position that is clearly outside the modal panel
    await modal.click({ position: { x: 5, y: 5 } });

    // Modal should close after animation
    await expect(modal).toBeHidden({ timeout: 3000 });
  });

  test('should NOT close on backdrop click when disabled', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-no-backdrop"]');

    const modal = page.locator('[data-testid="modal-no-backdrop"]');
    await expect(modal).toBeVisible();

    // Click on the backdrop area
    await modal.click({ position: { x: 5, y: 5 } });

    // Modal should still be visible
    await expect(modal).toBeVisible();

    // Cleanup
    await page.keyboard.press('Escape');
  });

  test('should trap focus within modal (Tab key stays inside)', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Wait for focus trap to activate
    await page.waitForTimeout(300);

    // Collect all focusable elements inside the modal panel
    // The modal contains: close button (header), input, action button
    // Tab through several times and verify focus stays within the modal
    const focusableCount = await modal.locator(
      'button, input, [tabindex]:not([tabindex="-1"])'
    ).count();

    // There should be focusable elements inside
    expect(focusableCount).toBeGreaterThan(0);

    // Tab through all elements + 1 to verify cycling
    for (let i = 0; i < focusableCount + 1; i++) {
      await page.keyboard.press('Tab');
    }

    // After cycling through all elements, focus should still be within the modal
    const activeElementTestId = await page.evaluate(() => {
      const active = document.activeElement;
      // Walk up the tree to check if active element is within a dialog
      let current: Element | null = active;
      while (current) {
        if (current.getAttribute('role') === 'dialog') {
          return 'inside-modal';
        }
        current = current.parentElement;
      }
      return 'outside-modal';
    });

    expect(activeElementTestId).toBe('inside-modal');
  });

  test('should have correct ARIA attributes', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Verify role="dialog"
    await expect(modal).toHaveAttribute('role', 'dialog');

    // Verify aria-modal="true"
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // Verify aria-labelledby points to the title element
    await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');

    // Verify the title element exists with matching ID
    const title = modal.locator('#modal-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Test Modal');
  });

  test('should close from internal action button', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-basic"]');

    const modal = page.locator('[data-testid="modal-basic"]');
    await expect(modal).toBeVisible();

    // Click the close button rendered inside modal content
    await page.click('[data-testid="modal-action-button"]');

    // Modal should close
    await expect(modal).toBeHidden({ timeout: 3000 });
  });

  test('should display footer when provided', async ({ page }) => {
    await page.click('[data-testid="trigger-modal-with-footer"]');

    const modal = page.locator('[data-testid="modal-with-footer"]');
    await expect(modal).toBeVisible();

    // Footer buttons should be visible
    const cancelButton = page.locator('[data-testid="modal-footer-cancel"]');
    const saveButton = page.locator('[data-testid="modal-footer-save"]');

    await expect(cancelButton).toBeVisible();
    await expect(saveButton).toBeVisible();

    // Clicking save should close the modal
    await saveButton.click();
    await expect(modal).toBeHidden({ timeout: 3000 });
  });
});
