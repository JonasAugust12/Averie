'use client';

import { FileText, Mail, Phone, User } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';

interface CustomerForm {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    note: string;
}

interface BookingCustomerStepProps {
    form: CustomerForm;
    errors: Record<string, string>;
    onChange: (updates: Partial<CustomerForm>) => void;
}

export function BookingCustomerStep({ form, errors, onChange }: BookingCustomerStepProps) {
    const tAdmin = useAdminTranslations();

    return (
        <div className="space-y-5 max-w-lg mx-auto">
            <p className="font-sans text-sm text-stone-600 font-medium">
                {tAdmin('booking.customer.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                        {tAdmin('booking.customer.firstName')}{' '}
                        <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative flex items-center bg-white border border-stone-300 rounded-xl overflow-hidden focus-within:border-stone-900 transition-colors">
                        <User className="absolute left-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => onChange({ firstName: e.target.value })}
                            placeholder="Sarah"
                            className="w-full bg-transparent py-2.5 pl-10 pr-3 font-sans text-sm text-stone-900 outline-none rounded-[inherit]"
                        />
                    </div>
                    {errors.firstName && (
                        <p className="font-sans text-xs text-rose-600 font-semibold pl-1">
                            {errors.firstName}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                        {tAdmin('booking.customer.lastName')}
                    </label>
                    <div className="relative flex items-center bg-white border border-stone-300 rounded-xl overflow-hidden focus-within:border-stone-900 transition-colors">
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => onChange({ lastName: e.target.value })}
                            placeholder="Jenkins"
                            className="w-full bg-transparent py-2.5 px-3.5 font-sans text-sm text-stone-900 outline-none rounded-[inherit]"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                    {tAdmin('booking.customer.phone')} <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center bg-white border border-stone-300 rounded-xl overflow-hidden focus-within:border-stone-900 transition-colors">
                    <Phone className="absolute left-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        placeholder={tAdmin('booking.customer.phonePlaceholder')}
                        className="w-full bg-transparent py-2.5 pl-10 pr-3 font-sans text-sm text-stone-900 outline-none rounded-[inherit]"
                    />
                </div>
                {errors.phone && (
                    <p className="font-sans text-xs text-rose-600 font-semibold pl-1">
                        {errors.phone}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                    {tAdmin('booking.customer.email')}
                </label>
                <div className="relative flex items-center bg-white border border-stone-300 rounded-xl overflow-hidden focus-within:border-stone-900 transition-colors">
                    <Mail className="absolute left-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        placeholder={tAdmin('booking.customer.emailPlaceholder')}
                        className="w-full bg-transparent py-2.5 pl-10 pr-3 font-sans text-sm text-stone-900 outline-none rounded-[inherit]"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                    {tAdmin('booking.customer.note')}
                </label>
                <div className="relative flex items-start bg-white border border-stone-300 rounded-xl overflow-hidden focus-within:border-stone-900 transition-colors">
                    <FileText className="absolute left-3.5 top-3 h-4 w-4 text-stone-400 pointer-events-none" />
                    <textarea
                        rows={3}
                        value={form.note}
                        onChange={(e) => onChange({ note: e.target.value })}
                        placeholder={tAdmin('booking.customer.notePlaceholder')}
                        className="w-full bg-transparent py-2.5 pl-10 pr-3 font-sans text-sm text-stone-900 outline-none resize-none rounded-[inherit]"
                    />
                </div>
            </div>
        </div>
    );
}
