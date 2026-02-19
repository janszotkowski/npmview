/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router';
import appCss from '../styles/app.css?url';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient } from '@tanstack/react-query';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { defaultMeta, siteConfig } from '@/utils/seo.ts';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { useEffect } from 'react';
import { encodePackageName } from '@/utils/url';
import { registerServiceWorker } from '@/utils/service-worker';

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    headers: () => ({
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    }),
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: siteConfig.title,
            },
            ...defaultMeta,
        ],
        links: [
            // {
            //     rel: 'preconnect',
            //     href: '',
            // },
            // {
            //     rel: 'dns-prefetch',
            //     href: '',
            // },
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
    const router = useRouter();

    useEffect(() => {
        registerServiceWorker();
    }, []);

    useEffect(() => {
        const topPackages = ['react', 'next', 'vue', 'angular', 'typescript', 'vite'];
        topPackages.forEach(name => {
            void router.preloadRoute({
                to: '/package/$name',
                params: { name: encodePackageName(name) },
            });
        });
    }, [router]);

    return (
        <RootDocument>
            <ThemeProvider
                defaultTheme={'system'}
                storageKey={'npmview-theme'}
            >
                <a
                    href={'#main-content'}
                    className={'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:bg-white dark:focus:text-neutral-900'}
                >
                    Skip to main content
                </a>
                <div className={'flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 relative'}>
                    <BackgroundGradient />
                    <div className={'relative z-10 flex flex-col min-h-screen'}>
                        <Header />
                        <main
                            id={'main-content'}
                            className={'flex-1'}
                        >
                            <Outlet />
                        </main>
                        <Footer />
                    </div>
                </div>
            </ThemeProvider>
        </RootDocument>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang={'en'}>
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <TanStackRouterDevtools position={'bottom-right'} />
                <ReactQueryDevtools buttonPosition={'bottom-left'} />
                <Scripts />
            </body>
        </html>
    );
}
