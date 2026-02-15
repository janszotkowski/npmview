import { createServerFn } from '@tanstack/react-start';
import { getCache, setCache } from './redis';
import type { SecurityAdvisory } from '@/components/package/SecurityAlerts';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_ADVISORY_URL = `${GITHUB_API_URL}/advisories`;

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

export const getSecurityAdvisories = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;

        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `github:security:${name}`;

        const cachedResult = await getCache<SecurityAdvisory[]>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(`${GITHUB_ADVISORY_URL}?ecosystem=npm&affects=${encodeURIComponent(name)}`, {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            });

            if (!response.ok) {
                console.warn(`Failed to fetch security advisories for ${name}: ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const advisories: SecurityAdvisory[] = data.map((advisory: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const npmVulnerability = advisory.vulnerabilities?.find((v: any) => v.package?.ecosystem === 'npm' && v.package?.name === name);
                const patchedVersion = npmVulnerability?.first_patched_version;
                const patchedVersionString = typeof patchedVersion === 'string' ? patchedVersion : patchedVersion?.identifier || undefined;

                return {
                    id: advisory.id,
                    ghsa_id: advisory.ghsa_id,
                    summary: advisory.summary,
                    severity: advisory.severity,
                    url: advisory.html_url,
                    published_at: advisory.published_at,
                    vulnerable_versions: npmVulnerability?.vulnerable_version_range || undefined,
                    patched_versions: patchedVersionString,
                };
            });

            await setCache(cacheKey, advisories, 86400); // Cache for 24 hours

            return advisories;
        } catch (error) {
            console.error(`Security advisories fetch failed for ${name}:`, error);
            return null;
        }
    });
