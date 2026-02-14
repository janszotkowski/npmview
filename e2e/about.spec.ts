import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
    test('loads successfully and displays main heading', async ({page}) => {
        await page.goto('/about');

        const heading = page.getByRole('heading', {name: /about npm view/i, level: 1});
        await expect(heading).toBeVisible();
    });

    test('has correct page title', async ({page}) => {
        await page.goto('/about');
        await expect(page).toHaveTitle('About | NPM View');
    });

    test('displays mission section', async ({page}) => {
        await page.goto('/about');

        const missionHeading = page.getByRole('heading', {name: /mission/i, level: 2});
        await expect(missionHeading).toBeVisible();

        await expect(page.getByText(/cleaner, more efficient interface/i)).toBeVisible();
    });

    test('displays tech stack section with all technologies', async ({page}) => {
        await page.goto('/about');

        const techStackHeading = page.getByRole('heading', {name: /tech stack/i, level: 2});
        await expect(techStackHeading).toBeVisible();

        const technologies = [
            'TanStack Start',
            'TanStack Router',
            'TanStack Query',
            'React 19',
            'Tailwind CSS v4',
            'Redis',
        ];

        for (const tech of technologies) {
            await expect(page.getByText(tech, {exact: true})).toBeVisible();
        }
    });

    test('displays disclaimer with warning icon', async ({page}) => {
        await page.goto('/about');

        const disclaimer = page.getByRole('note', {name: /disclaimer/i});
        await expect(disclaimer).toBeVisible();
        await expect(disclaimer).toContainText('hobby project created for learning purposes');
        await expect(disclaimer).toContainText('not affiliated with, endorsed by, or connected to npm, Inc.');
    });

    test('has proper semantic structure', async ({page}) => {
        await page.goto('/about');

        const mainContent = page.locator('#main-content');
        await expect(mainContent).toBeVisible();

        const sections = page.locator('section');
        await expect(sections).toHaveCount(2);
    });

    test('is responsive and displays grid layout', async ({page}) => {
        await page.goto('/about');

        const grid = page.locator('.grid.gap-8');
        await expect(grid).toBeVisible();
    });
});
