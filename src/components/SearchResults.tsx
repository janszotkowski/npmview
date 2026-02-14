import { SearchResultCard } from '@/components/SearchResultCard.tsx';
import { SearchResultItem } from '@/types/search.ts';

type SearchResultsProps = {
    results: SearchResultItem[];
    activeIndex: number;
    onSelect: (index: number) => void;
    className?: string;
};

export const SearchResults: React.FC<SearchResultsProps> = (props): React.ReactElement => {
    if (props.results.length === 0) {
        return <></>;
    }

    return (
        <div className={`w-full text-left pb-20 ${props.className || 'mt-8 max-w-2xl'}`}>
            <h3 className={'text-lg font-semibold text-neutral-900 dark:text-white mb-4'}>Search Results</h3>
            <ul
                className={'space-y-4'}
                role={'listbox'}
                id={'search-results-list'}
            >
                {props.results.map((pkg, index) => (
                    <SearchResultCard
                        key={pkg.name}
                        pkg={pkg}
                        isActive={index === props.activeIndex}
                        id={`search-result-${index}`}
                        onFocus={() => props.onSelect(index)}
                    />
                ))}
            </ul>
        </div>
    );
};
