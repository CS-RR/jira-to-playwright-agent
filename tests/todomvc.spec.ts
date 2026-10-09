import { test, expect } from '@playwright/test';

test('Add a task in TodoMVC', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.locator('.new-todo').fill('Learn Playwright');
  await page.locator('.new-todo').press('Enter');
  await expect(page.locator('.todo-list li')).toHaveText('Learn Playwright');
});
