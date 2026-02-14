export type PackageDetails = {
    name: string;
    description: string;
    'dist-tags': {
        latest: string;
    };
    versions: Record<string, {
        name: string;
        version: string;
        dist: {
            shasum: string;
            tarball: string;
            fileCount?: number;
            unpackedSize?: number;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    }>;
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
    maintainers?: Array<{
        name: string;
        email?: string;
    }>;
    repository?: {
        type: string;
        url: string;
    };
    homepage?: string;
    keywords?: string[];
    license?: string;
    readme?: string;
};

export type DownloadRange = {
    downloads: Array<{
        downloads: number;
        day: string;
    }>;
    start: string;
    end: string;
    package: string;
};
