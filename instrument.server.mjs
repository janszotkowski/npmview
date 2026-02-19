import * as Sentry from '@sentry/tanstackstart-react';
import 'dotenv/config';

Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    sendDefaultPii: true,
});
