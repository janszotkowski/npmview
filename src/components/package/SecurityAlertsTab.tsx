import { ShieldCheck } from 'lucide-react';
import { Await } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { SecurityAlertCard, type SecurityAdvisory } from './SecurityAlerts';

type SecurityAlertsTabProps = {
    advisories: Promise<SecurityAdvisory[] | null>;
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
    return (
        <Suspense fallback={
            <div className={'flex items-center justify-center py-12'}>
                <p className={'text-neutral-500'}>Loading security advisories...</p>
            </div>
        }
        >
            <Await promise={props.advisories}>
                {(data) => <SecurityAlertsTabContent advisories={data}/>}
            </Await>
        </Suspense>
    );
};
