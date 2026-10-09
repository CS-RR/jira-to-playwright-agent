import { test, expect } from '@playwright/test';

test('mark a to-do item as completed', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const newTodo = page.getByPlaceholder('What needs to be done?');
  await newTodo.fill('Buy milk');
  await newTodo.press('Enter');

  const todoItem = page.getByRole('listitem').filter({ hasText: 'Buy milk' });
  await expect(todoItem).toBeVisible();

  const checkbox = todoItem.getByRole('checkbox');
  await checkbox.check();

  await expect(checkbox).toBeChecked();
  await expect(todoItem).toHaveClass(/completed/);
  await expect(page.locator('.todo-count')).toHaveText(/^0 items left!?$/);
});
