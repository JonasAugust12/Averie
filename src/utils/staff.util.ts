import type { UserDto } from '@typings/salon-user.type';

export function formatUserName(user: Pick<UserDto, 'firstName' | 'lastName'>): string {
    return `${user.firstName} ${user.lastName}`.trim();
}

export function deriveInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export function getUserInitials(user: UserDto): string {
    return user.staffProfile?.initials ?? deriveInitials(formatUserName(user));
}

export function getUserColor(user: UserDto): string {
    return user.staffProfile?.color ?? '#78716c';
}

/** Append hex alpha to `#RRGGBB`. `alpha` is 0–100 (opacity percent). */
export function staffColorAlpha(color: string, alpha: number): string {
    const clamped = Math.min(100, Math.max(0, alpha));
    const hex = Math.round((clamped / 100) * 255)
        .toString(16)
        .padStart(2, '0');
    return `${color}${hex}`;
}
