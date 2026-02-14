import { createServerFn } from '@tanstack/react-start';
import { getCache, setCache } from './redis';
import { DownloadRange, PackageDetails } from '@/types/package.ts';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const NPM_DOWNLOADS_URL = 'https://api.npmjs.org/downloads/range';

export const getPackage = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;

        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `package:${name}`;

        const cachedResult = await getCache<PackageDetails>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${NPM_REGISTRY_URL}/${name}`);

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`NPM Registry error: ${response.statusText}`);
            }

            const data = (await response.json()) as PackageDetails;

            await setCache(cacheKey, data, 3600);

            return data;
        } catch (error) {
            console.error(`Package fetch failed for ${name}:`, error);
            throw error;
        }
    });

export const getPackageDownloads = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;

        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `downloads:month:${name}`;

        const cachedResult = await getCache<DownloadRange>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${NPM_DOWNLOADS_URL}/last-month/${name}`);

            if (!response.ok) {
                console.warn(`Failed to fetch downloads for ${name}: ${response.statusText}`);
                return null;
            }

            const data = (await response.json()) as DownloadRange;

            await setCache(cacheKey, data, 3600);

            return data;
        } catch (error) {
            console.error(`Downloads fetch failed for ${name}:`, error);
            return null;
        }
    });
