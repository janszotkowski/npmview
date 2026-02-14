import { Link } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Footer: React.FC = (): ReactElement => {
    return (
        <footer className={'w-full border-t border-neutral-200 bg-white py-6 dark:border-neutral-800 dark:bg-neutral-950'}>
            <div className={'container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row'}>
                <div className={'text-center text-sm text-neutral-500 md:text-left dark:text-neutral-400'}>
                    <p>
                        This is a hobby project for learning purposes. Not affiliated with npm, Inc.
                    </p>
                </div>

                <nav
                    className={'flex items-center gap-6'}
                    aria-label={'Footer navigation'}
                >
                    <Link
                        to={'/'}
                        className={'text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors'}
                    >
                        Home
                    </Link>
                    <Link
                        to={'/about'}
                        className={'text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors'}
                    >
                        About
                    </Link>
                </nav>
            </div>
        </footer>
    );
};
