import { createServerFn } from '@tanstack/react-start';
import { getCache, setCache } from './redis';
import type { OSVResponse, OSVVulnerability, SecurityAdvisory } from '@/types/security';

const OSV_API_URL = 'https://api.osv.dev/v1/query';

const getSeverityFromOSV = (vuln: OSVVulnerability): SecurityAdvisory['severity'] => {
    const dbSeverity = vuln.database_specific?.severity?.toLowerCase();
    if (dbSeverity === 'critical' || dbSeverity === 'high' || dbSeverity === 'moderate' || dbSeverity === 'low' || dbSeverity === 'medium') {
        return dbSeverity as SecurityAdvisory['severity'];
    }

    const cvss = vuln.severity?.find((s) => s.type === 'CVSS_V3');
    if (cvss) {
        const score = parseFloat(cvss.score.split(':')[1] || '0');
        if (score >= 9.0) {
            return 'critical';
        }
        if (score >= 7.0) {
            return 'high';
        }
        if (score >= 4.0) {
            return 'moderate';
        }
        return 'low';
    }

    return 'moderate';
};

const getVulnerableVersions = (vuln: OSVVulnerability): string | undefined => {
    const ranges = vuln.affected?.[0]?.ranges;
    if (!ranges) {
        return undefined;
    }

    const versions = ranges.map((range) => {
        const events = range.events ?? [];
        const introduced = events.find((e) => e.introduced)?.introduced;
        const fixed = events.find((e) => e.fixed)?.fixed;

        if (introduced && fixed) {
            return `${introduced} - ${fixed}`;
        }
        if (introduced) {
            return `>=${introduced}`;
        }
        if (fixed) {
            return `<${fixed}`;
        }
        return null;
    }).filter(Boolean).join(', ');

    return versions ?? undefined;
};

const getPatchedVersions = (vuln: OSVVulnerability): string | undefined => {
    const ranges = vuln.affected?.[0]?.ranges;
    if (!ranges) {
        return undefined;
    }

    const fixedVersions = ranges
        .flatMap((range) => range.events || [])
        .filter((event) => event.fixed)
        .map((event) => event.fixed)
        .filter(Boolean);

    return fixedVersions.length > 0 ? fixedVersions.join(', ') : undefined;
};

const getAdvisoryUrl = (vuln: OSVVulnerability): string => {
    const ghReference = vuln.references?.find((ref) => ref.url.includes('github.com/advisories'));
    return ghReference?.url ?? `https://osv.dev/vulnerability/${vuln.id}`;
};

export const getSecurityAdvisories = createServerFn({method: 'GET'})
    .inputValidator((name: string) => name)
    .handler(async (ctx) => {
        const name = ctx.data;

        if (!name) {
            throw new Error('Package name is required');
        }

        const cacheKey = `osv:security:${name}`;

        const cachedResult = await getCache<SecurityAdvisory[]>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const response = await fetch(OSV_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package: {
                        name,
                        ecosystem: 'npm',
                    },
                }),
            });

            if (!response.ok) {
                console.warn(`Failed to fetch security advisories for ${name}: ${response.statusText}`);
                return null;
            }

            const data: OSVResponse = await response.json();
            const vulnerabilities = data.vulns ?? [];

            const advisories: SecurityAdvisory[] = vulnerabilities.map((vuln) => ({
                id: vuln.id,
                ghsa_id: vuln.id.startsWith('GHSA-') ? vuln.id : '',
                summary: vuln.summary || vuln.details?.split('\n')[0] || 'No summary available',
                severity: getSeverityFromOSV(vuln),
                url: getAdvisoryUrl(vuln),
                published_at: vuln.published || vuln.modified || new Date().toISOString(),
                vulnerable_versions: getVulnerableVersions(vuln),
                patched_versions: getPatchedVersions(vuln),
            }));

            await setCache(cacheKey, advisories, 86400); // Cache for 24 hours

            return advisories;
        } catch (error) {
            console.error(`Security advisories fetch failed for ${name}:`, error);
            return null;
        }
    });
