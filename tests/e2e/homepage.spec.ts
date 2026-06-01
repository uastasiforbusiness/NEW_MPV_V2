import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and renders hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MPV Italia/i);
  });
});
