import type { PackageManifest } from '@/types/package';
import { Box, Github, Home } from 'lucide-react';

type PackageSidebarProps = {
    readonly pkg: PackageManifest;
};

export const PackageSidebar: React.FC<PackageSidebarProps> = (props): React.ReactElement => {
    return (
        <div className={'space-y-6'}>
            <div className={'rounded-xl bg-white p-6 shadow-sm border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800'}>
                <h3 className={'mb-4 text-xs font-bold uppercase tracking-wider text-neutral-600'}>Links</h3>
                <div className={'space-y-3'}>
                    {props.pkg.homepage && (
                        <a
                            href={props.pkg.homepage}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            className={'flex items-center gap-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'}
                        >
                            <Home className={'size-4'}/>
                            Homepage
                        </a>
                    )}
                    {props.pkg.repository?.url && (
                        <a
                            href={props.pkg.repository.url.replace('git+', '').replace('.git', '')}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            className={'flex items-center gap-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'}
                        >
                            <Github className={'size-4'}/>
                            Repository
                        </a>
                    )}
                    <a
                        href={`https://www.npmjs.com/package/${props.pkg.name}`}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={'flex items-center gap-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'}
                    >
                        <Box className={'size-4'}/>
                        NPM Page
                    </a>
                </div>
            </div>

            {props.pkg.maintainers && props.pkg.maintainers.length > 0 && (
                <div className={'rounded-xl bg-white p-6 shadow-sm border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800'}>
                    <h3 className={'mb-4 text-xs font-bold uppercase tracking-wider text-neutral-600'}>Maintainers</h3>
                    <ul className={'space-y-3'}>
                        {props.pkg.maintainers.map((maintainer) => (
                            <li key={maintainer.name}>
                                <a
                                    href={`https://www.npmjs.com/~${maintainer.name}`}
                                    target={'_blank'}
                                    rel={'noreferrer'}
                                    className={'flex items-center gap-3 group'}
                                >
                                    <div className={'flex size-8 items-center justify-center rounded-full bg-neutral-100 font-medium text-neutral-600 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700'}>
                                        {maintainer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={'flex flex-col'}>
                                        <span className={'text-sm font-medium text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100 transition-colors'}>
                                            {maintainer.name}
                                        </span>
                                        <span className={'text-xs text-neutral-500'}>{maintainer.email}</span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {props.pkg.keywords && props.pkg.keywords.length > 0 && (
                <div className={'rounded-xl bg-white p-6 shadow-sm border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800'}>
                    <h3 className={'mb-4 text-xs font-bold uppercase tracking-wider text-neutral-600'}>Keywords</h3>
                    <div className={'flex flex-wrap gap-2'}>
                        {props.pkg.keywords.map((keyword) => (
                            <span
                                key={keyword}
                                className={'rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'}
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
