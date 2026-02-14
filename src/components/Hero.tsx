export const Hero: React.FC = (): React.ReactElement => {
    return (
        <div className={'space-y-4 mt-10'}>
            <h1 className={'text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-neutral-900 dark:text-white'}>
                npm<span className={'text-red-500'}>view</span>
            </h1>
            <p className={'text-lg text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto'}>
                Fast, detailed, and clean view for any npm package.
                Enter a package name to get started.
            </p>
        </div>
    );
}
