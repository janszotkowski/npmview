import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type PackageReadmeProps = {
    readonly readme?: string;
};

export const PackageReadme: React.FC<PackageReadmeProps> = (props): React.ReactElement | null => {
    if (!props.readme) {
        return null;
    }

    return (
        <article className={'prose prose-neutral max-w-none dark:prose-invert'}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {props.readme}
            </ReactMarkdown>
        </article>
    );
};
