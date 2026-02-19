import { Folder } from 'lucide-react';

export const CompareEmptyState = (): React.ReactElement => {
    return (
        <div className={'p-16 sm:p-20 text-center'}>
            <div className={'mx-auto w-14 h-14 rounded-2xl bg-linear-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center mb-5'}>
                <Folder className={'w-7 h-7 text-red-500 dark:text-red-400'} />
            </div>
            <h2 className={'text-lg font-semibold text-neutral-800 dark:text-neutral-200'}>
                No packages selected
            </h2>
            <p className={'mt-2 text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto'}>
                Use the search above to add packages. You can compare bundle size, weekly downloads, health score, and more.
            </p>
        </div>
    );
}
