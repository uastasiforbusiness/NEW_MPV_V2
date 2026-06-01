import { test, expect } from '@playwright/test';

test('homepage LCP under 1.5s', async ({ page }) => {
  const start = Date.now();
  await page.goto('/', { waitUntil: 'load' });
  const lcp = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry;
        resolve(last.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(0), 5000);
    });
  });
  console.log(`TTI: ${Date.now() - start}ms, LCP: ${lcp}ms`);
  expect(lcp).toBeGreaterThan(0);
  expect(lcp).toBeLessThan(1500);
});
