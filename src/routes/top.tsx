import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { getTopPackages } from '@/server/package';
import { TopPackagesList } from '@/components/TopPackagesList';

export const Route = createFileRoute('/top')({
    loader: async () => {
        return getTopPackages({data: 'week'});
    },
    component: TopPackagesPage,
});

function TopPackagesPage(): ReactElement {
    const initialData = Route.useLoaderData();

    const topPackagesQuery = useQuery({
        queryKey: ['topPackages', 'week'],
        queryFn: () => getTopPackages({data: 'week'}),
        initialData: initialData,
        staleTime: 1000 * 60 * 60,
    });

    return (
        <main className={'container mx-auto px-4 py-8 max-w-4xl'}>
            <header className={'mb-8 text-center sm:text-left'}>
                <h1 className={'text-3xl font-bold tracking-tight text-neutral-900 dark:text-white'}>
                    Top Packages
                </h1>
                <p className={'text-neutral-500 dark:text-neutral-400 mt-2 text-lg'}>
                    Most downloaded npm packages via jsDelivr CDN in the last week.
                </p>
            </header>

            <TopPackagesList
                packages={topPackagesQuery.data || []}
                title={'Global Trends'}
            />
        </main>
    );
}
