import { createFileRoute } from '@tanstack/react-router';

const SENTRY_HOST = import.meta.env.VITE_SENTRY_HOST;
const SENTRY_PROJECT_IDS = [import.meta.env.VITE_SENTRY_PROJECT_ID];

export const Route = createFileRoute('/api/sentry')({
    loader: () => null,
    server: {
        handlers: {
            POST: async ({ request }: { request: Request }) => {
                try {
                    const envelopeBytes = await request.arrayBuffer();
                    const envelope = new TextDecoder().decode(envelopeBytes);
                    const piece = envelope.split('\n')[0];
                    const header = JSON.parse(piece);
                    const dsn = new URL(header['dsn']);
                    const project_id = dsn.pathname?.replace('/', '');

                    if (dsn.hostname !== SENTRY_HOST) {
                        throw new Error(`Invalid sentry hostname: ${dsn.hostname}`);
                    }

                    if (!project_id || !SENTRY_PROJECT_IDS.includes(project_id)) {
                        throw new Error(`Invalid sentry project id: ${project_id}`);
                    }

                    const upstream_sentry_url = `https://${SENTRY_HOST}/api/${project_id}/envelope/`;

                    await fetch(upstream_sentry_url, {
                        method: 'POST',
                        body: envelopeBytes,
                    });

                    return new Response(JSON.stringify({}), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    });
                } catch (e) {
                    console.error('error tunneling to sentry', e);
                    return new Response(JSON.stringify({ error: 'error tunneling to sentry' }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            },
        },
    },
});
