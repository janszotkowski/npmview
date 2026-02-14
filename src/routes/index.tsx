import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { searchPackages } from '@/server/search';

export const Route = createFileRoute('/')({
    component: Home,
});

function Home() {
    const [query, setQuery] = useState<string>('');

    const debouncedQuery = query;

    const {data, isLoading} = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => searchPackages({data: debouncedQuery}),
        enabled: debouncedQuery.length > 1,
        staleTime: 1000 * 60,
    });

    const results = data?.objects.map((obj) => obj.package) ?? [];

    return (
        <div className={'flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8'}>
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