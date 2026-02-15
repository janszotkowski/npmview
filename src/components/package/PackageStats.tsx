import { DownloadRange, PackageDownloadsTrend, PackageManifest } from '@/types/package';
import { Suspense, useMemo } from 'react';
import { Await } from '@tanstack/react-router';

type PackageStatsProps = {
    readonly pkg: PackageManifest;
    downloads: Promise<DownloadRange | null>;
};

export const PackageStats: React.FC<PackageStatsProps> = (props): React.ReactElement => {
    const unpackedSize = props.pkg.dist.unpackedSize ?? 0;
    const fileCount = props.pkg.dist.fileCount ?? 0;

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) {
            return '0 B';
        }
        const k = 1000;
        const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
    };

    const formattedSize = formatBytes(unpackedSize);

    return (
        <div className={'grid grid-cols-1 gap-4 md:grid-cols-3'}>
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
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Unpacked Size</span>
                <span className={'mt-2 text-3xl font-bold text-neutral-900 dark:text-white'}>
                    {formattedSize}
                </span>
                <span className={'text-xs text-neutral-500'}>Optimized for production</span>
            </div>

            <div className={'flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Total Files</span>
                <span className={'mt-2 text-3xl font-bold text-neutral-900 dark:text-white'}>
                    {fileCount}
                </span>
                <span className={'text-xs text-neutral-500'}>Core library components</span>
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

    return (
        <div className={'mt-2 flex items-end gap-3'}>
            <span className={'text-3xl font-bold text-neutral-900 dark:text-white'}>
                {new Intl.NumberFormat('en-US').format(totalDownloads)}
            </span>
            {percentage > 0 && (
                <span className={`mb-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trend === 'up' ? '+' : '-'}{percentage}%
                </span>
            )}
        </div>
    );
};
