import type { ReactElement } from 'react';
import { Link } from '@tanstack/react-router';
import { Package, Trophy } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { TopPackage } from '@/types/package.ts';
import { formatBytes } from '@/utils/format.ts';
import { encodePackageName } from '@/utils/url.ts';

type TopPackagesListProps = {
    readonly packages: TopPackage[];
    readonly title?: string;
};

export const TopPackagesList: React.FC<TopPackagesListProps> = (props): ReactElement => {
    return (
        <section className={'w-full max-w-5xl mx-auto'}>
            {props.title && (
                <div className={'flex items-center justify-between mb-8'}>
                    <h2 className={'text-3xl font-bold flex items-center gap-3 text-neutral-900 dark:text-white'}>
                        <div className={'p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg'}>
                            <Trophy className={'w-6 h-6 text-yellow-600 dark:text-yellow-500'}/>
                        </div>
                        {props.title}
                    </h2>
                </div>
            )}
            <div className={'flex flex-col gap-3'}>
                {props.packages.map((pkg, index) => {
                    const rank = index + 1;
                    const isTop3 = rank <= 3;

                    return (
                        <Link
                            key={pkg.name}
                            to={'/package/$name'}
                            params={{name: encodePackageName(pkg.name)}}
                            preload={'intent'}
                            className={twMerge(
                                'group relative flex items-center gap-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-all duration-200',
                                'hover:border-red-500/50 dark:hover:border-red-500/50 hover:shadow-lg hover:scale-[1.005]',
                                isTop3 ? 'bg-linear-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/10' : '',
                            )}
                        >
                            <div className={twMerge(
                                'shrink-0 flex items-center justify-center w-12 h-12 rounded-lg font-bold text-xl',
                                isTop3
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                                    : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                            )}
                            >
                                #{rank}
                            </div>

                            <div className={'flex-1 min-w-0'}>
                                <div className={'flex items-center gap-3 mb-1'}>
                                    <h3 className={'text-lg font-bold truncate text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors'}>
                                        {pkg.name}
                                    </h3>
                                    {isTop3 && (
                                        <Trophy className={'w-4 h-4 text-yellow-500'}/>
                                    )}
                                </div>
                                <div className={'flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400'}>
                                    <div className={'flex items-center gap-1.5'}>
                                        <Package className={'w-4 h-4'}/>
                                        <span>Total Hits: <span className={'font-medium text-neutral-700 dark:text-neutral-300'}>{pkg.hits.toLocaleString()}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={'hidden sm:flex flex-col items-end gap-1 text-right'}>
                                <span className={'text-sm text-neutral-500 dark:text-neutral-400'}>Bandwidth</span>
                                <span className={'font-mono font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded'}>
                                    {formatBytes(pkg.bandwidth)}
                                </span>
                            </div>

                            <div className={'shrink-0 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 group-hover:translate-x-1 transition-transform'}>
                                <svg
                                    width={'24'}
                                    height={'24'}
                                    viewBox={'0 0 24 24'}
                                    fill={'none'}
                                    xmlns={'http://www.w3.org/2000/svg'}
                                    className={'w-5 h-5'}
                                >
                                    <path
                                        d={'M9 18L15 12L9 6'}
                                        stroke={'currentColor'}
                                        strokeWidth={'2'}
                                        strokeLinecap={'round'}
                                        strokeLinejoin={'round'}
                                    />
                                </svg>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};
