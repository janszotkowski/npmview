import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Suspense } from 'react';
import { Await } from '@tanstack/react-router';

type PackageReadmeProps = {
    readonly readme: Promise<string | null> | string | undefined;
};

const ReadmeContent = ({content}: { content: string | null | undefined }): React.ReactNode => {
    if (!content) {
        return null;
    }
    return (
        <article className={'prose prose-neutral max-w-none dark:prose-invert'}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    img: ({node, ...props}) => (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                            {...props}
                            loading={'lazy'}
                            style={{maxWidth: '100%', height: 'auto'}}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
};

export const PackageReadme: React.FC<PackageReadmeProps> = (props): React.ReactElement => {
    const readmePromise = props.readme instanceof Promise ? props.readme : Promise.resolve(props.readme || null);

    return (
        <Suspense fallback={<div className={'h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-lg'}/>}>
            <Await promise={readmePromise}>
                {(content) => <ReadmeContent content={content}/>}
            </Await>
        </Suspense>
    );
};
