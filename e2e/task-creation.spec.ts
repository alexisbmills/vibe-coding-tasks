import { test, expect } from '@playwright/test';
import { createTestTask } from './fixtures/test-utils';

test.describe('Task Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /create task/i }).click();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /create new task/i }).click();
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should create a new task successfully', async ({ page }) => {
    const taskName = 'E2E Create Task ' + Date.now();
    await page.getByLabel(/task name/i).fill(taskName);
    await page.getByRole('button', { name: /create new task/i }).click();
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should handle form errors gracefully', async ({ page }) => {
    // Simulate error by submitting empty form
    await page.getByRole('button', { name: /create new task/i }).click();
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should allow navigation back to task list', async ({ page }) => {
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
  });

  test('should support keyboard accessibility', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/task name/i)).toBeFocused();
  });

  test('should have accessible form controls', async ({ page }) => {
    const input = page.getByLabel(/task name/i);
    await expect(input).toHaveAttribute('aria-label', /task name/i);
  });
}); 