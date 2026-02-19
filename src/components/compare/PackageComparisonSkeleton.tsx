import { Skeleton } from '@/components/Skeleton';

type PackageComparisonSkeletonProps = {
    count: number;
};

export const PackageComparisonSkeleton: React.FC<PackageComparisonSkeletonProps> = (props): React.ReactElement => {
    return (
        <div className={'space-y-10'}>
            <div className={'overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white/90 dark:border-neutral-800/80 dark:bg-neutral-900/90 shadow-lg'}>
                <table className={'w-full min-w-[720px]'}>
                    <thead>
                        <tr className={'border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/50'}>
                            {Array.from({ length: 9 }).map((_, i) => (
                                <th
                                    key={i}
                                    className={'px-5 py-4'}
                                >
                                    <Skeleton className={'h-3 w-20 rounded'} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={'divide-y divide-neutral-100 dark:divide-neutral-800/80'}>
                        {Array.from({ length: props.count }).map((_, i) => (
                            <tr key={i}>
                                {Array.from({ length: 9 }).map((_, j) => (
                                    <td
                                        key={j}
                                        className={'px-5 py-4'}
                                    >
                                        <Skeleton className={'h-4 w-full max-w-24 rounded'} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
