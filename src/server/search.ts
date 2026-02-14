import { createServerFn } from '@tanstack/react-start';
import { getCache, setCache } from './redis';
import { SearchResponse } from '../types/search';

const NPM_SEARCH_URL = 'https://registry.npmjs.org/-/v1/search';

export const searchPackages = createServerFn({method: 'GET'})
    .inputValidator((data: string) => data)
    .handler(async (ctx) => {
        const query = ctx.data;

        if (!query || query.length < 2) {
            return {objects: [], total: 0, time: new Date().toISOString()} as SearchResponse;
        }

        const cacheKey = `search:${query.toLowerCase()}`;

        const cachedResult = await getCache<SearchResponse>(cacheKey);
        if (cachedResult) {
            console.log(`[CACHE HIT] Search: ${query}`);
            return cachedResult;
        }

        console.log(`[API FETCH] Search: ${query}`);
        try {
            const response = await fetch(`${NPM_SEARCH_URL}?text=${encodeURIComponent(query)}&size=5`);

            if (!response.ok) {
                throw new Error(`NPM Registry error: ${response.statusText}`);
            }

            const data = (await response.json()) as SearchResponse;

            await setCache(cacheKey, data, 3600);

            return data;
        } catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    });
