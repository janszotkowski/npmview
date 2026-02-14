import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
    test('logo links to homepage', async ({page}) => {
        await page.goto('/about');

        const logo = page.getByRole('link', {name: /npmview home/i});
        await logo.click();

        await page.waitForURL('/');
        await expect(page).toHaveURL('/');
    });

    test('Home navigation link works', async ({page}) => {
        await page.goto('/about');

        const homeLink = page.getByRole('navigation', {name: /main navigation/i})
            .getByRole('link', {name: /^home$/i});
        await homeLink.click();

        await page.waitForURL('/');
        await expect(page).toHaveURL('/');
    });

    test('About navigation link works', async ({page}) => {
        await page.goto('/');

        const aboutLink = page.getByRole('navigation', {name: /main navigation/i})
            .getByRole('link', {name: /^about$/i});
        await aboutLink.click();

        await page.waitForURL('/about');
        await expect(page).toHaveURL('/about');
    });

    test('active navigation link is highlighted on homepage', async ({page}) => {
        await page.goto('/');

        const homeLink = page.getByRole('navigation', {name: /main navigation/i})
            .getByRole('link', {name: /^home$/i});

        await expect(homeLink).toHaveAttribute('aria-current', 'page');
        await expect(homeLink).toHaveClass(/font-semibold/);
    });

    test('active navigation link is highlighted on About page', async ({page}) => {
        await page.goto('/about');

        const aboutLink = page.getByRole('navigation', {name: /main navigation/i})
            .getByRole('link', {name: /^about$/i});

        await expect(aboutLink).toHaveAttribute('aria-current', 'page');
        await expect(aboutLink).toHaveClass(/font-semibold/);
    });

    test('GitHub link is present and has correct attributes', async ({page}) => {
        await page.goto('/');

        const githubLink = page.getByRole('link', {name: /view npmview on github/i});
        await expect(githubLink).toBeVisible();
        await expect(githubLink).toHaveAttribute('href', 'https://github.com/janszotkowski/npmview');
        await expect(githubLink).toHaveAttribute('target', '_blank');
        await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('header is sticky on scroll', async ({page}) => {
        await page.goto('/');

        const header = page.locator('header');
        await expect(header).toHaveClass(/sticky/);
        await expect(header).toHaveClass(/top-0/);
    });

    test('navigation maintains state during back/forward navigation', async ({page}) => {
        await page.goto('/');

        await page.getByRole('link', {name: /^about$/i}).click();
        await page.waitForURL('/about');

        await page.goBack();
        await page.waitForURL('/');

        const heading = page.getByRole('heading', {name: /npmview/i});
        await expect(heading).toBeVisible();

        await page.goForward();
        await page.waitForURL('/about');

        const aboutHeading = page.getByRole('heading', {name: /about npm view/i});
        await expect(aboutHeading).toBeVisible();
    });
});
