export const BackgroundGradient: React.FC = (): React.ReactElement => {
    return (
        <div className={'fixed inset-0 pointer-events-none z-0 overflow-hidden'}>
            <div className={'absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-red-100/80 to-transparent dark:from-red-900/20 dark:to-transparent blur-3xl'}/>
            <div className={'absolute top-0 right-0 w-150 h-150 bg-linear-to-bl from-blue-100/80 to-transparent dark:from-blue-900/20 dark:to-transparent blur-3xl'}/>
            <div className={'absolute top-0 left-0 w-150 h-150 bg-linear-to-br from-purple-100/80 to-transparent dark:from-purple-900/20 dark:to-transparent blur-3xl'}/>
        </div>
    );
};
