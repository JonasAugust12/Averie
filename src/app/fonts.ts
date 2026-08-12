import { Italiana, Plus_Jakarta_Sans } from 'next/font/google';

export const italiana = Italiana({
    variable: '--font-italiana',
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
});

export const plusJakartaSans = Plus_Jakarta_Sans({
    variable: '--font-plus-jakarta',
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
});

export const fontsVariables: string[] = [italiana.variable, plusJakartaSans.variable];
