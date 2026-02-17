type SectionHeaderProps = {
    title: string;
    className?: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = (props): React.ReactElement => {
    return (
        <div className={`flex items-center gap-2 mb-8 ${props.className ?? ''}`}>
            <div className={'h-px flex-1 bg-linear-to-r from-transparent to-neutral-200 dark:to-neutral-800'}/>
            <span className={'px-4 text-xs font-bold tracking-widest text-neutral-400 dark:text-neutral-600 uppercase'}>
                {props.title}
            </span>
            <div className={'h-px flex-1 bg-linear-to-l from-transparent to-neutral-200 dark:to-neutral-800'}/>
        </div>
    );
};
