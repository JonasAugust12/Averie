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
        <section className="flex h-full flex-col justify-between rounded-2xl border border-stone-200/70 bg-white/90 p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-xs">
            <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-stone-100 shadow-sm shadow-stone-900/10">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-display text-lg font-bold text-stone-900 md:text-xl">
                                {t('overview.revenueChartTitle')}
                            </h3>
                            <p className="mt-0.5 font-sans text-xs font-medium text-stone-500">
                                {t('overview.revenueChartSubtitle')}
                            </p>
                        </div>
                    </div>

                    {hasData && (
                        <div className="flex items-center gap-2 rounded-full border border-stone-200/80 bg-stone-50/80 px-3 py-1.5 text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-stone-900 ring-2 ring-stone-900/20" />
                                <span className="text-stone-700 font-semibold">
                                    {t('overview.currentPeriod')}
                                </span>
                            </div>
                            {period !== 'all' && (
                                <>
                                    <span className="text-stone-300">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-500/20" />
                                        <span className="text-stone-500">
                                            {t('overview.previousPeriod')}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative h-64 w-full sm:h-72">
                    {!hasData ? (
                        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-6 font-sans text-xs text-stone-400">
                            <TrendingUp className="mb-2 h-7 w-7 text-stone-300" />
                            <span>{t('overview.chartNoData')}</span>
                        </div>
                    ) : (
                        <>
                            {hoveredRevIdx !== null && (
                                <div
                                    className="pointer-events-none absolute z-20 rounded-xl border border-white/10 bg-stone-900/95 p-3 text-xs text-white shadow-2xl backdrop-blur-md transition-all duration-150"
                                    style={{
                                        left: `${Math.min(Math.max(getX(hoveredRevIdx, chartLabels.length) - 70, 10), svgWidth - 170)}px`,
                                        top: `${Math.max(getY(currentData[hoveredRevIdx]) - 70, 10)}px`,
                                    }}
                                >
                                    <p className="mb-1.5 border-b border-white/15 pb-1 font-sans text-[11px] font-bold uppercase tracking-wider text-stone-300">
                                        {chartLabels[hoveredRevIdx]}
                                    </p>
                                    <div className="space-y-1 font-sans">
                                        <p className="flex items-center justify-between gap-4">
                                            <span className="flex items-center gap-1.5 text-stone-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                                                {t('overview.currentPeriodHighlight')}:
                                            </span>
                                            <span className="font-bold text-amber-200">
                                                {formatUsd(currentData[hoveredRevIdx])}
                                            </span>
                                        </p>
                                        {period !== 'all' && (
                                            <p className="flex items-center justify-between gap-4">
                                                <span className="flex items-center gap-1.5 text-stone-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                                    {t('overview.previousPeriodHighlight')}:
                                                </span>
                                                <span className="font-semibold text-indigo-200">
                                                    {formatUsd(previousData[hoveredRevIdx])}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <svg
                                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                className="h-full w-full select-none"
                            >
                                <defs>
                                    <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2B2623" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#2B2623" stopOpacity={0.0} />
                                    </linearGradient>
                                    <linearGradient id="previousGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.18} />
                                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>

                                {/* Background Grid Lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                    const yValue = maxRevenue * ratio;
                                    const yPos = getY(yValue);
                                    return (
                                        <g key={i} className="opacity-75">
                                            <line
                                                x1={paddingLeft}
                                                y1={yPos}
                                                x2={svgWidth - paddingRight}
                                                y2={yPos}
                                                stroke="#E7E5E4"
                                                strokeWidth="0.75"
                                                strokeDasharray="3 3"
                                            />
                                            <text
                                                x={paddingLeft - 8}
                                                y={yPos + 3.5}
                                                textAnchor="end"
                                                className="fill-stone-400 font-sans text-[9px] font-semibold"
                                            >
                                                ${Math.round(yValue)}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Previous Period Area & Line */}
                                {period !== 'all' && (
                                    <>
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
                                            stroke="#6366F1"
                                            strokeWidth="1.5"
                                            strokeDasharray="3 3"
                                            className="opacity-70"
                                        />
                                    </>
                                )}

                                {/* Current Period Area & Line */}
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
                                    stroke="#2B2623"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Interactive Hover Vertical Guideline */}
                                {hoveredRevIdx !== null && (
                                    <line
                                        x1={getX(hoveredRevIdx, chartLabels.length)}
                                        y1={paddingTop}
                                        x2={getX(hoveredRevIdx, chartLabels.length)}
                                        y2={svgHeight - paddingBottom}
                                        stroke="#78716C"
                                        strokeWidth="1"
                                        strokeDasharray="2 2"
                                    />
                                )}

                                {/* Current Data Points */}
                                {currentData.map((val, idx) => {
                                    const cx = getX(idx, chartLabels.length);
                                    const cy = getY(val);
                                    const isHovered = hoveredRevIdx === idx;
                                    return (
                                        <g key={idx}>
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={isHovered ? 5.5 : 3.5}
                                                fill={isHovered ? '#1C1917' : '#2B2623'}
                                                stroke="#FFFFFF"
                                                strokeWidth={isHovered ? 2.5 : 1.5}
                                                className="transition-all duration-150"
                                            />
                                            {/* Hit target for easier hover */}
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

                                {/* X-Axis Labels */}
                                {chartLabels.map((lbl, idx) => (
                                    <text
                                        key={idx}
                                        x={getX(idx, chartLabels.length)}
                                        y={svgHeight - 8}
                                        textAnchor="middle"
                                        className="fill-stone-500 font-sans text-[10px] font-semibold"
                                    >
                                        {lbl}
                                    </text>
                                ))}
                            </svg>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-stone-200/70 bg-stone-50/70 p-3 text-xs">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                <p className="font-sans font-medium leading-relaxed text-stone-600">
                    {t('overview.revenueNote')}
                </p>
            </div>
        </section>
    );
}
