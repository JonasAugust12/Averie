export function formatUsd(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function generateBookingReference(): string {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `AVR-${num}`;
}

export function formatDisplayDate(iso: string): string {
    const date = new Date(`${iso}T12:00:00`);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
