# Test info

- Name: Task Creation >> should have accessible form controls
- Location: C:\Users\alexi\www\react-task-ai\e2e\task-creation.spec.ts:38:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveAttribute(expected)

Locator: getByLabel(/task name/i)
Expected pattern: /task name/i
Received string:  ""
Call log:
  - expect.toHaveAttribute with timeout 5000ms
  - waiting for getByLabel(/task name/i)
    6 × locator resolved to <input value="" name="name" required="" id="field-:r5:" aria-required="true" placeholder="Enter task name" class="chakra-input css-dn3ifq"/>
      - unexpected value "null"

    at C:\Users\alexi\www\react-task-ai\e2e\task-creation.spec.ts:40:25
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
- heading "Create New Task" [level=2]
- form "Create task form":
  - group:
    - text: Task Name
    - textbox "Task Name"
  - group:
    - text: Notes
    - textbox "Notes"
  - button "Cancel and go back": Cancel
  - button "Create new task": Create Task
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
   4 | test.describe('Task Creation', () => {
   5 |   test.beforeEach(async ({ page }) => {
   6 |     await page.goto('/');
   7 |     await page.getByRole('button', { name: /create task/i }).click();
   8 |   });
   9 |
  10 |   test('should validate required fields', async ({ page }) => {
  11 |     await page.getByRole('button', { name: /create new task/i }).click();
  12 |     await expect(page.getByText(/required/i)).toBeVisible();
  13 |   });
  14 |
  15 |   test('should create a new task successfully', async ({ page }) => {
  16 |     const taskName = 'E2E Create Task ' + Date.now();
  17 |     await page.getByLabel(/task name/i).fill(taskName);
  18 |     await page.getByRole('button', { name: /create new task/i }).click();
  19 |     await expect(page.getByText(taskName)).toBeVisible();
  20 |   });
  21 |
  22 |   test('should handle form errors gracefully', async ({ page }) => {
  23 |     // Simulate error by submitting empty form
  24 |     await page.getByRole('button', { name: /create new task/i }).click();
  25 |     await expect(page.getByText(/required/i)).toBeVisible();
  26 |   });
  27 |
  28 |   test('should allow navigation back to task list', async ({ page }) => {
  29 |     await page.getByRole('button', { name: /cancel/i }).click();
  30 |     await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
  31 |   });
  32 |
  33 |   test('should support keyboard accessibility', async ({ page }) => {
  34 |     await page.keyboard.press('Tab');
  35 |     await expect(page.getByLabel(/task name/i)).toBeFocused();
  36 |   });
  37 |
  38 |   test('should have accessible form controls', async ({ page }) => {
  39 |     const input = page.getByLabel(/task name/i);
> 40 |     await expect(input).toHaveAttribute('aria-label', /task name/i);
     |                         ^ Error: Timed out 5000ms waiting for expect(locator).toHaveAttribute(expected)
  41 |   });
  42 | }); 
```