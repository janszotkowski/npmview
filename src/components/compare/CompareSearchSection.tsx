import { Search } from '@/components/Search';

type CompareSearchSectionProps = {
    packageNames: string[];
    onAddPackage: (name: string) => void;
};

export const CompareSearchSection: React.FC<CompareSearchSectionProps> = (props): React.ReactElement => {
    return (
        <section className={'mb-10 mx-auto w-max'}>
            <label className={'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'}>
                Search and add packages to compare
            </label>
            <Search
                variant={'default'}
                className={'w-full max-w-2xl'}
                onSelectPackage={props.onAddPackage}
            />
            {props.packageNames.length > 0 && (
                <div className={'mt-5 flex flex-wrap gap-2'}>
                    {props.packageNames.map((pkg) => (
                        <span
                            key={pkg}
                            className={'inline-flex items-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 px-4 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 ring-1 ring-neutral-200/80 dark:ring-neutral-700/80'}
                        >
                            {pkg}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
}
