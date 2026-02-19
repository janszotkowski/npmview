import { PackageComparisonData } from './PackageComparison';
import { formatNumber } from '@/utils/format';
import { X } from 'lucide-react';

type ComparisonTableProps = {
    packages: PackageComparisonData[];
    onRemove: (name: string) => void;
};

export const ComparisonTable = (props: ComparisonTableProps): React.ReactElement => {
    const metrics = props.packages.map(pkg => ({
        name: pkg.name,
        version: pkg.data.manifest?.version ?? 'N/A',
        description: pkg.data.manifest?.description ?? 'N/A',
        weeklyDownloads: pkg.data.downloads?.downloads.reduce((sum, d) => sum + d.downloads, 0) ?? 0,
        bundleSize: pkg.data.bundleSize?.size ?? null,
        bundleSizeGzip: pkg.data.bundleSize?.gzip ?? null,
        score: pkg.data.score?.final ?? null,
        quality: pkg.data.score?.detail.quality ?? null,
        popularity: pkg.data.score?.detail.popularity ?? null,
        maintenance: pkg.data.score?.detail.maintenance ?? null,
        stars: pkg.data.stars ?? null,
        license: pkg.data.manifest?.license ?? 'N/A',
        dependencies: Object.keys(pkg.data.manifest?.dependencies ?? {}).length,
        devDependencies: Object.keys(pkg.data.manifest?.devDependencies ?? {}).length,
        peerDependencies: Object.keys(pkg.data.manifest?.peerDependencies ?? {}).length,
    }));

    return (
        <div className={'overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white/90 dark:bg-neutral-900/90 dark:border-neutral-800/80 backdrop-blur-sm shadow-lg shadow-neutral-200/30 dark:shadow-neutral-950/50'}>
            <table className={'w-full min-w-[720px]'}>
                <thead>
                    <tr className={'border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/50'}>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            Package
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            Version
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            Downloads
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            Bundle
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            Score
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            Stars
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            Deps
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'}>
                            License
                        </th>
                        <th className={'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 w-12'}>
                            <span className={'sr-only'}>Remove</span>
                        </th>
                    </tr>
                </thead>
                <tbody className={'divide-y divide-neutral-100 dark:divide-neutral-800/80'}>
                    {metrics.map((metric, idx) => (
                        <tr
                            key={metric.name}
                            className={`transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 ${idx % 2 === 0 ? 'bg-white/50 dark:bg-neutral-900/30' : ''}`}
                        >
                            <td className={'px-5 py-4'}>
                                <span className={'font-semibold text-neutral-900 dark:text-neutral-100'}>
                                    {metric.name}
                                </span>
                            </td>
                            <td className={'px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400'}>
                                {metric.version}
                            </td>
                            <td className={'px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400 tabular-nums'}>
                                {formatNumber(metric.weeklyDownloads)}
                            </td>
                            <td className={'px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400'}>
                                {metric.bundleSize !== null ? (
                                    <span>
                                        {formatNumber(metric.bundleSize / 1024)} KB
                                        {metric.bundleSizeGzip !== null && (
                                            <span className={'ml-1 text-neutral-500 dark:text-neutral-500'}>
                                                (gzip: {formatNumber(metric.bundleSizeGzip / 1024)})
                                            </span>
                                        )}
                                    </span>
                                ) : (
                                    '—'
                                )}
                            </td>
                            <td className={'px-5 py-4'}>
                                {metric.score !== null ? (
                                    <div className={'flex items-center gap-2 min-w-[100px]'}>
                                        <div className={'h-2 flex-1 max-w-20 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden'}>
                                            <div
                                                className={'h-full rounded-full bg-linear-to-r from-red-500 to-rose-500'}
                                                style={{ width: `${metric.score * 100}%` }}
                                            />
                                        </div>
                                        <span className={'text-sm font-medium text-neutral-700 dark:text-neutral-300 tabular-nums w-10'}>
                                            {(metric.score * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                ) : (
                                    <span className={'text-neutral-400'}>—</span>
                                )}
                            </td>
                            <td className={'px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400 tabular-nums'}>
                                {metric.stars !== null ? formatNumber(metric.stars) : '—'}
                            </td>
                            <td className={'px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400'}>
                                <span className={'tabular-nums'}>{metric.dependencies}</span>
                                {(metric.devDependencies > 0 || metric.peerDependencies > 0) && (
                                    <span className={'text-neutral-400 ml-0.5'}>
                                        +{metric.devDependencies + metric.peerDependencies}
                                    </span>
                                )}
                            </td>
                            <td className={'px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400'}>
                                {metric.license}
                            </td>
                            <td className={'px-5 py-4'}>
                                <button
                                    onClick={() => props.onRemove(metric.name)}
                                    className={'rounded-lg p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 transition-colors'}
                                    aria-label={`Remove ${metric.name}`}
                                >
                                    <X className={'h-4 w-4'} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
