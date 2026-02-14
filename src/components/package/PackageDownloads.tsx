import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DownloadRange } from '@/types/package';
import { useMemo } from 'react';

type PackageDownloadsProps = {
    readonly downloads?: DownloadRange | null;
};

export const PackageDownloads: React.FC<PackageDownloadsProps> = (props): React.ReactElement => {
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

    return (
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

            <div className={'h-75 w-full'}>
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
                                    stopColor={'#ef4444'} // red-500
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset={'95%'}
                                    stopColor={'#ef4444'}
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
                            tickFormatter={(value: number) => {
                                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                                return `${value}`;
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e5e5e5', // neutral-200
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'var(--color-bg-popover, #fff)',
                                color: 'var(--color-text-popover)',
                                padding: '12px',
                            }}
                            labelStyle={{color: '#737373', marginBottom: '0.25rem', fontSize: '12px'}}

                            formatter={(value: number | string | Array<number | string> | undefined) => {
                                if (value === undefined) {
                                    return [];
                                }
                                const displayValue = Array.isArray(value) ? value[0] : value;
                                return [
                                    <span
                                        key={'val'}
                                        style={{color: '#ef4444', fontWeight: 600}}
                                    >
                                        {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
                                    </span>,
                                    <span
                                        key={'label'}
                                        style={{color: '#525252'}}
                                    >Downloads</span>,
                                ];
                            }}
                        />
                        <Area
                            type={'monotone'}
                            dataKey={'value'}
                            stroke={'#ef4444'}
                            strokeWidth={1}
                            fillOpacity={1}
                            fill={'url(#colorDownloads)'}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
