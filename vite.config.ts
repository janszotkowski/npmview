import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    build: {
        sourcemap: true,
        target: 'es2022',
        minify: 'terser',
    },
    server: {
        port: 3000,
    },
    plugins: [
        tsConfigPaths(),
        tanstackStart({
            prerender: {
                enabled: true,
                crawlLinks: true,
            },
            sitemap: {
                enabled: true,
                host: '',
            },
        }),
        viteReact(),
        tailwindcss(),
    ],
});
