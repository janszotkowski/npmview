import { DownloadRange, PackageDetails } from '@/types/package';
import { Suspense, useMemo } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { InstallCommand } from './InstallCommand';
import { Await } from '@tanstack/react-router';

type PackageStatsProps = {
    pkg: PackageDetails;
    downloads: Promise<DownloadRange | null>;
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

        let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
        let percentChange = 0;

        if (firstHalfSum > 0) {
            percentChange = Math.round(((secondHalfSum - firstHalfSum) / firstHalfSum) * 100);
        }

        if (secondHalfSum > firstHalfSum) {
            trendDirection = 'up';
        } else if (secondHalfSum < firstHalfSum) {
            trendDirection = 'down';
        }

        return {totalDownloads: total, trend: trendDirection, percentage: Math.abs(percentChange)};
    }, [downloads]);

    return (
        <div className={'bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800 h-full'}>
            <h3 className={'text-sm font-semibold text-neutral-500 mb-2'}>Weekly Downloads</h3>
            <div className={'flex items-end gap-3'}>
                <span className={'text-4xl font-bold text-neutral-900 dark:text-white'}>
                    {totalDownloads.toLocaleString()}
                </span>
                {trend !== 'neutral' && (
                    <span className={`flex items-center text-sm font-bold mb-1.5 ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                        {trend === 'up' ? <TrendingUp className={'size-4 mr-1'}/> : <TrendingDown className={'size-4 mr-1'}/>}
                        {percentage}%
                    </span>
                )}
            </div>
        </div>
    );
};

export const PackageStats: React.FC<PackageStatsProps> = (props): React.ReactElement => {
    const latestVersion = props.pkg.versions[props.pkg['dist-tags'].latest];
    const unpackedSize = latestVersion?.dist.unpackedSize || 0;
    const fileCount = latestVersion?.dist.fileCount || 0;

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1000;
        const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
    };

    return (
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
            <Suspense fallback={
                <div className={'bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800 h-full animate-pulse'}>
                    <div className={'h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-4'}/>
                    <div className={'h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded'}/>
                </div>
            }>
                <Await promise={props.downloads}>
                    {(resolvedDownloads) => <WeeklyDownloads downloads={resolvedDownloads}/>}
                </Await>
            </Suspense>

            <div className={'bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800'}>
                <h3 className={'text-sm font-semibold text-neutral-500 mb-2'}>Unpacked Size</h3>
                <div className={'flex items-end gap-2'}>
                    <span className={'text-4xl font-bold text-neutral-900 dark:text-white'}>
                        {formatBytes(unpackedSize).split(' ')[0]}
                    </span>
                    <span className={'text-xl font-medium text-neutral-500 mb-1.5'}>
                        {formatBytes(unpackedSize).split(' ')[1]}
                    </span>
                </div>
            </div>

            <div className={'bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800'}>
                <h3 className={'text-sm font-semibold text-neutral-500 mb-2'}>Total Files</h3>
                <div className={'flex items-end'}>
                    <span className={'text-4xl font-bold text-neutral-900 dark:text-white'}>
                        {fileCount}
                    </span>
                </div>
            </div>

            <InstallCommand packageName={props.pkg.name}/>
        </div>
    );
};
