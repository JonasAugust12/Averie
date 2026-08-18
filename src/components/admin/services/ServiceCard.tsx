'use client';

import { Pencil, Trash2, Clock } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatUsd } from '@utils/format.util';
import { cn } from '@utils/cn.util';
import type { ServiceDto } from '@typings/service.type';

interface ServiceCardProps {
    service: ServiceDto;
    onEdit: (svc: ServiceDto) => void;
    onToggle: (svc: ServiceDto) => void;
    onDelete: (svc: ServiceDto) => void;
}

export function ServiceCard({ service, onEdit, onToggle, onDelete }: ServiceCardProps) {
    const t = useAdminTranslations();

    return (
        <div
            className={cn(
                'group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200',
                service.visible
                    ? 'bg-white border-stone-200/80 shadow-2xs hover:shadow-xs hover:border-stone-300'
                    : 'bg-stone-50/70 border-stone-200/50 opacity-65',
            )}
        >
            {/* Left: Text content details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                    <h4
                        className={cn(
                            'font-sans font-bold text-sm sm:text-[15.5px] leading-snug transition-colors',
                            service.visible
                                ? 'text-stone-900 group-hover:text-stone-950'
                                : 'text-stone-400 line-through',
                        )}
                    >
                        {service.name}
                    </h4>
                    {!service.visible && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200/60 text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">
                            {t('services.hidden')}
                        </span>
                    )}
                </div>

                {service.description && (
                    <p className="mt-1.5 font-sans text-xs sm:text-[13px] text-stone-500 leading-relaxed line-clamp-2">
                        {service.description}
                    </p>
                )}

                {/* Price and Duration */}
                <div className="flex items-center gap-3 text-stone-500 font-sans text-xs uppercase font-bold tracking-wider mt-2.5">
                    <span className="flex items-center gap-1.5 text-stone-500">
                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                        {service.estimatedMinutes} min
                    </span>
                    <span className="w-1 h-1 bg-stone-300 rounded-full shrink-0" />
                    <span className="font-display font-bold text-stone-900 text-sm tracking-normal normal-case">
                        {formatUsd(service.price)}
                    </span>
                </div>
            </div>

            {/* Right actions: Toggle + Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-stone-100 sm:pl-4">
                {/* Visibility label on mobile */}
                <span className="sm:hidden font-sans text-xs font-semibold text-stone-500">
                    {service.visible ? t('services.visible') : t('services.hidden')}
                </span>

                <div className="flex items-center gap-3">
                    {/* Luxury slider toggle */}
                    <button
                        type="button"
                        onClick={() => onToggle(service)}
                        className={cn(
                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-3xs',
                            service.visible ? 'bg-stone-900' : 'bg-stone-200',
                        )}
                        role="switch"
                        aria-checked={service.visible}
                        title={service.visible ? t('services.hide') : t('services.show')}
                    >
                        <span
                            className={cn(
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                                service.visible ? 'translate-x-5' : 'translate-x-0',
                            )}
                        />
                    </button>

                    {/* Quick actions (Edit / Delete) */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onEdit(service)}
                            className="h-8.5 w-8.5 rounded-xl flex items-center justify-center border border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all duration-200 shadow-3xs cursor-pointer text-stone-600 hover:text-stone-900"
                            title={t('services.edit')}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => onDelete(service)}
                            className="h-8.5 w-8.5 rounded-xl flex items-center justify-center border border-stone-200/80 bg-white hover:border-rose-200 hover:bg-rose-50 active:scale-95 transition-all duration-200 shadow-3xs cursor-pointer text-stone-400 hover:text-rose-600"
                            title={t('services.delete')}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
