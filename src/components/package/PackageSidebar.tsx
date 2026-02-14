import type { PackageDetails } from '@/types/package';
import { ExternalLink, Github, Home, Tag, Users } from 'lucide-react';

type PackageSidebarProps = {
    pkg: PackageDetails;
};

export const PackageSidebar: React.FC<PackageSidebarProps> = (props): React.ReactElement => {
    return (
        <div className={'space-y-4'}>
            <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                <h3 className={'mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500'}>Links</h3>
                <div className={'space-y-3'}>
                    {props.pkg.repository?.url && (
                        <a
                            href={props.pkg.repository.url.replace('git+', '').replace('.git', '')}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            className={'flex items-center gap-3 text-sm font-medium text-neutral-600 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'}
                        >
                            <Github className={'size-4'}/>
                            Repository
                        </a>
                    )}
                    {props.pkg.homepage && (
                        <a
                            href={props.pkg.homepage}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            className={'flex items-center gap-3 text-sm font-medium text-neutral-600 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'}
                        >
                            <Home className={'size-4'}/>
                            Homepage
                        </a>
                    )}
                    <a
                        href={`https://www.npmjs.com/package/${props.pkg.name}`}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={'flex items-center gap-3 text-sm font-medium text-neutral-600 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'}
                    >
                        <ExternalLink className={'size-4'}/>
                        NPM Page
                    </a>
                </div>
            </div>

            {props.pkg.maintainers && props.pkg.maintainers.length > 0 && (
                <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                    <div className={'flex items-center gap-2 mb-4 text-neutral-500'}>
                        <Users className={'size-4'}/>
                        <h3 className={'text-sm font-semibold uppercase tracking-wider'}>Maintainers</h3>
                    </div>
                    <ul className={'space-y-3'}>
                        {props.pkg.maintainers.map((maintainer) => (
                            <li
                                key={maintainer.name}
                                className={'flex items-center gap-3'}
                            >
                                <div className={'flex size-8 items-center justify-center rounded-full bg-neutral-100 font-medium text-neutral-600 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700'}>
                                    {maintainer.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={'text-sm font-medium text-neutral-700 dark:text-neutral-300'}>{maintainer.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {props.pkg.keywords && props.pkg.keywords.length > 0 && (
                <div className={'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'}>
                    <div className={'flex items-center gap-2 mb-4 text-neutral-500'}>
                        <Tag className={'size-4'}/>
                        <h3 className={'text-sm font-semibold uppercase tracking-wider'}>Keywords</h3>
                    </div>
                    <div className={'flex flex-wrap gap-2'}>
                        {props.pkg.keywords.map((keyword) => (
                            <span
                                key={keyword}
                                className={'rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'}
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
