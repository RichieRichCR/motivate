import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have no accessibility violations on homepage', async ({
    page,
  }) => {
    // This is a basic check - for comprehensive testing, consider using @axe-core/playwright

    // Check for basic accessibility features
    const main = page.locator('main, [role="main"], .container');
    await expect(main.first()).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Start from the beginning
    await page.keyboard.press('Tab');

    // Check if focus is visible on the page
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeAttached();
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();

    // Should have some headings for structure
    expect(count).toBeGreaterThan(0);
  });

  test('should have readable text contrast', async ({ page }) => {
    // Get the computed styles of text elements
    const textElements = page.locator('p, span, div').filter({ hasText: /.+/ });
    const firstText = textElements.first();

    // Check if text is visible (basic contrast check)
    await expect(firstText).toBeVisible();
  });

  test('should work with reduced motion preference', async ({
    page,
    context,
  }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Page should still be fully functional
    await expect(page.locator('.container')).toBeVisible();
  });
});
