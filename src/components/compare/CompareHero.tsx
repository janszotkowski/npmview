export const CompareHero = (): React.ReactElement => {
    return (
        <header className={'text-center mb-12 sm:mb-16'}>
            <h1 className={'text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white'}>
                Compare{' '}
                <span className={'text-transparent bg-clip-text bg-linear-to-r from-red-500 to-rose-500'}>
                    packages
                </span>
            </h1>
            <p className={'mt-3 text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto'}>
                Add npm packages below and see metrics side-by-side — bundle size, downloads, scores, and more.
            </p>
        </header>
    );
}
