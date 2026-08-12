import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingCustomerInput } from '@validations/booking.schema';

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface BookingState {
    step: BookingStep;
    serviceIds: string[];
    staffId: string | 'any' | null;
    date: string | null;
    time: string | null;
    customer: BookingCustomerInput | null;
    reference: string | null;
    setStep: (step: BookingStep) => void;
    toggleServiceId: (id: string) => void;
    setStaffId: (id: string | 'any' | null) => void;
    setDate: (date: string | null) => void;
    setTime: (time: string | null) => void;
    setCustomer: (customer: BookingCustomerInput | null) => void;
    setReference: (ref: string | null) => void;
    reset: () => void;
}

const initial = {
    step: 1 as BookingStep,
    serviceIds: [] as string[],
    staffId: null,
    date: null,
    time: null,
    customer: null,
    reference: null,
};

export const useBookingStore = create<BookingState>()(
    persist(
        (set) => ({
            ...initial,
            setStep: (step) => set({ step }),
            toggleServiceId: (id) =>
                set((state) => {
                    const exists = state.serviceIds.includes(id);
                    const nextIds = exists
                        ? state.serviceIds.filter((x) => x !== id)
                        : [...state.serviceIds, id];
                    return { serviceIds: nextIds };
                }),
            setStaffId: (staffId) => set({ staffId }),
            setDate: (date) => set({ date }),
            setTime: (time) => set({ time }),
            setCustomer: (customer) => set({ customer }),
            setReference: (reference) => set({ reference }),
            reset: () => set({ ...initial }),
        }),
        { name: 'averie-booking-draft' },
    ),
);

export const ADMIN_MOCK_KEY = 'averie-admin-mock';

export function isAdminMockAuthed() {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(ADMIN_MOCK_KEY) === '1';
}

export function setAdminMockAuthed(value: boolean) {
    if (typeof window === 'undefined') return;
    if (value) window.sessionStorage.setItem(ADMIN_MOCK_KEY, '1');
    else window.sessionStorage.removeItem(ADMIN_MOCK_KEY);
}
