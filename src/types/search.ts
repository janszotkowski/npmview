export type SearchResultItem = {
    name: string;
    version: string;
    description: string;
    keywords?: string[];
    date: string;
    publisher: {
        username: string;
        email: string;
    };
    links: {
        npm: string;
        homepage?: string;
        repository?: string;
        bugs?: string;
    };
};

export type SearchResponse = {
    objects: Array<{
        package: SearchResultItem;
        score: {
            final: number;
            detail: {
                quality: number;
                popularity: number;
                maintenance: number;
            };
        };
    }>;
    total: number;
    time: string;
};
