import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

type InstallCommandProps = {
    packageName: string;
};

type PackageManager = 'npm' | 'pnpm' | 'yarn';

export const InstallCommand: React.FC<InstallCommandProps> = (props): React.ReactElement => {
    const [manager, setManager] = useState<PackageManager>('npm');
    const [copied, setCopied] = useState(false);

    const getCommand = (): string => {
        switch (manager) {
            case 'npm':
                return `npm i ${props.packageName}`;
            case 'pnpm':
                return `pnpm add ${props.packageName}`;
            case 'yarn':
                return `yarn add ${props.packageName}`;
        }
    };

    const handleCopy = async (): Promise<void> => {
        await navigator.clipboard.writeText(getCommand());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={'w-full max-w-md overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl'}>
            <div className={'flex items-center border-b border-neutral-800 bg-neutral-900/50 px-2'}>
                {(['npm', 'pnpm', 'yarn'] as const).map((pm) => (
                    <button
                        key={pm}
                        onClick={() => setManager(pm)}
                        className={`cursor-pointer px-4 py-2 text-xs font-medium transition-colors ${manager === pm
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-neutral-300 hover:text-red-300'
                        }`}
                        type={'button'}
                    >
                        {pm}
                    </button>
                ))}
            </div>
            <div className={'group relative flex items-center justify-between p-4'}>
                <div className={'flex items-center gap-3 font-mono text-sm text-neutral-300'}>
                    <Terminal className={'size-4 text-neutral-600'}/>
                    <span>{getCommand()}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className={'cursor-pointer flex size-8 items-center justify-center rounded-md text-neutral-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50'}
                    aria-label={'Copy command'}
                    type={'button'}
                >
                    {copied ? <Check className={'size-4 text-emerald-500'}/> : <Copy className={'size-4'}/>}
                </button>
            </div>
        </div>
    );
};
