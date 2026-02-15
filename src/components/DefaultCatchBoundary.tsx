import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent, Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';

export const DefaultCatchBoundary = ({error}: ErrorComponentProps): React.ReactElement => {
    const router = useRouter();
    const isRoot = useMatch({
        strict: false,
        select: (state) => state.id === rootRouteId,
    });

    console.error(error);

    return (
        <div className={'min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50'}>
            <div className={'w-full max-w-md p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm'}>
                <div className={'flex flex-col items-center text-center space-y-4'}>
                    <div className={'p-3 bg-red-100 dark:bg-red-900/30 rounded-full'}>
                        <svg
                            xmlns={'http://www.w3.org/2000/svg'}
                            width={'24'}
                            height={'24'}
                            viewBox={'0 0 24 24'}
                            fill={'none'}
                            stroke={'currentColor'}
                            strokeWidth={'2'}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                            className={'text-red-600 dark:text-red-500 h-8 w-8'}
                        >
                            <circle
                                cx={'12'}
                                cy={'12'}
                                r={'10'}
                            />
                            <line
                                x1={'12'}
                                x2={'12'}
                                y1={'8'}
                                y2={'12'}
                            />
                            <line
                                x1={'12'}
                                x2={'12.01'}
                                y1={'16'}
                                y2={'16'}
                            />
                        </svg>
                    </div>
                    <h2 className={'text-xl font-semibold'}>Something went wrong!</h2>
                    <p className={'text-neutral-600 dark:text-neutral-400 text-sm'}>
                        {error.message || 'An unexpected error occurred.'}
                    </p>
                    <div className={'flex gap-2 w-full pt-2'}>
                        <button
                            onClick={() => {
                                router.invalidate();
                            }}
                            className={'flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm'}
                        >
                            Try Again
                        </button>
                        {isRoot ? (
                            <Link
                                to={'/'}
                                className={'flex-1 px-4 py-2 bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors font-medium text-sm flex items-center justify-center'}
                            >
                                Home
                            </Link>
                        ) : (
                            <Link
                                to={'/'}
                                className={'flex-1 px-4 py-2 bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors font-medium text-sm flex items-center justify-center'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.history.back();
                                }}
                            >
                                Go Back
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className={'mt-8 max-w-lg'}>
                {import.meta.env.DEV ? <ErrorComponent error={error}/> : null}
            </div>
        </div>
    );
};
