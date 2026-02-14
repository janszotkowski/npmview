import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { searchPackages } from '@/server/search';
import { useDebounce } from '@/hooks/useDebounce';
import { siteConfig } from '@/utils/seo.ts';

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
    const [query, setQuery] = useState<string>('');
    const debouncedQuery = useDebounce(query, 300);

    const {data, isLoading} = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => searchPackages({data: debouncedQuery}),
        enabled: debouncedQuery.length > 1,
        staleTime: 1000 * 60,
    });

    const results = data?.objects.map((obj) => obj.package) ?? [];

    return (
        <div className={'flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 pt-[20vh]'}>
            <div className={'w-full max-w-2xl space-y-8 text-center'}>
                <Hero/>

                <SearchInput
                    value={query}
                    onChange={setQuery}
                    isLoading={isLoading}
                />

                <SearchResults results={results}/>
            </div>
        </div>
    );
}