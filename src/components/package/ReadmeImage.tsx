import React, { useRef, useState } from 'react';

type ReadmeImageProps = {
    src: string | undefined;
    alt?: string | null;
    title?: string | null;
    className?: string;
    style?: React.CSSProperties;
};

export const ReadmeImage: React.FC<ReadmeImageProps> = (props): React.ReactNode => {
    const [proxyFailed, setProxyFailed] = useState(false);
    const [imageError, setImageError] = useState(false);
    const didSetImageError = useRef(false);

    if (!props.src) {
        return null;
    }

    const useProxy = !proxyFailed
        && !props.src.startsWith('/')
        && !props.src.startsWith('data:');

    const displaySrc = useProxy
        ? `/api/image-proxy?url=${encodeURIComponent(props.src)}`
        : props.src;

    const handleError = () => {
        if (useProxy) {
            setProxyFailed(true);
        } else {
            if (didSetImageError.current) return;
            didSetImageError.current = true;
            setImageError(true);
        }
    };

    if (imageError) {
        return (
            <span
                className={`block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 py-8 text-center text-sm text-zinc-500 ${props.className ?? ''}`}
                style={{ minHeight: 80, ...props.style }}
            >
                Image could not be loaded
            </span>
        );
    }

    return (
        <span
            className={'block overflow-hidden rounded-lg'}
            style={{ minHeight: 24 }}
        >
            <img
                src={displaySrc}
                alt={props.alt ?? ''}
                title={props.title ?? undefined}
                loading={'lazy'}
                decoding={'async'}
                className={`max-w-full h-auto rounded-lg border border-zinc-200 dark:border-zinc-800 ${props.className ?? ''}`}
                style={{ maxWidth: '100%', height: 'auto', verticalAlign: 'middle', ...props.style }}
                onError={handleError}
            />
        </span>
    );
};
