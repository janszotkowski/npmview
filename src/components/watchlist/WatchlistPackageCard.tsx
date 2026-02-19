import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { getPackageManifest, getPackageDownloads, getBundleSize, getPackageScore } from '@/server/package';
import { getGithubStars } from '@/server/github';
import { getSecurityAdvisories } from '@/server/security';
import { updateWatchlistItem, type WatchlistItem } from '@/utils/watchlist';
import { formatNumber } from '@/utils/format';
import { X, Package, Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

type WatchlistPackageCardProps = {
    item: WatchlistItem;
    onRemove: (name: string) => void;
};

export const WatchlistPackageCard: React.FC<WatchlistPackageCardProps> = (props): React.ReactElement => {
    const { data: manifest } = useQuery({
        queryKey: ['package-manifest', props.item.name],
        queryFn: () => getPackageManifest({ data: props.item.name }),
        staleTime: 1000 * 60 * 5,
    });

    const { data: downloads } = useQuery({
        queryKey: ['package-downloads', props.item.name],
        queryFn: () => getPackageDownloads({ data: props.item.name }),
        staleTime: 1000 * 60 * 30,
    });

    const { data: bundleSize } = useQuery({
        queryKey: ['bundle-size', props.item.name],
        queryFn: () => getBundleSize({ data: props.item.name }),
        staleTime: 1000 * 60 * 60,
    });

    const { data: score } = useQuery({
        queryKey: ['package-score', props.item.name],
        queryFn: () => getPackageScore({ data: props.item.name }),
        staleTime: 1000 * 60 * 60,
    });

    const { data: stars } = useQuery({
        queryKey: ['github-stars', props.item.name],
        queryFn: async () => {
            if (!manifest?.repository?.url) return null;
            return getGithubStars({ data: manifest.repository.url });
        },
        enabled: !!manifest?.repository?.url,
        staleTime: 1000 * 60 * 60,
    });

    const { data: securityAdvisories } = useQuery({
        queryKey: ['security-advisories', props.item.name],
        queryFn: () => getSecurityAdvisories({ data: props.item.name }),
        staleTime: 1000 * 60 * 60 * 12,
    });

    const weeklyDownloads = downloads?.downloads.reduce((sum, d) => sum + d.downloads, 0) ?? 0;
    const hasNewVersion = manifest && props.item.lastVersion && manifest.version !== props.item.lastVersion;
    const hasSecurityIssues = (securityAdvisories?.length ?? 0) > 0;

    useEffect(() => {
        if (manifest) {
            updateWatchlistItem(props.item.name, {
                lastChecked: new Date().toISOString(),
                lastVersion: manifest.version,
            });

            if (hasNewVersion && props.item.notifications?.newVersions && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(`New version available: ${props.item.name}`, {
                    body: `Version ${manifest.version} is now available`,
                    icon: '/favicon.ico',
                });
            }
        }
    }, [manifest, props.item.name, hasNewVersion, props.item.notifications?.newVersions]);

    useEffect(() => {
        if (hasSecurityIssues && props.item.notifications?.securityAdvisories && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`Security advisory: ${props.item.name}`, {
                body: `${securityAdvisories!.length} security advisory${securityAdvisories!.length > 1 ? 'ies' : 'y'} found`,
                icon: '/favicon.ico',
            });
        }
    }, [hasSecurityIssues, props.item.name, securityAdvisories, props.item.notifications?.securityAdvisories]);

    return (
        <div className={'group/card relative rounded-2xl border border-neutral-200/80 bg-white/90 dark:bg-neutral-900/90 dark:border-neutral-800/80 backdrop-blur-sm p-6 shadow-lg shadow-neutral-200/30 dark:shadow-neutral-950/50 transition-all hover:shadow-xl hover:shadow-neutral-200/40 dark:hover:shadow-neutral-950/60 hover:border-red-200/60 dark:hover:border-red-900/50'}>
            <button
                onClick={() => props.onRemove(props.item.name)}
                className={'absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 transition-colors'}
                aria-label={`Remove ${props.item.name}`}
            >
                <X className={'h-4 w-4'} />
            </button>

            <div className={'pr-10'}>
                <div className={'flex flex-wrap items-start justify-between gap-2 mb-2'}>
                    <Link
                        to={'/package/$name'}
                        params={{ name: props.item.name }}
                        className={'min-w-0'}
                    >
                        <h3 className={'text-lg font-bold text-neutral-900 group-hover/card:text-red-600 dark:text-neutral-100 dark:group-hover/card:text-red-400 transition-colors truncate'}>
                            {props.item.name}
                        </h3>
                    </Link>
                    <div className={'flex flex-wrap gap-1.5 shrink-0'}>
                        {hasNewVersion && (
                            <span className={'inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300'}>
                                <CheckCircle className={'h-3 w-3'} />
                                New
                            </span>
                        )}
                        {hasSecurityIssues && (
                            <span className={'inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/40 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-300'}>
                                <Shield className={'h-3 w-3'} />
                                {securityAdvisories!.length}
                            </span>
                        )}
                    </div>
                </div>

                {manifest && (
                    <p className={'text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4'}>
                        {manifest.description}
                    </p>
                )}

                <div className={'flex flex-wrap gap-2'}>
                    {manifest?.version && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            <Package className={'h-3.5 w-3.5 shrink-0'} />
                            v{manifest.version}
                            {hasNewVersion && props.item.lastVersion && (
                                <span className={'text-emerald-600 dark:text-emerald-400'}>← {props.item.lastVersion}</span>
                            )}
                        </span>
                    )}
                    {weeklyDownloads > 0 && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            {formatNumber(weeklyDownloads)}/wk
                        </span>
                    )}
                    {bundleSize && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            {formatNumber(bundleSize.size / 1024)} KB
                        </span>
                    )}
                    {score && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            {(score.final * 100).toFixed(0)}%
                        </span>
                    )}
                    {stars != null && stars > 0 && (
                        <span className={'inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300'}>
                            ★ {formatNumber(stars)}
                        </span>
                    )}
                </div>

                {hasSecurityIssues && securityAdvisories && (
                    <div className={'mt-4 rounded-xl border border-red-200/80 dark:border-red-800/50 bg-red-50/80 dark:bg-red-950/30 p-3'}>
                        <div className={'flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-200'}>
                            <AlertTriangle className={'h-4 w-4 shrink-0'} />
                            {securityAdvisories.length} advisory{securityAdvisories.length > 1 ? 'ies' : 'y'}
                        </div>
                        <div className={'mt-2 space-y-1.5'}>
                            {securityAdvisories.slice(0, 3).map((advisory) => (
                                <a
                                    key={advisory.id}
                                    href={advisory.url}
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                    className={'block text-xs text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100 truncate'}
                                >
                                    {advisory.summary}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

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

                {props.item.lastChecked && (
                    <div className={'mt-4 text-xs text-neutral-500 dark:text-neutral-400'}>
                        Checked {new Date(props.item.lastChecked).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                )}
            </div>
        </div>
    );
}
