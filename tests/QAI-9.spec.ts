import { test, expect } from '@playwright/test';

test('persist to-do items and completion state across reloads', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const newTodo = page.getByPlaceholder('What needs to be done?');
  await newTodo.fill('Buy milk');
  await newTodo.press('Enter');
  await newTodo.fill('Walk dog');
  await newTodo.press('Enter');

  const buyMilk = page.getByRole('listitem').filter({ hasText: 'Buy milk' });
  await buyMilk.getByRole('checkbox').check();

  const storedTodos = await page.evaluate(() => localStorage.getItem('react-todos'));
  expect(storedTodos).not.toBeNull();
  if (storedTodos === null) {
    throw new Error('Expected react-todos to be present in localStorage.');
  }

  const todos: unknown = JSON.parse(storedTodos);
  expect(todos).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: 'Buy milk', completed: true }),
      expect.objectContaining({ title: 'Walk dog', completed: false }),
    ]),
  );

  await page.reload();

  const reloadedBuyMilk = page.getByRole('listitem').filter({ hasText: 'Buy milk' });
  const reloadedWalkDog = page.getByRole('listitem').filter({ hasText: 'Walk dog' });

  await expect(reloadedBuyMilk).toBeVisible();
  await expect(reloadedWalkDog).toBeVisible();
  await expect(reloadedBuyMilk).toHaveClass(/completed/);
  await expect(reloadedBuyMilk.getByRole('checkbox')).toBeChecked();
  await expect(page.locator('.todo-count')).toHaveText(/^1 item left!?$/);
});
