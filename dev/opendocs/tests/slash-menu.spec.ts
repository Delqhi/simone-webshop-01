
import { test, expect } from '@playwright/test';

test('Slash menu opens when typing / in empty paragraph', async ({ page }) => {
  page.on('console', msg => console.log(msg.text()));
  await page.goto('http://localhost:5173');
  await page.waitForSelector('.max-w-5xl');

  const paragraphBlock = page.getByPlaceholder('Write… (type / on empty block to insert)');
  
  await paragraphBlock.clear();
  await paragraphBlock.focus();
  await paragraphBlock.type('/');

  const menu = page.getByText('Insert block');
  await expect(menu).toBeVisible({ timeout: 2000 });
});
