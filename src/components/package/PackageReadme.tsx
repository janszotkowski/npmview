import React, { Suspense, lazy } from 'react';
import { Await } from '@tanstack/react-router';

const ReadmeContentLazy = lazy(() => import('./PackageReadmeContent'));

type PackageReadmeProps = {
    readonly readme: Promise<string | null> | string | undefined;
};

export const PackageReadme: React.FC<PackageReadmeProps> = (props): React.ReactElement => {
    const readmePromise = props.readme instanceof Promise ? props.readme : Promise.resolve(props.readme || null);

    return (
        <Suspense fallback={<div className={'h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-lg'}/>}>
            <Await promise={readmePromise}>
                {(content) => (
                    <Suspense fallback={<div className={'h-32 animate-pulse bg-neutral-50 dark:bg-neutral-900 rounded-lg'}/>}>
                        <ReadmeContentLazy content={content}/>
                    </Suspense>
                )}
            </Await>
        </Suspense>
    );
};
