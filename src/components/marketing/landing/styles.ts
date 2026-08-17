export const landingTitle =
    'font-display text-3xl sm:text-4xl font-semibold uppercase leading-tight text-nude md:text-5xl lg:text-[56px] xl:text-6xl pointer-events-none select-none';

export const landingBody =
    'font-sans text-base leading-body text-body md:text-[17px] md:leading-relaxed lg:text-[18px] lg:leading-relaxed xl:text-[19px] xl:leading-relaxed pointer-events-none select-none';

/** Static copy — headings, paragraphs, badges that are not links or buttons. */
export const landingStaticText = 'pointer-events-none select-none';

/** Section eyebrow pill (nude variant). */
export const landingEyebrow =
    'inline-flex items-center gap-2 rounded-full border border-nude/30 bg-nude/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nude pointer-events-none select-none';

/** Section eyebrow pill (muted variant). */
export const landingEyebrowMuted =
    'inline-flex items-center gap-2 rounded-full border border-stone-300/60 bg-stone-100/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted pointer-events-none select-none';

/** Static copy on login pages (admin / staff). */
export const loginStaticText = 'pointer-events-none select-none';

/** Hover target for editorial images — keeps group-hover zoom while blocking select on frame. */
export const landingImageFrame = 'group select-none';

/** Next/Image — no select or native drag; use with group-hover:scale-* on parent frame. */
export const landingImage = 'pointer-events-none select-none [-webkit-user-drag:none]';

/** Links & buttons on landing — no text highlight; click and hover animations unchanged. */
export const landingInteractive = 'select-none';

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
