import { useState, useEffect } from 'react';
import { getWatchlist, addToWatchlist, removeFromWatchlist, type WatchlistItem } from '@/utils/watchlist';
import { WatchlistHero } from './WatchlistHero';
import { WatchlistSearchSection } from './WatchlistSearchSection';
import { WatchlistEmptyState } from './WatchlistEmptyState';
import { WatchlistPackageCard } from './WatchlistPackageCard';

export const WatchlistPage: React.FC = (): React.ReactElement => {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        setWatchlist(getWatchlist());
        if ('Notification' in window) {
            setShowNotifications(Notification.permission === 'granted');
        }
    }, []);

    const handleAdd = (name: string): void => {
        const trimmed = name.trim();
        if (trimmed) {
            addToWatchlist(trimmed);
            setWatchlist(getWatchlist());
        }
    };

    const handleRemove = (name: string): void => {
        removeFromWatchlist(name);
        setWatchlist(getWatchlist());
    };

    const handleRequestNotifications = async (): Promise<void> => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            setShowNotifications(permission === 'granted');
        }
    };

    return (
        <div className={'min-h-screen pb-20 relative'}>
            <div className={'container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14'}>
                <WatchlistHero
                    showNotificationButton={!showNotifications && 'Notification' in window}
                    onRequestNotifications={handleRequestNotifications}
                />
                <WatchlistSearchSection onAddPackage={handleAdd} />

                {watchlist.length === 0 ? (
                    <WatchlistEmptyState />
                ) : (
                    <div className={'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}>
                        {watchlist.map((item) => (
                            <WatchlistPackageCard
                                key={item.name}
                                item={item}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
