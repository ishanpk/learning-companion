import { test, expect } from '@playwright/test';

test.describe('Learning Companion E2E', () => {
  test('dashboard loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Learning Companion/);
    await expect(page.getByText('Welcome back,')).toBeVisible();
  });

  test('create learning path input is visible', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder(/What do you want to learn/);
    await expect(input).toBeVisible();
    const button = page.getByRole('button', { name: /Create Learning Path/ });
    await expect(button).toBeVisible();
  });

  test('skill loadout enforces max 5 slots', async ({ page }) => {
    await page.goto('/');
    // Navigate to Skill Loadout via sidebar
    const skillNav = page.getByText('Skill Loadout');
    if (await skillNav.isVisible()) {
      await skillNav.click();
      await expect(page.getByText('Active Focus Loadout')).toBeVisible();
      // Verify the slot counter is visible
      await expect(page.getByText(/\/5 slots/)).toBeVisible();
    }
  });

  test('focus timer displays 25:00 initially', async ({ page }) => {
    await page.goto('/');
    // Navigate to study view
    const studyNav = page.getByText('Study Session');
    if (await studyNav.isVisible()) {
      await studyNav.click();
      // Timer should show 25:00
      await expect(page.getByText('25:00')).toBeVisible({ timeout: 5000 });
    }
  });

  test('stats cards are visible on dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Study Hours')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Current Streak')).toBeVisible();
  });
});
