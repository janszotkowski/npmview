import { Skeleton } from '@/components/Skeleton';

export const PackageSkeleton: React.FC = (): React.ReactElement => {
    return (
        <div className={'min-h-screen bg-neutral-50 pb-20 dark:bg-black'}>
            <div className={'container mx-auto max-w-7xl px-4 py-8'}>
                <div className={'mb-8'}>
                    <div className={'flex items-start justify-between'}>
                        <div className={'space-y-4'}>
                            <Skeleton className={'h-10 w-64'}/>
                            <Skeleton className={'h-6 w-96'}/>
                            <div className={'flex gap-2'}>
                                <Skeleton className={'h-6 w-20 rounded-full'}/>
                                <Skeleton className={'h-6 w-20 rounded-full'}/>
                            </div>
                        </div>
                        <Skeleton className={'h-10 w-32'}/>
                    </div>
                </div>

                <div className={'mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12'}>
                    <div className={'space-y-8 lg:col-span-8'}>
                        <div className={'grid grid-cols-1 gap-4 sm:grid-cols-3'}>
                            <Skeleton className={'h-32 rounded-xl'}/>
                            <Skeleton className={'h-32 rounded-xl'}/>
                            <Skeleton className={'h-32 rounded-xl'}/>
                        </div>

                        <div>
                            <div className={'mb-4 flex gap-2'}>
                                <Skeleton className={'h-10 w-32'}/>
                                <Skeleton className={'h-10 w-32'}/>
                                <Skeleton className={'h-10 w-32'}/>
                            </div>
                            <div className={'h-96 rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900'}>
                                <div className={'space-y-4'}>
                                    <Skeleton className={'h-8 w-3/4'}/>
                                    <Skeleton className={'h-4 w-full'}/>
                                    <Skeleton className={'h-4 w-full'}/>
                                    <Skeleton className={'h-4 w-5/6'}/>
                                    <div className={'my-8 h-px bg-neutral-100 dark:bg-neutral-800'}/>
                                    <Skeleton className={'h-8 w-1/2'}/>
                                    <Skeleton className={'h-4 w-full'}/>
                                    <Skeleton className={'h-4 w-5/6'}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'space-y-8 lg:col-span-4'}>
                        <div className={'rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900'}>
                            <Skeleton className={'h-6 w-32 mb-4'}/>
                            <Skeleton className={'h-12 w-full rounded-lg'}/>
                        </div>

                        <div className={'rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900'}>
                            <div className={'space-y-6'}>
                                <div className={'space-y-2'}>
                                    <Skeleton className={'h-4 w-24'}/>
                                    <Skeleton className={'h-6 w-full'}/>
                                </div>
                                <div className={'space-y-2'}>
                                    <Skeleton className={'h-4 w-24'}/>
                                    <Skeleton className={'h-6 w-full'}/>
                                </div>
                                <div className={'space-y-2'}>
                                    <Skeleton className={'h-4 w-24'}/>
                                    <div className={'flex gap-2'}>
                                        <Skeleton className={'h-8 w-8 rounded-full'}/>
                                        <Skeleton className={'h-8 w-8 rounded-full'}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
