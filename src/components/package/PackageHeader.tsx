import type { PackageDetails } from '@/server/package';
import { ExternalLink, Github, Home } from 'lucide-react';

type PackageHeaderProps = {
    pkg: PackageDetails;
};

export const PackageHeader: React.FC<PackageHeaderProps> = (props): React.ReactElement => {
    return (
        <div className={'relative overflow-hidden rounded-xl bg-neutral-900 p-8 text-white shadow-xl dark:bg-neutral-800'}>
            <div className={'absolute -right-20 -top-20 size-64 rounded-full bg-blue-500/20 blur-3xl'}/>
            <div className={'absolute -bottom-20 -left-20 size-64 rounded-full bg-purple-500/20 blur-3xl'}/>

            <div className={'relative z-10'}>
                <div className={'mb-6 flex flex-wrap items-start justify-between gap-4'}>
                    <div>
                        <div className={'flex items-baseline gap-4'}>
                            <h1 className={'text-4xl font-extrabold tracking-tight md:text-5xl'}>
                                {props.pkg.name}
                            </h1>
                            <span className={'rounded-full bg-neutral-800 px-3 py-1 text-sm font-medium text-neutral-300 ring-1 ring-white/10'}>
                                v{props.pkg['dist-tags'].latest}
                            </span>
                        </div>
                        <p className={'mt-4 max-w-2xl text-lg text-neutral-300 md:text-xl'}>
                            {props.pkg.description}
                        </p>
                    </div>
                </div>

                <div className={'flex flex-wrap items-center gap-6 border-t border-white/10 pt-6'}>
                    <div className={'flex flex-wrap gap-3'}>
                        {props.pkg.keywords?.map((keyword) => (
                            <span
                                key={keyword}
                                className={'rounded-md bg-white/5 px-2.5 py-1 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10'}
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>

                    <div className={'flex flex-1 flex-wrap justify-end gap-4'}>
                        {props.pkg.repository?.url && (
                            <a
                                href={props.pkg.repository.url.replace('git+', '').replace('.git', '')}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                className={'group flex items-center gap-2 text-sm font-medium text-neutral-300 transition-colors hover:text-white'}
                            >
                                <Github className={'size-4 transition-transform group-hover:scale-110'}/>
                                Repository
                            </a>
                        )}
                        {props.pkg.homepage && (
                            <a
                                href={props.pkg.homepage}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                className={'group flex items-center gap-2 text-sm font-medium text-neutral-300 transition-colors hover:text-white'}
                            >
                                <Home className={'size-4 transition-transform group-hover:scale-110'}/>
                                Homepage
                            </a>
                        )}
                        <a
                            href={`https://www.npmjs.com/package/${props.pkg.name}`}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            className={'group flex items-center gap-2 text-sm font-medium text-neutral-300 transition-colors hover:text-white'}
                        >
                            <ExternalLink className={'size-4 transition-transform group-hover:scale-110'}/>
                            NPM
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
