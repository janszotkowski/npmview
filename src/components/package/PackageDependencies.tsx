import { PackageDetails } from '@/types/package';
import { Link } from '@tanstack/react-router';

type PackageDependenciesProps = {
    readonly pkg: PackageDetails;
};

export const PackageDependencies: React.FC<PackageDependenciesProps> = (props): React.ReactElement => {
    const latestVersion = props.pkg['dist-tags'].latest;
    const currentVersion = props.pkg.versions[latestVersion];

    if (!currentVersion) {
        return (
            <div className={'p-8 text-center text-neutral-500'}>
                No version information available.
            </div>
        );
    }

    const {dependencies, devDependencies, peerDependencies} = currentVersion;
    const hasDependencies = dependencies ?? devDependencies ?? peerDependencies;

    if (!hasDependencies) {
        return (
            <div className={'p-8 text-center text-neutral-500'}>
                This package has no dependencies.
            </div>
        );
    }

    return (
        <div className={'space-y-8'}>
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
                        params={{name}}
                        preload={'intent'}
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
