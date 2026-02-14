import * as React from 'react';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = (props): React.ReactElement => {
    const storageKey = props.storageKey || 'npmview-theme';
    const defaultTheme = props.defaultTheme || 'system';

    const [theme, setTheme] = React.useState<Theme>(defaultTheme);

    React.useEffect(() => {
        const savedTheme = localStorage.getItem(storageKey) as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, [storageKey]);

    React.useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        let effectiveTheme = theme;
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }

        root.classList.add(effectiveTheme);
        root.style.colorScheme = effectiveTheme;
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {props.children}
        </ThemeProviderContext.Provider>
    );
};

export const useTheme = (): ThemeProviderState => {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
