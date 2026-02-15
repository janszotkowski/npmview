import { createServerFn } from '@tanstack/react-start';
import { getCache, setCache } from './redis';
import { BundleSize, DownloadRange, PackageDetails, PackageManifest, PackageScore } from '@/types/package.ts';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const NPM_DOWNLOADS_URL = 'https://api.npmjs.org/downloads/range';
const BUNDLEPHOBIA_URL = 'https://bundlephobia.com/api/size';
const NPMS_API_URL = 'https://api.npms.io/v2/package';
const UNPKG_CDN_URL = 'https://unpkg.com';

export const getPackageManifest = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;

        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `package:manifest:${name}`;

        const cachedResult = await getCache<PackageManifest>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${NPM_REGISTRY_URL}/${name}/latest`);

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`NPM Registry error: ${response.statusText}`);
            }

            const data = (await response.json()) as PackageManifest;

            await setCache(cacheKey, data, 3600);

            return data;
        } catch (error) {
            console.error(`Package manifest fetch failed for ${name}:`, error);
            throw error;
        }
    });

export const getPackageReadme = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;
        if (!name) throw new Error('Package name is required');

        const cacheKey = `package:readme:${name}`;
        const cachedResult = await getCache<string>(cacheKey);
        if (cachedResult) return cachedResult;

        try {
            const response = await fetch(`${UNPKG_CDN_URL}/${name}/README.md`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Unpkg error: ${response.statusText}`);
            }
            const data = await response.text();
            await setCache(cacheKey, data, 3600);
            return data;
        } catch (error) {
            console.error(`Readme fetch failed for ${name}:`, error);
            return null;
        }
    });

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

        const cacheKey = `downloads:week:${name}`;

        const cachedResult = await getCache<DownloadRange>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${NPM_DOWNLOADS_URL}/last-week/${name}`);

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

export const getBundleSize = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;

        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `bundle:${name}`;

        const cachedResult = await getCache<BundleSize>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${BUNDLEPHOBIA_URL}?package=${name}`);

            if (!response.ok) {
                console.warn(`Failed to fetch bundle size for ${name}: ${response.statusText}`);
                return null;
            }

            const data = (await response.json()) as BundleSize;

            await setCache(cacheKey, data, 86400); // Cache for 24 hours

            return data;
        } catch (error) {
            console.error(`Bundle size fetch failed for ${name}:`, error);
            return null;
        }
    });

export const getPackageScore = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;

        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `score:${name}`;

        const cachedResult = await getCache<PackageScore>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${NPMS_API_URL}/${name}`);

            if (!response.ok) {
                console.warn(`Failed to fetch package score for ${name}: ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            const score: PackageScore = {
                final: data.score.final,
                detail: {
                    quality: data.score.detail.quality,
                    popularity: data.score.detail.popularity,
                    maintenance: data.score.detail.maintenance,
                },
            };

            await setCache(cacheKey, score, 86400); // Cache for 24 hours

            return score;
        } catch (error) {
            console.error(`Package score fetch failed for ${name}:`, error);
            return null;
        }
    });
