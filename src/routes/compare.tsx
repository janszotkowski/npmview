import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPackageManifest, getPackageDownloads, getBundleSize, getPackageScore } from '@/server/package';
import { getGithubStars } from '@/server/github';
import { PackageManifest, BundleSize, PackageScore, DownloadRange } from '@/types/package';
import { defaultMeta, siteConfig } from '@/utils/seo';
import { PackageComparison } from '@/components/compare/PackageComparison';
import { PackageComparisonSkeleton } from '@/components/compare/PackageComparisonSkeleton';
import { CompareHero } from '@/components/compare/CompareHero';
import { CompareSearchSection } from '@/components/compare/CompareSearchSection';
import { CompareEmptyState } from '@/components/compare/CompareEmptyState';
import { CompareErrorState } from '@/components/compare/CompareErrorState';

export const Route = createFileRoute('/compare')({
    component: ComparePage,
    validateSearch: (search: Record<string, unknown>) => ({
        packages: search.packages as string[] | string | undefined,
    }),
    head: () => ({
        title: `Package Comparison | ${siteConfig.title}`,
        meta: [
            ...defaultMeta,
            {
                name: 'description',
                content: 'Compare npm packages side-by-side with metrics like bundle size, downloads, security score, and more.',
            },
        ],
    }),
});

type PackageData = {
    manifest: PackageManifest | null;
    downloads: DownloadRange | null;
    bundleSize: BundleSize | null;
    score: PackageScore | null;
    stars: number | null;
};

function ComparePage() {
    const search = useSearch({ from: '/compare' });
    const navigate = useNavigate();
    const [packageNames, setPackageNames] = useState<string[]>(() => {
        if (search.packages) {
            return Array.isArray(search.packages) ? search.packages : [search.packages];
        }
        return [];
    });

    useEffect(() => {
        if (search.packages) {
            const packages = Array.isArray(search.packages) ? search.packages : [search.packages];
            setPackageNames(packages);
        }
    }, [search.packages]);

    const packagesData = useQuery({
        queryKey: ['compare', packageNames],
        queryFn: async () => {
            const results = await Promise.allSettled(
                packageNames.map(async (name): Promise<{ name: string; data: PackageData }> => {
                    const [manifest, downloads, bundleSize, score, stars] = await Promise.allSettled([
                        getPackageManifest({ data: name }),
                        getPackageDownloads({ data: name }),
                        getBundleSize({ data: name }),
                        getPackageScore({ data: name }),
                        getPackageManifest({ data: name }).then(pkg =>
                            pkg?.repository?.url ? getGithubStars({ data: pkg.repository.url }) : Promise.resolve(null)
                        ),
                    ]);

                    return {
                        name,
                        data: {
                            manifest: manifest.status === 'fulfilled' ? manifest.value : null,
                            downloads: downloads.status === 'fulfilled' ? downloads.value : null,
                            bundleSize: bundleSize.status === 'fulfilled' ? bundleSize.value : null,
                            score: score.status === 'fulfilled' ? score.value : null,
                            stars: stars.status === 'fulfilled' ? stars.value : null,
                        },
                    };
                })
            );

            return results
                .filter((r): r is PromiseFulfilledResult<{ name: string; data: PackageData }> => r.status === 'fulfilled')
                .map(r => r.value);
        },
        enabled: packageNames.length > 0,
    });

    const handleAddPackage = (name: string) => {
        const trimmed = name.trim();
        if (trimmed && !packageNames.includes(trimmed)) {
            const newPackages = [...packageNames, trimmed];
            setPackageNames(newPackages);
            void navigate({
                to: '/compare',
                search: { packages: newPackages },
                replace: true,
            });
        }
    };

    const handleRemovePackage = (name: string) => {
        const newPackages = packageNames.filter(p => p !== name);
        setPackageNames(newPackages);
        void navigate({
            to: '/compare',
            search: { packages: newPackages.length > 0 ? newPackages : [] },
            replace: true,
        });
    };

    const handleClearAll = () => {
        setPackageNames([]);
        void navigate({
            to: '/compare',
            search: { packages: [] },
            replace: true,
        });
    };

    return (
        <div className={'min-h-screen pb-20 relative'}>
            <div className={'container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14'}>
                <CompareHero />
                <CompareSearchSection
                    packageNames={packageNames}
                    onAddPackage={handleAddPackage}
                />

                {packageNames.length === 0 ? (
                    <CompareEmptyState />
                ) : packagesData.isLoading ? (
                    <PackageComparisonSkeleton count={packageNames.length} />
                ) : packagesData.data && packagesData.data.length > 0 ? (
                    <PackageComparison
                        packages={packagesData.data}
                        onRemove={handleRemovePackage}
                        onClearAll={handleClearAll}
                    />
                ) : (
                    <CompareErrorState />
                )}
            </div>
        </div>
    );
}
