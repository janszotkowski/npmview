export const CACHE_TTL = {
    MANIFEST: 3600,
    README: 7200,
    DOWNLOADS: 1800,
    BUNDLE_SIZE: 86400,
    SCORE: 86400,
    VERSIONS: 3600,
    SECURITY: 43200,
    GITHUB_STARS: 3600,
    SEARCH: 1800,
    TOP_PACKAGES: 3600,
} as const;

/**
 * Request deduplication map
 * Prevents duplicate concurrent requests for the same resource
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pendingRequests = new Map<string, Promise<any>>();


export async function getDeduplicatedRequest<T>(
    key: string,
    fetcher: () => Promise<T>,
): Promise<T> {
    // Check if request already pending
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key) as Promise<T>;
    }

    // Create new request
    const promise = fetcher().finally(() => {
        // Clean up after request completes
        pendingRequests.delete(key);
    });

    pendingRequests.set(key, promise);
    return promise;
}
