import { Await, createFileRoute, defer } from '@tanstack/react-router';
import { getPackage, getPackageDownloads } from '@/server/package';
import { defaultMeta, siteConfig } from '@/utils/seo';
import { PackageHeader } from '@/components/package/PackageHeader';
import { PackageReadme } from '@/components/package/PackageReadme';
import { PackageStats } from '@/components/package/PackageStats';
import { Suspense } from 'react';

export const Route = createFileRoute('/package/$name')({
    loader: async ({params}) => {
        const pkg = await getPackage({data: params.name});
        const downloads = getPackageDownloads({data: params.name});

        return {pkg, downloads: defer(downloads)};
    },
    head: ({loaderData}) => {
        const pkg = loaderData?.pkg;
        if (!pkg) {
            return {
                title: `Package Not Found | ${siteConfig.title}`,
                meta: [
                    ...defaultMeta,
                    {
                        name: 'robots',
                        content: 'noindex',
                    },
                ],
            };
        }

        return {
            title: `Package: ${pkg.name} | ${siteConfig.title}`,
            meta: [
                ...defaultMeta,
                {
                    name: 'description',
                    content: pkg.description || siteConfig.description,
                },
                {
                    property: 'og:title',
                    content: `Package: ${pkg.name} | ${siteConfig.title}`,
                },
                {
                    property: 'og:description',
                    content: pkg.description || siteConfig.description,
                },
            ],
        };
    },
    component: PackageDetail,
});

function PackageDetail() {
    const {pkg, downloads} = Route.useLoaderData();

    if (!pkg) {
        return (
            <div className={'container mx-auto px-4 py-8'}>
                <h1 className={'text-2xl font-bold text-red-600'}>Package Not Found</h1>
                <p className={'mt-2'}>The requested package could not be found in the npm registry.</p>
            </div>
        );
    }

    return (
        <div className={'container mx-auto max-w-7xl px-4 py-8'}>
            <PackageHeader pkg={pkg}/>

            <div className={'mt-8 grid gap-8 lg:grid-cols-3'}>
                <div className={'lg:col-span-2'}>
                    <div className={'mb-8'}>
                        <Suspense fallback={<div className={'h-100 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900'}/>}>
                            <Await promise={downloads}>
                                {(resolvedDownloads) => (
                                    <PackageStats
                                        pkg={pkg}
                                        downloads={resolvedDownloads}
                                    />
                                )}
                            </Await>
                        </Suspense>
                    </div>

                    <h2 className={'mb-4 text-2xl font-bold'}>Readme</h2>
                    <div className={'rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900'}>
                        <PackageReadme readme={pkg.readme}/>
                    </div>
                </div>

                <div className={'lg:col-span-1'}>
                    <div className={'space-y-6'}>
                        <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                            <h3 className={'mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500'}>Install</h3>
                            <div className={'group relative rounded-md bg-neutral-950 p-4 font-mono text-sm text-neutral-300 dark:bg-black'}>
                                <div className={'flex items-center justify-between'}>
                                    <code>npm i {pkg.name}</code>
                                </div>
                            </div>
                            <div className={'mt-3 group relative rounded-md bg-neutral-950 p-4 font-mono text-sm text-neutral-300 dark:bg-black'}>
                                <div className={'flex items-center justify-between'}>
                                    <code>pnpm add {pkg.name}</code>
                                </div>
                            </div>
                            <div className={'mt-3 group relative rounded-md bg-neutral-950 p-4 font-mono text-sm text-neutral-300 dark:bg-black'}>
                                <div className={'flex items-center justify-between'}>
                                    <code>yarn add {pkg.name}</code>
                                </div>
                            </div>
                        </div>

                        {pkg.maintainers && pkg.maintainers.length > 0 && (
                            <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                <h3 className={'mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500'}>Maintainers</h3>
                                <ul className={'space-y-3'}>
                                    {pkg.maintainers.map((maintainer) => (
                                        <li
                                            key={maintainer.name}
                                            className={'flex items-center gap-3'}
                                        >
                                            <div className={'flex size-8 items-center justify-center rounded-full bg-neutral-100 font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}>
                                                {maintainer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={'text-sm font-medium text-neutral-700 dark:text-neutral-300'}>{maintainer.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
