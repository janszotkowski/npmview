import { twMerge } from 'tailwind-merge';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton: React.FC<SkeletonProps> = ({className, ...props}): React.ReactElement => {
    return (
        <div
            className={twMerge('animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800', className)}
            {...props}
        />
    );
};
