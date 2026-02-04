/**
 * E2E tests for Toast notifications
 *
 * Verifies core toast functionality including:
 * - Rendering in the DOM when triggered
 * - Auto-dismissal after configured duration
 * - Close button behavior
 * - Multiple toast stacking
 * - Position variants
 */

import { test, expect } from '@playwright/test';

test.describe('Toast Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="trigger-toast-success"]');
  });

  test('should appear in the DOM when triggered', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-success"]');

    // Toast should appear with role="alert"
    const toast = page.locator('role=alert').first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Operation completed successfully');
  });

  test('should auto-dismiss after configured duration', async ({ page }) => {
    // Trigger a toast with 1 second duration
    await page.click('[data-testid="trigger-toast-custom-duration"]');

    const toast = page.locator('[data-testid="toast-custom-duration"]');
    await expect(toast).toBeVisible();

    // Wait for the toast to auto-dismiss (1s duration + exit animation buffer)
    await expect(toast).toBeHidden({ timeout: 5000 });
  });

  test('should close when close button is clicked', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-with-testid"]');

    const toast = page.locator('[data-testid="toast-tracked"]');
    await expect(toast).toBeVisible();

    // Find and click the dismiss button within the toast
    const dismissButton = toast.locator('button[aria-label="Dismiss notification"]');
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    // Toast should be removed from the DOM
    await expect(toast).toBeHidden({ timeout: 3000 });
  });

  test('should stack multiple toasts correctly', async ({ page }) => {
    // Trigger three toasts at once
    await page.click('[data-testid="trigger-multiple-toasts"]');

    // All three toasts should appear
    const toast1 = page.locator('[data-testid="toast-multi-1"]');
    const toast2 = page.locator('[data-testid="toast-multi-2"]');
    const toast3 = page.locator('[data-testid="toast-multi-3"]');

    await expect(toast1).toBeVisible();
    await expect(toast2).toBeVisible();
    await expect(toast3).toBeVisible();

    // Verify content of each toast
    await expect(toast1).toContainText('First toast');
    await expect(toast2).toContainText('Second toast');
    await expect(toast3).toContainText('Third toast');

    // There should be multiple alert elements visible
    const alerts = page.locator('role=alert');
    await expect(alerts).toHaveCount(3, { timeout: 3000 });
  });

  test('should render at top-left position', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-top-left"]');

    const toast = page.locator('[data-testid="toast-top-left"]');
    await expect(toast).toBeVisible();

    // Verify the toast is in a container positioned at top-left
    const container = page.locator('[data-position="top-left"]');
    await expect(container).toBeVisible();
  });

  test('should render at bottom-left position', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-bottom-left"]');

    const toast = page.locator('[data-testid="toast-bottom-left"]');
    await expect(toast).toBeVisible();

    // Verify the toast is in a container positioned at bottom-left
    const container = page.locator('[data-position="bottom-left"]');
    await expect(container).toBeVisible();
  });

  test('should render at bottom-right position', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-bottom-right"]');

    const toast = page.locator('[data-testid="toast-bottom-right"]');
    await expect(toast).toBeVisible();

    // Verify the toast is in a container positioned at bottom-right
    const container = page.locator('[data-position="bottom-right"]');
    await expect(container).toBeVisible();
  });

  test('should dismiss all toasts when dismiss-all is triggered', async ({ page }) => {
    // Create multiple toasts
    await page.click('[data-testid="trigger-multiple-toasts"]');

    // Verify toasts exist
    const alerts = page.locator('role=alert');
    await expect(alerts.first()).toBeVisible();

    // Dismiss all
    await page.click('[data-testid="dismiss-all-toasts"]');

    // All toasts should be gone
    await expect(alerts).toHaveCount(0, { timeout: 5000 });
  });

  test('should not show dismiss button when dismissible is false', async ({ page }) => {
    await page.click('[data-testid="trigger-toast-no-dismiss"]');

    const toast = page.locator('[data-testid="toast-no-dismiss"]');
    await expect(toast).toBeVisible();

    // Dismiss button should not exist
    const dismissButton = toast.locator('button[aria-label="Dismiss notification"]');
    await expect(dismissButton).toHaveCount(0);
  });
});
