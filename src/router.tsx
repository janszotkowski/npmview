import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import { NotFound } from '@/components/NotFound';

export function getRouter() {
    const queryClient = new QueryClient();

    const router = createRouter({
        routeTree,
        context: {queryClient},
        scrollRestoration: true,
        scrollRestorationBehavior: 'smooth',
        defaultPreload: 'intent',
        defaultErrorComponent: DefaultCatchBoundary,
        defaultNotFoundComponent: NotFound,
    });
    setupRouterSsrQueryIntegration({
        router,
        queryClient,
    });

    return router;
}

declare module '@tanstack/react-router' {
    // eslint-disable-next-line interface-to-type/prefer-type-over-interface
    interface Register {
        router: ReturnType<typeof getRouter>;
    }

    // eslint-disable-next-line interface-to-type/prefer-type-over-interface
    interface HistoryState {
        package?: import('@/types/search').SearchResultItem;
    }
}
