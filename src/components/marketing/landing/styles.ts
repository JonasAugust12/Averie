export const landingTitle =
    'font-display text-3xl sm:text-4xl font-semibold uppercase leading-tight text-nude md:text-5xl lg:text-[56px] xl:text-6xl';

export const landingBody =
    'font-sans text-base leading-body text-body md:text-[17px] md:leading-relaxed lg:text-[18px] lg:leading-relaxed xl:text-[19px] xl:leading-relaxed';

/** Show block only at md+ (desktop landing layouts). */
export const landingDesktopOnly = 'hidden md:block';

/** Show block only below md (mobile landing layouts). */
export const landingMobileOnly = 'md:hidden';

/** Hide decorative SVG ornaments on small screens. */
export const landingOrnamentDesktopOnly = 'pointer-events-none hidden md:block';

/** Full-viewport background band; grid/content stays within AppShell max-width. */
export const landingBleedWhite =
    "relative isolate before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-white before:content-['']";

/** Full-viewport secondary-600 band for footer tail, legal bar, etc. */
export const landingBleedSecondary600 =
    "relative isolate before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-secondary-600 before:content-['']";

/** Viewport left edge; pair with -translate-x-1/2 to clip half off-screen. */
export const landingBleedLeft = 'left-[calc(50%-50vw)] -translate-x-1/2';

/** Viewport right edge; pair with -translate-x-1/2 to clip half off-screen. */
export const landingBleedRight = 'left-[calc(50%+50vw)] -translate-x-1/2';
