import React, { useState, useMemo } from 'react';
import { Download, Calendar, FileText, Filter, Search, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, MapPin, Clock, Printer, X, CreditCard, User, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBookingData, hospitalDepartments, mockSlotData } from '../data/mockData';

const BookingReports = () => {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('dateTime');
    const [sortDirection, setSortDirection] = useState('desc');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedDeptInvoice, setSelectedDeptInvoice] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showDeptInvoice, setShowDeptInvoice] = useState(false);

    // Filter Logic
    const filteredBookings = useMemo(() => {
        return mockBookingData.filter(booking => {
            // Search filter
            if (searchTerm && !booking.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            // Dept filter
            if (departmentFilter !== 'All' && booking.department !== departmentFilter) return false;

            // Location filter
            if (locationFilter !== 'All' && booking.location !== locationFilter) return false;

            // Date range filter
            if (dateRange.start && dateRange.end) {
                const bookingDate = new Date(booking.dateTime);
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                if (bookingDate < startDate || bookingDate > endDate) return false;
            }

            return true;
        }).sort((a, b) => {
            let valueA = a[sortField];
            let valueB = b[sortField];

            if (sortField === 'dateTime') {
                valueA = new Date(a.dateTime).getTime();
                valueB = new Date(b.dateTime).getTime();
            }

            if (sortDirection === 'asc') return valueA > valueB ? 1 : -1;
            return valueA < valueB ? 1 : -1;
        });
    }, [searchTerm, departmentFilter, locationFilter, dateRange, sortField, sortDirection]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const openInvoice = (booking) => {
        setSelectedBooking(booking);
        setShowInvoice(true);
    };

    const openDeptInvoice = (dept) => {
        setSelectedDeptInvoice(dept);
        setShowDeptInvoice(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    // Calculate a mock amount based on duration/vehicles for invoice demonstration
    const getBookingAmount = (booking) => {
        const baseRate = 5; // $5 per hour
        const durationHours = parseInt(booking.duration) || 1;
        return baseRate * durationHours * (booking.numberOfVehicles || 1);
    };

    // Aggregate by Department
    const departmentBreakdown = useMemo(() => {
        const breakdown = {};
        filteredBookings.forEach(booking => {
            const dept = booking.department;
            const amount = getBookingAmount(booking);
            if (!breakdown[dept]) {
                breakdown[dept] = { count: 0, revenue: 0 };
            }
            breakdown[dept].count += 1;
            breakdown[dept].revenue += amount;
        });
        return Object.entries(breakdown).map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue);
    }, [filteredBookings]);

    return (
        <div className="p-8 bg-gray-50/20 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Booking Reports</h1>
                    <p className="text-gray-500 font-medium mt-1">Generate payment invoices and audit reservation logs</p>
                </div>
                <div className="flex gap-3">
                    {departmentFilter !== 'All' && (
                        <button
                            onClick={() => openDeptInvoice({ name: departmentFilter, revenue: filteredBookings.reduce((acc, b) => acc + getBookingAmount(b), 0), count: filteredBookings.length })}
                            className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 hover:bg-black transition-all border border-gray-800"
                        >
                            <FileText size={18} className="mr-2 text-primary-blue" /> Dept Statement
                        </button>
                    )}
                    <button className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all">
                        <Download size={18} className="mr-2 text-primary-blue" /> Export CSV
                    </button>
                    <button className="flex items-center px-6 py-3 bg-primary-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                        <Printer size={18} className="mr-2" /> Batch Print
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Search */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Search Visitor</label>
                        <div className="relative font-bold mt-2">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Enter name..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-blue/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Arrival Period</label>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="date"
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-blue/10 outline-none transition-all text-sm font-bold text-gray-700"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                            <span className="text-gray-300 font-black">/</span>
                            <input
                                type="date"
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-blue/10 outline-none transition-all text-sm font-bold text-gray-700"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                        <select
                            className="w-full mt-2 px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-blue/10 outline-none font-bold text-gray-700 appearance-none cursor-pointer"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                            <option value="All">All Departments</option>
                            {hospitalDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                        <select
                            className="w-full mt-2 px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-blue/10 outline-none font-bold text-gray-700 appearance-none cursor-pointer"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="All">All Locations</option>
                            {mockSlotData.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Cards & Department Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left: Summary Cards */}
                <div className="lg:col-span-1 space-y-6">
                    {[
                        { label: 'Total Bookings', value: filteredBookings.length, color: 'text-primary-blue', bg: 'bg-blue-50' },
                        { label: 'Confirmed Payments', value: formatCurrency(filteredBookings.reduce((acc, b) => acc + getBookingAmount(b), 0)), color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Avg Duration', value: '3.2 Hours', color: 'text-purple-600', bg: 'bg-purple-50' }
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} p-6 rounded-[28px] border border-transparent hover:border-white transition-all`}>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Right: Department Payment Details */}
                <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 border-dashed p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-blue/10 rounded-xl flex items-center justify-center mr-4">
                                <Building2 className="text-primary-blue" size={20} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Department Breakdown</h2>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue Summary</span>
                    </div>

                    <div className="max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Department</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Bookings</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Revenue</th>
                                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {departmentBreakdown.map((dept, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="py-4 font-black text-gray-800 text-sm">{dept.name}</td>
                                        <td className="py-4 text-center">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase">{dept.count}</span>
                                        </td>
                                        <td className="py-4 text-right font-black text-primary-blue text-sm">{formatCurrency(dept.revenue)}</td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => openDeptInvoice(dept)}
                                                className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-primary-blue transition-all"
                                            >
                                                Statement
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {departmentBreakdown.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="py-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No matching data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('dateTime')}>
                                <div className="flex items-center">
                                    Date & Time {sortField === 'dateTime' && (sortDirection === 'asc' ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />)}
                                </div>
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Visitor Name</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Department</th>
                            <th className="px-8 py-6 text-[10px) font-black text-gray-400 uppercase tracking-widest">Location</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Invoice Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {currentItems.map((booking) => (
                            <tr key={booking.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-800">{new Date(booking.dateTime).toLocaleDateString()}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-black text-gray-800">{booking.name}</td>
                                <td className="px-8 py-5 text-center">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider group-hover:bg-primary-blue group-hover:text-white transition-colors">{booking.department}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center text-sm font-bold text-gray-600">
                                        <MapPin size={14} className="mr-2 text-primary-red" /> {booking.location}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button
                                        onClick={() => openInvoice(booking)}
                                        className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-blue transition-all group-hover:shadow-lg shadow-blue-500/20"
                                    >
                                        <FileText size={14} className="mr-2" /> View Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-primary-blue text-white shadow-xl shadow-blue-200' : 'bg-white text-gray-400 hover:text-primary-blue border border-gray-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Invoice Modal */}
            <AnimatePresence>
                {showInvoice && selectedBooking && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[1000] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white"
                        >
                            <div className="relative p-12">
                                <button
                                    onClick={() => setShowInvoice(false)}
                                    className="absolute right-8 top-8 p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all hover:text-gray-900"
                                >
                                    <X size={24} />
                                </button>

                                {/* Invoice Content */}
                                <div id="invoice-content">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-primary-blue rounded-3xl flex items-center justify-center">
                                                <CreditCard className="text-white" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Payment Invoice</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Commercial Reservation Receipt</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
                                            <p className="text-sm font-black text-gray-900">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-12 mb-12">
                                        <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                                <User size={12} className="mr-2" /> Bill To
                                            </p>
                                            <p className="text-lg font-black text-gray-900 mb-1">{selectedBooking.name}</p>
                                            <p className="text-xs font-bold text-gray-500 uppercase flex items-center">
                                                <Building2 size={12} className="mr-1.5" /> {selectedBooking.department} Dept
                                            </p>
                                            <p className="text-xs font-bold text-gray-500 mt-3">{selectedBooking.mobileNumber}</p>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 p-8 rounded-[32px]">
                                            <p className="text-[10px] font-black text-primary-blue/60 uppercase tracking-widest mb-4 flex items-center">
                                                <Clock size={12} className="mr-2" /> Reservation Details
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">Vehicles</span>
                                                    <span className="text-xs font-black text-gray-900">{selectedBooking.numberOfVehicles} Units</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">Stay</span>
                                                    <span className="text-xs font-black text-gray-900">{selectedBooking.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-gray-200 pt-8 mt-4">
                                        <div className="flex justify-between items-center bg-gray-900 px-8 py-6 rounded-3xl">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Total Outstanding</span>
                                            <span className="text-3xl font-black text-white">{formatCurrency(getBookingAmount(selectedBooking))}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <button
                                        className="flex-1 py-5 bg-primary-blue text-white rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-300/30"
                                        onClick={() => window.print()}
                                    >
                                        <Printer size={16} className="mr-2" /> Download & Print Receipt
                                    </button>
                                    <button
                                        onClick={() => setShowInvoice(false)}
                                        className="px-8 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Department Consolidated Invoice Modal */}
            <AnimatePresence>
                {showDeptInvoice && selectedDeptInvoice && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[1000] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white rounded-[48px] w-full max-w-4xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white"
                        >
                            <div className="relative p-12">
                                <button
                                    onClick={() => setShowDeptInvoice(false)}
                                    className="absolute right-8 top-8 p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all hover:text-gray-900"
                                >
                                    <X size={24} />
                                </button>

                                {/* Invoice Content */}
                                <div id="dept-invoice-content" className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center">
                                                <Building2 className="text-white" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Department Statement</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{selectedDeptInvoice.name} Section</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Statement Date</p>
                                            <p className="text-sm font-black text-gray-900">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100 mb-10">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-2">Billing Entity</p>
                                                <p className="text-lg font-black text-gray-900 leading-tight">{selectedDeptInvoice.name} Department</p>
                                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-tighter italic">Consolidated Booking Summary</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-2">Total Payable</p>
                                                <p className="text-3xl font-black text-gray-900 leading-none">{formatCurrency(selectedDeptInvoice.revenue)}</p>
                                                <p className="text-xs font-bold text-primary-blue/60 mt-1 uppercase tracking-widest">{selectedDeptInvoice.count} Reservations</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Line Items Table */}
                                    <div className="mb-10">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b-2 border-gray-100">
                                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Visitor Name</th>
                                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                                                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {filteredBookings.filter(b => b.department === selectedDeptInvoice.name).map((booking, idx) => (
                                                    <tr key={idx}>
                                                        <td className="py-4">
                                                            <div className="text-xs font-black text-gray-800">{new Date(booking.dateTime).toLocaleDateString()}</div>
                                                            <div className="text-[10px] font-bold text-gray-400 uppercase">{new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </td>
                                                        <td className="py-4 text-xs font-bold text-gray-700">{booking.name}</td>
                                                        <td className="py-4">
                                                            <div className="flex items-center text-xs font-bold text-gray-500">
                                                                <MapPin size={10} className="mr-1 text-primary-red" /> {booking.location}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-right text-xs font-black text-gray-900">{formatCurrency(getBookingAmount(booking))}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-gray-900 px-10 py-8 rounded-[36px] flex justify-between items-center text-white">
                                        <div className="flex items-center gap-4">
                                            <Printer size={24} className="opacity-40" />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Signature</p>
                                                <p className="text-xs font-bold mt-1 text-gray-500">System Generated Document</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Consolidated Total</p>
                                            <p className="text-4xl font-black">{formatCurrency(selectedDeptInvoice.revenue)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <button
                                        className="flex-1 py-5 bg-primary-blue text-white rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-300/30"
                                        onClick={() => window.print()}
                                    >
                                        <Printer size={16} className="mr-2" /> Download Full Statement
                                    </button>
                                    <button
                                        onClick={() => setShowDeptInvoice(false)}
                                        className="px-8 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingReports;
