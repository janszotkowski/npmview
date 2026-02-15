import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { searchPackages } from '@/server/search';
import { useDebounce } from '@/hooks/useDebounce';
import { siteConfig } from '@/utils/seo.ts';
import { TrendingPackages } from '@/components/TrendingPackages';

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
    const navigate = useNavigate();
    const [query, setQuery] = useState<string>('');
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const debouncedQuery = useDebounce(query, 300);

    const {data, isLoading} = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => searchPackages({data: debouncedQuery}),
        enabled: debouncedQuery.length > 1,
        staleTime: 1000 * 60,
    });

    const results = data?.objects.map((obj) => obj.package) ?? [];

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (activeIndex + 1) % results.length;
            setActiveIndex(nextIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (results.length === 0) {
                return;
            }
            const nextIndex = activeIndex <= 0 ? results.length - 1 : activeIndex - 1;
            setActiveIndex(nextIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < results.length) {
                navigate({to: '/package/$name', params: {name: results[activeIndex].name}});
            } else if (query.trim()) {
                navigate({to: '/package/$name', params: {name: query.trim()}});
            }
        }
    };

    if (query !== debouncedQuery && activeIndex !== -1) {
        setActiveIndex(-1);
    }

    return (
        <div className={'flex flex-col items-center min-h-screen relative pb-20 overflow-x-hidden'}>
            <div className={'absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-linear-to-b from-red-100/80 to-transparent dark:from-red-900/20 dark:to-transparent pointer-events-none blur-3xl'}/>
            <div className={'absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-bl from-blue-100/80 to-transparent dark:from-blue-900/20 dark:to-transparent pointer-events-none blur-3xl'}/>
            <div className={'absolute top-0 left-0 w-[600px] h-[600px] bg-linear-to-br from-purple-100/80 to-transparent dark:from-purple-900/20 dark:to-transparent pointer-events-none blur-3xl'}/>

            <div
                className={'w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-[15vh] space-y-8 text-center relative z-10'}
                onKeyDown={handleKeyDown}
            >
                <Hero/>

                <div className={'w-full max-w-2xl flex flex-col items-center'}>
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        isLoading={isLoading}
                        activeIndex={activeIndex}
                        onFocus={() => setActiveIndex(-1)}
                    />

                    {query && (
                        <SearchResults
                            results={results}
                            activeIndex={activeIndex}
                            onSelect={setActiveIndex}
                            className={'w-full'}
                        />
                    )}
                </div>

                {!query && <TrendingPackages/>}
            </div>
        </div>
    );
}