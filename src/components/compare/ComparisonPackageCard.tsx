import { Link } from '@tanstack/react-router';
import { X, ExternalLink, Download, Package, Shield, Star } from 'lucide-react';
import { formatNumber } from '@/utils/format';
import type { PackageComparisonData } from './PackageComparison';

type ComparisonPackageCardProps = {
    pkg: PackageComparisonData;
    onRemove: (name: string) => void;
};

export const ComparisonPackageCard = (props: ComparisonPackageCardProps): React.ReactElement => {
    const manifest = props.pkg.data.manifest;
    const downloads = props.pkg.data.downloads;
    const bundleSize = props.pkg.data.bundleSize;
    const score = props.pkg.data.score;
    const stars = props.pkg.data.stars;

    const weeklyDownloads = downloads?.downloads.reduce((sum, d) => sum + d.downloads, 0) ?? 0;

    return (
        <div className={'group/card relative rounded-2xl border border-neutral-200/80 bg-white/90 dark:bg-neutral-900/90 dark:border-neutral-800/80 backdrop-blur-sm p-6 shadow-lg shadow-neutral-200/30 dark:shadow-neutral-950/50 transition-all hover:shadow-xl hover:shadow-neutral-200/40 dark:hover:shadow-neutral-950/60 hover:border-red-200/60 dark:hover:border-red-900/50'}>
            <button
                onClick={() => props.onRemove(props.pkg.name)}
                className={'absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 transition-colors'}
                aria-label={`Remove ${props.pkg.name}`}
            >
                <X className={'h-4 w-4'} />
            </button>

            <div className={'pr-10'}>
                <Link
                    to={'/package/$name'}
                    params={{ name: props.pkg.name }}
                    className={'block'}
                >
                    <h3 className={'text-lg font-bold text-neutral-900 group-hover/card:text-red-600 dark:text-neutral-100 dark:group-hover/card:text-red-400 transition-colors truncate pr-2'}>
                        {props.pkg.name}
                    </h3>
                </Link>

                {manifest && (
                    <p className={'mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2'}>
                        {manifest.description}
                    </p>
                )}

                <div className={'mt-5 flex flex-wrap gap-2'}>
                    {manifest?.version && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            <Package className={'h-3.5 w-3.5 shrink-0'} />
                            v{manifest.version}
                        </span>
                    )}
                    {weeklyDownloads > 0 && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            <Download className={'h-3.5 w-3.5 shrink-0'} />
                            {formatNumber(weeklyDownloads)}/wk
                        </span>
                    )}
                    {bundleSize && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            <Package className={'h-3.5 w-3.5 shrink-0'} />
                            {formatNumber(bundleSize.size / 1024)} KB
                        </span>
                    )}
                    {score && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            <Shield className={'h-3.5 w-3.5 shrink-0'} />
                            {(score.final * 100).toFixed(0)}%
                        </span>
                    )}
                    {stars !== null && stars > 0 && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            <Star className={'h-3.5 w-3.5 shrink-0'} />
                            {formatNumber(stars)} ★
                        </span>
                    )}
                </div>

                {manifest?.repository?.url && (
                    <a
                        href={manifest.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={'mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors'}
                    >
                        <ExternalLink className={'h-3.5 w-3.5'} />
                        Repository
                    </a>
                )}
            </div>
        </div>
    );
}
