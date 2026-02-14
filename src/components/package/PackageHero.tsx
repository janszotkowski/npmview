import type { PackageDetails } from '@/types/package';
import { InstallCommand } from './InstallCommand';
import { formatDistanceToNow } from 'date-fns';
import { Shield } from 'lucide-react';

type PackageHeroProps = {
    pkg: PackageDetails;
};

export const PackageHero: React.FC<PackageHeroProps> = (props): React.ReactElement => {
    const latestVersion = props.pkg['dist-tags'].latest;
    const publishDate = props.pkg.time[latestVersion];

    return (
        <div className={'relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-black dark:ring-1 dark:ring-white/10'}>
            <div className={'relative z-10 flex flex-col gap-8 p-8 lg:flex-row lg:items-start lg:justify-between lg:p-12'}>
                <div className={'flex-1 space-y-6'}>
                    <div className={'space-y-4'}>
                        <div className={'flex flex-wrap items-baseline gap-3'}>
                            <h1 className={'bg-linear-to-br from-white to-white/60 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl lg:text-6xl'}>
                                {props.pkg.name}
                            </h1>
                            <span className={'rounded-full bg-red-500/10 px-3 py-1 font-mono text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 dark:text-red-400'}>
                                v{latestVersion}
                            </span>
                        </div>
                        <p className={'max-w-2xl text-lg creating-relaxed text-neutral-300 md:text-xl'}>
                            {props.pkg.description}
                        </p>
                    </div>

                    <div className={'flex flex-wrap items-center gap-6 text-sm text-neutral-300'}>
                        {publishDate && (
                            <div className={'flex items-center gap-2'}>
                                <span className={'size-1.5 rounded-full bg-emerald-500'}/>
                                <span>Updated {formatDistanceToNow(new Date(publishDate))} ago</span>
                            </div>
                        )}
                        {props.pkg.license && (
                            <div className={'flex items-center gap-2'}>
                                <Shield className={'size-4'}/>
                                <span>{props.pkg.license}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={'w-full lg:w-auto lg:min-w-[400px]'}>
                    <InstallCommand packageName={props.pkg.name}/>
                </div>
            </div>
        </div>
    );
};
