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
            <div className={'flex flex-col gap-6'}>
                <div className={'flex flex-col gap-4'}>
                    <div className={'flex flex-wrap items-center gap-3'}>
                        <h1 className={'text-3xl font-extrabold text-neutral-900 dark:text-white md:text-5xl'}>
                            {props.pkg.name}
                        </h1>
                        <div className={'flex items-center gap-2'}>
                            <span className={'rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300'}>
                                v{latestVersion}
                            </span>
                            {props.pkg.license && (
                                <span className={'rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}>
                                    {props.pkg.license}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className={'text-lg text-neutral-600 dark:text-neutral-300'}>
                        {props.pkg.description}
                    </p>
                </div>

                <div className={'flex flex-col gap-4 md:flex-row md:items-center md:justify-between'}>
                    <div className={'flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400'}>
                        <Suspense fallback={null}>
                            <Await promise={props.fullPkg}>
                                {(fullPkg) => (
                                    <PublishDate
                                        fullPkg={fullPkg}
                                        latestVersion={latestVersion}
                                    />
                                )}
                            </Await>
                        </Suspense>
                        <div className={'hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600 md:block'}/>
                        <a
                            href={`https://www.npmjs.com/~${props.pkg.maintainers?.[0]?.name}`}
                            target={'_blank'}
                            rel={'noreferrer'}
                            className={'font-medium text-neutral-900 hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400'}
                        >
                            @{props.pkg.maintainers?.[0]?.name || 'unknown'}
                        </a>
                    </div>

                    <div className={'flex items-center gap-3'}>
                        <div className={'flex items-center md:hidden'}>
                            <a
                                href={props.pkg.repository?.url?.replace('git+', '').replace('.git', '')}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                className={'inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'}
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
                        </div>
                        <div className={'hidden md:flex'}>
                            <a
                                href={props.pkg.repository?.url?.replace('git+', '').replace('.git', '')}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                className={'inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'}
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
                        </div>

                        <a
                            href={`https://github.com/${props.pkg.repository?.url?.split('github.com/')[1]?.replace('.git', '')}/archive/refs/heads/main.zip`}
                            className={'inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'}
                        >
                            Download ZIP
                        </a>
                    </div>
                </div>
            </div>

            <div className={'my-8 h-px w-full bg-neutral-200 dark:bg-neutral-800'}/>
        </div>
    );
};
