import { createFileRoute } from '@tanstack/react-router';
import { getPackage } from '@/server/package';
import { defaultMeta, siteConfig } from '@/utils/seo';

export const Route = createFileRoute('/package/$name')({
    loader: async ({params}) => {
        return getPackage({data: params.name});
    },
    head: ({loaderData}) => {
        if (!loaderData) {
            return {
                title: `Package Not Found | ${siteConfig.title}`,
                meta: [
                    ...defaultMeta,
                    {
                        name: 'robots',
                        content: 'noindex',
                    },
                ],
            };
        }

        return {
            title: `Package: ${loaderData.name} | ${siteConfig.title}`,
            meta: [
                ...defaultMeta,
                {
                    name: 'description',
                    content: loaderData.description || siteConfig.description,
                },
                {
                    property: 'og:title',
                    content: `Package: ${loaderData.name} | ${siteConfig.title}`,
                },
                {
                    property: 'og:description',
                    content: loaderData.description || siteConfig.description,
                },
            ],
        };
    },
    component: PackageDetail,
});

function PackageDetail() {
    const pkg = Route.useLoaderData();

    if (!pkg) {
        return (
            <div className={'container mx-auto px-4 py-8'}>
                <h1 className={'text-2xl font-bold text-red-600'}>Package Not Found</h1>
                <p className={'mt-2'}>The requested package could not be found in the npm registry.</p>
            </div>
        );
    }

    return (
        <div className={'p-4'}>
            <h1 className={'text-2xl font-bold'}>Package: {pkg.name}</h1>
            <p className={'mt-2 text-neutral-600 dark:text-neutral-400'}>
                This is a placeholder for the package details page.
            </p>
        </div>
    );
}
