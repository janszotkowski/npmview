import { getPackageVersions } from '@/server/package';
import { PackageManifest, PackageVersionsResponse } from '@/types/package';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/Skeleton';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { File, HardDrive } from 'lucide-react';
import { formatBytes } from '@/utils/format';

type PackageVersionsProps = {
    readonly pkg: PackageManifest;
};

type VersionListProps = {
    data: PackageVersionsResponse;
};

const VersionList: React.FC<VersionListProps> = (props): React.ReactElement => {
    const versions = [...props.data.versions];
    const [showAllVersions, setShowAllVersions] = useState(false);

    const visibleVersions = showAllVersions ? versions : versions.slice(0, 10);
    const remainingCount = versions.length - visibleVersions.length;

    return (
        <div className={'space-y-4'}>
            <div className={'flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800'}>
                <h3 className={'text-lg font-semibold'}>
                    Version History
                </h3>
                <span className={'text-sm text-neutral-500'}>
                    {versions.length} versions
                </span>
            </div>

            <div className={'divide-y divide-neutral-100 dark:divide-neutral-800'}>
                {visibleVersions.map((version) => {
                    return (
                        <div
                            key={version.v}
                            className={'flex items-center justify-between py-3 hover:bg-neutral-50 -mx-2 px-2 rounded-md transition-colors dark:hover:bg-neutral-900/50'}
                        >
                            <div className={'flex items-center gap-3'}>
                                <span className={'font-mono font-medium text-neutral-900 dark:text-neutral-100'}>
                                    {version.v}
                                </span>
                                {version.v === props.data.latest && (
                                    <span className={'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400'}>
                                        latest
                                    </span>
                                )}
                            </div>
                            <div className={'flex items-center gap-4 text-sm text-neutral-500'}>
                                {version.s > 0 && (
                                    <span className={'hidden items-center gap-1.5 sm:flex'}>
                                        <HardDrive className={'h-3.5 w-3.5 text-neutral-400'}/>
                                        {formatBytes(version.s)}
                                    </span>
                                )}
                                {version.f !== undefined && (
                                    <span className={'hidden items-center gap-1.5 sm:flex'}>
                                        <File className={'h-3.5 w-3.5 text-neutral-400'}/>
                                        {version.f} files
                                    </span>
                                )}
                                <time
                                    dateTime={version.t}
                                    title={new Date(version.t).toLocaleString()}
                                    className={'min-w-25 text-right text-neutral-600'}
                                >
                                    {formatDistanceToNow(new Date(version.t), {addSuffix: true})}
                                </time>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!showAllVersions && remainingCount > 0 && (
                <button
                    type={'button'}
                    onClick={() => setShowAllVersions(true)}
                    className={'w-full cursor-pointer rounded-lg border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'}
                >
                    Load all (+{remainingCount} more)
                </button>
            )}
        </div>
    );
};

export const PackageVersions: React.FC<PackageVersionsProps> = (props): React.ReactElement => {
    const {data, isLoading, error} = useQuery({
        queryKey: ['package', 'versions', props.pkg.name],
        queryFn: () => getPackageVersions({data: props.pkg.name}),
    });

    if (isLoading) {
        return (
            <div className={'space-y-4'}>
                <Skeleton className={'h-8 w-32'}/>
                <div className={'space-y-2'}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton
                            key={i}
                            className={'h-12 w-full'}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={'py-8 text-center text-neutral-500'}>
                Failed to load version history
            </div>
        );
    }

    return <VersionList data={data}/>;
};
