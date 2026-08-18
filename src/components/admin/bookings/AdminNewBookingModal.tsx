'use client';

import { useState, useMemo } from 'react';
import {
    CalendarPlus,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Check,
    Loader2,
    X,
    Plus,
} from 'lucide-react';
import { useAllServices, useServiceCategories } from '@services/service-catalog.service';
import { useAllStaff } from '@services/staff.service';
import { useScheduleSettings } from '@services/schedule.service';
import { useCreateBooking, useAvailableSlots } from '@services/booking.service';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { Button } from '@components/common';
import { cn } from '@utils/cn.util';
import { usePreventScroll } from '@hooks/usePreventScroll';
import {
    BookingServiceStep,
    BookingStaffStep,
    BookingDateStep,
    BookingTimeStep,
    BookingCustomerStep,
    BookingReviewStep,
    BookingSuccessStep,
} from '@components/admin/bookings';

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

const ADMIN_STEP_DOT_SIZE_PX = 32;
const ADMIN_STEP_DOT_RADIUS_PX = ADMIN_STEP_DOT_SIZE_PX / 2;

export function AdminNewBookingModal({ isOpen, onClose }: AdminNewBookingModalProps) {
    const tAdmin = useAdminTranslations();
    const createBooking = useCreateBooking();
    usePreventScroll(isOpen);

    const { data: services, isLoading: servicesLoading } = useAllServices();
    const { data: categories } = useServiceCategories();
    const { data: staff, isLoading: staffLoading } = useAllStaff();
    const { data: settings } = useScheduleSettings();

    const [step, setStep] = useState<ModalStep>(1);
    const [serviceIds, setServiceIds] = useState<string[]>([]);
    const [staffPreference, setStaffPreference] = useState<'any' | 'specific'>('any');
    const [staffId, setStaffId] = useState<string | null>(null);
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

    const { data: slots, isLoading: slotsLoading } = useAvailableSlots(selectedDate, serviceIds);

    const selectedServicesList = useMemo(
        () => (services ?? []).filter((s) => serviceIds.includes(s.id)),
        [services, serviceIds],
    );

    const totalPrice = useMemo(
        () => selectedServicesList.reduce((sum, s) => sum + s.price, 0),
        [selectedServicesList],
    );

    const totalDuration = useMemo(
        () => selectedServicesList.reduce((sum, s) => sum + s.estimatedMinutes, 0),
        [selectedServicesList],
    );

    const selectedStaffMember = useMemo(
        () =>
            staffPreference === 'specific' && staffId
                ? (staff ?? []).find((s) => s.id === staffId)
                : null,
        [staff, staffId, staffPreference],
    );

    const filteredServices = useMemo(() => {
        let list = (services ?? []).filter((s) => s.visible);
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
        setStaffPreference('any');
        setStaffId(null);
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
        if (staffPreference === 'specific' && !staffId) return;

        createBooking.mutate(
            {
                serviceIds,
                staffPreference,
                staffId: staffPreference === 'specific' ? (staffId ?? undefined) : undefined,
                date: selectedDate,
                time: selectedTime,
                customer: {
                    firstName: customerForm.firstName.trim(),
                    lastName: customerForm.lastName.trim() || '—',
                    phone: customerForm.phone.trim(),
                    email: customerForm.email.trim() || undefined,
                    note: customerForm.note.trim() || undefined,
                },
            },
            {
                onSuccess: (data) => {
                    setCreatedReference(data.reference);
                    setStep(7);
                },
            },
        );
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
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-md animate-in fade-in duration-200 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="relative flex h-full max-h-full w-full max-w-app flex-col overflow-hidden rounded-3xl border border-stone-300/90 bg-stone-50 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-stone-300/70 bg-stone-100 px-6 py-5 lg:px-8 lg:py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-md lg:h-11 lg:w-11">
                            {step === 7 ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden />
                            ) : (
                                <CalendarPlus className="h-5 w-5" aria-hidden />
                            )}
                        </div>
                        <div>
                            <h2 className="font-display text-xl font-black leading-tight text-stone-900 lg:text-2xl">
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
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-stone-300/70 text-stone-700 transition-colors hover:bg-stone-300"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Stepper */}
                {step <= 6 && (
                    <div className="shrink-0 overflow-x-auto border-b border-stone-200 bg-stone-50 px-4 py-4 sm:px-6 lg:px-8">
                        <nav
                            aria-label="Booking progress"
                            className="mx-auto w-full max-w-5xl min-w-136 lg:min-w-0"
                        >
                            <ol className="flex w-full items-start">
                                {STEP_TITLES.map((title, index) => {
                                    const stepNum = (index + 1) as ModalStep;
                                    const isPassed = step > stepNum;
                                    const isCurrent = step === stepNum;
                                    const isLast = index === STEP_TITLES.length - 1;

                                    return (
                                        <li
                                            key={title}
                                            className="relative flex flex-1 flex-col items-center"
                                        >
                                            {!isLast && (
                                                <div
                                                    aria-hidden
                                                    className="pointer-events-none absolute z-0 h-0.5"
                                                    style={{
                                                        top: ADMIN_STEP_DOT_RADIUS_PX,
                                                        left: `calc(50% + ${ADMIN_STEP_DOT_RADIUS_PX}px)`,
                                                        width: `calc(100% - ${ADMIN_STEP_DOT_SIZE_PX}px)`,
                                                    }}
                                                >
                                                    <div className="h-full w-full rounded-full bg-stone-200/90" />
                                                    <div
                                                        key={`${stepNum}-${isPassed ? 'done' : isCurrent ? 'active' : 'idle'}`}
                                                        className={cn(
                                                            'absolute inset-y-0 left-0 origin-left rounded-full bg-stone-900',
                                                            isPassed &&
                                                                'animate-booking-step-line-fill',
                                                            isCurrent &&
                                                                'animate-booking-step-line-hint',
                                                            !isPassed && !isCurrent && 'w-0',
                                                        )}
                                                    />
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                disabled={!isPassed}
                                                onClick={() => isPassed && setStep(stepNum)}
                                                className={cn(
                                                    'group relative z-10 flex flex-col items-center border-0 bg-transparent p-0 outline-none transition-all duration-200',
                                                    isPassed
                                                        ? 'cursor-pointer hover:scale-105'
                                                        : 'cursor-default',
                                                )}
                                            >
                                                <div className="relative">
                                                    <div
                                                        className={cn(
                                                            'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ring-[3px] ring-stone-50 transition-all duration-300',
                                                            isPassed
                                                                ? 'border-stone-900 bg-stone-900 text-white'
                                                                : isCurrent
                                                                  ? 'border-stone-900 bg-white text-stone-900 shadow-md shadow-stone-900/10'
                                                                  : 'border-stone-300 bg-white text-stone-400',
                                                        )}
                                                    >
                                                        {isPassed ? (
                                                            <Check
                                                                className="h-3.5 w-3.5"
                                                                strokeWidth={3}
                                                            />
                                                        ) : (
                                                            <span className="font-sans text-[11px] font-black">
                                                                {stepNum}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isCurrent && (
                                                        <span
                                                            aria-hidden
                                                            className="absolute -inset-1 rounded-full bg-stone-900/10 animate-ambient-pulse"
                                                        />
                                                    )}
                                                </div>

                                                <span
                                                    className={cn(
                                                        'mt-2 w-full truncate px-0.5 text-center font-sans text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] lg:text-xs',
                                                        isCurrent
                                                            ? 'font-bold text-stone-900'
                                                            : isPassed
                                                              ? 'font-bold text-stone-700'
                                                              : 'text-stone-400',
                                                    )}
                                                >
                                                    {title}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>
                    </div>
                )}

                {/* Modal Body */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-stone-100/90 p-5 sm:p-7 lg:p-8">
                    <div className="mx-auto w-full max-w-5xl">
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
                                categories={categories ?? []}
                            />
                        )}

                        {step === 2 && (
                            <BookingStaffStep
                                staff={staff}
                                isLoading={staffLoading}
                                staffPreference={staffPreference}
                                staffId={staffId}
                                onSelectAny={() => {
                                    setStaffPreference('any');
                                    setStaffId(null);
                                }}
                                onSelectStaff={(id) => {
                                    setStaffPreference('specific');
                                    setStaffId(id);
                                }}
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
                                onChange={(updates) =>
                                    setCustomerForm((f) => ({ ...f, ...updates }))
                                }
                            />
                        )}

                        {step === 6 && (
                            <BookingReviewStep
                                selectedServices={selectedServicesList}
                                selectedStaff={selectedStaffMember}
                                staffPreference={staffPreference}
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
                            />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between border-t border-stone-300/70 bg-stone-50 px-6 py-4 lg:px-8 lg:py-5">
                    {step === 7 ? (
                        <div className="flex items-center justify-between w-full gap-3">
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                className="border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl uppercase tracking-wider text-xs font-bold"
                            >
                                {tAdmin('booking.success.close') || 'Close'}
                            </Button>
                            <Button
                                onClick={handleResetAll}
                                className="bg-stone-900 text-white rounded-xl uppercase tracking-wider text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                {tAdmin('booking.success.newBooking') || 'New Appointment'}
                            </Button>
                        </div>
                    ) : (
                        <>
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
                                        className="flex items-center gap-1.5 bg-stone-900 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:shadow-md lg:px-5 lg:py-2.5"
                                    >
                                        <span>{tAdmin('booking.next') || 'Next'}</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConfirmBooking}
                                        disabled={createBooking.isPending}
                                        className="bg-stone-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-lg"
                                    >
                                        {createBooking.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>
                                                    {tAdmin('booking.creating') || 'Creating…'}
                                                </span>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
