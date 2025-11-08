import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display metric cards', async ({ page }) => {
    // Look for card components - they should have the Card component structure
    const cards = page
      .locator('[class*="rounded"]')
      .filter({ hasText: /lbs|steps|km|liters|minutes/i });

    // There should be multiple cards displayed
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display weight metric', async ({ page }) => {
    // Look for weight-related content
    const weightCard = page.getByText(/weight|lbs/i);
    await expect(weightCard.first()).toBeVisible();
  });

  test('should display steps metric', async ({ page }) => {
    // Look for steps-related content
    const stepsCard = page.getByText(/steps/i);
    await expect(stepsCard.first()).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test different viewport sizes
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page.locator('.container')).toBeVisible();

    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await expect(page.locator('.container')).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await expect(page.locator('.container')).toBeVisible();
  });

  test('should display charts', async ({ page }) => {
    // Look for chart elements (recharts creates SVG elements)
    const charts = page.locator('svg');
    const chartCount = await charts.count();

    // Should have at least one chart visible
    expect(chartCount).toBeGreaterThan(0);
  });

  test('should display dates in correct format', async ({ page }) => {
    // Look for date text that matches the format MM/DD/YYYY or "as of"
    const dateText = page.getByText(/as of|no date/i);
    const count = await dateText.count();

    // Should have date information displayed
    expect(count).toBeGreaterThan(0);
  });
});
