import { Search } from '@/components/Search';

type WatchlistSearchSectionProps = {
    onAddPackage: (name: string) => void;
};

export const WatchlistSearchSection: React.FC<WatchlistSearchSectionProps> = (props): React.ReactElement => {
    return (
        <section className={'mb-10 mx-auto w-max'}>
            <label className={'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'}>
                Add a package to your watchlist
            </label>
            <Search
                variant={'default'}
                className={'w-full max-w-2xl'}
                onSelectPackage={props.onAddPackage}
            />
        </section>
    );
}
