import { Link } from '@tanstack/react-router';
import { FileQuestion } from 'lucide-react';

export const NotFound = (): React.ReactElement => {
    return (
        <div className={'min-h-[80vh] flex flex-col items-center justify-center p-4 text-center'}>
            <div className={'p-4 bg-muted rounded-full mb-4'}>
                <FileQuestion className={'w-12 h-12 text-muted-foreground'}/>
            </div>
            <h1 className={'text-4xl font-bold tracking-tight mb-2'}>Page not found</h1>
            <p className={'text-muted-foreground mb-8 max-w-sm'}>
                Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            <Link
                to={'/'}
                className={'px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium'}
            >
                Back to Home
            </Link>
        </div>
    );
}
