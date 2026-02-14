import type { DownloadRange } from '@/types/package';
import { useMemo } from 'react';
import { Download, Minus, TrendingDown, TrendingUp } from 'lucide-react';

type PackageDownloadsProps = {
    readonly downloads?: DownloadRange | null;
};

export const PackageDownloads: React.FC<PackageDownloadsProps> = (props): React.ReactElement => {
    const {totalDownloads, trend} = useMemo(() => {
        if (!props.downloads || props.downloads.downloads.length === 0) {
            return {totalDownloads: 0, trend: 'neutral'};
        }

        const downloads = props.downloads.downloads;
        const total = downloads.reduce((acc, curr) => acc + curr.downloads, 0);

        const midPoint = Math.floor(downloads.length / 2);
        const firstHalf = downloads.slice(0, midPoint);
        const secondHalf = downloads.slice(midPoint);

        const firstHalfSum = firstHalf.reduce((acc, curr) => acc + curr.downloads, 0);
        const secondHalfSum = secondHalf.reduce((acc, curr) => acc + curr.downloads, 0);

        let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
        if (secondHalfSum > firstHalfSum) {
            trendDirection = 'up';
        } else if (secondHalfSum < firstHalfSum) {
            trendDirection = 'down';
        }

        return {totalDownloads: total, trend: trendDirection};
    }, [props.downloads]);

    return (
        <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
            <div className={'flex items-center gap-2 text-neutral-500 mb-2'}>
                <Download className={'size-4'}/>
                <span className={'text-sm font-medium'}>Downloads</span>
                <span className={'text-xs text-neutral-400'}>(30d)</span>
            </div>
            <div className={'flex items-center gap-2'}>
                <span className={'text-2xl font-bold text-neutral-900 dark:text-white'}>
                    {totalDownloads.toLocaleString()}
                </span>
                {trend === 'up' && <TrendingUp className={'size-8 text-green-500'}/>}
                {trend === 'down' && <TrendingDown className={'size-8 text-red-500'}/>}
                {trend === 'neutral' && <Minus className={'size-8 text-neutral-400'}/>}
            </div>
        </div>
    );
};
