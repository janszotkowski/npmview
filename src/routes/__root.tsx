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
            // {
            //     rel: 'canonical',
            //     href: siteConfig.url,
            // },
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
                <div className={'flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50'}>
                    <Header/>
                    <div className={'flex-1'}>
                        <Outlet/>
                    </div>
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
