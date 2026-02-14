import { Monitor, Moon, Sun } from 'lucide-react';
import type { Theme } from '@/components/ThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import type { ReactElement } from 'react';

export const ThemeToggle: React.FC = (): ReactElement => {
    const {theme, setTheme} = useTheme();

    const themes: { value: Theme; icon: React.ElementType; label: string }[] = [
        {value: 'light', icon: Sun, label: 'Light'},
        {value: 'dark', icon: Moon, label: 'Dark'},
        {value: 'system', icon: Monitor, label: 'System'},
    ];

    return (
        <div className={'flex items-center rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900'}>
            {themes.map(({value, icon: Icon, label}) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`
                        relative flex size-8 items-center justify-center rounded-full transition-all
                        ${theme === value
                        ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'}
                    `}
                    title={`Switch to ${label} theme`}
                    aria-label={`Switch to ${label} theme`}
                >
                    <Icon className={'size-4'}/>
                    <span className={'sr-only'}>{label}</span>
                </button>
            ))}
        </div>
    );
};
