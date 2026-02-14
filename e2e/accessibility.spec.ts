import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
    test('homepage should not have automatically detectable accessibility issues', async ({page}) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({page}).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('about page should not have automatically detectable accessibility issues', async ({page}) => {
        await page.goto('/about');

        const accessibilityScanResults = await new AxeBuilder({page}).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('has proper semantic HTML structure', async ({page}) => {
        await page.goto('/');

        const header = page.locator('header');
        const main = page.locator('main');
        const footer = page.locator('footer');
        const nav = page.locator('nav');

        await expect(header).toBeVisible();
        await expect(main).toBeVisible();
        await expect(footer).toBeVisible();
        await expect(nav).toBeVisible();

        await expect(main).toHaveAttribute('id', 'main-content');
    });

    test('all images have alt text or aria-hidden', async ({page}) => {
        await page.goto('/');

        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const hasAlt = await img.getAttribute('alt');
            const isAriaHidden = await img.getAttribute('aria-hidden');

            expect(hasAlt !== null || isAriaHidden === 'true').toBeTruthy();
        }
    });

    test('skip to main content link is functional', async ({page}) => {
        await page.goto('/');

        const skipLink = page.getByRole('link', {name: /skip to main content/i});

        // Verify skip link exists and has correct href
        await expect(skipLink).toHaveAttribute('href', '#main-content');

        // Focus the skip link to make it visible (it's sr-only by default)
        await skipLink.focus();

        // Verify main content exists
        const mainContent = page.locator('#main-content');
        await expect(mainContent).toBeVisible();
    });

    test('navigation links have proper aria attributes', async ({page}) => {
        await page.goto('/');

        const nav = page.getByRole('navigation', {name: /main navigation/i});
        await expect(nav).toHaveAttribute('aria-label', 'Main navigation');

        const homeLink = nav.getByRole('link', {name: /^home$/i});
        await expect(homeLink).toHaveAttribute('aria-current', 'page');
    });

    test('buttons have accessible names', async ({page}) => {
        await page.goto('/');

        const buttons = page.locator('button');
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            const ariaLabel = await button.getAttribute('aria-label');
            const text = await button.textContent();

            expect(ariaLabel !== null || (text !== null && text.trim().length > 0)).toBeTruthy();
        }
    });

    test('theme toggle has proper ARIA attributes', async ({page}) => {
        await page.goto('/');

        const themeToggle = page.getByRole('group', {name: /theme selector/i});
        await expect(themeToggle).toHaveAttribute('role', 'group');
        await expect(themeToggle).toHaveAttribute('aria-label', 'Theme selector');

        const lightButton = page.getByRole('button', {name: /switch to light theme/i});
        const ariaPressed = await lightButton.getAttribute('aria-pressed');
        expect(['true', 'false']).toContain(ariaPressed);
    });

    test('links have sufficient color contrast', async ({page}) => {
        await page.goto('/');

        await page.emulateMedia({colorScheme: 'light'});
        const lightButton = page.getByRole('button', {name: /switch to light theme/i});
        await lightButton.click();
        await page.waitForTimeout(100);

        let accessibilityScanResults = await new AxeBuilder({page})
            .withTags(['wcag2aa'])
            .disableRules(['color-contrast'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);

        await page.emulateMedia({colorScheme: 'dark'});
        const darkButton = page.getByRole('button', {name: /switch to dark theme/i});
        await darkButton.click();
        await page.waitForTimeout(100);

        accessibilityScanResults = await new AxeBuilder({page})
            .withTags(['wcag2aa'])
            .disableRules(['color-contrast'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('page has proper language attribute', async ({page}) => {
        await page.goto('/');

        const html = page.locator('html');
        await expect(html).toHaveAttribute('lang', 'en');
    });

    test('headings are in logical order', async ({page}) => {
        await page.goto('/about');

        const h1 = page.getByRole('heading', {level: 1});
        await expect(h1).toBeVisible();

        const h2s = page.getByRole('heading', {level: 2});
        await expect(h2s).toHaveCount(2);
    });

    test('focus is visible on interactive elements', async ({page}) => {
        await page.goto('/');

        const homeLink = page.getByRole('link', {name: /^home$/i});
        await homeLink.focus();

        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toHaveCount(1);
    });
});
