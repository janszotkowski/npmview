import { Await, createFileRoute, defer } from '@tanstack/react-router';
import { getPackage, getPackageDownloads } from '@/server/package';
import { defaultMeta, siteConfig } from '@/utils/seo';
import { PackageHero } from '@/components/package/PackageHero';
import { PackageReadme } from '@/components/package/PackageReadme';
import { PackageSidebar } from '@/components/package/PackageSidebar';
import { PackageDownloads } from '@/components/package/PackageDownloads';
import { Suspense } from 'react';
import { FileCode, Scale } from 'lucide-react';

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

    const latestVersion = pkg.versions[pkg['dist-tags'].latest];
    const unpackedSize = latestVersion?.dist.unpackedSize || 0;
    const fileCount = latestVersion?.dist.fileCount;

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) {
            return '0 B';
        }
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={'min-h-screen bg-neutral-50 pb-20 dark:bg-black'}>
            <div className={'container mx-auto max-w-7xl px-4 py-8'}>
                <PackageHero pkg={pkg}/>

                <div className={'mt-8 grid gap-8 lg:grid-cols-12'}>
                    <div className={'lg:col-span-8 space-y-8'}>
                        <div className={'grid grid-cols-2 gap-4'}>
                            <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                <div className={'flex items-center gap-2 text-neutral-500 mb-2'}>
                                    <Scale className={'size-4'}/>
                                    <span className={'text-sm font-medium'}>Unpacked Size</span>
                                </div>
                                <span className={'text-2xl font-bold text-neutral-900 dark:text-white'}>
                                    {formatBytes(unpackedSize)}
                                </span>
                            </div>
                            <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                <div className={'flex items-center gap-2 text-neutral-500 mb-2'}>
                                    <FileCode className={'size-4'}/>
                                    <span className={'text-sm font-medium'}>Files</span>
                                </div>
                                <span className={'text-2xl font-bold text-neutral-900 dark:text-white'}>
                                    {fileCount?.toLocaleString() || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <Suspense fallback={<div className={'h-24.5 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900'}/>}>
                            <Await promise={downloads}>
                                {(resolvedDownloads) => (
                                    <PackageDownloads downloads={resolvedDownloads}/>
                                )}
                            </Await>
                        </Suspense>

                        <div className={'space-y-4'}>
                            <h2 className={'text-2xl font-bold tracking-tight'}>Readme</h2>
                            <div className={'overflow-hidden rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                <PackageReadme readme={pkg.readme}/>
                            </div>
                        </div>
                    </div>

                    <div className={'lg:col-span-4'}>
                        <div className={'sticky top-8'}>
                            <PackageSidebar pkg={pkg}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
