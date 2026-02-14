---
trigger: always_on
---

# AI Agent Instructions for NPM View Project

## Role
You are a senior full-stack TypeScript developer specializing in modern React applications with TanStack Router, React Query, and server-side rendering (SSR). You have deep expertise in type-safe development, performance optimization, and maintainable code architecture.

## Project Context

### Technology Stack
- **Framework**: TanStack Start (SSR React framework)
- **Router**: TanStack Router with file-based routing and SSR query integration
- **State Management**: TanStack React Query v5
- **UI Framework**: React 19.2.4
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **Language**: TypeScript (strict mode enabled)
- **Build Tool**: Vite 7 with terser minification
- **Caching**: Redis (ioredis) for server-side caching
- **Package Manager**: pnpm 10.28.2

### Project Structure
```
src/
├── components/         # React components
├── routes/            # File-based TanStack Router routes
│   ├── __root.tsx     # Root route with layout
│   └── index.tsx      # Home route
├── server/            # Server-side utilities
│   └── redis.ts       # Redis caching utilities
├── styles/            # Global styles
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── router.tsx         # Router configuration
└── routeTree.gen.ts   # Auto-generated route tree
```

### Key Configuration
- **Dev Server**: Port 3000
- **Redis**: Port 6380 (Docker), with fallback to localhost:6380
- **Build Target**: ES2022 with sourcemaps
- **Path Alias**: `@/*` maps to `./src/*`
- **Prerendering**: Enabled with crawl links

## Core Responsibilities

### 1. Code Development
- Implement new features following existing patterns
- Create type-safe components and utilities
- Integrate TanStack Router routes with proper loaders and SSR support
- Implement React Query hooks for data fetching with caching
- Write server-side utilities with Redis caching when appropriate

### 2. Code Quality
- Maintain strict TypeScript compliance (noUnusedLocals, noUnusedParameters)
- Follow ESLint rules (run `pnpm lint` before committing)
- Ensure all code passes type checking
- Write clean, maintainable, and self-documenting code

### 3. Performance
- Leverage SSR and prerendering capabilities
- Implement proper caching strategies with Redis
- Use React Query for efficient data fetching and caching
- Optimize bundle size (terser with drop_console enabled)

## Strict Code Style Rules

### TypeScript Rules
1. **Always use `type` over `interface`** (enforced by eslint-plugin-interface-to-type)
   - Exception: Only use `interface` when extending third-party types (e.g., `@tanstack/react-router` Register)
   - Add `// eslint-disable-next-line interface-to-type/prefer-type-over-interface` comment when using interface

2. **Strict typing**
   - No `any` types unless absolutely necessary with justification
   - Enable all strict TypeScript checks
   - Use generics for reusable utilities

3. **Path aliases**
   - Always use `@/` prefix for src imports: `import { foo } from '@/utils/foo'`

### React/JSX Rules
1. **Quotes**
   - Single quotes for JavaScript/TypeScript: `const foo = 'bar'`
   - Single quotes for JSX attributes: `<div className={'foo'}>`

2. **JSX Formatting**
   - **Always wrap prop values in curly braces**: `<Component prop={'value'}/>` (not `<Component prop="value"/>`)
   - Maximum 1 prop per line (single or multi)
   - First prop on new line for multiline-multiprop
   - 4-space indentation for JSX props
   - Tag-aligned closing brackets

   **Example:**
   ```tsx
   // ✅ Correct
   <Component prop={'value'}/>

   <Component
       prop1={'value1'}
       prop2={'value2'}
   />

   // ❌ Wrong
   <Component prop="value"/>
   <Component prop1="value1" prop2="value2"/>
   ```

3. **JSX Children**
   - Avoid curly braces for static children: `<div>text</div>` (not `<div>{'text'}</div>`)

4. **Component structure**
   - Use only `React.FC`
   - Use constant declarations: `const ComponentName: React.FC = (): React.ReactElement => { ... }`
   - Props type: `type ComponentProps = { ... }`
   - Readonly props for components: `Readonly<{ children: ReactNode }>`
   - Never use props destructuring, always use `props.propName`

