import type { PackageManifest } from '@/types/package';
import { Box, Github, Home } from 'lucide-react';

type PackageSidebarProps = {
    readonly pkg: PackageManifest;
};

export const PackageSidebar: React.FC<PackageSidebarProps> = (props): React.ReactElement => {
    return (
        <div className={'space-y-8'}>
            <h3 className={'mb-3 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100'}>
                Resources
            </h3>
            <div className={'space-y-3'}>
                {props.pkg.homepage && (
                    <a
                        href={props.pkg.homepage}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={'flex items-center gap-3 text-sm font-medium text-neutral-600 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'}
                    >
                        <Home className={'size-4'}/>
                        <span>Homepage</span>
                    </a>
                )}
                {props.pkg.repository?.url && (
                    <a
                        href={props.pkg.repository.url.replace('git+', '').replace('.git', '')}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={'flex items-center gap-3 text-sm font-medium text-neutral-600 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'}
                    >
                        <Github className={'size-4'}/>
                        <span>Repository</span>
                    </a>
                )}
                <a
                    href={`https://www.npmjs.com/package/${props.pkg.name}`}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    className={'flex items-center gap-3 text-sm font-medium text-neutral-600 transition-colors hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'}
                >
                    <Box className={'size-4'}/>
                    <span>NPM Page</span>
                </a>
            </div>

            {props.pkg.maintainers && props.pkg.maintainers.length > 0 && (
                <div>
                    <h3 className={'mb-3 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100'}>
                        Maintainers
                    </h3>
                    <ul className={'space-y-3'}>
                        {props.pkg.maintainers.map((maintainer) => (
                            <li key={maintainer.name}>
                                <a
                                    href={`https://www.npmjs.com/~${maintainer.name}`}
                                    target={'_blank'}
                                    rel={'noreferrer'}
                                    className={'group flex items-center gap-3'}
                                >
                                    <div className={'flex size-8 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700'}>
                                        <span className={'text-xs font-bold text-neutral-600 dark:text-neutral-300'}>
                                            {maintainer.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className={'text-sm font-medium text-neutral-900 transition-colors group-hover:text-red-600 dark:text-neutral-200 dark:group-hover:text-red-500'}>
                                        {maintainer.name}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {props.pkg.engines && (props.pkg.engines.node || props.pkg.engines.npm) && (
                <div>
                    <h3 className={'mb-3 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100'}>
                        Engine Requirements
                    </h3>
                    <div className={'space-y-2'}>
                        {props.pkg.engines.node && (
                            <div className={'flex items-center justify-between text-sm'}>
                                <span className={'text-neutral-600 dark:text-neutral-400'}>Node</span>
                                <span className={'font-mono font-medium text-neutral-900 dark:text-neutral-100'}>
                                    {props.pkg.engines.node}
                                </span>
                            </div>
                        )}
                        {props.pkg.engines.npm && (
                            <div className={'flex items-center justify-between text-sm'}>
                                <span className={'text-neutral-600 dark:text-neutral-400'}>npm</span>
                                <span className={'font-mono font-medium text-neutral-900 dark:text-neutral-100'}>
                                    {props.pkg.engines.npm}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {props.pkg.keywords && props.pkg.keywords.length > 0 && (
                <div>
                    <h3 className={'mb-3 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100'}>
                        Keywords
                    </h3>
                    <div className={'flex flex-wrap gap-2'}>
                        {props.pkg.keywords.map((keyword) => (
                            <span
                                key={keyword}
                                className={'rounded bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'}
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
