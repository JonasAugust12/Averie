import { landingMobileOnly } from '@components/marketing/landing/styles';

type Bubble = {
    className: string;
    delay?: string;
};

const presets = {
    hero: [
        {
            className:
                'absolute top-12 left-4 h-64 w-64 rounded-full bg-primary02/30 blur-3xl animate-landing-bubble sm:h-72 sm:w-72',
        },
        {
            className:
                'absolute -bottom-16 right-4 h-72 w-72 rounded-full bg-primary01/30 blur-3xl animate-landing-bubble sm:h-80 sm:w-80',
            delay: '3.5s',
        },
    ],
    services: [
        {
            className:
                'absolute top-10 right-4 h-60 w-60 rounded-full bg-primary02/35 blur-3xl animate-landing-bubble',
            delay: '2s',
        },
        {
            className:
                'absolute bottom-6 left-6 h-56 w-56 rounded-full bg-primary01/35 blur-3xl animate-landing-bubble',
            delay: '4.5s',
        },
    ],
    testimonials: [
        {
            className:
                'absolute top-1/4 -left-6 h-60 w-60 rounded-full bg-primary02/25 blur-3xl animate-landing-bubble',
            delay: '1.5s',
        },
        {
            className:
                'absolute bottom-4 -right-6 h-64 w-64 rounded-full bg-primary01/25 blur-3xl animate-landing-bubble',
            delay: '4.5s',
        },
    ],
    hours: [
        {
            className:
                'absolute top-12 left-0 h-64 w-64 rounded-full bg-primary01/35 blur-3xl animate-landing-bubble sm:left-6 sm:h-72 sm:w-72',
            delay: '2s',
        },
        {
            className:
                'absolute -bottom-8 right-0 h-72 w-72 rounded-full bg-primary02/35 blur-3xl animate-landing-bubble sm:right-6 sm:h-80 sm:w-80',
            delay: '4.5s',
        },
    ],
} as const satisfies Record<string, readonly Bubble[]>;

type LandingBubblesVariant = keyof typeof presets;

export function LandingBubbles({ variant }: { variant: LandingBubblesVariant }) {
    return (
        <div
            className={`pointer-events-none absolute inset-0 -z-10 overflow-visible ${landingMobileOnly}`}
            aria-hidden
        >
            {presets[variant].map((bubble) => (
                <div
                    key={bubble.className}
                    className={bubble.className}
                    style={bubble.delay ? { animationDelay: bubble.delay } : undefined}
                />
            ))}
        </div>
    );
}
