import { expect, test } from '@playwright/test';

const KEYS = {
  display: '[data-testid="calculator-display"]',
  history: '[data-testid="calculator-history-button"]',
  clear: '[data-testid="calculator-clear-button"]',
  backspace: '[data-testid="calculator-backspace-button"]',
  division: '[data-testid="calculator-division-button"]',
  multiplication: '[data-testid="calculator-multiplication-button"]',
  addition: '[data-testid="calculator-addition-button"]',
  subtraction: '[data-testid="calculator-subtraction-button"]',
  equal: '[data-testid="calculator-equal-button"]',
  dot: '[data-testid="calculator-dot-button"]',
  one: '[data-testid="calculator-1-button"]',
  two: '[data-testid="calculator-2-button"]',
  three: '[data-testid="calculator-3-button"]',
  four: '[data-testid="calculator-4-button"]',
  five: '[data-testid="calculator-5-button"]',
  six: '[data-testid="calculator-6-button"]',
  seven: '[data-testid="calculator-7-button"]',
  eight: '[data-testid="calculator-8-button"]',
  nine: '[data-testid="calculator-9-button"]',
  zero: '[data-testid="calculator-0-button"]',
};

test.describe('Calculator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Simple addition', async ({ page }) => {
    await page.getByText('1').click();
    await page.getByText('+').click();
    await page.getByText('2').click();
    await page.getByText('=').click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('3');
  });

  test('History works', async ({ page }) => {
    await page.locator(KEYS.four).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.equal).click();
    const history = page.locator(KEYS.history);
    await history.click();
    await expect(page.locator(KEYS.history)).toBeVisible();
    await expect(page.getByText('20')).toBeVisible();
  });

  test('division by zero displays Infinity or Error', async ({ page }) => {
    await page.locator(KEYS.eight).click();
    await page.locator(KEYS.division).click();
    await page.locator(KEYS.zero).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText(/Infinity|Error/);
  });

  test('clear resets to zero', async ({ page }) => {
    await page.locator(KEYS.seven).click();
    await page.locator(KEYS.clear).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('0');
  });

  test('backspace deletes the last digit', async ({ page }) => {
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.backspace).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('1');
  });

  test('decimal calculation works', async ({ page }) => {
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.dot).click();
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.dot).click();
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('4');
  });

  test('multiple operations chain', async ({ page }) => {
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.three).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('13');
  });

  test('negative numbers', async ({ page }) => {
    await page.locator(KEYS.subtraction).click();
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('-10');
  });

  test('large number calculation', async ({ page }) => {
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('998001');
  });

  test('clear history works', async ({ page }) => {
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.equal).click();
    await page.locator(KEYS.history).click();
    await page.getByTestId('calculator-history-clear-button').click();
    await expect(page.getByText('No history yet')).toBeVisible();
  });

  test('use history item', async ({ page }) => {
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.equal).click();
    await page.locator(KEYS.history).click();
    await page.getByText('5x2').click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('10');
  });

  test('multiple decimal points are ignored', async ({ page }) => {
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.dot).click();
    await page.locator(KEYS.dot).click();
    await page.locator(KEYS.five).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('1.5');
  });

  test('complex calculation with parentheses', async ({ page }) => {
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.three).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('11');
  });

  test('repeated operations', async ({ page }) => {
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.equal).click();
    await page.locator(KEYS.equal).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('5');
  });

  test('clear after calculation', async ({ page }) => {
    await page.locator(KEYS.eight).click();
    await page.locator(KEYS.division).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.equal).click();
    await page.locator(KEYS.clear).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('0');
  });

  test('backspace on empty display', async ({ page }) => {
    await page.locator(KEYS.backspace).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('0');
  });

  test('operation after result', async ({ page }) => {
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.three).click();
    await page.locator(KEYS.equal).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('16');
  });

  test('handle double click on addition button', async ({ page }) => {
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('3');
  });

  test('very large number calculation', async ({ page }) => {
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.nine).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('999998000001');
  });

  test('decimal precision', async ({ page }) => {
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.division).click();
    await page.locator(KEYS.three).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('0.3333333333333333');
  });

  test('history persists after refresh', async ({ page }) => {
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.equal).click();
    await page.reload();
    await page.locator(KEYS.history).click();
    await expect(page.getByText('10')).toBeVisible();
  });

  test('multiple operations with decimals', async ({ page }) => {
    await page.locator(KEYS.one).click();
    await page.locator(KEYS.dot).click();
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.multiplication).click();
    await page.locator(KEYS.two).click();
    await page.locator(KEYS.dot).click();
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.addition).click();
    await page.locator(KEYS.three).click();
    await page.locator(KEYS.dot).click();
    await page.locator(KEYS.seven).click();
    await page.locator(KEYS.five).click();
    await page.locator(KEYS.equal).click();
    const display = page.locator(KEYS.display);
    await expect(display).toHaveText('7.5');
  });
});
