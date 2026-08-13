import { Montserrat } from 'next/font/google';

export const montserrat = Montserrat({
    variable: '--font-montserrat',
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export const fontsVariables: string[] = [montserrat.variable];
