import React, { ReactNode } from 'react';

type TooltipProps = {
    children: ReactNode;
    content: string | number;
    className?: string;
};

export const Tooltip: React.FC<TooltipProps> = (props): React.ReactElement => {
    return (
        <div className={`relative group inline-block ${props.className ?? ''}`}>
            {props.children}
            <div className={'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'}>
                {props.content}
                <div className={'absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900 dark:border-t-white'}/>
            </div>
        </div>
    );
};
