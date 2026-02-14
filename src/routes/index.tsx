import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/')({
    component: Home,
});

function Home() {
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

    return (
        <div className={'flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8'}>
            <div className={'w-full max-w-2xl space-y-8 text-center'}>
                <div className={'space-y-4'}>
                    <h1 className={'text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-neutral-900 dark:text-white'}>
                        npm<span className={'text-red-500'}>view</span>
                    </h1>
                    <p className={'text-lg text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto'}>
                        Fast, detailed, and clean view for any npm package.
                        Enter a package name to get started.
                    </p>
                </div>

                <div className={'relative max-w-xl mx-auto group'}>
                    <div className={'absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'}>
                        <Search className={'h-5 w-5 text-neutral-400 group-focus-within:text-red-500 transition-colors'}/>
                    </div>
                    <input
                        ref={inputRef}
                        type={'text'}
                        className={'block w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all text-lg'}
                        placeholder={'Search for a package (e.g., react, zod, vite)...'}
                    />
                    <div className={'absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none'}>
                        <kbd className={'hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-500 font-medium'}>
                            ⌘K
                        </kbd>
                    </div>
                </div>
            </div>
        </div>
    );
}
