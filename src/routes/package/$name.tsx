import { Await, createFileRoute, defer } from '@tanstack/react-router';
import { getBundleSize, getPackageDownloads, getPackageManifest, getPackageReadme, getPackageScore } from '@/server/package';
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
import { SecurityAlertsTab } from '@/components/package/SecurityAlertsTab';
import { getGithubStars } from '@/server/github.ts';
import { Suspense } from 'react';
import { PackageManifest } from '@/types/package.ts';
import { SearchResultItem } from '@/types/search.ts';
import { decodePackageName } from '@/utils/url.ts';

export const Route = createFileRoute('/package/$name')({
    loader: async (opts) => {
        const name = decodePackageName(opts.params.name);
        const statePkg = opts.location.state.package;

        const readmePromise = getPackageReadme({data: name});
        const downloadsPromise = getPackageDownloads({data: name});
        const bundleSizePromise = getBundleSize({data: name});
        const scorePromise = getPackageScore({data: name});

        let fastPkg: Partial<PackageManifest> | undefined;
        let pkgResult: Promise<PackageManifest | null> | PackageManifest | null;
        let starsPromise: Promise<number | null>;

        if (statePkg) {
            fastPkg = mapSearchResultToManifest(statePkg);
            pkgResult = defer(getPackageManifest({data: name}));
            const repoUrl = fastPkg.repository?.url;
            starsPromise = repoUrl ? getGithubStars({data: repoUrl}) : Promise.resolve(null);
        } else {
            const fetchedPkg = await getPackageManifest({data: name});
            pkgResult = fetchedPkg;
            starsPromise = (fetchedPkg?.repository?.url) ? getGithubStars({data: fetchedPkg.repository.url}) : Promise.resolve(null);
        }

        return {
            pkg: pkgResult,
            fastPkg,
            readme: defer(readmePromise),
            downloads: defer(downloadsPromise),
            stars: defer(starsPromise),
            bundleSize: defer(bundleSizePromise),
            score: defer(scorePromise),
        };
    },
    head: ({loaderData}) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pkgData = (loaderData?.pkg && 'name' in (loaderData.pkg as any))
            ? (loaderData.pkg as PackageManifest)
            : loaderData?.fastPkg;

        if (!pkgData && !loaderData?.fastPkg && !loaderData?.pkg) {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const name = pkgData?.name || loaderData?.pkg && 'name' in (loaderData.pkg as any) ? (loaderData?.pkg as PackageManifest).name : '';
        const description = pkgData?.description || '';

        if (!name) return {};

        return {
            title: `Package: ${name} | ${siteConfig.title}`,
            meta: [
                ...defaultMeta,
                {
                    name: 'description',
                    content: description || siteConfig.description,
                },
                {
                    property: 'og:title',
                    content: `Package: ${name} | ${siteConfig.title}`,
                },
                {
                    property: 'og:description',
                    content: description || siteConfig.description,
                },
            ],
            links: [
                {
                    rel: 'canonical',
                    href: `${siteConfig.url}/package/${name}/`,
                },
            ],
        };
    },
    component: PackageDetail,
    pendingComponent: PackageSkeleton,
    pendingMs: 0,
    staleTime: 60_000,
});

function mapSearchResultToManifest(item: SearchResultItem): Partial<PackageManifest> {
    return {
        name: item.name,
        version: item.version,
        description: item.description,
        keywords: item.keywords,
        maintainers: [
            {
                name: item.publisher.username,
                email: item.publisher.email,
            },
        ],
        repository: item.links.repository ? {type: 'git', url: item.links.repository} : undefined,
        homepage: item.links.homepage,
        license: undefined,
    };
}

function PackageDetail() {
    const {pkg, fastPkg, stars} = Route.useLoaderData();

    const isDeferred = pkg && typeof pkg === 'object' && 'then' in pkg;

    if (isDeferred) {
        return (
            <Suspense fallback={<PackageSkeleton fastPkg={fastPkg}/>}>
                <Await promise={pkg as Promise<PackageManifest | null>}>
                    {(resolvedPkg) => (
                        <PackageContent
                            pkg={resolvedPkg}
                            stars={stars}
                        />
                    )}
                </Await>
            </Suspense>
        );
    }

    return (
        <PackageContent
            pkg={pkg as PackageManifest | null}
            stars={stars}
        />
    );
}

type PackageContentProps = {
    pkg: PackageManifest | null;
    stars: Promise<number | null>;
};

function PackageContent({pkg, stars}: PackageContentProps) {
    const {readme, downloads, bundleSize, score} = Route.useLoaderData();

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
            <script
                type={'application/ld+json'}
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: pkg.name,
                        operatingSystem: 'Any',
                        applicationCategory: 'DeveloperApplication',
                        description: pkg.description,
                        offers: {
                            '@type': 'Offer',
                            price: '0.00',
                            priceCurrency: 'USD',
                        },
                    }),
                }}
            />
            <div className={'container mx-auto max-w-7xl px-4 py-8'}>
                <PackageHeader
                    pkg={pkg}
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
                        <Tabs
                            defaultValue={'readme'}
                            key={pkg.name}
                        >
                            <TabsList className={'mb-4 overflow-x-auto'}>
                                <TabsTrigger
                                    value={'readme'}
                                    icon={(
                                        <FileText
                                            className={'h-4 w-4'}
                                            aria-hidden={'true'}
                                        />
                                    )}
                                >
                                    Readme
                                </TabsTrigger>
                                <TabsTrigger
                                    value={'dependencies'}
                                    icon={(
                                        <Box
                                            className={'h-4 w-4'}
                                            aria-hidden={'true'}
                                        />
                                    )}
                                >
                                    Dependencies
                                </TabsTrigger>
                                <TabsTrigger
                                    value={'versions'}
                                    icon={(
                                        <History
                                            className={'h-4 w-4'}
                                            aria-hidden={'true'}
                                        />
                                    )}
                                >
                                    Versions
                                </TabsTrigger>
                                <TabsTrigger
                                    value={'security'}
                                    icon={(
                                        <Shield
                                            className={'h-4 w-4'}
                                            aria-hidden={'true'}
                                        />
                                    )}
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
                                    <PackageVersions pkg={pkg}/>
                                </div>
                            </TabsContent>

                            <TabsContent value={'security'}>
                                <div className={'overflow-hidden rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                                    <SecurityAlertsTab pkg={pkg}/>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className={'space-y-8 lg:col-span-4'}>
                        <InstallCommand packageName={pkg.name}/>
                        <PackageSidebar pkg={pkg}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
