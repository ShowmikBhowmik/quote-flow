import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Fills the first two steps with a cafe in Oregon and lands on the coverage step. */
async function reachCoverage(page: Page) {
  await page.goto('/quote/business');
  await page.getByLabel('Business name').fill('Fernway Coffee Roasters');
  await page.getByLabel('What kind of business is it?').selectOption('CAFE');
  await page.getByLabel('Years in business').fill('6');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/\/quote\/location$/);

  await page.getByLabel('State').selectOption('OR');
  await page.getByLabel('ZIP code').fill('97201');
  await page.getByLabel('Employees').fill('4');
  await page.getByLabel('Annual payroll').fill('160000');
  await page.getByLabel('Annual revenue').fill('420000');
  await page.getByLabel('Equipment and inventory').fill('85000');
  await page.getByRole('button', { name: 'Continue to coverage' }).click();
  await expect(page).toHaveURL(/\/quote\/coverage$/);
}

const annual = (page: Page) => page.getByTestId('annual-premium').locator('.sr-only');

test.describe('quote flow', () => {
  test('prices a cafe, reprices live, and binds a policy that shows on the dashboard', async ({ page }) => {
    await reachCoverage(page);

    // Recommended coverages are pre-selected and priced.
    await expect(page.getByRole('switch', { name: /General Liability/ })).toBeChecked();
    await expect(page.getByRole('switch', { name: /Workers/ })).toBeChecked();
    await expect(page.getByRole('switch', { name: /Professional Liability/ })).not.toBeChecked();
    await expect(annual(page)).toHaveText('$4,242');

    // Toggling a coverage reprices.
    await page.getByRole('switch', { name: /Professional Liability/ }).check();
    await expect(annual(page)).not.toHaveText('$4,242');
    const withPl = await annual(page).textContent();
    await page.getByRole('switch', { name: /Professional Liability/ }).uncheck();
    await expect(annual(page)).toHaveText('$4,242');
    expect(withPl).not.toBe('$4,242');

    // Changing a limit reprices too.
    await page.getByRole('radio', { name: '$2M / $4M' }).check();
    await expect(annual(page)).not.toHaveText('$4,242');

    await page.getByRole('button', { name: 'Review quote' }).click();
    await expect(page).toHaveURL(/\/quote\/summary$/);
    await expect(page.getByRole('heading', { name: 'Review and bind' })).toBeVisible();

    const bind = page.getByRole('button', { name: /Bind policy/ });
    await expect(bind).toBeDisabled();
    await page.getByRole('checkbox', { name: /I confirm/ }).check();
    await expect(bind).toBeEnabled();
    await bind.click();

    await expect(page).toHaveURL(/\/quote\/bound$/, { timeout: 10_000 });
    const number = await page.getByTestId('policy-number').textContent();
    expect(number).toMatch(/^NL-\d{4}-\d{6}$/);

    await page.getByRole('link', { name: 'Open the dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard\/policies$/);
    await expect(page.getByRole('cell', { name: new RegExp(number!) })).toBeVisible({ timeout: 10_000 });
  });

  test('shows errors on submit and moves focus to the first invalid field', async ({ page }) => {
    await page.goto('/quote/business');
    await expect(page.getByRole('alert').first()).toBeHidden();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Enter the name you trade under')).toBeVisible();
    await expect(page.getByLabel('Business name')).toBeFocused();
    await expect(page).toHaveURL(/\/quote\/business$/);
  });

  test('guards later steps until earlier ones are complete', async ({ page }) => {
    await page.goto('/quote/summary');
    await expect(page).toHaveURL(/\/quote\/business$/);
  });

  test('is operable with the keyboard alone', async ({ page }) => {
    await reachCoverage(page);
    // Tab from the heading to the first switch and toggle it with Space.
    await page.getByRole('heading', { name: 'Choose your coverage' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('switch', { name: /General Liability/ })).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByRole('switch', { name: /General Liability/ })).not.toBeChecked();
    await page.keyboard.press('Space');
    await expect(page.getByRole('switch', { name: /General Liability/ })).toBeChecked();
  });

  test('moves focus to the step heading after navigating', async ({ page }) => {
    await page.goto('/quote/business');
    await page.getByLabel('Business name').fill('Fernway');
    await page.getByLabel('What kind of business is it?').selectOption('CAFE');
    await page.getByLabel('Years in business').fill('1');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  });

  test('has no accessibility violations on each step', async ({ page }) => {
    await reachCoverage(page);
    for (const url of ['/quote/business', '/quote/location', '/quote/coverage', '/quote/summary']) {
      await page.goto(url);
      await page.waitForSelector('h1');
      // Let the ledger's posting animation settle; axe reads colours mid-fade otherwise.
      await page.waitForTimeout(600);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations, `${url}: ${JSON.stringify(results.violations.map((v) => v.id))}`).toEqual([]);
    }
  });
});

test.describe('dashboard', () => {
  test('shows skeletons, then policies, invoices and claims', async ({ page }) => {
    await page.goto('/dashboard/policies');
    await expect(page.getByLabel('Loading policies')).toBeVisible();
    await expect(page.getByRole('cell', { name: /NL-2026-004815/ })).toBeVisible();

    await page.getByRole('link', { name: 'Invoices' }).click();
    await expect(page.getByRole('cell', { name: /INV-004815-08/ })).toBeVisible();
    const pay = page.getByRole('button', { name: /^Pay/ }).first();
    await pay.click();
    await expect(page.getByRole('cell', { name: /INV-004815-08/ }).locator('..').getByText('paid', { exact: true })).toBeVisible({ timeout: 5_000 });

    await page.getByRole('link', { name: 'Claims' }).click();
    await expect(page.getByRole('cell', { name: /CLM-26-01192/ })).toBeVisible();
    await page.getByLabel('Filter claims').selectOption('settled');
    await expect(page.getByRole('cell', { name: /CLM-26-01192/ })).toBeHidden();
    await expect(page.getByRole('cell', { name: /CLM-26-00731/ })).toBeVisible();
  });

  test('has no accessibility violations', async ({ page }) => {
    for (const url of ['/dashboard/policies', '/dashboard/invoices', '/dashboard/claims']) {
      await page.goto(url);
      await page.waitForSelector('table');
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations, `${url}: ${JSON.stringify(results.violations.map((v) => v.id))}`).toEqual([]);
    }
  });
});
