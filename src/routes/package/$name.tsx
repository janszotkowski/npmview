import { createFileRoute, defer } from '@tanstack/react-router';
import { getPackage, getPackageDownloads } from '@/server/package';
import { defaultMeta, siteConfig } from '@/utils/seo';
import { PackageHeader } from '@/components/package/PackageHeader';
import { PackageReadme } from '@/components/package/PackageReadme';
import { PackageSidebar } from '@/components/package/PackageSidebar';
import { PackageStats } from '@/components/package/PackageStats';

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
        <div className={'min-h-screen bg-neutral-50 pb-20 dark:bg-black'}>
            <div className={'container mx-auto max-w-7xl px-4 py-8'}>
                <PackageHeader pkg={pkg}/>

                <div className={'mt-8 space-y-8'}>
                    <PackageStats pkg={pkg} downloads={downloads}/>

                    <div className={'grid gap-8 lg:grid-cols-12'}>
                        <div className={'lg:col-span-8'}>
                            <div className={'overflow-hidden rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                <PackageReadme readme={pkg.readme}/>
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
        </div>
    );
}
