'use client';

import React, { useMemo, useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { useAdminTranslations } from '@i18n/use-app-translations';
import { formatUsd } from '@utils/format.util';
import type { BookingListItemDto } from '@typings/booking.type';
import { buildRevenueChartSeries, type RevenueChartLabels } from '@utils/dashboard-analytics.util';
import type { DashboardPeriod } from '@utils/dashboard-period.util';

interface RevenueChartProps {
    bookings: BookingListItemDto[];
    previousBookings: BookingListItemDto[];
    period: DashboardPeriod;
}

export function RevenueChart({ bookings, previousBookings, period }: RevenueChartProps) {
    const t = useAdminTranslations();
    const [hoveredRevIdx, setHoveredRevIdx] = useState<number | null>(null);

    const labels: RevenueChartLabels = useMemo(
        () => ({
            todayHours: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
            weekDays: [
                t('overview.chartDays.mon'),
                t('overview.chartDays.tue'),
                t('overview.chartDays.wed'),
                t('overview.chartDays.thu'),
                t('overview.chartDays.fri'),
                t('overview.chartDays.sat'),
                t('overview.chartDays.sun'),
            ],
            monthWeeks: [
                t('overview.chartWeeks.w1'),
                t('overview.chartWeeks.w2'),
                t('overview.chartWeeks.w3'),
                t('overview.chartWeeks.w4'),
            ],
            quarters: [
                t('overview.chartQuarters.q1'),
                t('overview.chartQuarters.q2'),
                t('overview.chartQuarters.q3'),
                t('overview.chartQuarters.q4'),
            ],
        }),
        [t],
    );

    const {
        labels: chartLabels,
        currentData,
        previousData,
    } = useMemo(
        () => buildRevenueChartSeries(period, bookings, previousBookings, labels),
        [period, bookings, previousBookings, labels],
    );

    const maxRevenue = Math.max(...currentData, ...previousData, 1) * 1.15;

    const svgWidth = 500;
    const svgHeight = 200;
    const paddingLeft = 45;
    const paddingRight = 15;
    const paddingTop = 15;
    const paddingBottom = 25;

    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;

    const getX = (index: number, total: number) => {
        if (total <= 1) return paddingLeft;
        return paddingLeft + (index * chartWidth) / (total - 1);
    };

    const getY = (val: number) => {
        return svgHeight - paddingBottom - (val / maxRevenue) * chartHeight;
    };

    const hasData = currentData.some((v) => v > 0) || previousData.some((v) => v > 0);

    return (
        <section className="flex h-full flex-col rounded-2xl border border-stone-200/50 bg-white p-5 shadow-xs">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-semibold text-stone-905 md:text-[19px]">
                            {t('overview.revenueChartTitle')}
                        </h3>
                        <p className="mt-0.5 font-sans text-[13px] font-medium text-stone-500">
                            {t('overview.revenueChartSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative h-64 w-full sm:h-72">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 font-sans text-sm text-stone-500">
                        {t('overview.chartNoData')}
                    </div>
                ) : (
                    <>
                        {hoveredRevIdx !== null && (
                            <div
                                className="pointer-events-none absolute z-10 rounded-xl border border-white/20 bg-primary p-3 text-xs leading-normal text-neutral shadow-xl transition-all duration-150"
                                style={{
                                    left: `${Math.min(getX(hoveredRevIdx, chartLabels.length) + 12, svgWidth - 140)}px`,
                                    top: `${Math.max(getY(currentData[hoveredRevIdx]) - 60, 10)}px`,
                                }}
                            >
                                <p className="mb-1.5 border-b border-white/10 pb-1 font-bold tracking-wider uppercase opacity-80">
                                    {chartLabels[hoveredRevIdx]}
                                </p>
                                <div className="space-y-0.5 font-sans">
                                    <p className="flex items-center justify-between gap-4">
                                        <span className="opacity-70">
                                            {t('overview.currentPeriodHighlight')}:
                                        </span>
                                        <span className="font-semibold text-sand-200">
                                            {formatUsd(currentData[hoveredRevIdx])}
                                        </span>
                                    </p>
                                    <p className="flex items-center justify-between gap-4">
                                        <span className="opacity-70">
                                            {t('overview.previousPeriodHighlight')}:
                                        </span>
                                        <span className="font-semibold opacity-90">
                                            {formatUsd(previousData[hoveredRevIdx])}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="h-full w-full select-none text-neutral-400"
                        >
                            <defs>
                                <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#D4C5B9" stopOpacity={0.65} />
                                    <stop offset="100%" stopColor="#D4C5B9" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="previousGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5F87C1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#5F87C1" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                const yValue = maxRevenue * ratio;
                                const yPos = getY(yValue);
                                return (
                                    <g key={i} className="opacity-60">
                                        <line
                                            x1={paddingLeft}
                                            y1={yPos}
                                            x2={svgWidth - paddingRight}
                                            y2={yPos}
                                            stroke="currentColor"
                                            strokeWidth="0.5"
                                            strokeDasharray="4 4"
                                            className="text-border"
                                        />
                                        <text
                                            x={paddingLeft - 8}
                                            y={yPos + 4}
                                            textAnchor="end"
                                            className="fill-neutral-700 font-sans text-[9px] font-bold"
                                        >
                                            ${Math.round(yValue)}
                                        </text>
                                    </g>
                                );
                            })}

                            <path
                                d={`
                            ${previousData.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx, chartLabels.length)} ${getY(val)}`).join(' ')}
                            L ${getX(chartLabels.length - 1, chartLabels.length)} ${svgHeight - paddingBottom}
                            L ${getX(0, chartLabels.length)} ${svgHeight - paddingBottom} Z
                        `}
                                fill="url(#previousGrad)"
                            />
                            <path
                                d={previousData
                                    .map(
                                        (val, idx) =>
                                            `${idx === 0 ? 'M' : 'L'} ${getX(idx, chartLabels.length)} ${getY(val)}`,
                                    )
                                    .join(' ')}
                                fill="none"
                                stroke="#5F87C1"
                                strokeWidth="1.5"
                                strokeDasharray="3 2"
                                className="opacity-70"
                            />

                            <path
                                d={`
                            ${currentData.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx, chartLabels.length)} ${getY(val)}`).join(' ')}
                            L ${getX(chartLabels.length - 1, chartLabels.length)} ${svgHeight - paddingBottom}
                            L ${getX(0, chartLabels.length)} ${svgHeight - paddingBottom} Z
                        `}
                                fill="url(#currentGrad)"
                            />
                            <path
                                d={currentData
                                    .map(
                                        (val, idx) =>
                                            `${idx === 0 ? 'M' : 'L'} ${getX(idx, chartLabels.length)} ${getY(val)}`,
                                    )
                                    .join(' ')}
                                fill="none"
                                stroke="#D4C5B9"
                                strokeWidth="2.5"
                            />

                            {hoveredRevIdx !== null && (
                                <line
                                    x1={getX(hoveredRevIdx, chartLabels.length)}
                                    y1={paddingTop}
                                    x2={getX(hoveredRevIdx, chartLabels.length)}
                                    y2={svgHeight - paddingBottom}
                                    stroke="#D4C5B9"
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                />
                            )}

                            {currentData.map((val, idx) => {
                                const cx = getX(idx, chartLabels.length);
                                const cy = getY(val);
                                return (
                                    <g key={idx}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={hoveredRevIdx === idx ? 5 : 3.5}
                                            fill="#D4C5B9"
                                            stroke="#FFF"
                                            strokeWidth="1.5"
                                            className="transition-all duration-100"
                                        />
                                        <rect
                                            x={cx - chartWidth / chartLabels.length / 2}
                                            y={paddingTop}
                                            width={chartWidth / chartLabels.length}
                                            height={chartHeight + paddingTop}
                                            fill="transparent"
                                            className="cursor-pointer"
                                            onMouseEnter={() => setHoveredRevIdx(idx)}
                                            onMouseLeave={() => setHoveredRevIdx(null)}
                                        />
                                    </g>
                                );
                            })}

                            {chartLabels.map((lbl, idx) => (
                                <text
                                    key={idx}
                                    x={getX(idx, chartLabels.length)}
                                    y={svgHeight - 10}
                                    textAnchor="middle"
                                    className="fill-neutral-800 font-sans text-[10px] font-bold"
                                >
                                    {lbl}
                                </text>
                            ))}
                        </svg>

                        <div className="absolute top-2 right-4 flex items-center gap-4 text-[12px] leading-none font-medium">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: '#D4C5B9' }}
                                />
                                <span className="text-stone-600">
                                    {t('overview.currentPeriod')}
                                </span>
                            </div>
                            {period !== 'all' && (
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#5F87C1' }}
                                    />
                                    <span className="text-stone-600">
                                        {t('overview.previousPeriod')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary-200/30 bg-primary-50/20 p-3 text-[12.5px]">
                <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-600/90" />
                <p className="font-sans font-medium leading-relaxed text-primary-900">
                    {t('overview.revenueNote')}
                </p>
            </div>
        </section>
    );
}
