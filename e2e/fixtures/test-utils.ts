import { Page, expect } from '@playwright/test';

export const createTestTask = async (
  page: Page,
  taskName: string,
  description?: string
) => {
  // Open the create task form from the list page
  await page.getByRole('button', { name: /create task/i }).click();
  // Fill in the form fields
  await page.getByLabel(/task name/i).fill(taskName);
  if (description) {
    await page.getByLabel(/description|notes/i).fill(description);
  }
  // Submit the form using aria-label
  await page.getByRole('button', { name: /create new task/i }).click();
  await expect(page.getByText(taskName)).toBeVisible();
};

export const deleteTestTask = async (page: Page, taskName: string) => {
  // Click the edit button
  await page.getByRole('link', { name: /edit task/i }).click();
  // Click the delete button
  await page.getByRole('button', { name: /delete task/i }).click();
  // Confirm deletion in the dialog
  await page.getByRole('button', { name: /confirm delete/i }).click();
  // Ensure the task is no longer visible in the list
  await expect(page.getByText(taskName)).not.toBeVisible();
};

export const archiveTestTask = async (page: Page, taskName: string) => {
  const taskItem = page.getByText(taskName).first();
  await taskItem.click();
  await page.getByRole('button', { name: /archive task/i }).click();
};

export const searchTasks = async (page: Page, searchTerm: string) => {
  await page.getByPlaceholder(/search tasks/i).fill(searchTerm);
  await page.waitForTimeout(300); // Wait for debounce
};

export const toggleTaskCompletion = async (page: Page, taskName: string) => {
  const checkbox = page.getByRole('checkbox', { name: new RegExp(taskName, 'i') });
  await checkbox.dispatchEvent('click');
  return checkbox;
};

export const showArchivedTasks = async (page: Page) => {
  await page.getByRole('button', { name: /show archived/i }).click();
};

export const hideArchivedTasks = async (page: Page) => {
  await page.getByRole('button', { name: /show active/i }).click();
};