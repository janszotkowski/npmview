export type PackageManifest = {
    name: string;
    version: string;
    description: string;
    dist: {
        shasum: string;
        tarball: string;
        fileCount?: number;
        unpackedSize?: number;
    };
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
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
    _id?: string;
    gitHead?: string;
    engines?: {
        node?: string;
        npm?: string;
        [key: string]: string | undefined;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

export type PackageDetails = {
    name: string;
    description: string;
    'dist-tags': {
        latest: string;
    };
    versions: Record<string, PackageManifest>;
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

export type PackageDownloadsTrend = 'up' | 'down' | 'neutral';

export type BundleSize = {
    size: number;
    gzip: number;
    name: string;
    version: string;
};

export type PackageScore = {
    final: number;
    detail: {
        quality: number;
        popularity: number;
        maintenance: number;
    };
};

export type MinimalVersion = {
    v: string;
    t: string;
    s: number;
    f?: number;
};

export type PackageVersionsResponse = {
    name: string;
    latest: string;
    total: number;
    versions: MinimalVersion[];
};
