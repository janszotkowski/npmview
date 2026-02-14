import { Link } from '@tanstack/react-router';
import { SearchResultItem } from '@/types/search.ts';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type SearchResultCardProps = {
    pkg: SearchResultItem;
    isActive: boolean;
    id: string;
    onFocus: () => void;
};

export const SearchResultCard: React.FC<SearchResultCardProps> = (props): React.ReactElement => {
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (props.isActive) {
            linkRef.current?.focus();
            linkRef.current?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
        }
    }, [props.isActive]);

    return (
        <li
            className={'group'}
            role={'option'}
            aria-selected={props.isActive}
            id={props.id}
        >
            <Link
                to={'/package/$name'}
                params={{name: props.pkg.name}}
                ref={linkRef}
                onFocus={props.onFocus}
                className={twMerge(
                    'block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-colors relative outline-none',
                    'hover:border-red-500 dark:hover:border-red-500',
                    props.isActive ? 'ring-2 ring-red-500 border-red-500 z-10' : '',
                )}
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
