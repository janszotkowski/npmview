export const Hero: React.FC = (): React.ReactElement => {
    return (
        <div className={'space-y-6 mt-2'}>
            <h1 className={'text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-neutral-900 dark:text-white leading-tight'}>
                Fast, beautiful<br/>
                <span className={'text-transparent bg-clip-text bg-linear-to-r from-red-500 to-purple-600'}>package</span>{' '}
                <span className={'text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400'}>insights.</span>
            </h1>
            <p className={'text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed'}>
                The premium tool for exploring and analyzing npm packages with
                ease. Instant bundle sizes, dependency graphs, and health scores.
            </p>
        </div>
    );
};
