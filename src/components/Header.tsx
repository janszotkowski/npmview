import { Link } from '@tanstack/react-router';
import { Github, PackageSearch } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ReactElement } from 'react';

export const Header: React.FC = (): ReactElement => {
    return (
        <header className={'sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80'}>
            <div className={'container mx-auto flex h-16 items-center justify-between px-4'}>
                <div className={'flex items-center gap-8'}>
                    <Link
                        to={'/'}
                        className={'flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity'}
                        aria-label={'npmview home'}
                    >
                        <div
                            className={'flex size-8 items-center justify-center rounded-lg bg-red-600 text-white'}
                            aria-hidden={'true'}
                        >
                            <PackageSearch className={'size-5'}/>
                        </div>
                        <span>npmview</span>
                    </Link>

                    <nav
                        className={'hidden md:flex items-center gap-6'}
                        aria-label={'Main navigation'}
                    >
                        <Link
                            to={'/'}
                            className={'text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors'}
                            activeProps={{
                                className: '!text-neutral-900 dark:!text-white font-semibold',
                                'aria-current': 'page',
                            }}
                        >
                            Home
                        </Link>
                        <Link
                            to={'/about'}
                            className={'text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors'}
                            activeProps={{
                                className: '!text-neutral-900 dark:!text-white font-semibold',
                                'aria-current': 'page',
                            }}
                        >
                            About
                        </Link>
                    </nav>
                </div>

                <div className={'flex items-center gap-4'}>
                    <a
                        href={'https://github.com/janszotkowski/npmview'}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={'hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors'}
                        aria-label={'View npmview on GitHub'}
                    >
                        <Github
                            className={'size-5'}
                            aria-hidden={'true'}
                        />
                        <span className={'hidden lg:inline'}>GitHub</span>
                    </a>

                    <div
                        className={'h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block'}
                        aria-hidden={'true'}
                    />

                    <ThemeToggle/>
                </div>
            </div>
        </header>
    );
};
