import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type TabsContextValue = {
    value: string;
    onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

type TabsProps = {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
};

export const Tabs: React.FC<TabsProps> = (props): React.ReactElement => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(props.defaultValue);
    const isControlled = props.value !== undefined;
    const value = isControlled ? props.value! : uncontrolledValue;

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setUncontrolledValue(newValue);
        }
        props.onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{value, onValueChange: handleValueChange}}>
            <div className={twMerge('w-full', props.className)}>
                {props.children}
            </div>
        </TabsContext.Provider>
    );
};

type TabsListProps = {
    children: React.ReactNode;
    className?: string;
};

export const TabsList: React.FC<TabsListProps> = (props): React.ReactElement => {
    return (
        <div
            role={'tablist'}
            className={twMerge(
                'flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800',
                props.className,
            )}
        >
            {props.children}
        </div>
    );
};

type TabsTriggerProps = {
    value: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
};

export const TabsTrigger: React.FC<TabsTriggerProps> = (props): React.ReactElement => {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within Tabs');
    }

    const isSelected = context.value === props.value;

    return (
        <button
            type={'button'}
            onClick={() => context.onValueChange(props.value)}
            className={twMerge(
                'cursor-pointer group relative flex items-center gap-2 py-4 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:focus-visible:ring-white',
                isSelected
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
                props.className,
            )}
            role={'tab'}
            aria-selected={isSelected}
        >
            {props.icon && (
                <span className={twMerge(
                    'h-4 w-4',
                    isSelected ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300',
                )}
                >
                    {props.icon}
                </span>
            )}
            {props.children}
            {isSelected && (
                <span className={'absolute inset-x-0 bottom-0 h-0.5 bg-red-600 dark:bg-red-500 motion-safe:transition-all'}/>
            )}
        </button>
    );
};

type TabsContentProps = {
    value: string;
    children: React.ReactNode;
    className?: string;
};

export const TabsContent: React.FC<TabsContentProps> = (props): React.ReactNode => {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within Tabs');
    }

    if (context.value !== props.value) {
        return null;
    }

    return (
        <div
            role={'tabpanel'}
            className={twMerge(
                'mt-6 animate-in fade-in-50 zoom-in-95 duration-200',
                props.className,
            )}
        >
            {props.children}
        </div>
    );
};
