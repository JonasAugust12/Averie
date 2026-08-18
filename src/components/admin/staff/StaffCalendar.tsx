'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventContentArg } from '@fullcalendar/core';
import { useLocale } from 'next-intl';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { cn } from '@utils/cn.util';
import type { BookingCalendarEvent } from '@utils/staff-calendar.util';
import type { BookingListItemDto } from '@typings/booking.type';
import type { UserDto } from '@typings/salon-user.type';
import { formatUserName, getUserColor } from '@utils/staff.util';

interface StaffCalendarProps {
    events: BookingCalendarEvent[];
    onBookingClick?: (booking: BookingListItemDto) => void;
    initialDate?: string;
    staffList?: UserDto[];
}

export function StaffCalendar({
    events,
    onBookingClick,
    initialDate,
    staffList,
}: StaffCalendarProps) {
    const t = useAdminTranslations();
    const locale = useLocale();

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
                    'staff-event-chip flex w-full min-w-0 items-center gap-1 overflow-hidden rounded-md px-1.5 py-0.5 shadow-sm',
                )}
                style={{
                    backgroundColor: arg.event.backgroundColor ?? undefined,
                    color: '#fff',
                }}
            >
                <span className="truncate text-[10px] font-semibold leading-tight">
                    {arg.timeText} {customerName}
                </span>
                <span className="sr-only">{status}</span>
            </div>
        );
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            <style>{`
                .fc {
                    --fc-button-bg-color: #2b2623;
                    --fc-button-border-color: #2b2623;
                    --fc-button-hover-bg-color: #44403c;
                    --fc-button-hover-border-color: #44403c;
                    --fc-button-active-bg-color: #78716c;
                    --fc-button-active-border-color: #78716c;
                    --fc-button-text-color: #ffffff;
                    --fc-today-bg-color: color-mix(in oklab, #78716c 8%, white);
                    --fc-border-color: #e7e5e4;
                    --fc-page-bg-color: #ffffff;
                    --fc-neutral-bg-color: #fafaf9;
                    --fc-neutral-text-color: #57534e;
                    font-family: inherit;
                }

                .fc .fc-toolbar {
                    padding: 1rem 1.25rem !important;
                    margin-bottom: 0 !important;
                    background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%);
                    border-bottom: 1px solid #e7e5e4;
                }

                .fc .fc-toolbar-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1c1917;
                    letter-spacing: -0.02em;
                }

                .fc .fc-button:not(:hover):not(.fc-button-active) {
                    background-color: #ffffff;
                    color: #44403c;
                    border-color: #d6d3d1;
                }

                .fc .fc-button {
                    font-weight: 600;
                    font-size: 0.75rem;
                    border-radius: 9999px;
                    padding: 6px 12px;
                    border: 1px solid;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
                    transition: all 0.2s ease;
                }

                .fc .fc-button:hover {
                    transform: translateY(-1px);
                }

                .fc .fc-daygrid-day.fc-day-today {
                    background: linear-gradient(135deg, color-mix(in oklab, #78716c 10%, white) 0%, color-mix(in oklab, #78716c 5%, white) 100%);
                }

                .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                    color: #44403c;
                    background: rgba(120, 113, 108, 0.15);
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    font-weight: 700;
                }

                .fc .fc-col-header-cell {
                    background: #f5f5f4;
                    color: #78716c;
                    font-weight: 700;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 8px 4px;
                }

                .fc-event {
                    cursor: pointer;
                    border: none !important;
                    margin: 1px !important;
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
                    border-color: #e7e5e4;
                }
            `}</style>

            <div className="border-b border-stone-100 bg-linear-to-r from-stone-50 to-white px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    {staffList && staffList.length > 0 ? (
                        <>
                            {staffList.map((s) => (
                                <span
                                    key={s.id}
                                    className="flex items-center gap-1.5 bg-stone-100/50 border border-stone-200/50 px-2 py-0.5 rounded-md"
                                >
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: getUserColor(s) }}
                                    />
                                    <span>{formatUserName(s)}</span>
                                </span>
                            ))}
                            <span className="flex items-center gap-1.5 bg-stone-100/50 border border-stone-200/50 px-2 py-0.5 rounded-md">
                                <span className="h-2.5 w-2.5 rounded-full bg-stone-400" />
                                <span>{t('overview.anyTechnician') || 'KTV ngẫu nhiên'}</span>
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                                {t('staff.calendarLegendConfirmed')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                {t('staff.calendarLegendPending')}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="p-3">
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
