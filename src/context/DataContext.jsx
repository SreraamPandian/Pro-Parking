import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    mockStaffPassData,
    mockBarrierData,
    mockTieredPricingData,
    mockDeviceData,
    mockSlotData,
    mockBookingData,
    mockUserData,
    mockDoctorData,
    mockDashboardData
} from '../data/mockData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // Departments (Initial state copied from Departments.jsx pattern)
    const initialDepartments = [
        { id: 1, name: 'Administration', description: 'Administrative and management staff', employeeCount: 12, location: ['Location A'], isActive: true },
        { id: 2, name: 'Security', description: 'Security and surveillance personnel', employeeCount: 8, location: ['Location B'], isActive: true },
        { id: 3, name: 'Maintenance', description: 'Facility maintenance and technical staff', employeeCount: 15, location: ['Location C'], isActive: true },
        { id: 4, name: 'Customer Service', description: 'Customer support and assistance', employeeCount: 6, location: ['Location A'], isActive: true },
        { id: 5, name: 'Operations', description: 'Daily operations and logistics', employeeCount: 10, location: ['Location B'], isActive: true }
    ];

    const [departments, setDepartments] = useState(() => {
        const saved = localStorage.getItem('appDepartments');
        return saved ? JSON.parse(saved) : initialDepartments;
    });

    // Passes
    const [staffPasses, setStaffPasses] = useState(() => {
        const saved = localStorage.getItem('appStaffPasses');
        return saved ? JSON.parse(saved) : mockStaffPassData;
    });

    // Pricing
    const [pricingData, setPricingData] = useState(() => {
        const saved = localStorage.getItem('appPricingData');
        return saved ? JSON.parse(saved) : mockTieredPricingData.filter(p => p.vehicleType === '4-Wheeler');
    });

    // Devices
    const [devices, setDevices] = useState(() => {
        const saved = localStorage.getItem('appDevices');
        return saved ? JSON.parse(saved) : mockDeviceData;
    });

    // Barriers
    const [barriers, setBarriers] = useState(() => {
        const saved = localStorage.getItem('appBarriers');
        // Filter logic from BoomBarrierControl:
        // initialBarrierData.filter(b => b.name.includes("Main Entrance Barrier") || b.name.includes("Main Exit Barrier"))
        // I'll just store the full list or the filtered list. BoomBarrierControl filters mockBarrierData.
        // I will store the RAW mockBarrierData as base? Or just the ones used?
        // BoomBarrierControl uses specific ones. I'll store the list it uses.
        const initialBarriers = mockBarrierData.filter(b => b.name.includes("Main Entrance Barrier") || b.name.includes("Main Exit Barrier"));
        return saved ? JSON.parse(saved) : initialBarriers;
    });

    // Slots
    const [slots, setSlots] = useState(() => {
        const saved = localStorage.getItem('appSlots');
        return saved ? JSON.parse(saved) : mockSlotData;
    });

    // Bookings
    const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem('appBookings');
        return saved ? JSON.parse(saved) : mockBookingData;
    });

    // Users
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('appUsers');
        return saved ? JSON.parse(saved) : mockUserData;
    });

    // Kiosk Videos
    const [kioskVideos, setKioskVideos] = useState(() => {
        const saved = localStorage.getItem('appKioskVideos');
        return saved ? JSON.parse(saved) : [];
    });

    // Waiver Reasons
    const [waiverReasons, setWaiverReasons] = useState(() => {
        const saved = localStorage.getItem('lifeLineParkingWaiverReasons');
        return saved ? JSON.parse(saved) : ['Official Duty', 'Emergency Staff', 'Invited Guest'];
    });

    // Account Settings
    const [accountSettings, setAccountSettings] = useState(() => {
        const saved = localStorage.getItem('appAccountSettings');
        return saved ? JSON.parse(saved) : {
            name: 'Life Line Admin',
            email: 'admin@lifeline.com',
            phone: '(555) 123-4567',
            organization: 'Pro-Parking System',
            position: 'Parking Administrator'
        };
    });


    // Sync to localStorage
    useEffect(() => localStorage.setItem('appDepartments', JSON.stringify(departments)), [departments]);
    useEffect(() => localStorage.setItem('appStaffPasses', JSON.stringify(staffPasses)), [staffPasses]);
    useEffect(() => localStorage.setItem('appPricingData', JSON.stringify(pricingData)), [pricingData]);
    useEffect(() => localStorage.setItem('appDevices', JSON.stringify(devices)), [devices]);
    useEffect(() => localStorage.setItem('appBarriers', JSON.stringify(barriers)), [barriers]);
    useEffect(() => localStorage.setItem('appSlots', JSON.stringify(slots)), [slots]);
    useEffect(() => localStorage.setItem('appBookings', JSON.stringify(bookings)), [bookings]);
    useEffect(() => localStorage.setItem('appUsers', JSON.stringify(users)), [users]);
    useEffect(() => localStorage.setItem('appKioskVideos', JSON.stringify(kioskVideos)), [kioskVideos]);
    useEffect(() => localStorage.setItem('lifeLineParkingWaiverReasons', JSON.stringify(waiverReasons)), [waiverReasons]);
    useEffect(() => localStorage.setItem('appAccountSettings', JSON.stringify(accountSettings)), [accountSettings]);

    const clearAllData = () => {
        // Option to clear data on logout. User said "unless i log out".
        // Just removing keys or resetting state?
        // Resetting state to initial is complex because initial depends on imports.
        // But removing keys ensures next load is fresh.
        localStorage.removeItem('appDepartments');
        localStorage.removeItem('appStaffPasses');
        localStorage.removeItem('appPricingData');
        localStorage.removeItem('appDevices');
        localStorage.removeItem('appBarriers');
        localStorage.removeItem('appSlots');
        localStorage.removeItem('appBookings');
        localStorage.removeItem('appUsers');
        localStorage.removeItem('appKioskVideos');
        localStorage.removeItem('lifeLineParkingWaiverReasons');
        localStorage.removeItem('appAccountSettings');

        // Optionally reload or reset states here if we stay on page, but logout usually redirects.
        window.location.reload(); // Simplest way to reset everything to initial mock data after clearing storage
    };

    const value = {
        departments, setDepartments,
        staffPasses, setStaffPasses,
        pricingData, setPricingData,
        devices, setDevices,
        barriers, setBarriers,
        slots, setSlots,
        bookings, setBookings,
        users, setUsers,
        kioskVideos, setKioskVideos,
        waiverReasons, setWaiverReasons,
        accountSettings, setAccountSettings,
        clearAllData
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
