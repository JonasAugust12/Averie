import type { CSSProperties } from 'react';
import type { EmailPalette } from './types';

export function buildEmailStyles(palette: EmailPalette) {
    return {
        heading: {
            color: palette.primary,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: '30px',
            letterSpacing: '-0.01em',
            margin: '0 0 16px',
        } satisfies CSSProperties,
        text: {
            color: palette.primary,
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: '15px',
            lineHeight: '24px',
            margin: '0 0 12px',
        } satisfies CSSProperties,
        subText: {
            color: palette.muted,
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: '13px',
            lineHeight: '20px',
            margin: '0 0 12px',
        } satisfies CSSProperties,
        label: {
            color: palette.muted,
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            margin: '0 0 4px',
        } satisfies CSSProperties,
        value: {
            color: palette.primary,
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            margin: '0 0 16px',
        } satisfies CSSProperties,
        card: {
            backgroundColor: palette.card,
            borderRadius: '16px',
            border: `1px solid ${palette.secondary}`,
            padding: '20px',
            margin: '20px 0',
        } satisfies CSSProperties,
        highlightCard: {
            backgroundColor: palette.background,
            borderRadius: '12px',
            border: `1px solid ${palette.secondary}`,
            padding: '16px',
            margin: '12px 0',
        } satisfies CSSProperties,
        badge: {
            display: 'inline-block',
            backgroundColor: palette.card,
            color: palette.primary,
            border: `1px solid ${palette.secondary}`,
            borderRadius: '100px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            marginBottom: '16px',
        } satisfies CSSProperties,
        price: {
            color: palette.primary,
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            fontWeight: 700,
            margin: 0,
        } satisfies CSSProperties,
        link: {
            color: palette.accent || palette.primary,
            fontWeight: 600,
            textDecoration: 'none',
        } satisfies CSSProperties,
    };
}

export type EmailStyleSet = ReturnType<typeof buildEmailStyles>;
