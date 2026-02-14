import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DownloadRange, PackageDetails } from '@/server/package';
import { useMemo } from 'react';
import { Archive, FileCode, Scale } from 'lucide-react';

type PackageStatsProps = {
    readonly downloads?: DownloadRange | null;
    readonly pkg: PackageDetails;
};

export const PackageStats: React.FC<PackageStatsProps> = (props): React.ReactElement => {
    const chartData = useMemo(() => {
        if (!props.downloads) {
            return [];
        }
        return props.downloads.downloads.map(d => ({
            date: new Date(d.day).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
            value: d.downloads,
            originalDate: d.day,
        }));
    }, [props.downloads]);

    const totalDownloads = useMemo(() => {
        return props.downloads?.downloads.reduce((acc, curr) => acc + curr.downloads, 0) || 0;
    }, [props.downloads]);

    const latestVersion = props.pkg.versions[props.pkg['dist-tags'].latest];
    const unpackedSize = latestVersion?.dist.unpackedSize || 0;
    const fileCount = latestVersion?.dist.fileCount;

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) {
            return '0 B';
        }
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const maxSize = 5 * 1024 * 1024;
    const sizePercentage = Math.min((unpackedSize / maxSize) * 100, 100);

    const getSizeColor = (bytes: number): string => {
        if (bytes < 100 * 1024) {
            return 'bg-emerald-500';
        }
        if (bytes < 1024 * 1024) {
            return 'bg-yellow-500';
        }
        return 'bg-red-500';
    };

    const getSizeLabel = (bytes: number): string => {
        if (bytes < 50 * 1024) {
            return 'Tiny';
        }
        if (bytes < 500 * 1024) {
            return 'Small';
        }
        if (bytes < 2 * 1024 * 1024) {
            return 'Medium';
        }
        if (bytes < 10 * 1024 * 1024) {
            return 'Large';
        }
        return 'Huge';
    };

    return (
        <div className={'grid gap-6'}>
            <div className={'grid gap-4 sm:grid-cols-3'}>
                <div className={'rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                    <div className={'flex items-center gap-2 text-neutral-500'}>
                        <Scale className={'size-4'}/>
                        <span className={'text-sm font-medium'}>Unpacked Size</span>
                    </div>
                    <div className={'mt-2'}>
                        <div className={'flex items-end gap-2'}>
                            <span className={'text-2xl font-bold'}>{formatBytes(unpackedSize)}</span>
                            <span className={`mb-1 text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 ${unpackedSize < 1024 * 1024 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {getSizeLabel(unpackedSize)}
                            </span>
                        </div>
                        <div className={'mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800'}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getSizeColor(unpackedSize)}`}
                                style={{width: `${sizePercentage}%`}}
                            />
                        </div>
                    </div>
                </div>

                <div className={'rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                    <div className={'flex items-center gap-2 text-neutral-500'}>
                        <FileCode className={'size-4'}/>
                        <span className={'text-sm font-medium'}>Files</span>
                    </div>
                    <div className={'mt-2'}>
                        <span className={'text-2xl font-bold'}>{fileCount?.toLocaleString() || 'N/A'}</span>
                    </div>
                </div>

                <div className={'rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                    <div className={'flex items-center gap-2 text-neutral-500'}>
                        <Archive className={'size-4'}/>
                        <span className={'text-sm font-medium'}>License</span>
                    </div>
                    <div className={'mt-2'}>
                        <span className={'text-2xl font-bold'}>{props.pkg.license || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <div className={'mb-6 flex items-baseline justify-between'}>
                    <div>
                        <h3 className={'text-lg font-semibold'}>Downloads</h3>
                        <p className={'text-sm text-neutral-500'}>Last month</p>
                    </div>
                    <div className={'text-right'}>
                        <span className={'text-2xl font-bold block'}>{totalDownloads.toLocaleString()}</span>
                        <span className={'text-xs text-neutral-500'}>Total</span>
                    </div>
                </div>

                <div className={'h-[300px] w-full'}>
                    <ResponsiveContainer
                        width={'100%'}
                        height={'100%'}
                    >
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient
                                    id={'colorDownloads'}
                                    x1={'0'}
                                    y1={'0'}
                                    x2={'0'}
                                    y2={'1'}
                                >
                                    <stop
                                        offset={'5%'}
                                        stopColor={'#3b82f6'}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset={'95%'}
                                        stopColor={'#3b82f6'}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey={'date'}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={30}
                                tick={{fontSize: 12, fill: '#737373'}}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{fontSize: 12, fill: '#737373'}}
                                tickFormatter={(value) => {
                                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                                    return value;
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    backgroundColor: 'var(--color-bg-popover, #fff)',
                                    color: 'var(--color-text-popover)',
                                }}
                                labelStyle={{color: '#737373', marginBottom: '0.25rem'}}
                                formatter={(value: number | string | Array<number | string> | undefined) => [
                                    typeof value === 'number' ? value.toLocaleString() : value,
                                    'Downloads',
                                ]}
                            />
                            <Area
                                type={'monotone'}
                                dataKey={'value'}
                                stroke={'#3b82f6'}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={'url(#colorDownloads)'}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
