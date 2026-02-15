import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { PackageDownloadsTrend } from '@/types/package.ts';

type StatCardProps = {
    title: string;
    value?: React.ReactNode | string | number;
    unit?: string;
    trend?: {
        direction: PackageDownloadsTrend;
        percentage: number;
    };
    loading?: boolean;
    className?: string;
};

export const StatCard: React.FC<StatCardProps> = (props): React.ReactElement => {
    if (props.loading) {
        return (
            <div
                className={`bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800 h-full animate-pulse ${props.className ?? ''}`}
            >
                <div className={'h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-4'}/>
                <div className={'h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded'}/>
            </div>
        );
    }

    return (
        <div className={`cursor-default bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800 h-full ${props.className ?? ''}`}>
            <h3 className={'text-sm font-semibold text-neutral-500 mb-2'}>{props.title}</h3>
            <div className={'flex items-end gap-2'}>
                <span className={'text-4xl font-bold text-neutral-900 dark:text-white'}>
                    {props.value}
                </span>
                {props.unit && (
                    <span className={'text-xl font-medium text-neutral-500 mb-1.5'}>
                        {props.unit}
                    </span>
                )}
                {props.trend && props.trend.direction !== 'neutral' && (
                    <span
                        className={`flex items-center text-sm font-bold mb-1.5 ml-1 ${props.trend.direction === 'up' ? 'text-emerald-500' : 'text-red-500'
                        }`}
                    >
                        {props.trend.direction === 'up' ? <TrendingUp className={'size-4 mr-1'}/> :
                            <TrendingDown className={'size-4 mr-1'}/>}
                        {props.trend.percentage}%
                    </span>
                )}
            </div>
        </div>
    );
};
