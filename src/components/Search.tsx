import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { searchPackages } from '@/server/search.ts';
import { useDebounce } from '@/hooks/useDebounce.ts';
import { SearchInput } from '@/components/SearchInput.tsx';
import { SearchResults } from '@/components/SearchResults.tsx';
import { SearchResultItem } from '@/types/search.ts';

type SearchProps = {
    readonly variant?: 'default' | 'header';
    readonly className?: string;
};

export const Search: React.FC<SearchProps> = (props): React.ReactElement => {
    const {variant = 'default', className} = props;
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState<string>('');
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const debouncedQuery = useDebounce(query, 300);

    const {data, isLoading} = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => searchPackages({data: debouncedQuery}),
        enabled: debouncedQuery.length > 1,
        staleTime: 1000 * 60,
    });

    const results = (data?.objects.map((obj) => obj.package) ?? []) as SearchResultItem[];

    const handleInputChange = (value: string): void => {
        setQuery(value);
        if (value.length > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const location = useLocation();
    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
            inputRef.current?.blur();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Global shortcut ⌘K
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (!isOpen && !query) {
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                return;
            }
            setActiveIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isOpen) {
                return;
            }
            setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const targetName = (activeIndex >= 0 && activeIndex < results.length) ? results[activeIndex].name : query.trim();

            if (targetName) {
                void navigate({to: '/package/$name', params: {name: targetName}});
                setIsOpen(false);
                inputRef.current?.blur();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
            setActiveIndex(-1);
            inputRef.current?.focus();
        }
    };

    const handleFocus = (): void => {
        if (query.length > 0) {
            setIsOpen(true);
        }
    };

    const handleSelect = (index: number): void => {
        setActiveIndex(index);
    };

    return (
        <div
            ref={containerRef}
            className={`relative ${className ?? ''} ${variant === 'header' ? 'flex-1 max-w-xl mx-auto' : 'w-full max-w-2xl'}`}
            onKeyDown={handleKeyDown}
        >
            <SearchInput
                ref={inputRef}
                value={query}
                onChange={handleInputChange}
                isLoading={isLoading}
                onFocus={handleFocus}
                variant={variant}
                aria-expanded={isOpen}
                aria-controls={'search-results-list'}
                aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
            />

            <div
                className={`absolute top-full left-0 right-0 z-50 mt-2 transform transition-all duration-200 ease-out origin-top ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0 visible'
                    : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                }`}
            >
                <SearchResults
                    results={results}
                    activeIndex={activeIndex}
                    onSelect={handleSelect}
                    className={variant === 'header' ? 'mt-0 shadow-lg border border-neutral-200 dark:border-neutral-800' : 'mt-4'}
                />
            </div>
        </div>
    );
};
