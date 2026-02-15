import { useEffect, useState } from 'react';

export const useScroll = (threshold = 10): boolean => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > threshold) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isScrolled;
};
