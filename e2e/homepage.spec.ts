import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
    test('loads successfully and displays main heading', async ({page}) => {
        await page.goto('/');

        const heading = page.getByRole('heading', {name: /npmview/i});
        await expect(heading).toBeVisible();
        await expect(heading).toHaveText('npmview');
    });

    test('has correct page title', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveTitle('NPM View');
    });

    test('displays header with logo and navigation', async ({page}) => {
        await page.goto('/');

        const header = page.locator('header');
        await expect(header).toBeVisible();

        const logo = page.getByRole('link', {name: /npmview home/i});
        await expect(logo).toBeVisible();
    });

    test('displays footer with disclaimer', async ({page}) => {
        await page.goto('/');

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
        await expect(footer).toContainText('hobby project for learning purposes');
    });

    test('has skip to main content link', async ({page}) => {
        await page.goto('/');

        const skipLink = page.getByRole('link', {name: /skip to main content/i});
        await expect(skipLink).toHaveAttribute('href', '#main-content');
    });
});
