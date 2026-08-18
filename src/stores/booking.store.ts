import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingCustomerInput } from '@validations/booking.schema';

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface BookingState {
    step: BookingStep;
    serviceIds: string[];
    staffPreference: 'any' | 'specific';
    staffId: string | null;
    date: string | null;
    time: string | null;
    customer: BookingCustomerInput | null;
    reference: string | null;
    setStep: (step: BookingStep) => void;
    toggleServiceId: (id: string) => void;
    setStaffPreference: (preference: 'any' | 'specific', staffId?: string | null) => void;
    setDate: (date: string | null) => void;
    setTime: (time: string | null) => void;
    setCustomer: (customer: BookingCustomerInput | null) => void;
    setReference: (ref: string | null) => void;
    resetBookingFlow: () => void;
    reset: () => void;
}

const initial = {
    step: 1 as BookingStep,
    serviceIds: [] as string[],
    staffPreference: 'any' as const,
    staffId: null as string | null,
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
            setStaffPreference: (staffPreference, staffId = null) =>
                set({ staffPreference, staffId: staffPreference === 'any' ? null : staffId }),
            setDate: (date) => set({ date }),
            setTime: (time) => set({ time }),
            setCustomer: (customer) => set({ customer }),
            setReference: (reference) => set({ reference }),
            resetBookingFlow: () =>
                set({
                    step: 1,
                    serviceIds: [],
                    staffPreference: 'any',
                    staffId: null,
                    date: null,
                    time: null,
                    reference: null,
                }),
            reset: () => set({ ...initial }),
        }),
        {
            name: 'averie-booking-draft',
            partialize: (state) => ({
                customer: state.customer
                    ? {
                          firstName: state.customer.firstName,
                          lastName: state.customer.lastName || '',
                          phone: state.customer.phone,
                          email: state.customer.email || '',
                          note: '',
                      }
                    : null,
            }),
        },
    ),
);
