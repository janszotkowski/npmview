const WATCHLIST_STORAGE_KEY = 'npmview_watchlist';

export type WatchlistItem = {
    name: string;
    addedAt: string;
    lastChecked?: string;
    lastVersion?: string;
    notifications?: {
        newVersions: boolean;
        securityAdvisories: boolean;
        breakingChanges: boolean;
    };
};

export function getWatchlist(): WatchlistItem[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
        if (!stored) {
            return [];
        }
        return JSON.parse(stored) as WatchlistItem[];
    } catch {
        return [];
    }
}

export function addToWatchlist(packageName: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    const watchlist = getWatchlist();
    if (watchlist.some(item => item.name === packageName)) {
        return;
    }

    const newItem: WatchlistItem = {
        name: packageName,
        addedAt: new Date().toISOString(),
        notifications: {
            newVersions: true,
            securityAdvisories: true,
            breakingChanges: true,
        },
    };

    watchlist.push(newItem);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        void Notification.requestPermission();
    }
}

export function removeFromWatchlist(packageName: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    const watchlist = getWatchlist();
    const filtered = watchlist.filter(item => item.name !== packageName);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(filtered));
}

export function updateWatchlistItem(
    packageName: string,
    updates: Partial<WatchlistItem>
): void {
    if (typeof window === 'undefined') {
        return;
    }

    const watchlist = getWatchlist();
    const index = watchlist.findIndex(item => item.name === packageName);
    if (index === -1) {
        return;
    }

    watchlist[index] = { ...watchlist[index], ...updates };
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
}

export function isInWatchlist(packageName: string): boolean {
    const watchlist = getWatchlist();
    return watchlist.some(item => item.name === packageName);
}
