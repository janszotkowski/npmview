import { getTopPackages } from './package';
import { getPackageManifest, getPackageReadme, getPackageScore } from './package';

/**
 * Cache warming function for top packages
 * Preloads data for the most popular packages to improve response times
 */
export async function warmCache(): Promise<void> {
    try {
        console.log('[CACHE WARMING] Starting cache warming for top packages...');

        const topPackages = await getTopPackages({ data: 'week' });

        if (!topPackages || topPackages.length === 0) {
            console.log('[CACHE WARMING] No top packages found');
            return;
        }

        // Warm cache for top 50 packages
        const packagesToWarm = topPackages.slice(0, 50);

        console.log(`[CACHE WARMING] Warming cache for ${packagesToWarm.length} packages...`);

        // Warm cache in parallel batches to avoid overwhelming the system
        const batchSize = 10;
        for (let i = 0; i < packagesToWarm.length; i += batchSize) {
            const batch = packagesToWarm.slice(i, i + batchSize);

            await Promise.allSettled(
                batch.map(async (pkg) => {
                    try {
                        const packageName = typeof pkg === 'string' ? pkg : pkg.name;

                        // Prefetch critical data
                        await Promise.allSettled([
                            getPackageManifest({ data: packageName }),
                            getPackageReadme({ data: packageName }),
                            getPackageScore({ data: packageName }),
                        ]);
                    } catch (error) {
                        console.error('[CACHE WARMING] Failed to warm cache for package:', error);
                    }
                })
            );
        }

        console.log('[CACHE WARMING] Cache warming completed');
    } catch (error) {
        console.error('[CACHE WARMING] Cache warming failed:', error);
    }
}

// Run cache warming on server startup (only in production)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Run after a short delay to allow server to start
    setTimeout(() => {
        void warmCache();
    }, 5000);
}
