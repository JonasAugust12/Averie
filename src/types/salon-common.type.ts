export type UserRole = 'admin' | 'staff';

export type BookingStatus = 'upcoming' | 'cancelled';

export type BookingDisplayStatus = BookingStatus | 'completed';

export type StaffPreference = 'any' | 'specific';

export type DayPeriod = 'morning' | 'afternoon' | 'evening';

export type DayOffScope = 'full' | DayPeriod;
