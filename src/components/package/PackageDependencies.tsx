import { PackageManifest } from '@/types/package';
import { Link } from '@tanstack/react-router';
import { lazy, Suspense, useState } from 'react';
import { LayoutList, Network } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';

const DependencyUniverse = lazy(() => import('./DependencyUniverse'));

type PackageDependenciesProps = {
    readonly pkg: PackageManifest;
};

export const PackageDependencies: React.FC<PackageDependenciesProps> = (props): React.ReactElement => {
    const { dependencies, devDependencies, peerDependencies } = props.pkg;
    const hasDependencies = dependencies ?? devDependencies ?? peerDependencies;
    const [view, setView] = useState<'list' | 'universe'>('list');

    if (!hasDependencies) {
        return (
            <div className={'p-8 text-center text-neutral-500'}>
                This package has no dependencies.
            </div>
        );
    }

    return (
        <div className={'space-y-6'}>
            <div className={'flex justify-end px-8 pt-4'}>
                <div className={'inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900'}>
                    <button
                        onClick={() => setView('list')}
                        className={`cursor-pointer flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === 'list'
                            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                            }`}
                    >
                        <LayoutList className={'h-4 w-4'} />
                        List
                    </button>
                    <button
                        onClick={() => setView('universe')}
                        className={`cursor-pointer flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === 'universe'
                            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                            }`}
                    >
                        <Network className={'h-4 w-4'} />
                        Universe
                    </button>
                </div>
            </div>

            {view === 'list' ? (
                <div className={'space-y-8 px-8 pb-8'}>
                    {dependencies && (
                        <DependencyList
                            title={'Dependencies'}
                            dependencies={dependencies}
                            count={Object.keys(dependencies).length}
                        />
                    )}
                    {peerDependencies && (
                        <DependencyList
                            title={'Peer Dependencies'}
                            dependencies={peerDependencies}
                            count={Object.keys(peerDependencies).length}
                        />
                    )}
                    {devDependencies && (
                        <DependencyList
                            title={'Dev Dependencies'}
                            dependencies={devDependencies}
                            count={Object.keys(devDependencies).length}
                        />
                    )}
                </div>
            ) : (
                <div className={'min-h-[500px] border-t border-neutral-200 dark:border-neutral-800'}>
                    <Suspense fallback={
                        <div className={'flex h-[500px] items-center justify-center'}>
                            <div className={'space-y-4 text-center'}>
                                <Skeleton className={'mx-auto h-32 w-32 rounded-full'} />
                                <p className={'text-sm text-neutral-500'}>Loading Universe...</p>
                            </div>
                        </div>
                    }
                    >
                        <DependencyUniverse pkg={props.pkg} />
                    </Suspense>
                </div>
            )}
        </div>
    );
};

type DependencyListProps = {
    title: string;
    dependencies: Record<string, string>;
    count: number;
};

const DependencyList: React.FC<DependencyListProps> = (props): React.ReactElement => {
    return (
        <div>
            <h3 className={'mb-4 flex items-center gap-2 text-lg font-semibold'}>
                {props.title}
                <span className={'rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}>
                    {props.count}
                </span>
            </h3>
            <div className={'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}>
                {Object.entries(props.dependencies).map(([name, version]) => (
                    <Link
                        key={name}
                        to={'/package/$name'}
                        params={{ name }}
                        preload={'intent'}
                        onMouseEnter={() => {
                            const link = document.querySelector(`[href="/package/${name}"]`) as HTMLAnchorElement;
                            if (link) {
                                link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                            }
                        }}
                        className={'group flex flex-col rounded-lg border border-neutral-200 p-3 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900'}
                    >
                        <span className={'font-medium text-neutral-900 group-hover:text-red-700 dark:text-neutral-100 dark:group-hover:text-red-500'}>
                            {name}
                        </span>
                        <span className={'mt-1 text-sm text-neutral-600'}>
                            {version}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
