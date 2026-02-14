import { SearchResultCard } from '@/components/SearchResultCard.tsx';
import { SearchResultItem } from '@/types/search.ts';

type SearchResultsProps = {
    results: SearchResultItem[];
};

export const SearchResults: React.FC<SearchResultsProps> = (props): React.ReactElement => {
    if (props.results.length === 0) {
        return <></>;
    }

    return (
        <div className={'mt-8 w-full max-w-2xl text-left'}>
            <h3 className={'text-lg font-semibold text-neutral-900 dark:text-white mb-4'}>Search Results</h3>
            <ul className={'space-y-4'}>
                {props.results.map((pkg) => (
                    <SearchResultCard
                        key={pkg.name}
                        pkg={pkg}
                    />
                ))}
            </ul>
        </div>
    );
};
