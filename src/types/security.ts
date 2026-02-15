export type SecurityAdvisory = {
    id: string;
    ghsa_id: string;
    summary: string;
    severity: 'low' | 'moderate' | 'high' | 'critical' | 'medium';
    url: string;
    published_at: string;
    vulnerable_versions?: string;
    patched_versions?: string;
};

export type OSVVulnerability = {
    id: string;
    summary?: string;
    details?: string;
    severity?: Array<{
        type: string;
        score: string;
    }>;
    affected?: Array<{
        package: {
            ecosystem: string;
            name: string;
        };
        ranges?: Array<{
            type: string;
            events: Array<{
                introduced?: string;
                fixed?: string;
            }>;
        }>;
        versions?: string[];
    }>;
    published?: string;
    modified?: string;
    references?: Array<{
        type: string;
        url: string;
    }>;
    database_specific?: {
        severity?: string;
        github_reviewed?: boolean;
    };
};

export type OSVResponse = {
    vulns?: OSVVulnerability[];
};
