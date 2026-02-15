import { createServerFn } from '@tanstack/react-start';
import { getCache, setCache } from './redis';

const GITHUB_API_URL = 'https://api.github.com';

type GitHubRepoData = {
    stargazers_count: number;
};

export const getGithubStars = createServerFn({method: 'GET'})
    .inputValidator((repoUrl: string) => repoUrl)
    .handler(async (ctx) => {
        const repoUrl = ctx.data;

        try {
            const match = repoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
            if (!match) {
                return null;
            }

            const owner = match[1];
            const repo = match[2];

            const cacheKey = `github:stars:${owner}/${repo}`;

            const cachedResult = await getCache<number>(cacheKey);
            if (cachedResult !== null) {
                return cachedResult;
            }

            const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'npmview-app',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`GitHub API error: ${response.statusText}`);
            }

            const data = (await response.json()) as GitHubRepoData;
            const stars = data.stargazers_count;

            await setCache(cacheKey, stars, 86400); // Cache for 24 hours

            return stars;
        } catch (error) {
            console.error('Failed to fetch GitHub stars:', error);
            return null;
        }
    });
