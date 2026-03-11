import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { MapPin, Car, TrendingUp, Clock, Calendar, Filter } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// Mock Data — Location A / Location B (not zones)
// ─────────────────────────────────────────────────────────────────
const LOCATIONS = ['Location A', 'Location B'];
const HOURS = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

const generateHeatmapData = (scale = 1) => {
    const data = [];
    LOCATIONS.forEach((_, li) => {
        HOURS.forEach((_, hi) => {
            const peak = (hi >= 2 && hi <= 4) || (hi >= 8 && hi <= 10) ? 1.8 : 1;
            const val = Math.round(Math.random() * 80 * peak * scale + 10);
            data.push([hi, li, Math.min(val, 100)]);
        });
    });
    return data;
};

const MOCK = {
    Monthly: {
        heatData: generateHeatmapData(1), peak: '09:00', peakLoc: 'Location B', avgOccupancy: '67%', totalVehicles: '57.6K', peakDay: 'Wednesday',
        locA: { vehicles: 26, occupancy: '62%' }, locB: { vehicles: 21, occupancy: '82%' }
    },
    Weekly: {
        heatData: generateHeatmapData(0.7), peak: '08:30', peakLoc: 'Location A', avgOccupancy: '54%', totalVehicles: '14.2K', peakDay: 'Thursday',
        locA: { vehicles: 66, occupancy: '55%' }, locB: { vehicles: 52, occupancy: '74%' }
    },
    Yearly: {
        heatData: generateHeatmapData(1.3), peak: '09:15', peakLoc: 'Location B', avgOccupancy: '72%', totalVehicles: '689K', peakDay: 'Wednesday',
        locA: { vehicles: 31, occupancy: '68%' }, locB: { vehicles: 25, occupancy: '87%' }
    },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayOccupancy = {
    Monthly: [72, 68, 85, 82, 78, 45, 30],
    Weekly: [60, 55, 70, 75, 65, 40, 25],
    Yearly: [78, 74, 88, 85, 80, 50, 35],
};

const locationCapacity = [
    { label: 'Location A', total: 620, entryPoints: ['Gate 1'] },
    { label: 'Location B', total: 500, entryPoints: ['Gate 2'] },
];

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────
const PeriodFilter = ({ value, onChange }) => (
    <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {['Monthly', 'Weekly', 'Yearly'].map(p => (
            <button key={p} onClick={() => onChange(p)}
                className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all
                    ${value === p ? 'bg-[#004EA8] text-white' : 'bg-white text-gray-400 hover:bg-blue-50 hover:text-[#004EA8]'}`}>
                {p}
            </button>
        ))}
    </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-[#004EA8]' }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`text-2xl font-black tracking-tighter mt-1 ${color}`}>{value}</p>
                {sub && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sub}</p>}
            </div>
            <div className={`p-2.5 rounded-xl ${color.includes('red') || color === 'text-[#EC1B22]' ? 'bg-red-50' : 'bg-blue-50'}`}>
                <Icon size={18} className={color} />
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────
const HeatMap = () => {
    const [period, setPeriod] = useState('Monthly');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-03-08');

    const current = MOCK[period];

    // ── Main heatmap (Location A vs Location B) ────────────────
    const heatmapOption = useMemo(() => ({
        tooltip: {
            position: 'top',
            formatter: ({ data }) =>
                `<b>${LOCATIONS[data[1]]}</b> at <b>${HOURS[data[0]]}</b><br/>Occupancy: <b>${data[2]}%</b>`,
        },
        grid: { top: 20, right: 20, bottom: 70, left: 100 },
        xAxis: {
            type: 'category', data: HOURS, splitArea: { show: true },
            axisLabel: { color: '#9CA3AF', fontSize: 10, rotate: 30 }
        },
        yAxis: {
            type: 'category', data: LOCATIONS, splitArea: { show: true },
            axisLabel: { color: '#374151', fontSize: 13, fontWeight: 'bold' }
        },
        visualMap: {
            min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 5,
            inRange: { color: ['#EFF6FF', '#BFDBFE', '#60A5FA', '#1D4ED8', '#004EA8'] },
            textStyle: { color: '#9CA3AF', fontSize: 10 }
        },
        series: [{
            name: 'Occupancy %',
            type: 'heatmap',
            data: current.heatData,
            label: {
                show: true,
                formatter: ({ data }) => `${data[2]}%`,
                color: '#fff', fontSize: 9, fontWeight: 'bold'
            },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,78,168,0.4)' } }
        }]
    }), [period, current]);

    // ── Daily occupancy bar ────────────────────────────────────
    const dayBarOption = useMemo(() => ({
        grid: { top: 10, right: 10, bottom: 30, left: 40, containLabel: true },
        tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}: <b>${p[0].value}%</b>` },
        xAxis: { type: 'category', data: DAYS, axisLabel: { color: '#9CA3AF', fontSize: 10 } },
        yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#9CA3AF', fontSize: 9 } },
        series: [{
            type: 'bar',
            data: dayOccupancy[period].map((v, i) => ({
                value: v,
                itemStyle: { color: DAYS[i] === current.peakDay ? '#EC1B22' : '#004EA8', borderRadius: [4, 4, 0, 0] }
            })),
            barMaxWidth: 32
        }]
    }), [period, current]);

    // ── Location A vs B comparison bar ───────────────────────
    const locationCompOption = useMemo(() => ({
        tooltip: { trigger: 'axis' },
        grid: { top: 20, right: 20, bottom: 30, left: 20, containLabel: true },
        xAxis: { type: 'value', axisLabel: { color: '#9CA3AF', fontSize: 9 } },
        yAxis: { type: 'category', data: ['Location A', 'Location B'], axisLabel: { color: '#374151', fontSize: 11, fontWeight: 'bold' } },
        series: [
            {
                name: 'Vehicles', type: 'bar', stack: 'loc',
                data: [
                    { value: current.locA.vehicles, itemStyle: { color: '#004EA8', borderRadius: [0, 4, 4, 0] } },
                    { value: current.locB.vehicles, itemStyle: { color: '#EC1B22', borderRadius: [0, 4, 4, 0] } },
                ],
                label: {
                    show: true, position: 'right',
                    formatter: ({ value }) => value.toLocaleString(),
                    color: '#374151', fontSize: 10, fontWeight: 'bold'
                },
                barWidth: 28
            }
        ]
    }), [period, current]);

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <MapPin size={24} className="text-[#004EA8]" />
                        Parking Heat Map
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Hourly occupancy density across Location A and Location B</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                        <Calendar size={14} className="text-[#004EA8]" />
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
                <StatCard icon={Car} label="Total Vehicles" value={current.totalVehicles} sub={`Period: ${period}`} color="text-[#004EA8]" />
                <StatCard icon={TrendingUp} label="Avg Occupancy" value={current.avgOccupancy} sub="Both locations combined" color="text-[#004EA8]" />
                <StatCard icon={Clock} label="Peak Hour" value={current.peak} sub={`Busiest on ${current.peakDay}`} color="text-[#EC1B22]" />
                <StatCard icon={MapPin} label="Busiest Location" value={current.peakLoc} sub="Highest hourly avg" color="text-[#EC1B22]" />
            </div>

            {/* ── Main heatmap ─────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Hourly Occupancy Heatmap</h2>
                        <p className="text-[10px] text-gray-400 mt-0.5">Each cell shows occupancy % — darker = higher density</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 bg-blue-50 px-3 py-1.5 rounded-lg">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#004EA8]"></span> Location A
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 bg-red-50 px-3 py-1.5 rounded-lg">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#EC1B22]"></span> Location B
                        </span>
                    </div>
                </div>
                <ReactECharts key={period} option={heatmapOption} style={{ height: '220px' }} />
            </div>

            {/* ── Location A vs B summary + daily bar ───────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Location summary */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Location Comparison</h2>
                    <ReactECharts key={period + 'comp'} option={locationCompOption} style={{ height: '120px' }} />
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Location A', color: '#004EA8', bg: 'bg-blue-50', data: current.locA },
                            { label: 'Location B', color: '#EC1B22', bg: 'bg-red-50', data: current.locB },
                        ].map(({ label, color, bg, data: d }) => (
                            <div key={label} className={`${bg} rounded-xl p-4`}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color }}>{label}</p>
                                <p className="text-xl font-black tracking-tighter" style={{ color }}>{d.vehicles.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500 font-bold mt-0.5">Vehicles · {d.occupancy} occ.</p>
                            </div>
                        ))}
                    </div>
                </div>

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
                    <ReactECharts key={period + 'day'} option={dayBarOption} style={{ height: '230px' }} />
                </div>
            </div>

            {/* ── Location details table ─────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Location Details</h2>
                    <span className="text-[10px] font-bold text-gray-400">{dateFrom} → {dateTo}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-3 text-left">Location</th>
                                <th className="px-6 py-3 text-left">Capacity</th>
                                <th className="px-6 py-3 text-left">Vehicles ({period})</th>
                                <th className="px-6 py-3 text-left">Occupancy</th>
                                <th className="px-6 py-3 text-left">Entry Points</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {locationCapacity.map(({ label, total, entryPoints }, i) => {
                                const d = i === 0 ? current.locA : current.locB;
                                const pct = parseFloat(d.occupancy);
                                const color = i === 0 ? '#004EA8' : '#EC1B22';
                                const status = pct >= 80 ? { label: 'High', cls: 'bg-amber-50 text-amber-600' }
                                    : { label: 'Normal', cls: 'bg-blue-50 text-[#004EA8]' };
                                return (
                                    <tr key={label} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-black text-gray-800 flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                                            {label}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{total} slots</td>
                                        <td className="px-6 py-4 font-black" style={{ color }}>{d.vehicles.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: d.occupancy, backgroundColor: color }} />
                                                </div>
                                                <span className="text-[11px] font-bold text-gray-600">{d.occupancy}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-[11px]">{entryPoints.join(', ')}</td>
                                        <td className="px-6 py-4">
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
