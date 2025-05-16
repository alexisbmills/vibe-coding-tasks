# Test info

- Name: Task Management >> should combine search and filter
- Location: C:\Users\alexi\www\react-task-ai\e2e\task-management.spec.ts:32:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /archived tasks/i })

    at C:\Users\alexi\www\react-task-ai\e2e\task-management.spec.ts:37:65
```

# Page snapshot

```yaml
- navigation:
  - link "Vibe Coding Tasks":
    - /url: /
  - link "Home":
    - /url: /
  - link "About":
    - /url: /about
- heading "Tasks" [level=2]
- button "Create Task"
- textbox "Search tasks": SearchFilter
- button "Clear search"
- button "Show Archived"
- list "Task list":
  - 'listitem "Task: Management SearchFilter 1747368597147"':
    - checkbox "Mark task \"Management SearchFilter 1747368597147\" as complete"
    - paragraph: Management SearchFilter 1747368597147
    - button "Archive task": Archive
    - link "Edit task":
      - /url: /task/6e707bd0-2453-49a4-aaea-8b7c5ff67f09
      - text: Edit
- region "Notifications-top"
- region "Notifications-top-left"
- region "Notifications-top-right"
- region "Notifications-bottom-left"
- region "Notifications-bottom"
- region "Notifications-bottom-right"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import {
   3 |   createTestTask,
   4 |   archiveTestTask,
   5 |   searchTasks,
   6 | } from './fixtures/test-utils';
   7 |
   8 | test.describe('Task Management', () => {
   9 |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto('/');
  11 |   });
  12 |
  13 |   test('should complete and uncomplete a task', async ({ page }) => {
  14 |     const taskName = 'Management Complete ' + Date.now();
  15 |     await createTestTask(page, taskName);
  16 |     const checkbox = page.getByRole('checkbox', { name: new RegExp(taskName, 'i') });
  17 |     await checkbox.check();
  18 |     await expect(checkbox).toBeChecked();
  19 |     await checkbox.uncheck();
  20 |     await expect(checkbox).not.toBeChecked();
  21 |   });
  22 |
  23 |   test('should archive and unarchive a task', async ({ page }) => {
  24 |     const taskName = 'Management Archive ' + Date.now();
  25 |     await createTestTask(page, taskName);
  26 |     await archiveTestTask(page, taskName);
  27 |     // Unarchive
  28 |     await page.getByRole('button', { name: /unarchive task/i }).click();
  29 |     await expect(page.getByText(/archived/i)).not.toBeVisible();
  30 |   });
  31 |
  32 |   test('should combine search and filter', async ({ page }) => {
  33 |     const taskName = 'Management SearchFilter ' + Date.now();
  34 |     await createTestTask(page, taskName);
  35 |     await searchTasks(page, 'SearchFilter');
  36 |     await expect(page.getByText(taskName)).toBeVisible();
> 37 |     await page.getByRole('button', { name: /archived tasks/i }).click();
     |                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  38 |     await expect(page.getByText(taskName)).not.toBeVisible();
  39 |   });
  40 |
  41 |   test('should persist tasks after reload', async ({ page }) => {
  42 |     const taskName = 'Management Persistence ' + Date.now();
  43 |     await createTestTask(page, taskName);
  44 |     await page.reload();
  45 |     await expect(page.getByText(taskName)).toBeVisible();
  46 |   });
  47 |
  48 |   test('should handle error scenarios gracefully', async ({ page }) => {
  49 |     // Simulate error by submitting empty form
  50 |     await page.getByRole('button', { name: /create task/i }).click();
  51 |     await page.getByRole('button', { name: /create new task/i }).click();
  52 |     await expect(page.getByText(/required/i)).toBeVisible();
  53 |   });
  54 |
  55 |   test('should display correctly on small screens', async ({ page }) => {
  56 |     await page.setViewportSize({ width: 375, height: 667 });
  57 |     await expect(page.getByRole('main')).toBeVisible();
  58 |     await expect(page.getByRole('button', { name: /create task/i })).toBeVisible();
  59 |   });
  60 | }); 
```