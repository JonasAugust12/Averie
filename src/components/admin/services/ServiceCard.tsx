'use client';

import { Pencil, Trash2, Clock } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatUsd } from '@utils/format.util';
import { cn } from '@utils/cn.util';
import type { SalonService } from '@typings/salon.type';

interface ServiceCardProps {
    service: SalonService;
    onEdit: (svc: SalonService) => void;
    onToggle: (svc: SalonService) => void;
    onDelete: (svc: SalonService) => void;
}

export function ServiceCard({ service, onEdit, onToggle, onDelete }: ServiceCardProps) {
    const t = useAdminTranslations();

    return (
        <div
            className={cn(
                'group flex items-center justify-between p-5 rounded-2xl border transition-all duration-200',
                service.active
                    ? 'bg-white border-stone-200/80 shadow-xs hover:shadow-md hover:border-stone-350'
                    : 'bg-stone-50/60 border-stone-200/45 opacity-65',
            )}
        >
            {/* Left: Text content details */}
            <div className="flex-1 min-w-0 mr-6">
                <div className="flex items-center gap-2.5 flex-wrap">
                    <h4
                        className={cn(
                            'font-sans font-bold text-[15.5px] leading-tight transition-colors',
                            service.active
                                ? 'text-stone-900 group-hover:text-stone-950'
                                : 'text-stone-400 line-through',
                        )}
                    >
                        {service.name}
                    </h4>
                    {!service.active && (
                        <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200/40 text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">
                            {t('services.hidden')}
                        </span>
                    )}
                </div>
                {service.description && (
                    <p className="mt-2 font-sans text-[13px] text-stone-500 leading-relaxed line-clamp-2">
                        {service.description}
                    </p>
                )}
                {/* Price and Duration in uppercase style sheet inline */}
                <div className="flex items-center gap-2.5 text-stone-500 font-sans text-xs uppercase font-bold tracking-wider mt-3">
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                        {service.durationMin} Min
                    </span>
                    <span className="w-1.5 h-1.5 bg-stone-300 rounded-full shrink-0" />
                    <span className="text-stone-700">{formatUsd(service.price)}</span>
                </div>
            </div>

            {/* Right actions: Toggle + Actions split by border line */}
            <div className="flex items-center gap-4 shrink-0 pl-5 border-l border-stone-200/50">
                {/* Premium slider toggle */}
                <button
                    type="button"
                    onClick={() => onToggle(service)}
                    className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none',
                        service.active ? 'bg-stone-850 bg-[#2b2623]' : 'bg-[#e3e2e1]',
                    )}
                    role="switch"
                    aria-checked={service.active}
                    title={service.active ? t('services.hide') : t('services.show')}
                >
                    <span
                        className={cn(
                            'pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition duration-300 ease-in-out mt-0.5 ml-0.5',
                            service.active ? 'translate-x-5' : 'translate-x-0',
                        )}
                    />
                </button>

                {/* Quick actions (Edit / Delete) */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onEdit(service)}
                        className="h-9 w-9 rounded-lg flex items-center justify-center border border-stone-200/60 bg-white hover:border-stone-400 hover:bg-stone-100 hover:scale-110 active:scale-90 transition-all duration-300 ease-in-out shadow-xs"
                        title={t('services.edit')}
                    >
                        <Pencil className="h-3.5 w-3.5 text-stone-500" />
                    </button>
                    <button
                        onClick={() => onDelete(service)}
                        className="h-9 w-9 rounded-lg flex items-center justify-center border border-stone-200/60 bg-white hover:border-red-300 hover:bg-red-50 hover:scale-110 active:scale-90 transition-all duration-300 ease-in-out shadow-xs"
                        title={t('services.delete')}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}
