import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/components/Hero';
import { Search } from '@/components/Search';
import { siteConfig } from '@/utils/seo.ts';
import { TrendingPackages } from '@/components/TrendingPackages';
import { Promotions } from '@/components/Promotions';

export const Route = createFileRoute('/')({
    headers: () => ({
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    }),
    head: () => ({
        meta: [
            {
                title: `${siteConfig.title}`,
            },
        ],
        links: [
            {
                rel: 'canonical',
                href: `${siteConfig.url}`,
            },
        ],
    }),
    component: Home,
});

function Home() {
    return (
        <div className={'flex flex-col items-center min-h-screen relative overflow-x-hidden'}>
            <script
                type={'application/ld+json'}
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: siteConfig.title,
                        url: siteConfig.url,
                        description: siteConfig.description,
                    }),
                }}
            />

            <div
                className={'w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-[15vh] space-y-8 text-center relative z-10'}
            >
                <Hero />

                <div className={'w-full max-w-2xl flex flex-col items-center relative'}>
                    <Search variant={'default'} />
                </div>

                <Promotions />
                <TrendingPackages />
            </div>
        </div>
    );
}