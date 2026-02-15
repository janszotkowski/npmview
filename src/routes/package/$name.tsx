import { createFileRoute, defer } from '@tanstack/react-router';
import { getBundleSize, getPackage, getPackageDownloads, getPackageManifest, getPackageReadme, getPackageScore } from '@/server/package';
import { defaultMeta, siteConfig } from '@/utils/seo';
import { PackageHeader } from '@/components/package/PackageHeader';
import { PackageReadme } from '@/components/package/PackageReadme';
import { PackageSidebar } from '@/components/package/PackageSidebar';
import { PackageStats } from '@/components/package/PackageStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { PackageDependencies } from '@/components/package/PackageDependencies';
import { PackageVersions } from '@/components/package/PackageVersions';
import { Box, FileText, History, Shield } from 'lucide-react';
import { InstallCommand } from '@/components/package/InstallCommand.tsx';
import { PackageSkeleton } from '@/components/package/PackageSkeleton';
import { SecurityAlerts } from '@/components/package/SecurityAlerts';
import { SecurityAlertsTab } from '@/components/package/SecurityAlertsTab';
import { getGithubStars, getSecurityAdvisories } from '@/server/github.ts';

export const Route = createFileRoute('/package/$name')({
    loader: async (opts) => {
        const pkg = await getPackageManifest({data: opts.params.name});

        if (!pkg) {
            return {
                pkg: null,
                readme: defer(Promise.resolve(null)),
                downloads: defer(Promise.resolve(null)),
                stars: defer(Promise.resolve(null)),
                fullPkg: defer(Promise.resolve(null)),
                bundleSize: defer(Promise.resolve(null)),
                score: defer(Promise.resolve(null)),
                advisories: defer(Promise.resolve(null)),
            };
        }

        const readmePromise = getPackageReadme({data: opts.params.name});
        const downloadsPromise = getPackageDownloads({data: opts.params.name});
        const fullPkgPromise = getPackage({data: opts.params.name});
        const bundleSizePromise = getBundleSize({data: opts.params.name});
        const scorePromise = getPackageScore({data: opts.params.name});
        const advisoriesPromise = getSecurityAdvisories({data: opts.params.name});

        const starsPromise = (pkg.repository?.url) ? getGithubStars({data: pkg.repository.url}) : Promise.resolve(null);

        return {
            pkg,
            readme: defer(readmePromise),
            fullPkg: defer(fullPkgPromise),
            downloads: defer(downloadsPromise),
            stars: defer(starsPromise),
            bundleSize: defer(bundleSizePromise),
            score: defer(scorePromise),
            advisories: defer(advisoriesPromise),
        };
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
            links: [
                {
                    rel: 'canonical',
                    href: `${siteConfig.url}/package/${pkg.name}/`,
                },
            ],
        };
    },
    component: PackageDetail,
    pendingComponent: PackageSkeleton,
    pendingMs: 0,
    staleTime: 60_000,
});

function PackageDetail() {
    const {pkg, readme, downloads, stars, fullPkg, bundleSize, score, advisories} = Route.useLoaderData();

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
                <PackageHeader
                    pkg={pkg}
                    fullPkg={fullPkg}
                    stars={stars}
                />

                <PackageStats
                    pkg={pkg}
                    downloads={downloads}
                    bundleSize={bundleSize}
                    score={score}
                />

                <div className={'mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12'}>
                    <div className={'space-y-8 lg:col-span-8'}>
                        <Tabs defaultValue={'readme'}>
                            <TabsList className={'mb-4 overflow-x-auto'}>
                                <TabsTrigger
                                    value={'readme'}
                                    icon={<FileText className={'h-4 w-4'}/>}
                                >
                                    Readme
                                </TabsTrigger>
                                <TabsTrigger
                                    value={'dependencies'}
                                    icon={<Box className={'h-4 w-4'}/>}
                                >
                                    Dependencies
                                </TabsTrigger>
                                <TabsTrigger
                                    value={'versions'}
                                    icon={<History className={'h-4 w-4'}/>}
                                >
                                    Versions
                                </TabsTrigger>
                                <TabsTrigger
                                    value={'security'}
                                    icon={<Shield className={'h-4 w-4'}/>}
                                >
                                    Security
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value={'readme'}>
                                <PackageReadme readme={readme}/>
                            </TabsContent>

                            <TabsContent value={'dependencies'}>
                                <div className={'overflow-hidden rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                    <PackageDependencies pkg={pkg}/>
                                </div>
                            </TabsContent>

                            <TabsContent value={'versions'}>
                                <div className={'overflow-hidden rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                    <PackageVersions
                                        pkg={pkg}
                                        fullPkg={fullPkg}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value={'security'}>
                                <div className={'overflow-hidden rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                    <SecurityAlertsTab advisories={advisories}/>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className={'space-y-8 lg:col-span-4'}>
                        <InstallCommand packageName={pkg.name}/>
                        <SecurityAlerts advisories={advisories}/>
                        <PackageSidebar pkg={pkg}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
