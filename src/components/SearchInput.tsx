import * as React from 'react';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Loader2, Search } from 'lucide-react';

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    isLoading?: boolean;
};

export const SearchInput: React.FC<SearchInputProps> = (props: SearchInputProps): React.ReactElement => {
    const inputRef = useRef<HTMLInputElement>(null);

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

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const firstResult = document.querySelector('[data-search-result-item]');
            (firstResult as HTMLElement)?.focus();
        }
    };

    return (
        <div className={'relative max-w-xl mx-auto group'}>
            <div className={'absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'}>
                <Search className={'h-5 w-5 transition-colors text-neutral-400 group-focus-within:text-red-500'}/>
            </div>
            <input
                ref={inputRef}
                type={'text'}
                value={props.value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className={'block w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all text-lg'}
                placeholder={'Search for a package (e.g., react, zod, vite)...'}
                autoComplete={'off'}
                autoCorrect={'off'}
                spellCheck={'false'}
            />
            <div className={'absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none'}>
                {props.isLoading ? (
                    <Loader2 className={'h-5 w-5 animate-spin text-neutral-400'}/>
                ) : (
                    <kbd className={'hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-500 font-medium'}>
                        ⌘K
                    </kbd>
                )}
            </div>
        </div>
    );
};
