import { test, expect } from '@playwright/test';
import {
  createTestTask,
  archiveTestTask,
  searchTasks,
} from './fixtures/test-utils';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete and uncomplete a task', async ({ page }) => {
    const taskName = 'Management Complete ' + Date.now();
    await createTestTask(page, taskName);
    const checkbox = page.getByRole('checkbox', { name: new RegExp(taskName, 'i') });
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should archive and unarchive a task', async ({ page }) => {
    const taskName = 'Management Archive ' + Date.now();
    await createTestTask(page, taskName);
    await archiveTestTask(page, taskName);
    // Unarchive
    await page.getByRole('button', { name: /unarchive task/i }).click();
    await expect(page.getByText(/archived/i)).not.toBeVisible();
  });

  test('should combine search and filter', async ({ page }) => {
    const taskName = 'Management SearchFilter ' + Date.now();
    await createTestTask(page, taskName);
    await searchTasks(page, 'SearchFilter');
    await expect(page.getByText(taskName)).toBeVisible();
    await page.getByRole('button', { name: /archived tasks/i }).click();
    await expect(page.getByText(taskName)).not.toBeVisible();
  });

  test('should persist tasks after reload', async ({ page }) => {
    const taskName = 'Management Persistence ' + Date.now();
    await createTestTask(page, taskName);
    await page.reload();
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    // Simulate error by submitting empty form
    await page.getByRole('button', { name: /create task/i }).click();
    await page.getByRole('button', { name: /create new task/i }).click();
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should display correctly on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('button', { name: /create task/i })).toBeVisible();
  });
}); 