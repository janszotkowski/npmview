import { Link } from '@tanstack/react-router';
import { ArrowRight, Box, ExternalLink, Sparkles, Star, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader.tsx';

type PromotionType = 'package' | 'external' | 'resource';

type Promotion = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    type: PromotionType;
    href: string;
    cta: string;
    gradient: string;
    featured?: boolean;
};

const PROMOTIONS: Promotion[] = [
    {
        id: 'tanstack-router',
        title: 'TanStack Router',
        description: 'Type-safe routing for React applications. The future of routing is here.',
        icon: <Zap className={'w-6 h-6 text-yellow-500'}/>,
        type: 'package',
        href: '/package/%40tanstack%2Freact-router',
        cta: 'View Package',
        gradient: 'from-yellow-500/20 to-orange-500/20',
        featured: true,
    },
    {
        id: 'react-19',
        title: 'React 19',
        description: 'Explore the latest features in the React 19 release.',
        icon: <Box className={'w-6 h-6 text-cyan-500'}/>,
        type: 'package',
        href: '/package/react',
        cta: 'Check Metadata',
        gradient: 'from-cyan-500/20 to-blue-500/20',
    },
    {
        id: 'react-summit',
        title: 'React Summit 26',
        description: 'Watch the recordings from the biggest React conference of the year.',
        icon: <Star className={'w-6 h-6 text-purple-500'}/>,
        type: 'external',
        href: 'https://reactsummit.com/',
        cta: 'Join Now',
        gradient: 'from-purple-500/20 to-pink-500/20',
    },
];

type PromotionCardProps = {
    promotion: Promotion;
};

const PromotionCard: React.FC<PromotionCardProps> = (props): React.ReactElement => {
    const isExternal = props.promotion.type === 'external';
    const Component = isExternal ? 'a' : Link;
    const componentProps = isExternal ? {href: props.promotion.href, target: '_blank', rel: 'noopener noreferrer'} : {to: props.promotion.href};

    return (

        <Component
            {...componentProps}
            className={'group relative flex flex-col p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50'}
        >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 bg-linear-to-br ${props.promotion.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}/>

            <div className={'flex items-start justify-between mb-4 relative z-10'}>
                <div className={'p-3 rounded-xl bg-white dark:bg-neutral-800 shadow-xs group-hover:scale-110 transition-transform duration-300'}>
                    {props.promotion.icon}
                </div>
                {props.promotion.featured && (
                    <span className={'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-800'}>
                        <Sparkles className={'w-3 h-3'}/>
                        Featured
                    </span>
                )}
            </div>

            <div className={'relative z-10 flex-1'}>
                <h3 className={'text-lg font-bold text-neutral-900 dark:text-white mb-2 transition-colors'}>
                    {props.promotion.title}
                </h3>
                <p className={'text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2'}>
                    {props.promotion.description}
                </p>
            </div>

            <div className={'mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors'}>
                {props.promotion.cta}
                {isExternal ? (
                    <ExternalLink className={'w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity'}/>
                ) : (
                    <ArrowRight className={'w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300'}/>
                )}
            </div>
        </Component>
    );
};

export const Promotions: React.FC = (): React.ReactElement => {
    return (
        <section className={'w-full max-w-6xl mx-auto mt-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300'}>
            <SectionHeader title={'Discover More'}/>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {PROMOTIONS.map((promo) => (
                    <PromotionCard
                        key={promo.id}
                        promotion={promo}
                    />
                ))}
            </div>
        </section>
    );
};
