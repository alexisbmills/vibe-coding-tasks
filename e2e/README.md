# End-to-End Testing

This directory contains end-to-end tests for the Task Management application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

- Run all tests:
```bash
npm run test:e2e
```

- Run tests with UI mode:
```bash
npm run test:e2e:ui
```

- Run tests in debug mode:
```bash
npm run test:e2e:debug
```

- View test report:
```bash
npm run test:e2e:report
```

## Test Structure

- `fixtures/` - Contains test utilities and helper functions
- `*.spec.ts` - Test files for different features

## Writing Tests

1. Use the test utilities from `fixtures/test-utils.ts` for common operations
2. Follow the existing test patterns in `task-list.spec.ts`
3. Use Playwright's built-in test fixtures and assertions
4. Keep tests independent and isolated

## Best Practices

1. Use meaningful test descriptions
2. Keep tests focused and atomic
3. Use test utilities for common operations
4. Clean up test data after each test
5. Use proper selectors (prefer role-based selectors)
6. Handle async operations properly
7. Add proper assertions for each test case

## CI Integration

The tests are configured to run in CI environments with:
- Retry on failure
- Parallel test execution
- HTML report generation
- Video recording on failure
- Trace capture on failure 