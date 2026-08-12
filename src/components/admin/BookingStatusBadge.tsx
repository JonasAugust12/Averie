import type { BookingStatus } from '@typings/salon.type';
import { Badge } from '@components/ui';

const toneMap: Record<BookingStatus, 'neutral' | 'peach' | 'taupe' | 'outline'> = {
    pending: 'peach',
    confirmed: 'neutral',
    rejected: 'outline',
    cancelled: 'outline',
};

interface BookingStatusBadgeProps {
    status: BookingStatus;
    label: string;
}

export function BookingStatusBadge({ status, label }: BookingStatusBadgeProps) {
    return <Badge tone={toneMap[status]}>{label}</Badge>;
}
