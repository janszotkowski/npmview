import { PackageDetails } from '@/types/package';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

type PackageVersionsProps = {
    readonly pkg: PackageDetails;
};

export const PackageVersions: React.FC<PackageVersionsProps> = (props): React.ReactElement => {
    const versions = Object.keys(props.pkg.versions).reverse();
    const time = props.pkg.time;
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
                    const date = time[version];
                    return (
                        <div
                            key={version}
                            className={'flex items-center justify-between py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 -mx-2 px-2 rounded-md transition-colors'}
                        >
                            <div className={'flex items-center gap-3'}>
                                <span className={'font-mono font-medium text-neutral-900 dark:text-neutral-100'}>
                                    {version}
                                </span>
                                {version === props.pkg['dist-tags'].latest && (
                                    <span className={'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400'}>
                                        latest
                                    </span>
                                )}
                            </div>
                            {date && (
                                <time
                                    dateTime={date}
                                    title={new Date(date).toLocaleString()}
                                    className={'text-sm text-neutral-500'}
                                >
                                    {formatDistanceToNow(new Date(date), {addSuffix: true})}
                                </time>
                            )}
                        </div>
                    );
                })}
            </div>

            {!showAllVersions && remainingCount > 0 && (
                <button
                    type={'button'}
                    onClick={() => setShowAllVersions(true)}
                    className={'w-full rounded-lg border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors cursor-pointer'}
                >
                    Load all (+{remainingCount} more)
                </button>
            )}
        </div>
    );
};
