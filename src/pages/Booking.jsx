import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Calendar, Clock, Car, X, Eye, Phone, MapPin, ParkingSquare, ChevronRight, ChevronLeft, CreditCard, CheckCircle2, User, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hospitalDepartments, mockSlotData } from '../data/mockData';
import { useData } from '../context/DataContext';

// Reusable Multi-Select Dropdown Component
const MultiSelectDropdown = ({ options, selected, onChange, placeholder, icon: Icon, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(opt =>
            opt.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const toggleOption = (option) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const isAllSelected = options.length > 0 && selected.length === options.length;

    const toggleAll = (e) => {
        e.stopPropagation();
        if (isAllSelected) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full pl-4 pr-3 py-2.5 bg-white border ${isOpen ? 'border-primary-blue ring-2 ring-primary-blue/5' : 'border-gray-200'} rounded-xl cursor-pointer transition-all hover:bg-gray-50/50 shadow-sm`}
            >
                <div className="flex items-center overflow-hidden mr-2">
                    {Icon && <Icon size={16} className={`${isOpen ? 'text-primary-blue' : 'text-gray-400'} mr-2.5 flex-shrink-0`} />}
                    <span className={`text-sm truncate font-medium ${selected.length > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                        {selected.length === 0 ? placeholder :
                            isAllSelected ? `All ${label}s` :
                                selected.length === 1 ? selected[0] :
                                    `${selected.length} Selected`}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-blue' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-blue-900/10 overflow-hidden py-3"
                    >
                        {/* Search Input */}
                        <div className="px-3 mb-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-blue/20 rounded-xl text-sm outline-none transition-all font-medium placeholder:text-gray-400"
                                    placeholder={`Search ${label}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {!searchTerm && options.length > 0 && (
                                <>
                                    <div
                                        onClick={toggleAll}
                                        className="px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer flex items-center group"
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isAllSelected ? 'bg-primary-blue border-primary-blue' : 'border-gray-300 group-hover:border-primary-blue'}`}>
                                            {isAllSelected && <Check size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-sm font-bold ${isAllSelected ? 'text-primary-blue' : 'text-gray-600'}`}>Select All</span>
                                    </div>
                                    <div className="h-px bg-gray-50 my-1" />
                                </>
                            )}
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => {
                                    const isSelected = selected.includes(option);
                                    return (
                                        <div
                                            key={option}
                                            onClick={(e) => { e.stopPropagation(); toggleOption(option); }}
                                            className="px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer flex items-center group"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-primary-blue border-primary-blue' : 'border-gray-300 group-hover:border-primary-blue'}`}>
                                                {isSelected && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>{option}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-8 text-center bg-gray-50/30 m-2 rounded-xl border border-dashed border-gray-100">
                                    <Search size={24} className="mx-auto text-gray-200 mb-2" />
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No results found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Booking = () => {
    const { bookings, setBookings } = useData();

    // Filter State
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const [formData, setFormData] = useState({
        names: [],
        locations: [],
        departments: [],
        dateTime: '',
        duration: '1 hour',
        numberOfVehicles: 1
    });

    // Extract dynamic names for the main filter based on selected departments
    const availableNames = useMemo(() => {
        const names = bookings
            .filter(b => selectedDepts.length === 0 || selectedDepts.includes(b.department))
            .map(b => b.name)
            .filter((value, index, self) => self.indexOf(value) === index && value);
        return names.sort();
    }, [bookings, selectedDepts]);

    // Reset names filter if they no longer exist in available names
    useEffect(() => {
        if (selectedNames.length > 0) {
            setSelectedNames(prev => prev.filter(name => availableNames.includes(name)));
        }
    }, [availableNames, selectedNames.length]);

    // Extract names for the form based on selected departments in the form
    const formAvailableNames = useMemo(() => {
        const names = bookings
            .filter(b => formData.departments.length === 0 || formData.departments.includes(b.department))
            .map(b => b.name)
            .filter((value, index, self) => self.indexOf(value) === index && value);
        return names.sort();
    }, [bookings, formData.departments]);

    // Reset names filter if they no longer exist in available names
    useEffect(() => {
        if (selectedNames.length > 0) {
            setSelectedNames(prev => prev.filter(name => availableNames.includes(name)));
        }
    }, [availableNames]);

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
        setFormData({ ...formData, [name]: value });
    };


    const handleOpenForm = () => {
        setFormData({
            names: [],
            locations: [],
            departments: [],
            dateTime: new Date().toISOString().slice(0, 16),
            duration: '1 hour',
            numberOfVehicles: 1
        });
        setShowForm(true);
    };

    const handleBookNow = (e) => {
        e.preventDefault();

        const namesToBook = formData.names.length > 0 ? formData.names : ['New Visitor'];

        const newBookingsToAdd = namesToBook.map((name, index) => {
            // Find the original department for this person if they exist in mock data
            const existingBooking = bookings.find(b => b.name === name);
            const dept = existingBooking ? existingBooking.department : (formData.departments[0] || 'Visitor');

            return {
                id: `B${Date.now()}${index}`,
                name: name,
                department: dept,
                location: formData.locations.length > 0 ? formData.locations.join(', ') : 'All Locations',
                dateTime: formData.dateTime,
                duration: formData.duration,
                numberOfVehicles: formData.numberOfVehicles,
                status: 'Booked',
                type: dept,
                vehicleNumbers: [],
                mobileNumber: 'N/A',
                plateImage: 'https://placehold.co/300x100/f3f4f6/666?text=RESERVED'
            };
        });

        setBookings([...newBookingsToAdd, ...bookings]);
        setShowForm(false);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
    };

    const handlePreview = (booking) => {
        setSelectedBooking(booking);
        setShowPreview(true);
    };

    // Advanced Filter Logic
    const filteredBookings = bookings.filter(b => {
        const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(b.department);
        const matchesName = selectedNames.length === 0 || selectedNames.includes(b.name);
        const matchesLoc = selectedLocations.length === 0 || selectedLocations.includes(b.location);
        return matchesDept && matchesName && matchesLoc;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    return (
        <div className="p-6 h-full flex flex-col bg-gray-50/20 overflow-hidden font-sans">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Booking Management</h1>
                    <p className="text-gray-500 text-sm font-medium">Coordinate visitor arrivals and reservation logs</p>
                </div>
                <button
                    onClick={handleOpenForm}
                    className="flex items-center px-7 py-3.5 bg-primary-red text-white rounded-2xl font-black shadow-2xl shadow-red-200 hover:bg-red-700 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} className="mr-2" /> <span className="text-sm uppercase tracking-widest">Add Booking</span>
                </button>
            </div>

            {/* Premium Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm shadow-blue-900/5">
                <MultiSelectDropdown
                    label="Department"
                    options={hospitalDepartments}
                    selected={selectedDepts}
                    onChange={setSelectedDepts}
                    placeholder="All Departments"
                    icon={Filter}
                />
                <MultiSelectDropdown
                    label="Name / Visitor"
                    options={availableNames}
                    selected={selectedNames}
                    onChange={setSelectedNames}
                    placeholder="All Visitors"
                    icon={User}
                />
                <MultiSelectDropdown
                    label="Location"
                    options={mockSlotData.map(l => l.name)}
                    selected={selectedLocations}
                    onChange={setSelectedLocations}
                    placeholder="All Locations"
                    icon={MapPin}
                />
            </div>

            {/* Table Container */}
            <div className="flex-1 bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 border border-gray-50 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Name</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Dept</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Location</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Entry Time</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">Duration</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100 text-center">Count</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.15em] text-right border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.map((booking) => (
                                <tr key={booking.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                    <td className="px-8 py-5 text-sm font-bold text-gray-800">{booking.name}</td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-blue-50 text-primary-blue rounded-full text-xs font-black uppercase">{booking.department}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center text-sm font-extrabold text-gray-600">
                                            <MapPin size={14} className="mr-2 text-primary-red" /> {booking.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs">
                                        <div className="flex flex-col">
                                            <span className="font-extrabold text-gray-800">{new Date(booking.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            <span className="text-gray-400 mt-0.5 font-bold uppercase">{new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-500 uppercase">{booking.duration}</td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-xs font-black text-gray-800">
                                            {booking.numberOfVehicles}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => handlePreview(booking)}
                                            className="px-4 py-2 rounded-xl text-primary-blue hover:bg-blue-100/50 font-black text-xs uppercase tracking-widest transition-all"
                                        >
                                            <Eye size={16} className="inline mr-2" /> Preview
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modern Pagination */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Total {filteredBookings.length} Records
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2.5 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-primary-blue shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-primary-blue text-white shadow-lg shadow-blue-200' : 'bg-white border border-gray-200 text-gray-500 hover:border-primary-blue'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2.5 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-primary-blue shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Creation Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-white/20"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">New Booking</h2>
                                <button onClick={() => setShowForm(false)} className="p-3 hover:bg-gray-200 rounded-2xl transition-all text-gray-500"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleBookNow} className="p-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <MultiSelectDropdown
                                                options={hospitalDepartments}
                                                selected={formData.departments}
                                                onChange={(val) => setFormData({ ...formData, departments: val, names: [] })}
                                                placeholder="Select Departments"
                                                icon={Filter}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">Visitor</label>
                                            <MultiSelectDropdown
                                                options={formAvailableNames}
                                                selected={formData.names}
                                                onChange={(val) => setFormData({ ...formData, names: val })}
                                                placeholder="Select Visitors"
                                                icon={User}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">Locations</label>
                                            <MultiSelectDropdown
                                                options={mockSlotData.map(l => l.name)}
                                                selected={formData.locations}
                                                onChange={(val) => setFormData({ ...formData, locations: val })}
                                                placeholder="Select Locations"
                                                icon={MapPin}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">Date and time arrival</label>
                                            <div className="relative">
                                                <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="datetime-local"
                                                    name="dateTime"
                                                    required
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue text-sm transition-all"
                                                    value={formData.dateTime}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">Assigned duration</label>
                                            <div className="relative">
                                                <Clock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <select
                                                    name="duration"
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue text-sm appearance-none cursor-pointer transition-all"
                                                    value={formData.duration}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="1 hour">1 hour</option>
                                                    <option value="2 hours">2 hours</option>
                                                    <option value="4 hours">4 hours</option>
                                                    <option value="Full Day">Full Day</option>
                                                </select>
                                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">Vehicle count</label>
                                            <div className="relative">
                                                <Car size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="number"
                                                    name="numberOfVehicles"
                                                    min="1"
                                                    max="10"
                                                    required
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue text-sm transition-all"
                                                    value={formData.numberOfVehicles}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 rounded-lg bg-primary-blue text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 uppercase tracking-wider"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && selectedBooking && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] flex items-center justify-center p-4 text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="p-10">
                                <div className="w-full aspect-[4/1] bg-gray-50 rounded-3xl overflow-hidden border-4 border-gray-50 mb-10 shadow-inner group relative">
                                    <img src={selectedBooking.plateImage} alt="Plate" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                                </div>
                                <div className="text-left space-y-5">
                                    {[
                                        { label: 'Name', value: selectedBooking.name, icon: User },
                                        { label: 'Location', value: selectedBooking.location, icon: MapPin },
                                        { label: 'Arrival', value: new Date(selectedBooking.dateTime).toLocaleString(), icon: Calendar },
                                        { label: 'Duration', value: selectedBooking.duration, icon: Clock },
                                        { label: 'Dept', value: selectedBooking.department, icon: Filter },
                                        { label: 'Vehicles', value: selectedBooking.numberOfVehicles, icon: Car },
                                        { label: 'Status', value: selectedBooking.status, badge: true }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-blue-100 group">
                                            <div className="flex items-center">
                                                {item.icon && <item.icon size={16} className="text-gray-400 mr-3 group-hover:text-primary-blue" />}
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            {item.badge ? (
                                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase">{item.value}</span>
                                            ) : (
                                                <span className={`text-sm font-black text-gray-800 ${item.upper ? 'uppercase' : ''}`}>{item.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setShowPreview(false)} className="w-full mt-10 py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all">Close Entry</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 50, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[600] bg-gray-900/95 backdrop-blur-md text-white px-10 py-5 rounded-[28px] flex items-center space-x-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30"><CheckCircle2 size={24} className="text-white" /></div>
                        <div>
                            <p className="font-black tracking-tight text-sm">Action Successful</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Reservation Saved</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Booking;
