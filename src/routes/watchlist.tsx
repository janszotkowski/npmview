import { createFileRoute } from '@tanstack/react-router';
import { defaultMeta, siteConfig } from '@/utils/seo';
import { WatchlistPage } from '@/components/watchlist/WatchlistPage';

export const Route = createFileRoute('/watchlist')({
    component: WatchlistRoute,
    head: () => ({
        title: `Package Watchlist | ${siteConfig.title}`,
        meta: [
            ...defaultMeta,
            {
                name: 'description',
                content: 'Monitor your favorite npm packages for updates, security advisories, and changes.',
            },
        ],
    }),
});

function WatchlistRoute() {
    return <WatchlistPage />;
}
