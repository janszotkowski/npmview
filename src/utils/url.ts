/**
 * Encodes a package name for use in URLs, specifically handling scoped packages.
 * Replaces '/' with '%2F' to ensure the router treats it as a single segment if possible,
 * or allows us to handle it manually.
 * 
 * However, TanStack Router (and many others) might split %2F if they decode early.
 * A safer approach for "path segment" preservation when we want "scope/pkg" to be one param
 * is to use a custom separator that is URL safe but not a slash.
 * 
 * We will use `+` as a replacement for `/` in scoped packages for the URL segment,
 * as it is rarely used in package names (which are URL-safe characters usually).
 * Actually, package names can't contain `+`.
 * Scoped packages look like `@scope/name`.
 * We will transform `@scope/name` -> `@scope+name`.
 */
export const encodePackageName = (name: string): string => {
    return name.replace('/', '+');
};

/**
 * Decodes a package name from the URL segment.
 * Reverses the encoding: `@scope+name` -> `@scope/name`.
 */
export const decodePackageName = (name: string): string => {
    return name.replace('+', '/');
};
