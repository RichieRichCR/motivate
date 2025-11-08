# Web App Testing

This directory contains comprehensive tests for the web application using **Vitest** (unit/component tests) and **Playwright** (E2E tests).

## 🧪 Test Structure

```
apps/web/
├── vitest.config.ts          # Vitest configuration
├── playwright.config.ts      # Playwright configuration
├── src/
│   ├── __tests__/
│   │   └── setup.ts          # Test setup and global config
│   ├── lib/__tests__/
│   │   ├── utils.test.ts           # Utility function tests
│   │   └── dashboard-helpers.test.ts # Dashboard helper tests
│   └── components/__tests__/
│       └── card.test.tsx     # ContentCard component tests
└── e2e/
    ├── homepage.spec.ts      # Homepage E2E tests
    ├── dashboard.spec.ts     # Dashboard E2E tests
    └── accessibility.spec.ts # Accessibility E2E tests
```

## 📦 Installation

All dependencies should already be installed. If not, run:

```bash
pnpm install
```

## 🚀 Running Tests

### Unit & Component Tests (Vitest)

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test -- --coverage
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in headed mode (see browser)
pnpm test:e2e -- --headed

# Run specific test file
pnpm test:e2e -- e2e/homepage.spec.ts

# Run tests on specific browser
pnpm test:e2e -- --project=chromium
```

### Run All Tests

```bash
# From the web app directory
pnpm test && pnpm test:e2e

# Or from workspace root
turbo run test --filter="@repo/web-app"
```

## 📝 Test Coverage

### Unit Tests

- **`utils.test.ts`** - Tests for utility functions:
  - Date formatting and range calculations
  - Data transformation
  - Metric value extraction
  - Goal target calculations
  - Chart data creation

- **`dashboard-helpers.test.ts`** - Tests for dashboard helper functions:
  - Metric ID resolution
  - Current metrics extraction
  - Goal target extraction
  - Water unit conversion
  - Radial chart configuration building

- **`card.test.tsx`** - Component tests for ContentCard:
  - Props rendering
  - Undefined value handling
  - Date formatting
  - Card structure

### E2E Tests

- **`homepage.spec.ts`** - Homepage tests:
  - Page loading
  - Title verification
  - Dashboard component visibility

- **`dashboard.spec.ts`** - Dashboard functionality tests:
  - Metric card display
  - Chart rendering
  - Responsive design
  - Date formatting

- **`accessibility.spec.ts`** - Accessibility tests:
  - Keyboard navigation
  - Heading structure
  - Reduced motion support
  - Basic contrast checks

## 🎯 Test Patterns

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';

it('should render component', () => {
  render(<MyComponent prop="value" />);
  expect(screen.getByText('value')).toBeInTheDocument();
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('should navigate to page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Title/);
});
```

## 🔧 Configuration

### Vitest Config

- **Environment**: jsdom (for React components)
- **Globals**: Enabled (no need to import `describe`, `it`, `expect`)
- **Setup**: `src/__tests__/setup.ts`
- **Coverage**: v8 provider

### Playwright Config

- **Base URL**: http://localhost:3000
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12
- **Web Server**: Auto-starts dev server before tests

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: pnpm install

- name: Run unit tests
  run: pnpm test --filter="@repo/web-app"

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e --filter="@repo/web-app"
```

## 🐛 Debugging

### Debug Vitest Tests

```bash
# Run specific test file
pnpm test -- src/lib/__tests__/utils.test.ts

# Run with verbose output
pnpm test -- --reporter=verbose

# Use the UI for debugging
pnpm test:ui
```

### Debug Playwright Tests

```bash
# Run with UI mode (best for debugging)
pnpm test:e2e:ui

# Run in headed mode
pnpm test:e2e -- --headed --debug

# Run specific test
pnpm test:e2e -- e2e/homepage.spec.ts --debug
```

## 📚 Best Practices

1. **Write tests first** when fixing bugs (TDD approach)
2. **Test behavior, not implementation** details
3. **Use descriptive test names** that explain what is being tested
4. **Keep tests focused** - one concept per test
5. **Mock external dependencies** (API calls, etc.)
6. **Use test.describe** to group related tests
7. **Clean up after tests** (automatically handled by setup)

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 📈 Test Metrics

Run tests with coverage to see metrics:

```bash
pnpm test -- --coverage
```

Coverage reports will be generated in `coverage/` directory.

## 🤝 Contributing

When adding new features:

1. Write unit tests for utility functions
2. Write component tests for UI components
3. Write E2E tests for user workflows
4. Ensure all tests pass before submitting PR
5. Maintain >80% code coverage
