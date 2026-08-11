import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingCustomerInput } from '@validations/booking.schema';

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface BookingState {
    step: BookingStep;
    serviceId: string | null;
    staffId: string | 'any' | null;
    date: string | null;
    time: string | null;
    customer: BookingCustomerInput | null;
    reference: string | null;
    setStep: (step: BookingStep) => void;
    setServiceId: (id: string | null) => void;
    setStaffId: (id: string | 'any' | null) => void;
    setDate: (date: string | null) => void;
    setTime: (time: string | null) => void;
    setCustomer: (customer: BookingCustomerInput | null) => void;
    setReference: (ref: string | null) => void;
    reset: () => void;
}

const initial = {
    step: 1 as BookingStep,
    serviceId: null,
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
            setServiceId: (serviceId) => set({ serviceId }),
            setStaffId: (staffId) => set({ staffId }),
            setDate: (date) => set({ date }),
            setTime: (time) => set({ time }),
            setCustomer: (customer) => set({ customer }),
            setReference: (reference) => set({ reference }),
            reset: () => set({ ...initial }),
        }),
        { name: 'avere-booking-draft' },
    ),
);

export const ADMIN_MOCK_KEY = 'avere-admin-mock';

export function isAdminMockAuthed() {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(ADMIN_MOCK_KEY) === '1';
}

export function setAdminMockAuthed(value: boolean) {
    if (typeof window === 'undefined') return;
    if (value) window.sessionStorage.setItem(ADMIN_MOCK_KEY, '1');
    else window.sessionStorage.removeItem(ADMIN_MOCK_KEY);
}
