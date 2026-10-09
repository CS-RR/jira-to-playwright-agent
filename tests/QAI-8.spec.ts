import { test, expect } from '@playwright/test';

test('filter to-do items by All, Active, and Completed', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const newTodo = page.getByPlaceholder('What needs to be done?');
  await newTodo.fill('Buy milk');
  await newTodo.press('Enter');
  await newTodo.fill('Walk dog');
  await newTodo.press('Enter');

  const buyMilk = page.getByRole('listitem').filter({ hasText: 'Buy milk' });
  await buyMilk.getByRole('checkbox').check();

  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.locator('.todo-list li')).toHaveText(['Walk dog']);
  await expect(buyMilk).toBeHidden();

  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.locator('.todo-list li')).toHaveText(['Buy milk']);
  await expect(page.getByRole('listitem').filter({ hasText: 'Walk dog' })).toBeHidden();

  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.locator('.todo-list li')).toHaveText(['Buy milk', 'Walk dog']);
});
