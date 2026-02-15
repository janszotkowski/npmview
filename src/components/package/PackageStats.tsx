import { DownloadRange, PackageDetails } from '@/types/package';
import { Suspense, useMemo } from 'react';
import { InstallCommand } from './InstallCommand';
import { Await } from '@tanstack/react-router';
import { StatCard } from '@/components/StatCard';

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

        return {
            totalDownloads: total,
            trend: trendDirection,
            percentage: Math.abs(percentChange),
        } as const;
    }, [downloads]);

    return (
        <StatCard
            title={'Weekly Downloads'}
            value={totalDownloads.toLocaleString()}
            trend={{
                direction: trend as 'up' | 'down' | 'neutral',
                percentage,
            }}
        />
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

    const formattedSize = formatBytes(unpackedSize).split(' ');

    return (
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
            <Suspense
                fallback={<StatCard
                    title={''}
                    loading={true}
                />}
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

            <InstallCommand packageName={props.pkg.name}/>
        </div>
    );
};
