import { PackageManifest, BundleSize, PackageScore, DownloadRange } from '@/types/package';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonCharts } from './ComparisonCharts';
import { ComparisonPackageCard } from './ComparisonPackageCard';

export type PackageComparisonData = {
    name: string;
    data: {
        manifest: PackageManifest | null;
        downloads: DownloadRange | null;
        bundleSize: BundleSize | null;
        score: PackageScore | null;
        stars: number | null;
    };
};

type PackageComparisonProps = {
    packages: PackageComparisonData[];
    onRemove: (name: string) => void;
    onClearAll: () => void;
};

export const PackageComparison = (props: PackageComparisonProps): React.ReactElement => {
    const totalDownloads = props.packages.map(p => {
        const total = p.data.downloads?.downloads.reduce((sum, d) => sum + d.downloads, 0) ?? 0;
        return { name: p.name, downloads: total };
    });

    const bundleSizes = props.packages.map(p => ({
        name: p.name,
        size: p.data.bundleSize?.size ?? 0,
        gzip: p.data.bundleSize?.gzip ?? 0,
    }));

    const scores = props.packages.map(p => ({
        name: p.name,
        final: p.data.score?.final ?? 0,
        quality: p.data.score?.detail.quality ?? 0,
        popularity: p.data.score?.detail.popularity ?? 0,
        maintenance: p.data.score?.detail.maintenance ?? 0,
    }));

    return (
        <div className={'space-y-10'}>
            <div className={'flex flex-wrap items-center justify-between gap-3'}>
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>
                    Comparing <span className={'font-semibold text-neutral-900 dark:text-neutral-100'}>{props.packages.length}</span> {props.packages.length === 1 ? 'package' : 'packages'}
                </span>
                <button
                    onClick={props.onClearAll}
                    className={'text-sm font-medium text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors rounded-lg px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30'}
                >
                    Clear all
                </button>
            </div>

            <section>
                <h2 className={'text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4'}>Metrics table</h2>
                <ComparisonTable
                    packages={props.packages}
                    onRemove={props.onRemove}
                />
            </section>

            <section>
                <h2 className={'text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4'}>Charts</h2>
                <ComparisonCharts
                    downloads={totalDownloads}
                    bundleSizes={bundleSizes}
                    scores={scores}
                />
            </section>

            <section>
                <h2 className={'text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4'}>Package details</h2>
                <div className={'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}>
                    {props.packages.map((pkg) => (
                        <ComparisonPackageCard
                            key={pkg.name}
                            pkg={pkg}
                            onRemove={props.onRemove}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
