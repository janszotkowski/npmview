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
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                passes: 2,
            },
            mangle: {
                safari10: true,
            },
        },
    },
    server: {
        port: 3000,
    },
    plugins: [
        tsConfigPaths(),
        tanstackStart({
            prerender: {
                enabled: true,
                crawlLinks: false,
            },
            // sitemap: {
            //     enabled: true,
            //     host: '',
            // },
        }),
        viteReact(),
        tailwindcss(),
    ],
});
