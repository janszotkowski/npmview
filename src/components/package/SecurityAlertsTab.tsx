import React from 'react';
import type { SecurityAdvisory } from '@/types/security';
import { SecurityAlertCard } from './SecurityAlerts';
import { PackageManifest } from '@/types/package';
import { useQuery } from '@tanstack/react-query';
import { getSecurityAdvisories } from '@/server/security';
import { Skeleton } from '@/components/Skeleton';
import { ShieldCheck } from 'lucide-react';

type SecurityAlertsTabProps = {
    pkg: PackageManifest;
};

const EmptyState: React.FC = (): React.ReactElement => {
    return (
        <div className={'flex flex-col items-center justify-center py-12'}>
            <ShieldCheck
                className={'h-16 w-16 text-emerald-500 mb-4'}
                aria-hidden={'true'}
            />
            <h3 className={'text-xl font-semibold text-neutral-900 dark:text-white mb-2'}>
                All Clear
            </h3>
            <p className={'text-neutral-600 dark:text-neutral-400 text-center max-w-md'}>
                No known security vulnerabilities found for this package.
            </p>
        </div>
    );
};

type SecurityAlertsTabContentProps = {
    advisories: SecurityAdvisory[] | null;
}

const SecurityAlertsTabContent: React.FC<SecurityAlertsTabContentProps> = (props): React.ReactElement => {
    if (!props.advisories || props.advisories.length === 0) {
        return <EmptyState/>;
    }

    return (
        <div className={'space-y-4'}>
            <div className={'mb-6'}>
                <h3 className={'text-lg font-semibold text-neutral-900 dark:text-white mb-1'}>
                    Security Advisories
                </h3>
                <p className={'text-sm text-neutral-600 dark:text-neutral-400'}>
                    Found {props.advisories.length} {props.advisories.length === 1 ? 'vulnerability' : 'vulnerabilities'}
                </p>
            </div>

            {props.advisories.map((advisory) => (
                <SecurityAlertCard
                    key={advisory.id}
                    advisory={advisory}
                />
            ))}
        </div>
    );
};

export const SecurityAlertsTab: React.FC<SecurityAlertsTabProps> = (props): React.ReactElement => {
    const {data, isLoading, error} = useQuery({
        queryKey: ['package', 'advisories', props.pkg.name],
        queryFn: () => getSecurityAdvisories({data: props.pkg.name}),
    });

    if (isLoading) {
        return (
            <div className={'space-y-4'}>
                <Skeleton className={'h-8 w-48'}/>
                <Skeleton className={'h-4 w-32'}/>
                <div className={'space-y-4 mt-6'}>
                    {[1, 2].map((i) => (
                        <Skeleton
                            key={i}
                            className={'h-32 w-full rounded-lg'}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={'py-8 text-center text-red-500'}>
                Failed to load security advisories
            </div>
        );
    }

    return <SecurityAlertsTabContent advisories={data ?? null}/>;
};
