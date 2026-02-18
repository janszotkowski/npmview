import { createServerFn } from '@tanstack/react-start';
import { getBinaryCache, setBinaryCache } from './redis';
import { BundleSize, DownloadRange, MinimalVersion, PackageManifest, PackageScore, PackageVersionsResponse } from '@/types/package.ts';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
const NPM_DOWNLOADS_URL = 'https://api.npmjs.org/downloads/range';
const BUNDLEPHOBIA_URL = 'https://bundlephobia.com/api/size';
const NPMS_API_URL = 'https://api.npms.io/v2/package';
const JS_DELIVR_CDN_URL = 'https://cdn.jsdelivr.net/npm';

export const getPackageManifest = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;
        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `package:manifest:${name}`;

        const cachedResult = await getBinaryCache<PackageManifest>(cacheKey);
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
            await setBinaryCache(cacheKey, data, 3600);
            return data;
        } catch (error) {
            console.error(`Manifest fetch failed for ${name}:`, error);
            throw error;
        }
    });

export const getPackageReadme = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;
        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `package:readme:${name}`;

        const cachedResult = await getBinaryCache<string>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${JS_DELIVR_CDN_URL}/${name}/README.md`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`JsDelivr error: ${response.statusText}`);
            }
            const data = await response.text();
            await setBinaryCache(cacheKey, data, 3600);
            return data;
        } catch (error) {
            console.error(`Readme fetch failed for ${name}:`, error);
            return null;
        }
    });

export const getPackageVersions = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;
        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `package:versions:${name}`;

        const cachedResult = await getBinaryCache<PackageVersionsResponse>(cacheKey);
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rawData = await response.json() as any;
            const timeMap = rawData.time || {};
            const distTags = rawData['dist-tags'] || {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const versionsList: MinimalVersion[] = Object.values(rawData.versions).map((ver: any) => {
                const versionString = ver.version;
                return {
                    v: versionString,
                    t: timeMap[versionString] || '',
                    s: ver.dist?.unpackedSize || 0,
                    f: ver.dist?.fileCount,
                };
            });

            versionsList.sort((a, b) => {
                const dateA = new Date(a.t).getTime() || 0;
                const dateB = new Date(b.t).getTime() || 0;
                return dateB - dateA;
            });

            const cleanData: PackageVersionsResponse = {
                name: rawData.name,
                latest: distTags.latest,
                total: versionsList.length,
                versions: versionsList,
            };

            await setBinaryCache(cacheKey, cleanData, 3600);
            return cleanData;
        } catch (error) {
            console.error(`Versions fetch failed for ${name}:`, error);
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

        const cachedResult = await getBinaryCache<DownloadRange>(cacheKey);
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

            await setBinaryCache(cacheKey, data, 3600);

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

        const cachedResult = await getBinaryCache<BundleSize>(cacheKey);
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

            await setBinaryCache(cacheKey, data, 86400); // Cache for 24 hours

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

        const cachedResult = await getBinaryCache<PackageScore>(cacheKey);
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

            await setBinaryCache(cacheKey, score, 86400); // Cache for 24 hours

            return score;
        } catch (error) {
            console.error(`Package score fetch failed for ${name}:`, error);
            return null;
        }
    });
