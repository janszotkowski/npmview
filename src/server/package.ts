import { createServerFn } from '@tanstack/react-start';
import { getCache, setCache } from './redis';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';

export type PackageDetails = {
    name: string;
    description: string;
    'dist-tags': {
        latest: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    versions: Record<string, any>;
    time: {
        created: string;
        modified: string;
        [key: string]: string;
    };
    author?: {
        name: string;
        email?: string;
        url?: string;
    };
    repository?: {
        type: string;
        url: string;
    };
    homepage?: string;
    keywords?: string[];
    license?: string;
    readme?: string;
};

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
            console.log(`[CACHE HIT] Package: ${name}`);
            return cachedResult;
        }

        console.log(`[API FETCH] Package: ${name}`);
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
