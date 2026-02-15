import { DownloadRange, PackageDownloadsTrend, PackageManifest } from '@/types/package';
import { Suspense, useMemo } from 'react';
import { Await } from '@tanstack/react-router';
import { StatCard } from '@/components/StatCard';
import { Tooltip } from '@/components/Tooltip';

type PackageStatsProps = {
    readonly pkg: PackageManifest;
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

    const formatDownloadCount = (count: number): string => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(count);
    };

    return (
        <StatCard
            title={'Weekly Downloads'}
            value={
                <Tooltip content={totalDownloads.toLocaleString()}>
                    {formatDownloadCount(totalDownloads)}
                </Tooltip>
            }
            trend={{
                direction: trend as PackageDownloadsTrend,
                percentage,
            }}
        />
    );
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

    const formattedSize = formatBytes(unpackedSize).split(' ');

    return (
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            <Suspense
                fallback={
                    <StatCard
                        title={''}
                        loading={true}
                    />
                }
            >
                <Await promise={props.downloads}>
                    {(resolvedDownloads) => <WeeklyDownloads downloads={resolvedDownloads}/>}
                </Await>
            </Suspense>

            <StatCard
                title={'Unpacked Size'}
                value={formattedSize[0]}
                unit={formattedSize[1]}
            />

            <StatCard
                title={'Total Files'}
                value={fileCount}
            />
        </div>
    );
};
