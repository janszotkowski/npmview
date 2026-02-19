import { formatNumber } from '@/utils/format';

type DownloadsData = {
    name: string;
    downloads: number;
};

type BundleSizeData = {
    name: string;
    size: number;
    gzip: number;
};

type ScoreData = {
    name: string;
    final: number;
    quality: number;
    popularity: number;
    maintenance: number;
};

type ComparisonChartsProps = {
    downloads: DownloadsData[];
    bundleSizes: BundleSizeData[];
    scores: ScoreData[];
};

export const ComparisonCharts = (props: ComparisonChartsProps): React.ReactElement => {
    const maxDownloads = Math.max(...props.downloads.map(d => d.downloads), 1);
    const maxBundleSize = Math.max(...props.bundleSizes.map(b => b.size), 1);
    const maxScore = Math.max(...props.scores.map(s => s.final), 1);

    return (
        <div className={'grid gap-6 md:grid-cols-2 xl:grid-cols-3'}>
            <ChartCard title={'Weekly downloads'}>
                <div className={'space-y-4'}>
                    {props.downloads.map((d) => (
                        <BarChart
                            key={d.name}
                            label={d.name}
                            value={d.downloads}
                            max={maxDownloads}
                            format={(v) => formatNumber(v)}
                            gradient={'from-blue-500 to-cyan-500'}
                        />
                    ))}
                </div>
            </ChartCard>

            <ChartCard title={'Bundle size'}>
                <div className={'space-y-4'}>
                    {props.bundleSizes.map((b) => (
                        <div key={b.name}>
                            <BarChart
                                label={b.name}
                                value={b.size}
                                max={maxBundleSize}
                                format={(v) => `${formatNumber(v / 1024)} KB`}
                                gradient={'from-violet-500 to-purple-500'}
                            />
                            {b.gzip > 0 && (
                                <div className={'mt-1.5 ml-1 text-xs text-neutral-500 dark:text-neutral-400'}>
                                    gzip: {formatNumber(b.gzip / 1024)} KB
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ChartCard>

            <ChartCard title={'Package score'}>
                <div className={'space-y-4'}>
                    {props.scores.map((s) => (
                        <div
                            key={s.name}
                            className={'space-y-1.5'}
                        >
                            <BarChart
                                label={s.name}
                                value={s.final}
                                max={maxScore}
                                format={(v) => `${(v * 100).toFixed(0)}%`}
                                gradient={'from-red-500 to-rose-500'}
                            />
                            <div className={'ml-1 text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5'}>
                                <span>Q {(s.quality * 100).toFixed(0)}%</span>
                                <span className={'mx-1.5'}>·</span>
                                <span>P {(s.popularity * 100).toFixed(0)}%</span>
                                <span className={'mx-1.5'}>·</span>
                                <span>M {(s.maintenance * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </ChartCard>
        </div>
    );
}

type ChartCardProps = {
    title: string;
    children: React.ReactNode;
};

const ChartCard: React.FC<ChartCardProps> = (props): React.ReactElement => {
    return (
        <div className={'rounded-2xl border border-neutral-200/80 bg-white/90 dark:bg-neutral-900/90 dark:border-neutral-800/80 backdrop-blur-sm p-6 shadow-lg shadow-neutral-200/30 dark:shadow-neutral-950/50'}>
            <h3 className={'mb-5 text-base font-semibold text-neutral-900 dark:text-neutral-100'}>
                {props.title}
            </h3>
            {props.children}
        </div>
    );
}

type BarChartProps = {
    label: string;
    value: number;
    max: number;
    format: (value: number) => string;
    gradient?: string;
};

const BarChart: React.FC<BarChartProps> = (props): React.ReactElement => {
    const percentage = (props.value / props.max) * 100;

    return (
        <div>
            <div className={'mb-2 flex items-center justify-between text-sm'}>
                <span className={'font-medium text-neutral-800 dark:text-neutral-200 truncate mr-2'}>{props.label}</span>
                <span className={'text-neutral-600 dark:text-neutral-400 tabular-nums shrink-0'}>{props.format(props.value)}</span>
            </div>
            <div className={'h-2.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden'}>
                <div
                    className={`h-full rounded-full bg-linear-to-r ${props.gradient} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
