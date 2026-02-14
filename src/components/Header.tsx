import { Link, useLocation } from '@tanstack/react-router';
import type { ReactElement } from 'react';
import { Github, PackageSearch } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeaderSearchController } from '@/components/HeaderSearchController.tsx';

export const Header: React.FC = (): ReactElement => {
    const location = useLocation();
    const pathname = location.pathname;
    const isPackagePage = pathname.startsWith('/package/');

    return (
        <header className={'sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80'}>
            <div className={'container mx-auto flex h-16 items-center justify-between px-4'}>
                <div className={'flex items-center gap-8 flex-1'}>
                    <Link
                        to={'/'}
                        className={'flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity shrink-0'}
                        aria-label={'npmview home'}
                    >
                        <div
                            className={'flex size-8 items-center justify-center rounded-lg bg-red-600 text-white'}
                            aria-hidden={'true'}
                        >
                            <PackageSearch className={'size-5'}/>
                        </div>
                        <span className={'hidden sm:inline'}>npmview</span>
                    </Link>
                    <HeaderSearchController
                        key={pathname}
                        isPackagePage={isPackagePage}
                    />
                </div>

                <div className={'flex items-center gap-4 shrink-0 ml-4'}>
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
