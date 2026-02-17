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
        <div className={`w-full text-left ${props.className || ''} mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800 overscroll-contain`}>
            <h3 className={'text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-500 uppercase mb-3 px-2'}>
                Search Results
            </h3>
            <ul
                className={'space-y-2'}
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
