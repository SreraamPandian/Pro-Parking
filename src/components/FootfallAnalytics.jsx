import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { vehicleAnalyticsMockData as data } from '../data/footfallMockData';
import { TrendingUp, TrendingDown, Clock, Filter, ChevronDown, Calendar } from 'lucide-react';

// ────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────

const PeriodFilter = ({ value, onChange }) => (
    <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {['Monthly', 'Weekly', 'Yearly'].map((p) => (
            <button
                key={p}
                onClick={() => onChange(p)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200 
                    ${value === p ? 'bg-[#004EA8] text-white' : 'bg-white text-gray-400 hover:bg-blue-50 hover:text-[#004EA8]'}`}
            >
                {p}
            </button>
        ))}
    </div>
);

const TargetRing = ({ pct, color, trackColor }) => {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const filled = circ * (parseFloat(pct) / 100);
    return (
        <svg width="52" height="52" viewBox="0 0 48 48" className="-rotate-90">
            <circle cx="24" cy="24" r={r} fill="none" stroke={trackColor} strokeWidth="5" />
            <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="5"
                strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
        </svg>
    );
};

const MetricCard = ({ title, metric, period, color = '#004EA8', trackColor = '#DBEAFE', pctKey }) => {
    const pm = data.periodMetrics[period];
    const pct = parseFloat(pm[pctKey]) || 0;
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-center gap-4">
                {/* Ring */}
                <div className="relative flex-shrink-0">
                    <TargetRing pct={pct} color={color} trackColor={trackColor} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5"/>
                            <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2.5"/>
                            <circle cx="12" cy="12" r="2" fill={color}/>
                        </svg>
                    </div>
                    {/* Pct badge */}
                    <span className={`absolute -bottom-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full`}
                        style={{ background: trackColor, color }}>
                        {pm[pctKey]}
                    </span>
                </div>
                {/* Values */}
                <div className="flex-1 min-w-0">
                    <p className="text-2xl font-black tracking-tighter truncate" style={{ color }}>
                        {metric.value}
                    </p>
                    <div className={`flex items-center gap-1 text-[10px] font-bold mt-0.5 ${metric.trendUp ? 'text-emerald-500' : 'text-[#EC1B22]'}`}>
                        {metric.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {metric.trend} vs prev {period.toLowerCase().replace('ly', '')}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SimpleMetricCard = ({ title, valueProp, label, color = '#004EA8', period, icon: Icon }) => {
    const pm = data.periodMetrics[period];
    const val = pm[valueProp];
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-black tracking-tighter" style={{ color }}>{val.value}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold border-t border-gray-50 pt-2">
                {Icon && <Icon size={11} className="flex-shrink-0" style={{ color }} />}
                <span>{val.label}</span>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
const VehicleAnalytics = () => {
    const [period, setPeriod] = useState('Monthly');
    const [activeView, setActiveView] = useState('Overview');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-03-08');

    const pm = data.periodMetrics[period];

    // Resolve chart data based on period
    const overviewData = period === 'Weekly' ? data.weeklyOverview
        : period === 'Yearly' ? data.yearlyOverview
        : data.monthlyOverview;

    const overviewLabels = period === 'Weekly'
        ? overviewData.map(d => d.week)
        : period === 'Yearly'
        ? overviewData.map(d => d.year)
        : overviewData.map(d => d.month.substring(0, 3));

    const splitData = period === 'Weekly' ? data.weeklySplit
        : period === 'Yearly' ? data.yearlySplit
        : data.monthlySplit;
    const locAVal = splitData.locationA;
    const locBVal = splitData.locationB;
    const total = locAVal + locBVal;

    // Chart Options
    const overviewBarOption = {
        grid: { top: 30, right: 20, bottom: 40, left: 20, containLabel: true },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: overviewLabels,
            axisLabel: { color: '#9CA3AF', fontSize: 9, interval: 0, rotate: period === 'Monthly' ? 30 : 0 },
            axisLine: { lineStyle: { color: '#F3F4F6' } }
        },
        yAxis: { type: 'value', show: false },
        series: [{
            type: 'bar',
            data: overviewData.map((d, i) => ({
                value: d.actual,
                itemStyle: {
                    color: i === overviewData.length - (period === 'Monthly' ? 10 : 1) ? '#004EA8' : '#E9EEF5',
                    borderRadius: [4, 4, 0, 0]
                }
            })),
            barMaxWidth: 28
        }]
    };

    const splitOption = {
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: [period === 'Weekly' ? 'This Week' : period === 'Yearly' ? 'This Year' : 'This Month'],
            axisLabel: { color: '#9CA3AF' }
        },
        yAxis: { type: 'value', show: false },
        series: [
            {
                name: 'Location B', type: 'bar', stack: 'total',
                data: [locBVal], color: '#EC1B22', barWidth: '55%',
                label: { show: true, position: 'inside', color: '#fff', fontSize: 10, fontWeight: 'bold',
                    formatter: ({ value }) => `${value.toLocaleString()}\n${Math.round(value/total*100)}%` }
            },
            {
                name: 'Location A', type: 'bar', stack: 'total',
                data: [locAVal], color: '#004EA8',
                label: { show: true, position: 'inside', color: '#fff', fontSize: 10, fontWeight: 'bold',
                    formatter: ({ value }) => `${value.toLocaleString()}\n${Math.round(value/total*100)}%` }
            }
        ]
    };

    const weekdayOption = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data.weekdayTrend.map(d => d.day), boundaryGap: false, axisLabel: { color: '#9CA3AF', fontSize: 10 } },
        yAxis: { type: 'value', show: false },
        series: [{
            data: data.weekdayTrend.map(d => d.value),
            type: 'line', smooth: true, symbolSize: 7, color: '#004EA8',
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,78,168,0.15)' }, { offset: 1, color: 'rgba(0,78,168,0)' }] } }
        }]
    };

    const donutOption = {
        series: [{
            type: 'pie', radius: ['55%', '78%'], avoidLabelOverlap: false,
            label: { show: false }, labelLine: { show: false },
            data: data.locationDistribution,
            color: data.locationDistribution.map(d => d.color)
        }]
    };

    const yoyOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0, left: 'center', data: ['2024', '2025', '2026'], textStyle: { fontSize: 10 } },
        grid: { top: 20, right: 20, bottom: 50, left: 20, containLabel: true },
        xAxis: { type: 'category', data: Array.from({ length: 31 }, (_, i) => i + 1), axisLabel: { color: '#9CA3AF', fontSize: 9 } },
        yAxis: { type: 'value', show: false },
        series: [
            { name: '2024', type: 'line', smooth: true, data: data.yoyComparison.years[2024], color: '#D1D5DB', lineStyle: { type: 'dashed', width: 1 }, symbol: 'none' },
            { name: '2025', type: 'line', smooth: true, data: data.yoyComparison.years[2025], color: '#004EA8', lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 5 },
            { name: '2026', type: 'line', smooth: true, data: data.yoyComparison.years[2026], color: '#EC1B22', lineStyle: { width: 2.5 }, symbol: 'circle', symbolSize: 7 }
        ]
    };

    return (
        <div className="mt-10 space-y-6">
            {/* ── Section Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">Vehicle Analytics</h2>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">Comprehensive traffic and distribution reports</p>
                </div>
                {/* Global Period Filter */}
                <PeriodFilter value={period} onChange={setPeriod} />
            </div>

            {/* ── Row 1: Metric Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Vehicle Entry YTD"
                    metric={pm.vehicleEntry}
                    period={period}
                    color="#004EA8"
                    trackColor="#DBEAFE"
                    pctKey="entryTarget"
                />
                <MetricCard
                    title="Vehicle Current Period"
                    metric={pm.vehicleCurrentMonth}
                    period={period}
                    color="#EC1B22"
                    trackColor="#FEE2E2"
                    pctKey="monthTarget"
                />
                <SimpleMetricCard
                    title="Avg Vehicle Entry"
                    valueProp="avgEntry"
                    period={period}
                    color="#004EA8"
                    icon={TrendingUp}
                />
                <SimpleMetricCard
                    title="Avg Dwell Time"
                    valueProp="avgDwellTime"
                    period={period}
                    color="#EC1B22"
                    icon={Clock}
                />
            </div>

            {/* ── Row 2: Location Donut + Filter Tabs (matching image 2) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Location donut */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                    <div className="flex gap-3 text-[10px] font-black mb-3">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#004EA8]"></span> Location A</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EC1B22]"></span> Location B</span>
                    </div>
                    <ReactECharts option={donutOption} style={{ height: '160px', width: '100%' }} />
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1 px-2 w-full">
                        <span>{Math.round(locBVal/total*100)}% Loc B</span>
                        <span>{Math.round(locAVal/total*100)}% Loc A</span>
                    </div>
                </div>

                {/* View tabs + info (matching image 2 design) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
                    {/* Tab row */}
                    <div className="flex gap-2 mb-4">
                        {['Overview', 'Indoor', 'Days'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setActiveView(v)}
                                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-sm
                                    ${activeView === v
                                        ? 'bg-[#004EA8] text-white shadow-blue-200 shadow-md'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    {/* Working time info */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center">
                            <Clock size={10} className="text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">Working Time (07:00 to 23:00)</span>
                    </div>
                    {/* Date range - now controlled with state */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <Calendar size={11} className="text-[#004EA8]" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                className="text-[10px] font-bold text-gray-500 bg-transparent border-0 outline-none cursor-pointer w-24"
                            />
                        </div>
                        <span className="text-gray-300 font-black">—</span>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <Calendar size={11} className="text-[#004EA8]" />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                className="text-[10px] font-bold text-gray-500 bg-transparent border-0 outline-none cursor-pointer w-24"
                            />
                        </div>
                    </div>
                    {/* Avg per day */}
                    <div className="mt-auto border-t border-gray-50 pt-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Entry / Day</p>
                        <p className="text-3xl font-black text-[#004EA8] tracking-tighter mt-1">{pm.avgEntry.value}</p>
                    </div>
                </div>

                {/* Weekday trend */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entry per Weekday</p>
                    <ReactECharts option={weekdayOption} style={{ height: '230px' }} />
                </div>
            </div>

            {/* ── Row 3: Overview 2026 + Split ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex">
                        {/* Vertical sidebar label */}
                        <div className="w-10 bg-[#004EA8] flex items-center justify-center flex-shrink-0" style={{ writingMode: 'vertical-rl' }}>
                            <span className="text-white font-black text-[10px] uppercase tracking-widest rotate-180">Overview 2026</span>
                        </div>
                        <div className="flex-1 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-3 text-[10px] font-bold">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#004EA8]"></span> Actual</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Target</span>
                                </div>
                                <span className="text-[10px] font-black text-[#004EA8] uppercase tracking-widest">
                                    {period}
                                </span>
                            </div>
                            <ReactECharts key={period} option={overviewBarOption} style={{ height: '250px' }} />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Entry Distribution</p>
                    <div className="flex gap-3 text-[10px] font-black mb-2">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#004EA8]"></span> Location A</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EC1B22]"></span> Location B</span>
                    </div>
                    <ReactECharts key={period + 'split'} option={splitOption} style={{ height: '250px' }} />
                </div>
            </div>

            {/* ── Row 4: YoY Comparison ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex">
                    <div className="w-10 bg-gray-100 flex items-center justify-center flex-shrink-0" style={{ writingMode: 'vertical-rl' }}>
                        <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest rotate-180">YOY Comparison</span>
                    </div>
                    <div className="flex-1 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-1 border-r border-gray-100 pr-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entry Prev Year (YTD)</p>
                                <h2 className="text-3xl font-black text-[#004EA8] tracking-tighter mb-4">{data.yoyComparison.totalPrevious}</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">% Change</p>
                                <h2 className="text-4xl font-black text-[#EC1B22] tracking-tighter">{data.yoyComparison.change}</h2>
                            </div>
                            <div className="lg:col-span-3">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex gap-4 items-center">
                                        <span className="text-[10px] font-black text-gray-600 uppercase">Year:</span>
                                        {['2024', '2025', '2026'].map((yr) => (
                                            <label key={yr} className="flex items-center gap-1 cursor-pointer">
                                                <input type="checkbox" defaultChecked className="h-3 w-3 rounded accent-[#004EA8]" />
                                                <span className="text-[10px] font-bold">{yr}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
                                        March 19 <Filter size={11} className="text-[#004EA8]" />
                                    </div>
                                </div>
                                <ReactECharts option={yoyOption} style={{ height: '260px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleAnalytics;
