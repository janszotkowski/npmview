import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

export function getRouter() {
    const queryClient = new QueryClient();

    const router = createRouter({
        routeTree,
        context: {queryClient},
        defaultPreload: 'intent',
        // defaultErrorComponent: DefaultCatchBoundary,
        // defaultNotFoundComponent: () => <NotFound/>,
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
}
