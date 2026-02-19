import { Bell } from 'lucide-react';

type WatchlistHeroProps = {
    showNotificationButton: boolean;
    onRequestNotifications: () => void;
};

export const WatchlistHero: React.FC<WatchlistHeroProps> = (props): React.ReactElement => {
    return (
        <header className={'text-center mb-12 sm:mb-16'}>
            <h1 className={'text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white'}>
                Your{' '}
                <span className={'text-transparent bg-clip-text bg-linear-to-r from-red-500 to-rose-500'}>
                    watchlist
                </span>
            </h1>
            <p className={'mt-3 text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto'}>
                Track npm packages and get notified about new versions and security advisories.
            </p>
            {props.showNotificationButton && (
                <button
                    onClick={props.onRequestNotifications}
                    className={'mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-700/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors shadow-sm'}
                >
                    <Bell className={'h-4 w-4'} />
                    Enable notifications
                </button>
            )}
        </header>
    );
}
