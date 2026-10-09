import { test, expect } from '@playwright/test';

test('add and list a new to-do item', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const newTodo = page.getByPlaceholder('What needs to be done?');
  await newTodo.fill('Buy milk');
  await newTodo.press('Enter');

  await expect(page.locator('.todo-list li')).toHaveText(['Buy milk']);
  await expect(page.locator('.todo-count')).toHaveText(/^1 item left!?$/);
});
