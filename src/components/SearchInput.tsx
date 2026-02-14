import * as React from 'react';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Loader2, Search } from 'lucide-react';

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    isLoading?: boolean;
    activeIndex: number;
    onFocus: () => void;
    className?: string;
    variant?: 'default' | 'header';
};

export const SearchInput: React.FC<SearchInputProps> = (props: SearchInputProps): React.ReactElement => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {variant = 'default'} = props;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        props.onChange(e.target.value);
    };

    const isHeader = variant === 'header';

    return (
        <div className={`relative group ${props.className || 'max-w-xl mx-auto'}`}>
            <div className={`absolute inset-y-0 left-0 flex items-center pointer-events-none ${isHeader ? 'pl-3' : 'pl-4'}`}>
                <Search className={`transition-colors text-neutral-400 group-focus-within:text-red-500 ${isHeader ? 'h-4 w-4' : 'h-5 w-5'}`}/>
            </div>
            <input
                ref={inputRef}
                type={'text'}
                value={props.value}
                onChange={onChange}
                onFocus={props.onFocus}
                className={`block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all ${isHeader
                    ? 'pl-9 pr-3 py-2 text-sm'
                    : 'pl-11 pr-4 py-4 text-lg'
                }`}
                placeholder={isHeader ? 'Search packages...' : 'Search for a package (e.g., react, zod, vite)...'}
                autoComplete={'off'}
                autoCorrect={'off'}
                spellCheck={'false'}
                aria-activedescendant={props.activeIndex >= 0 ? `search-result-${props.activeIndex}` : undefined}
                aria-autocomplete={'list'}
                aria-controls={'search-results-list'}
                aria-expanded={props.value.length > 1}
                role={'combobox'}
            />
            <div className={'absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none'}>
                {props.isLoading ? (
                    <Loader2
                        className={'h-5 w-5 animate-spin text-neutral-400'}
                        aria-label={'Loading results'}
                    />
                ) : (
                    <kbd className={'hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-medium'}>
                        ⌘K
                    </kbd>
                )}
            </div>
        </div>
    );
};
