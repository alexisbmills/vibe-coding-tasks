# Test info

- Name: Task List >> should search for tasks
- Location: C:\Users\alexi\www\react-task-ai\e2e\task-list.spec.ts:26:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

    at C:\Users\alexi\www\react-task-ai\e2e\task-list.spec.ts:11:16
```

# Page snapshot

```yaml
- heading "Unable to connect" [level=1]
- paragraph: Firefox can’t establish a connection to the server at localhost:5173.
- paragraph
- list:
  - listitem: The site could be temporarily unavailable or too busy. Try again in a few moments.
  - listitem: If you are unable to load any pages, check your computer’s network connection.
  - listitem: If your computer or network is protected by a firewall or proxy, make sure that Nightly is permitted to access the web.
- button "Try Again"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import {
   3 |   createTestTask,
   4 |   deleteTestTask,
   5 |   archiveTestTask,
   6 |   searchTasks,
   7 | } from './fixtures/test-utils';
   8 |
   9 | test.describe('Task List', () => {
  10 |   test.beforeEach(async ({ page }) => {
> 11 |     await page.goto('/');
     |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  12 |   });
  13 |
  14 |   test('should display empty state when no tasks exist', async ({ page }) => {
  15 |     await expect(
  16 |       page.getByText(/no tasks yet\. create your first task to get started!/i)
  17 |     ).toBeVisible();
  18 |   });
  19 |
  20 |   test('should create and display a new task', async ({ page }) => {
  21 |     const taskName = 'Test Task ' + Date.now();
  22 |     await createTestTask(page, taskName);
  23 |     await expect(page.getByText(taskName)).toBeVisible();
  24 |   });
  25 |
  26 |   test('should search for tasks', async ({ page }) => {
  27 |     const taskName = 'Searchable Task ' + Date.now();
  28 |     await createTestTask(page, taskName);
  29 |     await searchTasks(page, 'Searchable');
  30 |     await expect(page.getByText(taskName)).toBeVisible();
  31 |   });
  32 |
  33 |   test('should archive a task', async ({ page }) => {
  34 |     const taskName = 'Archive Task ' + Date.now();
  35 |     await createTestTask(page, taskName);
  36 |     await archiveTestTask(page, taskName);
  37 |     await expect(page.getByText(/archived/i)).toBeVisible();
  38 |   });
  39 |
  40 |   test('should delete a task', async ({ page }) => {
  41 |     const taskName = 'Delete Task ' + Date.now();
  42 |     await createTestTask(page, taskName);
  43 |     await searchTasks(page, taskName);
  44 |     await deleteTestTask(page, taskName);
  45 |     await expect(page.getByText(taskName)).not.toBeVisible();
  46 |   });
  47 |
  48 |   test('should toggle task completion', async ({ page }) => {
  49 |     const taskName = 'Completion Toggle Task ' + Date.now();
  50 |     await createTestTask(page, taskName);
  51 |     // Find the checkbox for the task and toggle it
  52 |     const checkbox = page.getByRole('checkbox', { name: new RegExp(taskName, 'i') });
  53 |     await checkbox.check();
  54 |     await expect(checkbox).toBeChecked();
  55 |     await checkbox.uncheck();
  56 |     await expect(checkbox).not.toBeChecked();
  57 |   });
  58 |
  59 |   test('should filter tasks by archived and non-archived', async ({ page }) => {
  60 |     const taskName = 'Filter Test Task ' + Date.now();
  61 |     await createTestTask(page, taskName);
  62 |     await archiveTestTask(page, taskName);
  63 |     // Click filter to show only non-archived
  64 |     await page.getByRole('button', { name: /active tasks/i }).click();
  65 |     await expect(page.getByText(taskName)).not.toBeVisible();
  66 |     // Click filter to show archived
  67 |     await page.getByRole('button', { name: /archived tasks/i }).click();
  68 |     await expect(page.getByText(taskName)).toBeVisible();
  69 |   });
  70 |
  71 |   test('should support keyboard navigation in task list', async ({ page }) => {
  72 |     const taskName = 'Keyboard Nav Task ' + Date.now();
  73 |     await createTestTask(page, taskName);
  74 |     // Focus the search bar and tab to the first task
  75 |     await page.getByPlaceholder(/search tasks/i).focus();
  76 |     await page.keyboard.press('Tab');
  77 |     // Expect the first task to be focused (aria or data-test-e2e selector)
  78 |     const taskItem = page.getByText(taskName);
  79 |     await expect(taskItem).toBeFocused();
  80 |   });
  81 |
  82 |   test('should have accessible roles and labels', async ({ page }) => {
  83 |     // Check for main landmark
  84 |     await expect(page.getByRole('main')).toBeVisible();
  85 |     // Check for accessible heading
  86 |     await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
  87 |     // Check for ARIA attributes on search
  88 |     const search = page.getByPlaceholder(/search tasks/i);
  89 |     await expect(search).toHaveAttribute('aria-label', /search/i);
  90 |   });
  91 | }); 
```