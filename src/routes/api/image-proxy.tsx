import { createFileRoute } from '@tanstack/react-router';

/**
 * Image proxy endpoint for optimizing and caching images from README files
 * This improves performance by:
 * - Caching images with proper headers
 * - Potentially resizing/optimizing images in the future
 * - Preventing broken image links
 */
export const Route = createFileRoute('/api/image-proxy')({
    loader: () => null,
    server: {
        handlers: {
            GET: async ({request}: {request: Request}) => {
                const url = new URL(request.url);
                const imageUrl = url.searchParams.get('url');

                if (!imageUrl) {
                    return new Response('Missing url parameter', {status: 400});
                }

                // Validate URL to prevent SSRF
                try {
                    const parsedUrl = new URL(imageUrl);
                    const allowedProtocols = ['http:', 'https:'];
                    if (!allowedProtocols.includes(parsedUrl.protocol)) {
                        return new Response('Invalid protocol', {status: 400});
                    }
                } catch {
                    return new Response('Invalid URL', {status: 400});
                }

                try {
                    const response = await fetch(imageUrl, {
                        headers: {
                            'User-Agent': 'npmview-app/1.0',
                        },
                    });

                    if (!response.ok) {
                        return new Response('Failed to fetch image', {status: response.status});
                    }

                    const imageBuffer = await response.arrayBuffer();
                    const contentType = response.headers.get('Content-Type') || 'image/png';

                    // Return image with proper cache headers
                    return new Response(imageBuffer, {
                        headers: {
                            'Content-Type': contentType,
                            'Cache-Control': 'public, max-age=31536000, immutable',
                            'X-Content-Type-Options': 'nosniff',
                        },
                    });
                } catch (error) {
                    console.error('Image proxy error:', error);
                    return new Response('Failed to proxy image', {status: 500});
                }
            },
        },
    },
});
