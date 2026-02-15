import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeExternalLinks from 'rehype-external-links';
import 'highlight.js/styles/github-dark.css';

const PackageReadmeContent = ({content}: { content: string | null | undefined }): React.ReactNode => {
    if (!content) {
        return null;
    }
    return (
        <article className={'prose prose-neutral max-w-none dark:prose-invert'}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, {
                        ...defaultSchema,
                        tagNames: [...(defaultSchema.tagNames || []), 'video', 'audio'],
                    }],
                    [rehypeExternalLinks, {target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer']}],
                    rehypeHighlight,
                ]}
                components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    img: ({node, ...props}) => (
                        <img
                            {...props}
                            loading={'lazy'}
                            style={{maxWidth: '100%', height: 'auto'}}
                            className={'rounded-lg'}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
};

export default PackageReadmeContent;