import { Link } from '@tanstack/react-router';
import { SearchResultItem } from '@/types/search.ts';
import { useRef } from 'react';

type SearchResultCardProps = {
    pkg: SearchResultItem;
};

export const SearchResultCard: React.FC<SearchResultCardProps> = (props): React.ReactElement => {
    const linkRef = useRef<HTMLAnchorElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = linkRef.current?.parentElement?.nextElementSibling?.querySelector('a');
            next?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = linkRef.current?.parentElement?.previousElementSibling?.querySelector('a');
            if (prev) {
                prev.focus();
            } else {
                const input = document.querySelector('input[type="text"]');
                (input as HTMLInputElement)?.focus();
            }
        }
    };

    return (
        <li className={'group'}>
            <Link
                to={'/package/$name'}
                params={{name: props.pkg.name}}
                ref={linkRef}
                onKeyDown={handleKeyDown}
                className={'block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-red-500 dark:hover:border-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 relative'}
                data-search-result-item
            >
                <div className={'flex justify-between items-start'}>
                    <div>
                        <h4 className={'text-xl font-bold text-neutral-900 dark:text-white group-hover:text-red-500 transition-colors'}>
                            {props.pkg.name}
                        </h4>
                        <p className={'text-neutral-600 dark:text-neutral-400 mt-1'}>
                            {props.pkg.description}
                        </p>
                    </div>
                    <div className={'text-right'}>
                        <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}>
                            v{props.pkg.version}
                        </span>
                    </div>
                </div>
                <div className={'mt-4 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400'}>
                    <div className={'flex items-center gap-1'}>
                        <span>by</span>
                        <span className={'font-medium text-neutral-900 dark:text-white'}>{props.pkg.publisher?.username}</span>
                    </div>
                    <span>•</span>
                    <span>{props.pkg.date}</span>
                </div>
            </Link>
        </li>
    );
};
