import { createServerFn } from '@tanstack/react-start';
import { getBinaryCache, setBinaryCache } from './redis';
import { SearchResponse } from '../types/search';
import { CACHE_TTL, getDeduplicatedRequest } from './cache-config';

const NPM_SEARCH_URL = 'https://registry.npmjs.org/-/v1/search';

export const searchPackages = createServerFn({method: 'GET'})
    .inputValidator((data: string) => data)
    .handler(async (ctx) => {
        const query = ctx.data;

        if (!query || query.length < 2) {
            return {objects: [], total: 0, time: new Date().toISOString()} as SearchResponse;
        }

        const cacheKey = `search:${query.toLowerCase()}`;

        return getDeduplicatedRequest(cacheKey, async () => {
            const cachedResult = await getBinaryCache<SearchResponse>(cacheKey);
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

                await setBinaryCache(cacheKey, data, CACHE_TTL.SEARCH);

                return data;
            } catch (error) {
                console.error('Search failed:', error);
                throw error;
            }
        });
    });