### File and Import Rules
1. **File naming**
   - React components: PascalCase (`HomePage.tsx`)
   - Utilities: camelCase (`cacheUtils.ts`)
   - Routes: TanStack Router conventions (`__root.tsx`, `index.tsx`)

2. **Import order** (implicit from codebase)
   - React/third-party imports first
   - Local imports (`@/`) second
   - Side effects (CSS) last

3. **Export patterns**
   - Named exports for utilities: `export const getCache = ...`
   - Default exports for routes: `export const Route = createFileRoute...`

### TanStack Router Patterns
1. **Route definition**
   ```tsx
   import { createFileRoute } from '@tanstack/react-router';

   export const Route = createFileRoute('/path')({
       component: ComponentName,
       // Add headers, head, loader, etc. as needed
   });
   ```

2. **Root route structure**
   - Use `createRootRouteWithContext` with QueryClient type
   - Include `<HeadContent/>`, `<Scripts/>`, devtools in document
   - Set appropriate cache headers

3. **Router context**
   - Always pass `queryClient` in router context
   - Use module augmentation for type safety

### Redis Caching Patterns
1. **Use provided utilities**: `getCache<T>()`, `setCache<T>()`
2. **Type-safe caching**: Always specify generic type
3. **Default TTL**: 3600 seconds (1 hour)
4. **Error handling**: All cache operations have try-catch

### React Query Patterns
1. **SSR integration**: Use `setupRouterSsrQueryIntegration`
2. **Default preload**: `'intent'` (hover/focus preloading)
3. **QueryClient**: Created per router instance

## Development Workflow

### Before Starting
1. Understand the existing code patterns
2. Check if similar functionality exists
3. Plan the implementation with proper typing

### Implementation
1. Create types first
2. Implement core logic
3. Add error handling
4. Test TypeScript compilation: `pnpm build`
5. Run linter: `pnpm lint:fix`

### Code Review Checklist
- [ ] All TypeScript strict rules passing
- [ ] ESLint rules satisfied (especially JSX and quote rules)
- [ ] Props wrapped in curly braces in JSX
- [ ] Using `type` instead of `interface` (except approved exceptions)
- [ ] Single quotes everywhere
- [ ] Path aliases used (`@/`)
- [ ] Proper error handling
- [ ] Redis caching where appropriate
- [ ] SSR-compatible code

## Common Patterns

### Component Pattern
```tsx
type ComponentProps = {
    title: string;
    count: number;
};

const Component: React.FC<ComponentProps> = (props): React.ReactElement => {
    return (
        <div className={'container'}>
            <h1>{props.title}</h1>
            <span>{props.count}</span>
        </div>
    );
}
```

### Route with Loader
```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/path')({
    loader: async ({context}) => {
        // Fetch data using React Query if needed
        return data;
    },
    component: Component,
});
```

### Redis Caching
```tsx
import { getCache, setCache } from '@/server/redis';

type CachedData = {
    value: string;
};

const data = await getCache<CachedData>('key');
if (!data) {
    const fresh = await fetchData();
    await setCache('key', fresh, 7200); // 2 hours
}
```

## Critical Rules Summary
1. ✅ **ALWAYS** use curly braces for JSX prop values
2. ✅ **ALWAYS** use single quotes (JS/TS and JSX)
3. ✅ **ALWAYS** use `type` over `interface` (except augmentation)
4. ✅ **ALWAYS** use `@/` path alias for imports
5. ✅ **ALWAYS** run lint before committing
6. ❌ **NEVER** use double quotes (except to avoid escaping)
7. ❌ **NEVER** use `any` without justification
8. ❌ **NEVER** disable TypeScript strict checks
9. ❌ **NEVER** leave console.log in production code (terser drops it)
10. ❌ **NEVER** bypass ESLint rules without good reason
