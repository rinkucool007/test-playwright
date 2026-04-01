# Playwright TypeScript Project

This project was bootstrapped with [Unified Playwright](https://github.com/yourusername/unified-playwright).

## Getting Started

### Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Writing Tests

Tests are located in the `tests/` directory. Check out `tests/example.spec.ts` for examples.

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

### Code Generation

Generate tests automatically using Codegen:

```bash
npm run codegen
```

## Learn More

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

## Project Structure

```
.
├── tests/              # Test files
├── playwright.config.ts # Playwright configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

Happy Testing! 🎭
