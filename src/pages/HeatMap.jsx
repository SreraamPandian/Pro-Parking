import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { MapPin, Car, TrendingUp, Clock, Calendar, ChevronDown, Filter } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────
const ZONES = ['Zone A1', 'Zone A2', 'Zone A3', 'Zone B1', 'Zone B2', 'Zone B3', 'Zone C1', 'Zone C2'];
const HOURS = Array.from({ length: 16 }, (_, i) => `${i + 7}:00`); // 7am–10pm

const generateHeatmapData = (scale = 1) => {
    const data = [];
    ZONES.forEach((_, zi) => {
        HOURS.forEach((_, hi) => {
            const peak = (hi >= 2 && hi <= 4) || (hi >= 8 && hi <= 10) ? 1.8 : 1;
            const val = Math.round(Math.random() * 80 * peak * scale + 10);
            data.push([hi, zi, Math.min(val, 100)]);
        });
    });
    return data;
};

const MOCK = {
    Monthly: { heatData: generateHeatmapData(1), peak: '09:00', peakZone: 'Zone B2', avgOccupancy: '67%', totalVehicles: '57.6K', peakDay: 'Wednesday' },
    Weekly:  { heatData: generateHeatmapData(0.7), peak: '08:30', peakZone: 'Zone A1', avgOccupancy: '54%', totalVehicles: '14.2K', peakDay: 'Thursday' },
    Yearly:  { heatData: generateHeatmapData(1.3), peak: '09:15', peakZone: 'Zone B2', avgOccupancy: '72%', totalVehicles: '689K', peakDay: 'Wednesday' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayOccupancy = {
    Monthly: [72, 68, 85, 82, 78, 45, 30],
    Weekly:  [60, 55, 70, 75, 65, 40, 25],
    Yearly:  [78, 74, 88, 85, 80, 50, 35],
};

const zoneCapacity = [
    { zone: 'Zone A1', total: 80,  occupied: 62 },
    { zone: 'Zone A2', total: 80,  occupied: 55 },
    { zone: 'Zone A3', total: 60,  occupied: 48 },
    { zone: 'Zone B1', total: 100, occupied: 88 },
    { zone: 'Zone B2', total: 100, occupied: 95 },
    { zone: 'Zone B3', total: 80,  occupied: 71 },
    { zone: 'Zone C1', total: 60,  occupied: 30 },
    { zone: 'Zone C2', total: 60,  occupied: 22 },
];

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────
const PeriodFilter = ({ value, onChange }) => (
    <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {['Monthly', 'Weekly', 'Yearly'].map(p => (
            <button key={p} onClick={() => onChange(p)}
                className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all
                    ${value === p ? 'bg-primary-blue text-white' : 'bg-white text-gray-400 hover:bg-blue-50 hover:text-primary-blue'}`}>
                {p}
            </button>
        ))}
    </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-primary-blue' }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`text-2xl font-black tracking-tighter mt-1 ${color}`}>{value}</p>
                {sub && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sub}</p>}
            </div>
            <div className={`p-2.5 rounded-xl ${color === 'text-primary-blue' ? 'bg-blue-50' : 'bg-red-50'}`}>
                <Icon size={18} className={color} />
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────
const HeatMap = () => {
    const [period, setPeriod]       = useState('Monthly');
    const [dateFrom, setDateFrom]   = useState('2026-01-01');
    const [dateTo, setDateTo]       = useState('2026-03-08');
    const [activeZone, setActiveZone] = useState('All');

    const current = MOCK[period];

    // ── Heatmap chart ──────────────────────────────────────────
    const heatmapOption = useMemo(() => ({
        tooltip: {
            position: 'top',
            formatter: ({ data }) => `<b>${ZONES[data[1]]}</b> at <b>${HOURS[data[0]]}</b><br/>Occupancy: <b>${data[2]}%</b>`,
        },
        grid: { top: 10, right: 20, bottom: 60, left: 80 },
        xAxis: {
            type: 'category', data: HOURS, splitArea: { show: true },
            axisLabel: { color: '#9CA3AF', fontSize: 10, rotate: 30 }
        },
        yAxis: {
            type: 'category', data: ZONES, splitArea: { show: true },
            axisLabel: { color: '#374151', fontSize: 11, fontWeight: 'bold' }
        },
        visualMap: {
            min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
            inRange: { color: ['#EFF6FF', '#BFDBFE', '#60A5FA', '#1D4ED8', '#004EA8'] },
            textStyle: { color: '#9CA3AF', fontSize: 10 }
        },
        series: [{
            name: 'Occupancy',
            type: 'heatmap',
            data: current.heatData,
            label: { show: false },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,78,168,0.3)' } }
        }]
    }), [period, current]);

    // ── Daily occupancy bar ────────────────────────────────────
    const dayBarOption = useMemo(() => ({
        grid: { top: 10, right: 10, bottom: 30, left: 40, containLabel: true },
        tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}: <b>${p[0].value}%</b>` },
        xAxis: { type: 'category', data: DAYS, axisLabel: { color: '#9CA3AF', fontSize: 10 } },
        yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#9CA3AF', fontSize: 9 } },
        series: [{
            type: 'bar', data: dayOccupancy[period].map((v, i) => ({
                value: v,
                itemStyle: { color: DAYS[i] === current.peakDay ? '#EC1B22' : '#004EA8', borderRadius: [4, 4, 0, 0] }
            })),
            barMaxWidth: 32
        }]
    }), [period, current]);

    // ── Zone capacity gauge ────────────────────────────────────
    const zoneGaugeOption = useMemo(() => ({
        tooltip: { trigger: 'axis' },
        grid: { top: 10, right: 10, bottom: 30, left: 60, containLabel: true },
        xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#9CA3AF', fontSize: 9 } },
        yAxis: {
            type: 'category',
            data: zoneCapacity.map(z => z.zone),
            axisLabel: { color: '#374151', fontSize: 10, fontWeight: 'bold' }
        },
        series: [{
            type: 'bar',
            data: zoneCapacity.map(z => {
                const pct = Math.round((z.occupied / z.total) * 100);
                return {
                    value: pct,
                    itemStyle: {
                        color: pct >= 90 ? '#EC1B22' : pct >= 70 ? '#F59E0B' : '#004EA8',
                        borderRadius: [0, 4, 4, 0]
                    }
                };
            }),
            barMaxWidth: 18,
            label: {
                show: true, position: 'right',
                formatter: ({ value }) => `${value}%`,
                color: '#6B7280', fontSize: 10, fontWeight: 'bold'
            }
        }]
    }), []);

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <MapPin size={24} className="text-primary-blue" />
                        Parking Heat Map
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time occupancy and traffic density across parking zones</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Date Range */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                        <Calendar size={14} className="text-primary-blue" />
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                            className="text-[11px] font-bold text-gray-600 bg-transparent border-0 outline-none cursor-pointer" />
                        <span className="text-gray-300 font-black">—</span>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                            className="text-[11px] font-bold text-gray-600 bg-transparent border-0 outline-none cursor-pointer" />
                    </div>
                    <PeriodFilter value={period} onChange={setPeriod} />
                </div>
            </div>

            {/* ── Stat row ────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Car}         label="Total Vehicles"    value={current.totalVehicles}  sub={`Period: ${period}`} color="text-primary-blue" />
                <StatCard icon={TrendingUp}  label="Avg Occupancy"     value={current.avgOccupancy}   sub="Across all zones"    color="text-primary-blue" />
                <StatCard icon={Clock}       label="Peak Hour"         value={current.peak}            sub={`Usually ${current.peakDay}`} color="text-primary-red" />
                <StatCard icon={MapPin}      label="Hottest Zone"      value={current.peakZone}        sub="Highest occupancy"   color="text-primary-red" />
            </div>

            {/* ── Main heatmap ─────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Hourly Occupancy Heatmap</h2>
                        <p className="text-[10px] text-gray-400 mt-0.5">Darker = higher occupancy. Hover for details.</p>
                    </div>
                    {/* Zone filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={13} className="text-gray-400" />
                        <select value={activeZone} onChange={e => setActiveZone(e.target.value)}
                            className="text-[11px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-primary-blue transition-colors">
                            <option value="All">All Zones</option>
                            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                    </div>
                </div>
                <ReactECharts key={period} option={heatmapOption} style={{ height: '340px' }} />
            </div>

            {/* ── Bottom charts ─────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Daily bar */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Occupancy by Day</h2>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-[#EC1B22] mr-1"></span>
                                Peak day: <b>{current.peakDay}</b>
                            </p>
                        </div>
                    </div>
                    <ReactECharts key={period + 'day'} option={dayBarOption} style={{ height: '240px' }} />
                </div>

                {/* Zone capacity */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Zone Capacity Usage</h2>
                            <div className="flex gap-4 text-[10px] font-bold mt-1">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-blue"></span> Normal</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> High</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-red"></span> Critical</span>
                            </div>
                        </div>
                    </div>
                    <ReactECharts option={zoneGaugeOption} style={{ height: '240px' }} />
                </div>
            </div>

            {/* ── Zone table ──────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Zone Details</h2>
                    <span className="text-[10px] font-bold text-gray-400">{dateFrom} → {dateTo}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-3 text-left">Zone</th>
                                <th className="px-6 py-3 text-left">Capacity</th>
                                <th className="px-6 py-3 text-left">Occupied</th>
                                <th className="px-6 py-3 text-left">Available</th>
                                <th className="px-6 py-3 text-left">Usage %</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {zoneCapacity.map(({ zone, total, occupied }) => {
                                const pct = Math.round((occupied / total) * 100);
                                const status = pct >= 90 ? { label: 'Critical', cls: 'bg-red-50 text-primary-red' }
                                    : pct >= 70 ? { label: 'High',     cls: 'bg-amber-50 text-amber-600' }
                                    :             { label: 'Normal',   cls: 'bg-blue-50 text-primary-blue' };
                                return (
                                    <tr key={zone} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 font-bold text-gray-800">{zone}</td>
                                        <td className="px-6 py-3 text-gray-600">{total}</td>
                                        <td className="px-6 py-3 text-gray-700 font-semibold">{occupied}</td>
                                        <td className="px-6 py-3 text-gray-600">{total - occupied}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: pct >= 90 ? '#EC1B22' : pct >= 70 ? '#F59E0B' : '#004EA8'
                                                    }} />
                                                </div>
                                                <span className="text-[11px] font-bold text-gray-600 w-8">{pct}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${status.cls}`}>{status.label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HeatMap;
