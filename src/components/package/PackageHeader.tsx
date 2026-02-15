import { PackageDetails, PackageManifest } from '@/types/package';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Star } from 'lucide-react';
import { Suspense } from 'react';
import { Await } from '@tanstack/react-router';

type PackageHeaderProps = {
    readonly pkg: PackageManifest;
    readonly stars: Promise<number | null>;
    readonly fullPkg: Promise<PackageDetails | null>;
};

type GithubStarsProps = {
    stars: number | null;
};

const GithubStars: React.FC<GithubStarsProps> = (props): React.ReactElement => {
    if (props.stars === null) {
        return <span>Star</span>;
    }

    return (
        <>
            <span>Star</span>
            <span className={'ml-1.5 pl-1.5 border-l border-neutral-200 dark:border-neutral-700 text-xs'}>
                {new Intl.NumberFormat('en-US', {notation: 'compact'}).format(props.stars)}
            </span>
        </>
    );
};

type PublishDateProps = {
    fullPkg: PackageDetails | null;
    latestVersion: string;
};

const PublishDate: React.FC<PublishDateProps> = (props): React.ReactNode => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publishDate = (props.fullPkg?.time as any)?.[props.latestVersion] || (props.fullPkg?.time as any)?.modified;

    if (!publishDate) {
        return null;
    }

    return (
        <div className={'flex items-center gap-1.5'}>
            <Clock
                className={'size-4'}
                aria-hidden={'true'}
            />
            <span>Updated {formatDistanceToNow(new Date(publishDate))} ago</span>
        </div>
    );
};

export const PackageHeader: React.FC<PackageHeaderProps> = (props): React.ReactElement => {
    const latestVersion = props.pkg.version;

    return (
        <div className={'mb-8'}>
            <div className={'flex flex-col md:flex-row md:items-start md:justify-between gap-6'}>
                <div className={'space-y-4'}>
                    <div className={'flex items-center gap-4'}>
                        <h1 className={'text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight'}>
                            {props.pkg.name}
                        </h1>
                        <span className={'px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900'}>
                            v{latestVersion}
                        </span>
                        {props.pkg.license && (
                            <span className={'px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'}>
                                {props.pkg.license} LICENSE
                            </span>
                        )}
                    </div>

                    <div className={'flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400'}>
                        <Suspense fallback={null}>
                            <Await promise={props.fullPkg}>
                                {(fullPkg) => <PublishDate fullPkg={fullPkg} latestVersion={latestVersion}/>}
                            </Await>
                        </Suspense>
                        <span aria-hidden={'true'}>•</span>
                        <a
                            href={`https://www.npmjs.com/~${props.pkg.maintainers?.[0]?.name}`}
                            target={'_blank'}
                            rel={'noreferrer'}
                            className={'font-medium hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors'}
                        >
                            @{props.pkg.maintainers?.[0]?.name || 'unknown'}
                        </a>
                    </div>
                </div>

                <div className={'flex items-center gap-3'}>
                    <a
                        href={props.pkg.repository?.url?.replace('git+', '').replace('.git', '')}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors shadow-sm dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800'}
                    >
                        <Star
                            className={'size-4'}
                            aria-hidden={'true'}
                        />
                        <Suspense fallback={<span>Star</span>}>
                            <Await promise={props.stars}>
                                {(resolvedStars) => <GithubStars stars={resolvedStars}/>}
                            </Await>
                        </Suspense>
                    </a>
                    <a
                        href={`https://github.com/${props.pkg.repository?.url?.split('github.com/')[1]?.replace('.git', '')}/archive/refs/heads/main.zip`}
                        className={'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20'}
                    >
                        Download ZIP
                    </a>
                </div>
            </div>

            <div className={'h-px w-full bg-neutral-200 dark:bg-neutral-800 my-8'}/>

            <div className={'space-y-4'}>
                <h2 className={'text-xl md:text-2xl font-bold text-neutral-900 dark:text-white'}>
                    {props.pkg.name.charAt(0).toUpperCase() + props.pkg.name.slice(1)}
                </h2>
                <p className={'text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-4xl'}>
                    {props.pkg.description}
                </p>
            </div>
        </div>
    );
};
