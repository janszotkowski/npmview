/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import appCss from '../styles/app.css?url';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient } from '@tanstack/react-query';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { siteConfig, defaultMeta } from '@/utils/seo.ts';

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
            // {rel: 'icon', href: '/favicon.ico'},
            // {rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png'},
            // {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
            // {rel: 'manifest', href: '/site.webmanifest'},
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
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
                <div className={'flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50'}>
                    <Header/>
                    <main
                        id={'main-content'}
                        className={'flex-1'}
                    >
                        <Outlet/>
                    </main>
                    <Footer/>
                </div>
            </ThemeProvider>
        </RootDocument>
    );
}

function RootDocument({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang={'en'}>
        <head>
            <HeadContent/>
        </head>
        <body>
        {children}
        <TanStackRouterDevtools position={'bottom-right'}/>
        <ReactQueryDevtools buttonPosition={'bottom-left'}/>
        <Scripts/>
        </body>
        </html>
    );
}
