# Test info

- Name: Task Edit >> should have accessible edit form controls
- Location: C:\Users\alexi\www\react-task-ai\e2e\task-edit.spec.ts:51:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveAttribute(expected)

Locator: getByLabel(/task name/i)
Expected pattern: /task name/i
Received string:  ""
Call log:
  - expect.toHaveAttribute with timeout 5000ms
  - waiting for getByLabel(/task name/i)
    6 × locator resolved to <input name="name" required="" id="field-:rl:" aria-required="true" placeholder="Enter task name" class="chakra-input css-dn3ifq" value="Edit Accessibility 1747368541784"/>
      - unexpected value "null"

    at C:\Users\alexi\www\react-task-ai\e2e\task-edit.spec.ts:56:25
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
- heading "Edit Task" [level=2]
- button "Delete task": Delete
- form "Edit task form":
  - group:
    - text: Task Name
    - textbox "Task Name": Edit Accessibility 1747368541784
  - group:
    - text: Notes
    - textbox "Notes"
  - button "Cancel and go back": Cancel
  - button "Save task changes": Save Changes
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
   2 | import { createTestTask } from './fixtures/test-utils';
   3 |
   4 | test.describe('Task Edit', () => {
   5 |   test.beforeEach(async ({ page }) => {
   6 |     await page.goto('/');
   7 |   });
   8 |
   9 |   test('should pre-populate form with existing task data', async ({ page }) => {
  10 |     const taskName = 'Edit Pre-populate ' + Date.now();
  11 |     await createTestTask(page, taskName);
  12 |     await page.getByRole('link', { name: /edit task/i }).click();
  13 |     await expect(page.getByLabel(/task name/i)).toHaveValue(taskName);
  14 |   });
  15 |
  16 |   test('should update a task successfully', async ({ page }) => {
  17 |     const taskName = 'Edit Update ' + Date.now();
  18 |     await createTestTask(page, taskName);
  19 |     await page.getByRole('link', { name: /edit task/i }).click();
  20 |     const updatedName = taskName + ' Updated';
  21 |     await page.getByLabel(/task name/i).fill(updatedName);
  22 |     await page.getByRole('button', { name: /save/i }).click();
  23 |     await expect(page.getByText(updatedName)).toBeVisible();
  24 |   });
  25 |
  26 |   test('should validate required fields on edit', async ({ page }) => {
  27 |     const taskName = 'Edit Validation ' + Date.now();
  28 |     await createTestTask(page, taskName);
  29 |     await page.getByRole('link', { name: /edit task/i }).click();
  30 |     await page.getByLabel(/task name/i).fill('');
  31 |     await page.getByRole('button', { name: /save/i }).click();
  32 |     await expect(page.getByText(/required/i)).toBeVisible();
  33 |   });
  34 |
  35 |   test('should allow navigation back to task list from edit', async ({ page }) => {
  36 |     const taskName = 'Edit Nav ' + Date.now();
  37 |     await createTestTask(page, taskName);
  38 |     await page.getByRole('link', { name: /edit task/i }).click();
  39 |     await page.getByRole('button', { name: /cancel/i }).click();
  40 |     await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
  41 |   });
  42 |
  43 |   test('should support keyboard shortcuts in edit form', async ({ page }) => {
  44 |     const taskName = 'Edit Keyboard ' + Date.now();
  45 |     await createTestTask(page, taskName);
  46 |     await page.getByRole('link', { name: /edit task/i }).click();
  47 |     await page.keyboard.press('Tab');
  48 |     await expect(page.getByLabel(/task name/i)).toBeFocused();
  49 |   });
  50 |
  51 |   test('should have accessible edit form controls', async ({ page }) => {
  52 |     const taskName = 'Edit Accessibility ' + Date.now();
  53 |     await createTestTask(page, taskName);
  54 |     await page.getByRole('link', { name: /edit task/i }).click();
  55 |     const input = page.getByLabel(/task name/i);
> 56 |     await expect(input).toHaveAttribute('aria-label', /task name/i);
     |                         ^ Error: Timed out 5000ms waiting for expect(locator).toHaveAttribute(expected)
  57 |   });
  58 | }); 
```