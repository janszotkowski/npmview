export const siteConfig = {
    title: 'NPM View',
    description: 'A fast and comprehensive npm package viewer',
    url: 'http://localhost:3000',
    author: 'Jan Szotkowski',
    twitter: '@janszotkowskix',
};

export const defaultMeta = [
    {
        name: 'description',
        content: siteConfig.description,
    },
    {
        name: 'author',
        content: siteConfig.author,
    },
    {
        property: 'og:type',
        content: 'website',
    },
    {
        property: 'og:site_name',
        content: siteConfig.title,
    },
    {
        property: 'og:title',
        content: siteConfig.title,
    },
    {
        property: 'og:description',
        content: siteConfig.description,
    },
    {
        name: 'twitter:card',
        content: 'summary_large_image',
    },
    {
        name: 'twitter:site',
        content: siteConfig.twitter,
    },
    {
        name: 'twitter:title',
        content: siteConfig.title,
    },
    {
        name: 'twitter:description',
        content: siteConfig.description,
    },
];
