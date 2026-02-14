import { SearchResults } from '@/components/SearchResults.tsx';
import { SearchInput } from '@/components/SearchInput.tsx';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { useQuery } from '@tanstack/react-query';
import { searchPackages } from '@/server/search.ts';

type HeaderSearchControllerProps = {
    isPackagePage: boolean;
};

export const HeaderSearchController: React.FC<HeaderSearchControllerProps> = (props): React.ReactElement => {
    const navigate = useNavigate();
    const [query, setQuery] = useState<string>('');
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    const {data, isLoading} = useQuery({
        queryKey: ['header-search', debouncedQuery],
        queryFn: () => searchPackages({data: debouncedQuery}),
        enabled: debouncedQuery.length > 1,
        staleTime: 1000 * 60,
    });

    const results = data?.objects.map((obj) => obj.package) ?? [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isFocused || results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const targetName = (activeIndex >= 0 && activeIndex < results.length)
                ? results[activeIndex].name
                : query.trim();

            if (targetName) {
                void navigate({to: '/package/$name', params: {name: targetName}});
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsFocused(false);
            setActiveIndex(-1);
        }
    };

    const onChange = (value: string): void => {
        setQuery(value);
        setActiveIndex(-1);
        if (!isFocused) setIsFocused(true);
    };

    if (!props.isPackagePage) {
        return <></>;
    }

    return (
        <div
            ref={containerRef}
            className={'flex-1 max-w-xl mx-auto relative group'}
            onKeyDown={handleKeyDown}
        >
            <SearchInput
                value={query}
                onChange={onChange}
                isLoading={isLoading}
                activeIndex={activeIndex}
                onFocus={() => setIsFocused(true)}
                className={'w-full'}
                variant={'header'}
            />
            {isFocused && (results.length > 0 || (query.length > 1 && isLoading)) && (
                <div className={'absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-lg max-h-[80vh] overflow-y-auto p-2 z-50'}>
                    <SearchResults
                        results={results}
                        activeIndex={activeIndex}
                        onSelect={(idx) => setActiveIndex(idx)}
                        className={'mt-0 pb-0'}
                    />
                </div>
            )}
        </div>
    );
};
