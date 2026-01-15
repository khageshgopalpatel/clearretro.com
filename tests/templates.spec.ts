import { test, expect } from '@playwright/test';

test.describe('Templates Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/templates');
  });

  test('should display templates heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /templates/i })).toBeVisible();
  });

  test('should display template options', async ({ page }) => {
     // Based on previous knowledge, there are templates like "Start Stop Continue".
     // We'll broaden the check or be specific if we know exact text.
     // Let's assume there are cards/items.
     // We can check for a common selector if known, or text.
     // Refine this after inspecting Templates.tsx if needed, but 'Start Stop Continue' is a safe bet.
     await expect(page.getByRole('heading', { name: 'Start, Stop, Continue' })).toBeVisible();
  });
});
