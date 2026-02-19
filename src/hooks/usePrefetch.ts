import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { getPackageManifest } from '@/server/package';

export function usePrefetchPackage() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const prefetchPackage = useCallback((packageName: string) => {
        void router.preloadRoute({
            to: '/package/$name',
            params: { name: packageName },
        });

        void queryClient.prefetchQuery({
            queryKey: ['package', 'manifest', packageName],
            queryFn: () => getPackageManifest({ data: packageName }),
            staleTime: 60_000,
        });
    }, [queryClient, router]);

    return prefetchPackage;
}
