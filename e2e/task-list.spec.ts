import { test, expect } from '@playwright/test';
import {
  createTestTask,
  deleteTestTask,
  archiveTestTask,
  searchTasks,
  toggleTaskCompletion,
  showArchivedTasks,
  hideArchivedTasks,
} from './fixtures/test-utils';

test.describe('Task List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display empty state when no tasks exist', async ({ page }) => {
    await expect(
      page.getByText(/no tasks yet\. create your first task to get started!/i)
    ).toBeVisible();
  });

  test('should create and display a new task', async ({ page }) => {
    const taskName = 'Test Task ' + Date.now();
    await createTestTask(page, taskName);
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should search for tasks', async ({ page }) => {
    const taskName = 'Searchable Task ' + Date.now();
    await createTestTask(page, taskName);
    await searchTasks(page, 'Searchable');
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should archive a task', async ({ page }) => {
    const taskName = 'Archive Task ' + Date.now();
    await createTestTask(page, taskName);
    await archiveTestTask(page, taskName);
    await expect(page.getByText(taskName)).not.toBeVisible();
    await showArchivedTasks(page);
    await expect(page.getByText(/archived/i)).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    const taskName = 'Delete Task ' + Date.now();
    await createTestTask(page, taskName);
    await searchTasks(page, taskName);
    await deleteTestTask(page, taskName);
    await expect(page.getByText(taskName)).not.toBeVisible();
  });

  test('should toggle task completion', async ({ page }) => {
    const taskName = 'Completion Toggle Task ' + Date.now();
    await createTestTask(page, taskName);
    // Find the checkbox for the task and toggle it   
    const checkboxChecked = await toggleTaskCompletion(page, taskName);
    await expect(checkboxChecked).toBeChecked();
    const checkboxUnchecked = await toggleTaskCompletion(page, taskName);
    await expect(checkboxUnchecked).not.toBeChecked();
  });

  test('should filter tasks by archived and non-archived', async ({ page }) => {
    const taskName = 'Filter Test Task ' + Date.now();
    await createTestTask(page, taskName);
    await archiveTestTask(page, taskName);
    await showArchivedTasks(page);
    await expect(page.getByText(taskName)).toBeVisible();
    await hideArchivedTasks(page);
    await expect(page.getByText(taskName)).not.toBeVisible();
  });

  test('should support keyboard navigation in task list', async ({ page }) => {
    const taskName = 'Keyboard Nav Task ' + Date.now();
    await createTestTask(page, taskName);
    // Focus the search bar and tab to the first task
    await page.getByPlaceholder(/search tasks/i).focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Expect the first task to be focused (aria or data-test-e2e selector)
    const taskItem = page.getByText(taskName);
    await expect(taskItem).toBeFocused();
  });

  test('should have accessible roles and labels', async ({ page }) => {
    // Check for main landmark
    await expect(page.getByRole('main')).toBeVisible();
    // Check for accessible heading
    await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
    // Check for ARIA attributes on search
    const search = page.getByPlaceholder(/search tasks/i);
    await expect(search).toHaveAttribute('aria-label', /search/i);
  });
}); 