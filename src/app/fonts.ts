import { Playfair_Display, Inter } from 'next/font/google';

export const playfair = Playfair_Display({
    variable: '--font-playfair',
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export const fontsVariables: string[] = [playfair.variable, inter.variable];
