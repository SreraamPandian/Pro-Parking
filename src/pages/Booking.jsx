import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, Car, X, Eye, Phone, MapPin, ParkingSquare, ChevronRight, ChevronLeft, CreditCard, CheckCircle2, Smartphone, Wallet, DollarSign, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hospitalDepartments, mockBookingData, mockSlotData } from '../data/mockData';

const Booking = () => {
    const [bookings, setBookings] = useState(mockBookingData);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState('summary'); // 'summary' or 'methodSelection'
    const [paymentMethod, setPaymentMethod] = useState('Apple Pay');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const [formData, setFormData] = useState({
        name: '',
        location: 'All Locations',
        department: 'Visitor',
        mobileNumber: '',
        numberOfVehicles: 1,
        dateTime: '',
        duration: '1 hour',
        vehicleNumbers: ['']
    });

    // US Mobile Format Helper: (XXX) XXX-XXXX
    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobileNumber') {
            setFormData({ ...formData, [name]: formatPhoneNumber(value) });
        } else if (name === 'numberOfVehicles') {
            const count = parseInt(value) || 1;
            const newVehicleNumbers = [...formData.vehicleNumbers];
            if (count > newVehicleNumbers.length) {
                for (let i = newVehicleNumbers.length; i < count; i++) newVehicleNumbers.push('');
            } else {
                newVehicleNumbers.splice(count);
            }
            setFormData({ ...formData, [name]: count, vehicleNumbers: newVehicleNumbers });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleVehicleNumberChange = (index, value) => {
        const newNums = [...formData.vehicleNumbers];
        newNums[index] = value;
        setFormData({ ...formData, vehicleNumbers: newNums });
    };

    const handleOpenForm = () => {
        setFormData({
            name: '',
            location: 'All Locations',
            department: 'Visitor',
            mobileNumber: '',
            numberOfVehicles: 1,
            dateTime: new Date().toISOString().slice(0, 16),
            duration: '1 hour',
            vehicleNumbers: ['']
        });
        setShowForm(true);
    };

    const handleBookNow = (e) => {
        e.preventDefault();
        if (formData.department === 'Visitor') {
            setPaymentStep('summary');
            setShowPaymentModal(true);
        } else {
            // Staff / Others confirm immediately
            finalizeBooking('Booked');
        }
    };

    const finalizeBooking = (method) => {
        const newBooking = {
            id: `bk${Date.now()}`,
            ...formData,
            status: method,
            type: formData.department,
            plateImage: 'https://placehold.co/300x100/333/white?text=' + (formData.vehicleNumbers[0] || 'PLATE')
        };
        setBookings([newBooking, ...bookings]);
        setShowForm(false);
        setShowPaymentModal(false);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
    };

    const handlePaymentSuccess = () => {
        finalizeBooking(paymentMethod);
    };

    const handlePreview = (booking) => {
        setSelectedBooking(booking);
        setShowPreview(true);
    };

    // Filter Logic
    const filteredBookings = bookings.filter(b => {
        const matchesSearch = (b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.vehicleNumbers.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesLocation = locationFilter === 'All' || b.location === locationFilter;
        const matchesDepartment = departmentFilter === 'All' || b.department === departmentFilter;
        return matchesSearch && matchesLocation && matchesDepartment;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    return (
        <div className="p-6 h-full flex flex-col bg-gray-50/30 overflow-hidden">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Booking Management</h1>
                    <p className="text-gray-500 text-sm">Manage visitor reservations and historical records</p>
                </div>
                <button
                    onClick={handleOpenForm}
                    className="flex items-center px-6 py-3 bg-primary-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all text-sm uppercase tracking-wider"
                >
                    <Plus size={18} className="mr-2" /> Add Booking
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or vehicle number..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue/20 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-60">
                    <ParkingSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-primary-blue/10 text-sm cursor-pointer"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        <option value="All">All Locations</option>
                        {mockSlotData.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
                    </select>
                </div>
                <div className="relative w-full md:w-60">
                    <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-primary-blue/10 text-sm cursor-pointer"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {hospitalDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 uppercase text-xs font-black tracking-[0.1em]">
                                <th className="px-6 py-4 border-b">Vehicle Number</th>
                                <th className="px-6 py-4 border-b">Name</th>
                                <th className="px-6 py-4 border-b">Mobile No</th>
                                <th className="px-6 py-4 border-b">Department</th>
                                <th className="px-6 py-4 border-b">Entry Time</th>
                                <th className="px-6 py-4 border-b">Location</th>
                                <th className="px-6 py-4 border-b">ANPR Image</th>
                                <th className="px-6 py-4 border-b">Status</th>
                                <th className="px-6 py-4 border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.map((booking) => (
                                <tr key={booking.id} className="hover:bg-blue-50/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {booking.vehicleNumbers.map((num, i) => (
                                                <span key={i} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-bold uppercase">{num}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{booking.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{booking.mobileNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-primary-blue text-xs font-black uppercase tracking-wider">{booking.department}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs">
                                            <span className="font-bold text-gray-800">{new Date(booking.dateTime).toLocaleDateString()}</span>
                                            <span className="text-gray-400 mt-0.5 font-medium">{new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm font-medium text-gray-600">
                                            <MapPin size={14} className="mr-1.5 text-primary-red opacity-70" /> {booking.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-9 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                            <img src={booking.plateImage} alt="Plate" className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${booking.status === 'Booked' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-primary-blue'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handlePreview(booking)}
                                            className="inline-flex items-center text-primary-blue hover:text-blue-700 font-bold text-xs uppercase tracking-wider"
                                        >
                                            <Eye size={16} className="mr-1.5" /> Preview
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-gray-50/30 border-t flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Total Records: <span className="text-gray-900">{filteredBookings.length}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex space-x-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-primary-blue text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Creation Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-800">New Booking Reservation</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleBookNow} className="p-8 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Visitor Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                                        <input
                                            type="text"
                                            name="mobileNumber"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                                            value={formData.mobileNumber}
                                            onChange={handleInputChange}
                                            placeholder="(555) 000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                                        <select
                                            name="location"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                        >
                                            <option value="All Locations">All Locations</option>
                                            {mockSlotData.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Department</label>
                                        <select
                                            name="department"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                        >
                                            {hospitalDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            name="dateTime"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                                            value={formData.dateTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Duration</label>
                                        <select
                                            name="duration"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                        >
                                            <option value="1 hour">1 hour</option>
                                            <option value="2 hours">2 hours</option>
                                            <option value="4 hours">4 hours</option>
                                            <option value="Full Day">Full Day</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">No. of Vehicles & Plate Numbers</label>
                                    <input
                                        type="number"
                                        name="numberOfVehicles"
                                        min="1" max="10"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4"
                                        value={formData.numberOfVehicles}
                                        onChange={handleInputChange}
                                    />
                                    <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto p-1">
                                        {formData.vehicleNumbers.map((num, i) => (
                                            <div key={i} className="relative">
                                                <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder={`Plate #${i + 1}`}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase"
                                                    value={num}
                                                    onChange={(e) => handleVehicleNumberChange(i, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 rounded-xl bg-primary-red text-white font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-colors">Book Now</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && selectedBooking && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">Booking Preview</h3>
                                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            </div>
                            <div className="p-8 flex flex-col items-center">
                                <div className="w-full aspect-[3/1] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 mb-8">
                                    <img src={selectedBooking.plateImage} alt="Plate" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full space-y-4">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Name</span>
                                        <span className="text-gray-800 font-bold">{selectedBooking.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Vehicle(s)</span>
                                        <span className="text-gray-800 font-bold uppercase">{selectedBooking.vehicleNumbers.join(', ')}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Mobile</span>
                                        <span className="text-gray-800 font-bold">{selectedBooking.mobileNumber}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Location</span>
                                        <span className="text-gray-800 font-bold">{selectedBooking.location}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Department</span>
                                        <span className="text-gray-800 font-bold">{selectedBooking.department}</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowPreview(false)} className="w-full mt-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Close Preview</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Payment Modal (Reused & Enhanced) */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[300] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center relative">
                            <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={20} /></button>

                            {paymentStep === 'summary' ? (
                                <>
                                    <div className="w-20 h-20 bg-blue-50 text-primary-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <CreditCard size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">Secure Pay</h3>
                                    <p className="text-gray-500 text-sm mb-8">Confirming reservation for <span className="font-bold text-gray-900">{formData.name}</span></p>
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4 border border-gray-100">
                                        <div className="flex justify-between text-xs font-bold text-gray-400"><span>Quantity</span><span className="text-gray-900">{formData.numberOfVehicles} Vehicles</span></div>
                                        <div className="flex justify-between items-center pt-4 border-t"><span className="font-black text-gray-900">Total Due</span><span className="font-black text-primary-blue text-2xl">${(formData.numberOfVehicles * 12.75).toFixed(2)}</span></div>
                                    </div>
                                    <button onClick={() => setPaymentStep('methodSelection')} className="w-full py-4 bg-primary-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200">Complete Payment</button>
                                </>
                            ) : (
                                <div className="text-left">
                                    <h3 className="text-xl font-black text-gray-900 mb-6">Select Payment Method</h3>

                                    <div className="space-y-3 mb-8">
                                        {[
                                            { id: 'Apple Pay', icon: Smartphone, label: 'Apple Pay', color: 'text-gray-800' },
                                            { id: 'Google Pay', icon: Wallet, label: 'Google Pay', color: 'text-green-600' },
                                            { id: 'Visa', icon: CreditCard, label: 'Visa', color: 'text-blue-600' },
                                            { id: 'Mastercard', icon: CreditCard, label: 'Mastercard', color: 'text-orange-600' },
                                            { id: 'PayPal', icon: DollarSign, label: 'PayPal', color: 'text-blue-500' },
                                            { id: 'Cash', icon: FileText, label: 'Cash', color: 'text-purple-600' }
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`w-full p-4 rounded-2xl border-2 flex items-center transition-all ${paymentMethod === method.id ? 'border-primary-blue bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <method.icon size={24} className={`mr-4 ${method.color}`} />
                                                <span className="font-bold text-sm text-gray-700">{method.label}</span>
                                                {paymentMethod === method.id && <div className="ml-auto w-2 h-2 bg-primary-blue rounded-full" />}
                                            </button>
                                        ))}
                                    </div>

                                    <button onClick={handlePaymentSuccess} className="w-full py-4 bg-primary-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-200">Book Now</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div initial={{ y: -100 }} animate={{ y: 50 }} exit={{ y: -100 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[400] bg-gray-900 text-white px-8 py-4 rounded-full flex items-center space-x-4 shadow-2xl">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50"><CheckCircle2 size={24} /></div>
                        <p className="font-bold tracking-tight">Booking Confirmed Successfully!</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Booking;
