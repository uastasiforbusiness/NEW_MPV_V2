---
name: gen-test
description: Generate unit or e2e tests for a component or module
disable-model-invocation: true
---

Generate tests for the given file.

## Rules
- Use Vitest + @testing-library/react for component tests
- Use Playwright for e2e tests in tests/e2e/
- Follow existing patterns in src/__tests__/
- Include snapshot test + behavioral tests
- Use jsdom environment
- Import from @testing-library/react, @testing-library/user-event

## Usage
User provides a file path. Generate the appropriate test file:
- Components → src/__tests__/[Name].test.tsx
- E2E flows → tests/e2e/[name].spec.ts

## Template (component)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ComponentName } from "@/components/path/ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />);
    // assertions
  });
});
```

## Template (e2e)

```ts
import { test, expect } from "@playwright/test";

test.describe("feature name", () => {
  test("does something", async ({ page }) => {
    await page.goto("/");
    // assertions
  });
});
```
