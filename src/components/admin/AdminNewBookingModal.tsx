'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2, Sparkles, X } from 'lucide-react';
import {
    useAllSalonServices,
    useAllSalonStaff,
    useScheduleSettings,
    useSaveMockBooking,
    useAvailableSlots,
} from '@services/salon.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { generateBookingReference } from '@utils/format.util';
import { cn } from '@utils/cn.util';
import type { SalonBooking } from '@typings/salon.type';
import {
    BookingServiceStep,
    BookingStaffStep,
    BookingDateStep,
    BookingTimeStep,
    BookingCustomerStep,
    BookingReviewStep,
    BookingSuccessStep,
} from '@components/admin/booking';

interface AdminNewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0);
}

const STEP_TITLES = ['Services', 'Specialist', 'Date', 'Time', 'Customer', 'Review'];

export function AdminNewBookingModal({ isOpen, onClose }: AdminNewBookingModalProps) {
    const tAdmin = useAdminTranslations();
    const saveBooking = useSaveMockBooking();

    const { data: services, isLoading: servicesLoading } = useAllSalonServices();
    const { data: staff, isLoading: staffLoading } = useAllSalonStaff();
    const { data: settings } = useScheduleSettings();

    const [step, setStep] = useState<ModalStep>(1);
    const [serviceIds, setServiceIds] = useState<string[]>([]);
    const [staffId, setStaffId] = useState<string>('any');
    const [selectedDate, setSelectedDate] = useState<string>(isoDate(new Date()));
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
    const [customerForm, setCustomerForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        note: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [createdReference, setCreatedReference] = useState<string | null>(null);

    const { data: slots, isLoading: slotsLoading } = useAvailableSlots(selectedDate);

    const selectedServicesList = useMemo(
        () => (services ?? []).filter((s) => serviceIds.includes(s.id)),
        [services, serviceIds],
    );

    const totalPrice = useMemo(
        () => selectedServicesList.reduce((sum, s) => sum + s.price, 0),
        [selectedServicesList],
    );

    const totalDuration = useMemo(
        () => selectedServicesList.reduce((sum, s) => sum + s.durationMin, 0),
        [selectedServicesList],
    );

    const selectedStaffMember = useMemo(
        () => (staffId === 'any' ? null : (staff ?? []).find((s) => s.id === staffId)),
        [staff, staffId],
    );

    const filteredServices = useMemo(() => {
        let list = (services ?? []).filter((s) => s.active);
        if (selectedCategory !== 'all')
            list = list.filter((s) => s.categoryId === selectedCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
            );
        }
        return list;
    }, [services, selectedCategory, searchQuery]);

    const handleResetAll = () => {
        setStep(1);
        setServiceIds([]);
        setStaffId('any');
        setSelectedDate(isoDate(new Date()));
        setSelectedTime('');
        setSearchQuery('');
        setSelectedCategory('all');
        setCustomerForm({ firstName: '', lastName: '', phone: '', email: '', note: '' });
        setFormErrors({});
        setCreatedReference(null);
    };

    const handleClose = () => {
        handleResetAll();
        onClose();
    };

    const validateCustomerStep = () => {
        const errs: Record<string, string> = {};
        if (!customerForm.firstName.trim())
            errs.firstName = tAdmin('booking.customer.errorFirstName');
        if (!customerForm.phone.trim()) {
            errs.phone = tAdmin('booking.customer.errorPhone');
        } else if (customerForm.phone.trim().replace(/\D/g, '').length < 8) {
            errs.phone = tAdmin('booking.customer.errorPhoneInvalid');
        }
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleConfirmBooking = async () => {
        if (selectedServicesList.length === 0 || !selectedDate || !selectedTime) return;
        const reference = generateBookingReference();
        const primary = selectedServicesList[0];
        const booking: SalonBooking = {
            id: `bk-${Date.now()}`,
            reference,
            serviceId: primary.id,
            serviceIds,
            staffId: staffId === 'any' ? 'st-1' : staffId,
            date: selectedDate,
            time: selectedTime,
            durationMin: totalDuration,
            price: totalPrice,
            customer: {
                firstName: customerForm.firstName.trim(),
                lastName: customerForm.lastName.trim(),
                phone: customerForm.phone.trim(),
                email: customerForm.email.trim() || undefined,
                note: customerForm.note.trim() || undefined,
            },
            status: 'upcoming',
        };
        try {
            await saveBooking.mutateAsync(booking);
            setCreatedReference(reference);
            setStep(7);
        } catch {
            // error handling
        }
    };

    const handleNextStep = () => {
        if (step === 5) {
            if (validateCustomerStep()) setStep(6);
        } else if (step < 6) {
            setStep((s) => (s + 1) as ModalStep);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="relative flex flex-col w-full max-w-4xl h-170 max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/70 bg-stone-50/80 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-md">
                            <Sparkles className="h-5 w-5 text-amber-300" />
                        </div>
                        <div>
                            <h2 className="font-display text-xl font-black text-stone-900 leading-tight">
                                {step === 7
                                    ? tAdmin('booking.confirmTitle') || 'Booking Confirmed'
                                    : tAdmin('newBooking') || 'New Appointment'}
                            </h2>
                            <p className="font-sans text-xs text-stone-500 font-semibold mt-0.5">
                                {step === 7
                                    ? tAdmin('booking.confirmSubtitle') ||
                                      'Appointment created and scheduled successfully'
                                    : tAdmin('booking.adminFlowHint') ||
                                      'Quick administrative booking flow'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="h-9 w-9 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Stepper */}
                {step <= 6 && (
                    <div className="bg-white border-b border-stone-100 px-6 py-3 shrink-0 overflow-x-auto">
                        <div className="flex items-center justify-between gap-1.5 min-w-135">
                            {STEP_TITLES.map((title, i) => {
                                const stepNum = (i + 1) as ModalStep;
                                const isCurrent = step === stepNum;
                                const isPassed = step > stepNum;
                                return (
                                    <button
                                        key={title}
                                        type="button"
                                        disabled={!isPassed}
                                        onClick={() => setStep(stepNum)}
                                        className={cn(
                                            'flex items-center gap-2 py-1.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all',
                                            isCurrent
                                                ? 'bg-stone-900 text-white shadow-sm'
                                                : isPassed
                                                  ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer'
                                                  : 'bg-transparent text-stone-300 cursor-default',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black',
                                                isCurrent
                                                    ? 'bg-white text-stone-900'
                                                    : isPassed
                                                      ? 'bg-stone-900 text-white'
                                                      : 'bg-stone-200 text-stone-400',
                                            )}
                                        >
                                            {isPassed ? '✓' : stepNum}
                                        </span>
                                        <span>{title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 min-h-0 bg-stone-50/40">
                    {step === 1 && (
                        <BookingServiceStep
                            services={services}
                            isLoading={servicesLoading}
                            serviceIds={serviceIds}
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory}
                            filteredServices={filteredServices}
                            onToggleService={(id) =>
                                setServiceIds((prev) =>
                                    prev.includes(id)
                                        ? prev.filter((x) => x !== id)
                                        : [...prev, id],
                                )
                            }
                            onSearchChange={setSearchQuery}
                            onCategoryChange={setSelectedCategory}
                        />
                    )}

                    {step === 2 && (
                        <BookingStaffStep
                            staff={staff}
                            isLoading={staffLoading}
                            staffId={staffId}
                            onSelectStaff={setStaffId}
                        />
                    )}

                    {step === 3 && (
                        <BookingDateStep
                            selectedDate={selectedDate}
                            monthCursor={monthCursor}
                            settings={settings}
                            onSelectDate={setSelectedDate}
                            onMonthChange={setMonthCursor}
                        />
                    )}

                    {step === 4 && (
                        <BookingTimeStep
                            slots={slots}
                            isLoading={slotsLoading}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onSelectTime={setSelectedTime}
                            onChangeDate={() => setStep(3)}
                        />
                    )}

                    {step === 5 && (
                        <BookingCustomerStep
                            form={customerForm}
                            errors={formErrors}
                            onChange={(updates) => setCustomerForm((f) => ({ ...f, ...updates }))}
                        />
                    )}

                    {step === 6 && (
                        <BookingReviewStep
                            selectedServices={selectedServicesList}
                            selectedStaff={selectedStaffMember}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            totalPrice={totalPrice}
                            totalDuration={totalDuration}
                            customerForm={customerForm}
                        />
                    )}

                    {step === 7 && (
                        <BookingSuccessStep
                            createdReference={createdReference}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            selectedServices={selectedServicesList}
                            totalPrice={totalPrice}
                            customerForm={customerForm}
                            onClose={handleClose}
                            onNewBooking={handleResetAll}
                        />
                    )}
                </div>

                {/* Footer */}
                {step <= 6 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200/70 bg-white shrink-0">
                        {step === 1 ? (
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                className="border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-bold uppercase tracking-wider"
                            >
                                {tAdmin('services.cancel') || 'Cancel'}
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={() => setStep((s) => (s - 1) as ModalStep)}
                                className="border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                {tAdmin('booking.back') || 'Back'}
                            </Button>
                        )}

                        <div className="flex items-center gap-3">
                            {step === 1 && (
                                <div className="text-right hidden sm:block">
                                    <span className="font-sans text-xs text-stone-500 font-semibold">
                                        {serviceIds.length} service
                                        {serviceIds.length !== 1 ? 's' : ''} selected
                                    </span>
                                </div>
                            )}

                            {step < 6 ? (
                                <Button
                                    onClick={handleNextStep}
                                    disabled={
                                        (step === 1 && serviceIds.length === 0) ||
                                        (step === 3 && !selectedDate) ||
                                        (step === 4 && !selectedTime)
                                    }
                                    className="bg-stone-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow-md"
                                >
                                    <span>{tAdmin('booking.next') || 'Next'}</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleConfirmBooking}
                                    disabled={saveBooking.isPending}
                                    className="bg-stone-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-lg"
                                >
                                    {saveBooking.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>{tAdmin('booking.creating') || 'Creating…'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            <span>
                                                {tAdmin('booking.confirm') || 'Confirm Booking'}
                                            </span>
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
