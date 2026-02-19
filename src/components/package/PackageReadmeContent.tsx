import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeExternalLinks from 'rehype-external-links';
import 'highlight.js/styles/github-dark.css';
import { ReadmeImage } from './ReadmeImage';

type PackageReadmeContentProps = {
    content: string | null | undefined;
};

const PackageReadmeContent: React.FC<PackageReadmeContentProps> = (props: PackageReadmeContentProps): React.ReactElement | null => {
    if (!props.content) {
        return null;
    }

    return (
        <article className={'prose prose-neutral max-w-none dark:prose-invert prose-code:before:content-none prose-code:after:content-none'}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, {
                        ...defaultSchema,
                        tagNames: [...(defaultSchema.tagNames || []), 'video', 'audio'],
                        attributes: {
                            ...defaultSchema.attributes,
                            code: ['className'],
                            span: ['className'],
                        },
                    }],
                    [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }],
                    rehypeHighlight,
                ]}
                components={{
                    img: ({ src, alt, title }) => (
                        <ReadmeImage
                            src={src}
                            alt={alt}
                            title={title}
                            className={'rounded-lg border border-zinc-200 dark:border-zinc-800'}
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    ),

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    code: ({ className, children, ...rest }: any) => {
                        const match = /language-(\w+)/.exec(className || '');

                        if (match) {
                            return (
                                <code
                                    className={className}
                                    {...rest}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code
                                className={'bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-500 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border border-zinc-200 dark:border-zinc-700 font-medium'}
                                {...rest}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className={'bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden p-4 not-prose'}>
                            {children}
                        </pre>
                    ),
                }}
            >
                {props.content}
            </ReactMarkdown>
        </article>
    );
};

export default PackageReadmeContent;