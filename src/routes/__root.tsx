/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import appCss from '../styles/app.css?url';

export const Route = createRootRoute({
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
            <Outlet/>
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
        <Scripts/>
        </body>
        </html>
    );
}