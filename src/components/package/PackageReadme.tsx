import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

type PackageReadmeProps = {
    readonly readme?: string;
};

export const PackageReadme: React.FC<PackageReadmeProps> = (props): React.ReactElement | null => {
    if (!props.readme) {
        return null;
    }

    return (
        <article className={'prose prose-neutral max-w-none dark:prose-invert'}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
                {props.readme}
            </ReactMarkdown>
        </article>
    );
};
