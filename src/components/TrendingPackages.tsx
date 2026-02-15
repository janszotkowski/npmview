import { Link } from '@tanstack/react-router';
import { TrendingUp } from 'lucide-react';

const PACKAGES = [
    {name: 'react', label: 'react'},
    {name: 'next', label: 'nextjs'},
    {name: 'nuxt', label: 'nuxt'},
    {name: 'vite', label: 'vite'},
    {name: 'zod', label: 'zod'},
    {name: 'framer-motion', label: 'framer-motion'},
    {name: 'typescript', label: 'typescript'},
    {name: 'lucide-react', label: 'lucide-react'},
];

export const TrendingPackages: React.FC = (): React.ReactElement => {
    return (
        <div className={'flex flex-col items-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200'}>
            <h2 className={'text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-500 uppercase'}>
                Trending Packages
            </h2>
            <div className={'flex flex-wrap justify-center gap-3'}>
                {PACKAGES.map((pkg) => (
                    <Link
                        key={pkg.name}
                        to={'/package/$name'}
                        params={{name: pkg.name}}
                        className={'group flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-red-500/30 hover:text-red-700 dark:hover:text-red-400 hover:shadow-sm transition-all duration-300'}
                    >
                        <TrendingUp className={'w-3 h-3 text-emerald-500 group-hover:opacity-100 transition-opacity'}/>
                        {pkg.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};
