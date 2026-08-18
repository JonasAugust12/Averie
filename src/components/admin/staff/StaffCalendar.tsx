'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import type { BookingCalendarEvent, CalendarDateRange } from '@utils/staff-calendar.util';
import { calendarRangeFromFullCalendar } from '@utils/staff-calendar.util';
import type { BookingListItemDto } from '@typings/booking.type';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor } from '@utils/staff.util';

interface StaffCalendarProps {
    events: BookingCalendarEvent[];
    onBookingClick?: (booking: BookingListItemDto) => void;
    initialDate?: string;
    staffList?: UserDto[];
    onRangeChange?: (range: CalendarDateRange) => void;
    isLoadingEvents?: boolean;
    accentColor?: string;
}

export function StaffCalendar({
    events,
    onBookingClick,
    initialDate,
    staffList,
    onRangeChange,
    isLoadingEvents = false,
    accentColor,
}: StaffCalendarProps) {
    const t = useAdminTranslations();
    const locale = useLocale();
    const accent = accentColor ?? '#1c1917';
    const accentMuted = accentColor ?? '#78716c';

    const handleDatesSet = useCallback(
        (arg: DatesSetArg) => {
            onRangeChange?.(calendarRangeFromFullCalendar(arg.start, arg.end));
        },
        [onRangeChange],
    );

    const handleEventClick = (info: EventClickArg) => {
        const type = info.event.extendedProps.type as string;
        if (type === 'booking' && onBookingClick) {
            onBookingClick(info.event.extendedProps.booking as BookingListItemDto);
        }
    };

    const renderEventContent = (arg: EventContentArg) => {
        const customerName = arg.event.extendedProps.customerName as string;
        const status = arg.event.extendedProps.status as string;

        return (
            <div
                className={cn(
                    'staff-event-chip flex w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-lg px-2 py-1 shadow-3xs cursor-pointer transition-transform hover:scale-101',
                )}
                style={{
                    backgroundColor: arg.event.backgroundColor ?? undefined,
                    color: '#fff',
                }}
            >
                <span className="truncate font-sans text-[11px] font-semibold leading-tight">
                    {arg.timeText} {customerName}
                </span>
                <span className="sr-only">{status}</span>
            </div>
        );
    };

    return (
        <div
            className={cn(
                'overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xs transition-opacity duration-200',
                isLoadingEvents && 'opacity-60',
            )}
        >
            <style>{`
                .fc {
                    --fc-button-bg-color: ${accent};
                    --fc-button-border-color: ${accent};
                    --fc-button-hover-bg-color: color-mix(in oklab, ${accent} 85%, black);
                    --fc-button-hover-border-color: color-mix(in oklab, ${accent} 85%, black);
                    --fc-button-active-bg-color: ${accentMuted};
                    --fc-button-active-border-color: ${accentMuted};
                    --fc-button-text-color: #ffffff;
                    --fc-today-bg-color: color-mix(in oklab, ${accentMuted} 8%, white);
                    --fc-border-color: #f0eeeb;
                    --fc-page-bg-color: #ffffff;
                    --fc-neutral-bg-color: #faf9f7;
                    --fc-neutral-text-color: #57534e;
                    font-family: inherit;
                }

                .fc .fc-toolbar {
                    padding: 1rem 1.25rem !important;
                    margin-bottom: 0 !important;
                    background-color: #faf9f7;
                    border-bottom: 1px solid #f0eeeb;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .fc .fc-toolbar-title {
                    font-family: var(--font-display, inherit);
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #1c1917;
                    letter-spacing: -0.01em;
                }

                .fc .fc-button:not(:hover):not(.fc-button-active) {
                    background-color: #ffffff;
                    color: #44403c;
                    border-color: #e7e5e4;
                }

                .fc .fc-button {
                    font-family: var(--font-sans, inherit);
                    font-weight: 600;
                    font-size: 0.75rem;
                    border-radius: 0.75rem;
                    padding: 6px 12px;
                    border: 1px solid;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
                    transition: all 0.2s ease;
                }

                .fc .fc-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
                }

                .fc .fc-button:active {
                    transform: scale(0.97);
                }

                .fc .fc-daygrid-day.fc-day-today {
                    background: linear-gradient(135deg, color-mix(in oklab, ${accentMuted} 10%, white) 0%, color-mix(in oklab, ${accentMuted} 4%, white) 100%);
                }

                .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                    color: #ffffff;
                    background-color: ${accentMuted};
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    font-weight: 700;
                    font-size: 0.75rem;
                    margin: 2px;
                }

                .fc .fc-col-header-cell {
                    background: #fdfdfd;
                    color: #78716c;
                    font-weight: 700;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 8px 4px;
                    border-color: #f0eeeb !important;
                }

                .fc-event {
                    cursor: pointer;
                    border: none !important;
                    margin: 1.5px !important;
                }

                .fc-daygrid-more-link {
                    font-weight: 700;
                    color: #78716c;
                    font-size: 0.65rem;
                    background: #f5f5f4;
                    padding: 2px 8px;
                    border-radius: 9999px;
                    border: 1px solid #e7e5e4;
                }

                .fc-theme-standard td, .fc-theme-standard th {
                    border-color: #f0eeeb;
                }
            `}</style>

            {/* Legend Bar */}
            <div className="border-b border-stone-100 bg-stone-50/70 px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    {staffList && staffList.length > 0 ? (
                        <>
                            {staffList.map((s) => (
                                <span
                                    key={s.id}
                                    className="flex items-center gap-1.5 bg-white border border-stone-200/80 px-2.5 py-1 rounded-xl shadow-3xs"
                                >
                                    <span
                                        className="h-2.5 w-2.5 rounded-full shadow-3xs"
                                        style={{ backgroundColor: getUserColor(s) }}
                                    />
                                    <span className="font-sans text-xs font-semibold text-stone-700">
                                        {formatUserName(s)}
                                    </span>
                                </span>
                            ))}
                            <span className="flex items-center gap-1.5 bg-white border border-stone-200/80 px-2.5 py-1 rounded-xl shadow-3xs">
                                <span className="h-2.5 w-2.5 rounded-full bg-stone-400" />
                                <span className="font-sans text-xs font-semibold text-stone-700">
                                    {t('overview.anyTechnician') || 'Any technician'}
                                </span>
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                                <span>{t('staff.calendarLegendConfirmed')}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                <span>{t('staff.calendarLegendPending')}</span>
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="p-3 sm:p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate={initialDate}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek',
                    }}
                    events={events}
                    datesSet={handleDatesSet}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                    eventDisplay="block"
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }}
                    dayMaxEvents={3}
                    height="auto"
                    locale={locale}
                    buttonText={{
                        today: t('staff.calendarToday'),
                        month: t('staff.calendarMonth'),
                        week: t('staff.calendarWeek'),
                    }}
                    slotMinTime="07:00:00"
                    slotMaxTime="21:00:00"
                    allDaySlot={false}
                    stickyHeaderDates
                    nowIndicator
                />
            </div>
        </div>
    );
}
