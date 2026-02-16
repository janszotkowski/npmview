import { BundleSize, DownloadRange, PackageDownloadsTrend, PackageManifest, PackageScore } from '@/types/package';
import { Suspense, useMemo } from 'react';
import { Await } from '@tanstack/react-router';
import { formatBytes } from '@/utils/format';

type PackageStatsProps = {
    readonly pkg: PackageManifest;
    downloads: Promise<DownloadRange | null>;
    bundleSize: Promise<BundleSize | null>;
    score: Promise<PackageScore | null>;
};

export const PackageStats: React.FC<PackageStatsProps> = (props): React.ReactElement => {
    const unpackedSize = props.pkg.dist.unpackedSize ?? 0;
    const fileCount = props.pkg.dist.fileCount ?? 0;

    const formattedSize = formatBytes(unpackedSize);

    return (
        <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'}>
            <div className={'flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Weekly Downloads</span>
                <Suspense fallback={<div className={'mt-2 h-8 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800'}/>}>
                    <Await promise={props.downloads}>
                        {(resolvedDownloads) => (
                            <WeeklyDownloads downloads={resolvedDownloads}/>
                        )}
                    </Await>
                </Suspense>
            </div>

            <div className={'flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Bundle Size</span>
                <Suspense fallback={<div className={'mt-2 h-8 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800'}/>}>
                    <Await promise={props.bundleSize}>
                        {(resolvedBundleSize) => (
                            <BundleSizeDisplay bundleSize={resolvedBundleSize}/>
                        )}
                    </Await>
                </Suspense>
            </div>

            <div className={'flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Unpacked Size</span>
                <span className={'mt-2 text-3xl font-bold text-neutral-900 dark:text-white'}>
                    {formattedSize}
                </span>
                <span className={'text-xs text-neutral-500'}>Raw package size</span>
            </div>

            <div className={'flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Total Files</span>
                <span className={'mt-2 text-3xl font-bold text-neutral-900 dark:text-white'}>
                    {fileCount}
                </span>
                <span className={'text-xs text-neutral-500'}>Core library components</span>
            </div>

            <div className={'flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Quality Score</span>
                <Suspense fallback={<div className={'mt-2 h-8 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800'}/>}>
                    <Await promise={props.score}>
                        {(resolvedScore) => (
                            <QualityScore score={resolvedScore}/>
                        )}
                    </Await>
                </Suspense>
            </div>
        </div>
    );
};

const BundleSizeDisplay = ({bundleSize}: { bundleSize: BundleSize | null }) => {
    if (!bundleSize) {
        return (
            <div className={'mt-2'}>
                <span className={'text-3xl font-bold text-neutral-900 dark:text-white'}>N/A</span>
                <span className={'block text-xs text-neutral-500'}>Data unavailable</span>
            </div>
        );
    }

    return (
        <div className={'mt-2'}>
            <div className={'flex items-baseline gap-2'}>
                <span className={'text-3xl font-bold text-neutral-900 dark:text-white'}>
                    {formatBytes(bundleSize.gzip)}
                </span>
            </div>
            <span className={'text-xs text-neutral-500'}>
                Minified + Gzipped
            </span>
        </div>
    );
};

const QualityScore = ({score}: { score: PackageScore | null }) => {
    if (!score) {
        return (
            <div className={'mt-2'}>
                <span className={'text-3xl font-bold text-neutral-900 dark:text-white'}>N/A</span>
                <span className={'block text-xs text-neutral-500'}>Data unavailable</span>
            </div>
        );
    }

    const percentage = Math.round(score.final * 100);
    const getScoreColor = (value: number) => {
        if (value >= 80) return 'text-emerald-600 dark:text-emerald-400';
        if (value >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className={'mt-2'}>
            <span className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
            </span>
            <div className={'mt-1 flex gap-1 text-xs text-neutral-500'}>
                <span>Q:{Math.round(score.detail.quality * 100)}</span>
                <span>P:{Math.round(score.detail.popularity * 100)}</span>
                <span>M:{Math.round(score.detail.maintenance * 100)}</span>
            </div>
        </div>
    );
};

const WeeklyDownloads = ({downloads}: { downloads: DownloadRange | null }) => {
    const {totalDownloads, trend, percentage} = useMemo(() => {
        if (!downloads || downloads.downloads.length === 0) {
            return {totalDownloads: 0, trend: 'neutral', percentage: 0};
        }

        const data = downloads.downloads;
        const total = data.reduce((acc, curr) => acc + curr.downloads, 0);

        const midPoint = Math.floor(data.length / 2);
        const firstHalf = data.slice(0, midPoint);
        const secondHalf = data.slice(midPoint);

        const firstHalfSum = firstHalf.reduce((acc, curr) => acc + curr.downloads, 0);
        const secondHalfSum = secondHalf.reduce((acc, curr) => acc + curr.downloads, 0);

        let trendDirection: PackageDownloadsTrend = 'neutral';
        let percentChange = 0;

        if (firstHalfSum > 0) {
            percentChange = Math.round(((secondHalfSum - firstHalfSum) / firstHalfSum) * 100);
        }

        if (secondHalfSum > firstHalfSum) {
            trendDirection = 'up';
        } else if (secondHalfSum < firstHalfSum) {
            trendDirection = 'down';
        }

        return {
            totalDownloads: total,
            trend: trendDirection,
            percentage: Math.abs(percentChange),
        } as const;
    }, [downloads]);

    const formattedDownloads = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
    }).format(totalDownloads);

    return (
        <div className={'mt-2 flex items-end gap-3'}>
            <span className={'text-3xl font-bold text-neutral-900 dark:text-white'}>
                {formattedDownloads}
            </span>
            {percentage > 0 && (
                <span className={`mb-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trend === 'up' ? '+' : '-'}{percentage}%
                </span>
            )}
        </div>
    );
};
