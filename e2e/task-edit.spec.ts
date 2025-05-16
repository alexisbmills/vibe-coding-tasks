import { test, expect } from '@playwright/test';
import { createTestTask } from './fixtures/test-utils';

test.describe('Task Edit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should pre-populate form with existing task data', async ({ page }) => {
    const taskName = 'Edit Pre-populate ' + Date.now();
    await createTestTask(page, taskName);
    await page.getByRole('link', { name: /edit task/i }).click();
    await expect(page.getByLabel(/task name/i)).toHaveValue(taskName);
  });

  test('should update a task successfully', async ({ page }) => {
    const taskName = 'Edit Update ' + Date.now();
    await createTestTask(page, taskName);
    await page.getByRole('link', { name: /edit task/i }).click();
    const updatedName = taskName + ' Updated';
    await page.getByLabel(/task name/i).fill(updatedName);
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(updatedName)).toBeVisible();
  });

  test('should validate required fields on edit', async ({ page }) => {
    const taskName = 'Edit Validation ' + Date.now();
    await createTestTask(page, taskName);
    await page.getByRole('link', { name: /edit task/i }).click();
    await page.getByLabel(/task name/i).fill('');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should allow navigation back to task list from edit', async ({ page }) => {
    const taskName = 'Edit Nav ' + Date.now();
    await createTestTask(page, taskName);
    await page.getByRole('link', { name: /edit task/i }).click();
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
  });

  test('should support keyboard shortcuts in edit form', async ({ page }) => {
    const taskName = 'Edit Keyboard ' + Date.now();
    await createTestTask(page, taskName);
    await page.getByRole('link', { name: /edit task/i }).click();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/task name/i)).toBeFocused();
  });

  test('should have accessible edit form controls', async ({ page }) => {
    const taskName = 'Edit Accessibility ' + Date.now();
    await createTestTask(page, taskName);
    await page.getByRole('link', { name: /edit task/i }).click();
    const input = page.getByLabel(/task name/i);
    await expect(input).toHaveAttribute('aria-label', /task name/i);
  });
}); 