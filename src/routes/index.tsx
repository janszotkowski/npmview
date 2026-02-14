import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Home,
});

function Home() {
    return (
        <div className={'container mx-auto px-4 py-16'}>
            <h1 className={'text-4xl font-bold'}>Hello NPM View</h1>
        </div>
    );
}