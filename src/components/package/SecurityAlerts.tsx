import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Await } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import type { SecurityAdvisory } from '@/types/security';

type SecurityAlertsProps = {
    advisories: Promise<SecurityAdvisory[] | null>;
};

export type SecurityAlertCardProps = {
    advisory: SecurityAdvisory;
    showCount?: number;
};

export const SEVERITY_COLORS = {
    low: 'text-orange-900 dark:text-orange-100 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-700',
    moderate: 'text-orange-900 dark:text-orange-100 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-700',
    medium: 'text-orange-900 dark:text-orange-100 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-700',
    high: 'text-red-900 dark:text-red-100 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-700',
    critical: 'text-red-900 dark:text-red-100 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-700',
} as const;

export const getSeverityIcon = (severity: SecurityAdvisory['severity']) => {
    return severity === 'critical' || severity === 'high' ? (
        <ShieldAlert
            className={'h-5 w-5'}
            aria-hidden={'true'}
        />
    ) : (
        <AlertTriangle
            className={'h-5 w-5'}
            aria-hidden={'true'}
        />
    );
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const NoVulnerabilitiesCard: React.FC = (): React.ReactElement => {
    return (
        <div className={'w-full'}>
            <div className={'block rounded-lg border p-4 text-emerald-900 dark:text-emerald-100 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-700'}>
                <div className={'flex items-start gap-3'}>
                    <div className={'mt-0.5'}>
                        <ShieldCheck className={'h-5 w-5'}/>
                    </div>
                    <div className={'flex-1'}>
                        <p className={'text-sm font-medium leading-tight'}>
                            No known security vulnerabilities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SecurityAlertCard: React.FC<SecurityAlertCardProps> = (props): React.ReactElement => {
    return (
        <div className={'w-full'}>
            <a
                href={props.advisory.url}
                target={'_blank'}
                rel={'noopener noreferrer'}
                className={`block rounded-lg border p-4 transition-all hover:shadow-md ${SEVERITY_COLORS[props.advisory.severity]}`}
            >
                <div className={'flex items-start gap-3'}>
                    <div className={'mt-0.5'}>
                        {getSeverityIcon(props.advisory.severity)}
                    </div>
                    <div className={'flex-1'}>
                        <div className={'flex items-center gap-2'}>
                            <span className={'text-xs font-semibold uppercase tracking-wide'}>
                                {props.advisory.severity}
                            </span>
                            <span className={'text-xs opacity-70'}>
                                {props.advisory.ghsa_id}
                            </span>
                        </div>
                        <p className={'mt-1 text-sm font-medium leading-tight'}>
                            {props.advisory.summary}
                        </p>
                        {props.advisory.vulnerable_versions && (
                            <p className={'mt-2 text-xs opacity-90'}>
                                <span className={'font-semibold'}>Affected:</span> {props.advisory.vulnerable_versions}
                            </p>
                        )}
                        {props.advisory.patched_versions && (
                            <p className={'mt-1 text-xs opacity-90'}>
                                <span className={'font-semibold'}>Patched:</span> {props.advisory.patched_versions}
                            </p>
                        )}
                        <p className={'mt-1 text-xs opacity-70'}>
                            Published: {formatDate(props.advisory.published_at)}
                        </p>
                        {props.showCount !== undefined && props.showCount > 0 && (
                            <p className={'mt-2 text-xs font-medium'}>
                                +{props.showCount} more {props.showCount === 1 ? 'vulnerability' : 'vulnerabilities'}
                            </p>
                        )}
                    </div>
                </div>
            </a>
        </div>
    );
};

const SecurityAlertsContent: React.FC<{ advisories: SecurityAdvisory[] | null }> = (props): React.ReactElement => {
    if (!props.advisories || props.advisories.length === 0) {
        return <NoVulnerabilitiesCard/>;
    }

    const latestAdvisory = props.advisories[0];
    const remainingCount = props.advisories.length - 1;

    return (
        <SecurityAlertCard
            advisory={latestAdvisory}
            showCount={remainingCount > 0 ? remainingCount : undefined}
        />
    );
};

export const SecurityAlerts: React.FC<SecurityAlertsProps> = (props): React.ReactElement => {
    return (
        <Suspense fallback={null}>
            <Await promise={props.advisories}>
                {(data) => <SecurityAlertsContent advisories={data}/>}
            </Await>
        </Suspense>
    );
};
