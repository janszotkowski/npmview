import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type InstallCommandProps = {
    packageName: string;
};

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const validManagers: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

export const InstallCommand: React.FC<InstallCommandProps> = (props): React.ReactElement => {
    const [copied, setCopied] = useState(false);
    const [manager, setManager] = useState<PackageManager>('pnpm');

    useEffect(() => {
        const saved = localStorage.getItem('preferred-package-manager') as PackageManager;
        if (validManagers.includes(saved)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setManager(saved);
        }
    }, []);

    const handleManagerChange = (pm: PackageManager): void => {
        setManager(pm);
        localStorage.setItem('preferred-package-manager', pm);
    };

    const getCommand = (): string => {
        switch (manager) {
            case 'npm':
                return `npm i ${props.packageName}`;
            case 'pnpm':
                return `pnpm add ${props.packageName}`;
            case 'yarn':
                return `yarn add ${props.packageName}`;
            case 'bun':
                return `bun add ${props.packageName}`;
        }
    };

    const handleCopy = async (): Promise<void> => {
        await navigator.clipboard.writeText(getCommand());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={'w-full overflow-hidden rounded-xl border border-neutral-800 bg-[#0c0c0c] shadow-2xl'}>
            <div
                className={'flex items-center border-b border-neutral-800 bg-[#151515] px-2'}
                role={'radiogroup'}
                aria-label={'Package Manager'}
            >
                {validManagers.map((pm) => (
                    <button
                        key={pm}
                        onClick={() => handleManagerChange(pm)}
                        className={`cursor-pointer border-b-2 px-4 py-2 text-xs font-medium transition-colors ${manager === pm
                            ? 'border-red-500 text-white'
                            : 'border-transparent text-neutral-400 hover:text-neutral-200'
                        }`}
                        type={'button'}
                        role={'radio'}
                        aria-checked={manager === pm}
                    >
                        {pm}
                    </button>
                ))}
            </div>
            <div className={'group relative flex items-center justify-between p-4'}>
                <div className={'flex items-center gap-3 font-mono text-sm text-neutral-300'}>
                    <span className={'select-none text-neutral-600'}>$</span>
                    <span>{getCommand()}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className={'cursor-pointer flex size-8 items-center justify-center rounded-md text-neutral-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50'}
                    aria-label={'Copy command'}
                    type={'button'}
                >
                    {copied ? (
                        <Check
                            className={'size-4 text-emerald-500'}
                            aria-hidden={'true'}
                        />
                    ) : (
                        <Copy
                            className={'size-4'}
                            aria-hidden={'true'}
                        />
                    )}
                </button>
            </div>
        </div>
    );
};
