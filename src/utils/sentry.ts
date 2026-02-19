import * as Sentry from '@sentry/tanstackstart-react';

export function initSentry() {
    if (typeof window === 'undefined') {
        return;
    }

    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) {
        console.warn('Sentry DSN is missing');
        return;
    }

    Sentry.init({
        dsn: dsn,
        sendDefaultPii: true,
        tunnel: `${window.location.origin}/api/sentry`,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
        ],
    });
}
