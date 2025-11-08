import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if the page loaded successfully
    expect(page.url()).toContain('localhost:3000');
  });

  test('should have a title', async ({ page }) => {
    await page.goto('/');

    // Expect the page to have a title
    await expect(page).toHaveTitle(/Motivate/i);
  });

  test('should display dashboard component', async ({ page }) => {
    await page.goto('/');

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Check if main container exists
    const container = page.locator('.container');
    await expect(container).toBeVisible();
  });
});
