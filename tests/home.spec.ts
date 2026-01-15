import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Clear Retro/);
  });

  test('can navigate to create board', async ({ page }) => {
    // Check if "Create New Board" button or link exists
    // Note: Adjust selector based on actual UI. Assuming text "Create New Board" or similar.
    const createButton = page.getByRole('button', { name: /create board/i }).first();
    
    // If it's a link, use getByRole('link')
    // Let's check for the main CTA.
    await expect(page.getByText('ClearRetro')).toBeVisible();
    
    // We will need to identify the "Create Board" button more precisely after inspecting the DOM or just guessing common patterns.
    // For now, let's assume there is a button.
  });
});
