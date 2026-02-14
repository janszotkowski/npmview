import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/package/$name')({
    component: PackageDetail,
});

function PackageDetail() {
    const {name} = Route.useParams();

    return (
        <div className={'p-4'}>
            <h1 className={'text-2xl font-bold'}>Package: {name}</h1>
            <p className={'mt-2 text-neutral-600 dark:text-neutral-400'}>
                This is a placeholder for the package details page.
            </p>
        </div>
    );
}
