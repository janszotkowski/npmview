import { Link } from '@tanstack/react-router';
import { FileQuestion } from 'lucide-react';

export const NotFound = (): React.ReactElement => {
    return (
        <div className={'min-h-[80vh] flex flex-col items-center justify-center p-4 text-center'}>
            <div className={'p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full mb-4'}>
                <FileQuestion className={'w-12 h-12 text-neutral-500 dark:text-neutral-400'}/>
            </div>
            <h1 className={'text-4xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-white'}>Page not found</h1>
            <p className={'text-neutral-600 dark:text-neutral-400 mb-8 max-w-sm'}>
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
            </p>
            <Link
                to={'/'}
                className={'px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium'}
            >
                Back to Home
            </Link>
        </div>
    );
};
