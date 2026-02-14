import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Route = createFileRoute('/about')({
    component: About,
});

function About(): ReactElement {
    return (
        <div className={'container mx-auto max-w-4xl px-4 py-16'}>
            <div className={'mb-12 text-center'}>
                <h1 className={'mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl'}>
                    About NPM View
                </h1>
                <p className={'mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400'}>
                    A modern, open-source tool designed to make exploring the npm ecosystem easier, faster, and more insightful.
                </p>
            </div>

            <div className={'mb-16 grid gap-8 md:grid-cols-2'}>
                <section className={'space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800'}>
                    <h2 className={'text-2xl font-bold text-neutral-900 dark:text-white'}>Mission</h2>
                    <p className={'leading-relaxed text-neutral-600 dark:text-neutral-300'}>
                        NPM View was created to provide a cleaner, more efficient interface for viewing npm package details.
                        Whether you are checking dependencies, versions, or package metadata, we aim to deliver the information you need without the clutter.
                    </p>

                    <div className={'rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100'}>
                        <p className={'font-medium'}>
                            <span className={'mr-2 text-xl'}>⚠️</span>
                            Disclaimer
                        </p>
                        <p className={'mt-2 text-sm opacity-90'}>
                            This is a hobby project created for learning purposes. It is not affiliated with, endorsed by, or connected to npm, Inc. or GitHub.
                        </p>
                    </div>
                </section>

                <section className={'space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800'}>
                    <h2 className={'text-2xl font-bold text-neutral-900 dark:text-white'}>Tech Stack</h2>
                    <p className={'text-neutral-600 dark:text-neutral-400'}>
                        Built with the latest technologies to ensure performance, type safety, and a great developer experience.
                    </p>
                    <ul className={'space-y-3'}>
                        {[
                            {name: 'TanStack Start', desc: 'Full-stack React framework'},
                            {name: 'TanStack Router', desc: 'Type-safe routing'},
                            {name: 'TanStack Query', desc: 'Async state management'},
                            {name: 'React 19', desc: 'Latest React features'},
                            {name: 'Tailwind CSS v4', desc: 'Utility-first styling'},
                            {name: 'Redis', desc: 'High-performance caching'},
                        ].map((tech) => (
                            <li
                                key={tech.name}
                                className={'flex items-start gap-3'}
                            >
                                <div className={'mt-1.5 size-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600'}/>
                                <div>
                                    <span className={'font-semibold text-neutral-900 dark:text-white'}>{tech.name}</span>
                                    <span className={'ml-2 text-sm text-neutral-500 dark:text-neutral-400'}>- {tech.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
