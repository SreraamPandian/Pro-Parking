// Mock data for dashboard
export const mockDashboardData = {
  currentVehicles: 125, // Sum of occupied in mockSlotData (40+20+65)
  enteredToday: 243,
  exitedToday: 116,
  availableSlots: 165, // Sum of available in mockSlotData (40+120+5)
  totalSlots: 330, // Sum of total in mockSlotData (100+150+80)
  reservedSlots: 40, // Sum of reserved in mockSlotData (20+10+10)
  vehicleFlow: {
    entries: [5, 8, 3, 2, 1, 4, 12, 25, 32, 18, 15, 10, 14, 18, 22, 19, 12, 8, 5, 4, 2, 1, 2, 1],
    exits: [1, 2, 1, 0, 0, 1, 3, 8, 15, 12, 10, 8, 12, 15, 10, 8, 5, 3, 2, 1, 0, 0, 0, 0]
  },
  parkingZones: [
    {
      id: '1', name: 'Location A', totalSlots: 100, occupiedSlots: 40, availableSlots: 40, reservedSlots: 20, isFull: false,
      department: 'Administration'
    },
    {
      id: '2', name: 'Location B', totalSlots: 150, occupiedSlots: 20, availableSlots: 120, reservedSlots: 10, isFull: false,
      department: 'General'
    },
    {
      id: '3', name: 'Location C', totalSlots: 80, occupiedSlots: 65, availableSlots: 5, reservedSlots: 10, isFull: true,
      department: 'Visitors'
    }
  ]
};

// Helper to generate mock vehicles
const generateMockVehicles = () => {
  const departments = ['Administration', 'Security', 'Maintenance', 'Customer Service', 'Operations', 'Visitor'];
  const locations = ['Location A', 'Location B', 'Location C'];
  let vehicles = [];
  let idCounter = 1;

  departments.forEach(dept => {
    // 30 Live Parking (Inside)
    for (let i = 0; i < 30; i++) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      vehicles.push({
        id: String(idCounter++),
        vehicleNumber: `${dept.substring(0, 2).toUpperCase()}${i}0 ${Math.floor(Math.random() * 900) + 100}`,
        entryTime: '2025-05-14T10:00:00', // Recent
        exitTime: null, // Inside
        type: dept === 'Visitor' ? 'Visitor' : 'Staff',
        department: dept,
        location: randomLocation,
        vehicleImage: 'https://placehold.co/400x300/333/white?text=Vehicle+Image',
        plateImage: `https://placehold.co/300x100/333/white?text=${dept.substring(0, 3).toUpperCase()}`
      });
    }
    // 20 Reports (Exited)
    for (let i = 0; i < 20; i++) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      vehicles.push({
        id: String(idCounter++),
        vehicleNumber: `${dept.substring(0, 2).toUpperCase()}${i}1 ${Math.floor(Math.random() * 900) + 100}`,
        entryTime: '2025-05-13T08:00:00',
        exitTime: '2025-05-13T17:00:00', // Exited
        type: dept === 'Visitor' ? 'Visitor' : 'Staff',
        department: dept,
        location: randomLocation,
        paymentMethod: ['Card', 'Cash', 'Waiver', 'Apple Pay', 'Google Pay'][Math.floor(Math.random() * 5)],
        paymentAmount: (Math.random() * 15 + 1).toFixed(2), // Random $1.00 - $16.00
        paymentProcessedTime: '2025-05-13T16:55:00',
        vehicleImage: 'https://placehold.co/400x300/333/white?text=Vehicle+Image',
        plateImage: `https://placehold.co/300x100/333/white?text=${dept.substring(0, 3).toUpperCase()}`
      });
    }
  });
  return vehicles;
};

export const mockVehicleData = generateMockVehicles();

// Mock data for device configuration (renamed from cameraData)
export const availableDeviceTypes = ["ANPR Camera", "Boom Barrier Controller", "Kiosk Display", "Payment Terminal"];
export const mockDeviceData = [
  {
    id: 'dev1',
    name: 'Entrance ANPR',
    deviceType: 'ANPR Camera',
    ipAddress: '192.168.1.101',
    macAddress: '00:1A:2B:3C:4D:E1',
    port: '80',
    status: 'active'
  },
  {
    id: 'dev2',
    name: 'Exit Boom Controller',
    deviceType: 'Boom Barrier Controller',
    ipAddress: '192.168.1.102',
    macAddress: '00:1A:2B:3C:4D:E2',
    port: '5000',
    status: 'active'
  },
  {
    id: 'dev3',
    name: 'Lobby Kiosk',
    deviceType: 'Kiosk Display',
    ipAddress: '192.168.1.103',
    macAddress: '00:1A:2B:3C:4D:E3',
    port: '3000',
    status: 'inactive'
  }
];

// Mock data for staff passes
export const mockStaffPassData = [
  {
    id: '1',
    staffName: 'Mr. Ahmed Al Balushi',
    department: 'Administration',
    location: 'Location A',
    vehicles: [
      { id: 'v1_1', number: 'AA11 BBB', type: 'Car' },
      { id: 'v1_2', number: 'CC22 DDD', type: 'Bike' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2025-12-31',
    isActive: true,
    mobileNumber: '(555) 123-4567'
  },
  {
    id: '2',
    staffName: 'Ms. Fatima Al Harthy',
    department: 'Nursing',
    location: 'Location B',
    vehicles: [
      { id: 'v2_1', number: 'EE33 FFF', type: 'Car' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2025-05-15', // Expiring soon
    isActive: true,
    mobileNumber: '(555) 234-5678'
  },
  {
    id: '3',
    staffName: 'Mr. Khalid Al Said',
    department: 'Maintenance',
    location: 'Location C',
    vehicles: [
      { id: 'v3_1', number: 'GG44 HHH', type: 'Bike' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2025-04-30', // Expired
    isActive: false,
    mobileNumber: '(555) 345-6789'
  },
  {
    id: '4',
    staffName: 'Mrs. Aisha Al Jabri',
    department: 'IT Support',
    location: 'Location A',
    vehicles: [
      { id: 'v4_1', number: 'II55 JJJ', type: 'Car' },
      { id: 'v4_2', number: 'XV12 ZZZ', type: 'Car' },
      { id: 'v4_3', number: 'BC90 YYY', type: 'Bike' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2026-01-01',
    isActive: true,
    mobileNumber: '(555) 456-7890'
  }
];

// Mock data for doctor passes (Added)
export const mockDoctorData = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Al-Lawati',
    department: 'Cardiology',
    location: 'Location A',
    vehicleNumber: 'DR 101',
    vehicleType: 'Car',
    validFrom: '2025-01-01',
    validUntil: '2025-12-31',
    isActive: true
  },
  {
    id: 'doc2',
    name: 'Dr. Mohammed Al-Hasni',
    department: 'Neurology',
    location: 'Location B',
    vehicleNumber: 'DR 202',
    vehicleType: 'Car',
    validFrom: '2025-02-01',
    validUntil: '2025-08-01',
    isActive: true
  }
];

// Mock data for settings
export const mockSettingsData = {
  parking: {
    gates: [
      {
        id: '1',
        name: 'Main Entrance',
        totalSlots: 200,
        staffAllocation: 60,
        visitorAllocation: 80,
        emergencyAllocation: 20
      }
    ]
  }
};

// Mock data for tiered pricing module (Only 4-Wheeler)
export const mockTieredPricingData = [
  {
    id: '1',
    vehicleType: '4-Wheeler',
    name: 'Standard Car Parking',
    department: 'All',
    location: 'Location A',
    description: 'Regular pricing for visitor cars with progressive rates',
    isActive: true,
    tiers: [
      { id: '1-1', duration: 1, unit: 'hour', priceUSD: '1.50' },
      { id: '1-2', duration: 2, unit: 'hour', priceUSD: '1.00' },
      { id: '1-3', duration: 4, unit: 'hour', priceUSD: '0.75' },
      { id: '1-4', duration: 1, unit: 'day', priceUSD: '15.00' }
    ]
  },
  {
    id: '3', // New ID for another 4-wheeler option
    vehicleType: '4-Wheeler',
    name: 'Premium Car Parking',
    department: 'All',
    location: 'Location B',
    description: 'Covered parking with slightly higher rates',
    isActive: true,
    tiers: [
      { id: '3-1', duration: 1, unit: 'hour', priceUSD: '2.50' },
      { id: '3-2', duration: 3, unit: 'hour', priceUSD: '2.00' },
      { id: '3-3', duration: 1, unit: 'day', priceUSD: '25.00' }
    ]
  }
];

// Mock data for slot management
export const mockSlotData = [
  {
    id: '1',
    name: 'Location A',
    totalSlots: 100,
    availableSlots: 40,
    reservedSlots: 20,
    occupiedSlots: 40,
    status: 'active',
    isNearlyFull: false
  },
  {
    id: '2',
    name: 'Location B',
    totalSlots: 150,
    availableSlots: 120,
    reservedSlots: 10,
    occupiedSlots: 20,
    status: 'active',
    isNearlyFull: false
  },
  {
    id: '3',
    name: 'Location C',
    totalSlots: 80,
    availableSlots: 5,
    reservedSlots: 10,
    occupiedSlots: 65,
    status: 'active',
    isNearlyFull: true
  }
];

// List of available modules for permissions
export const availableAppModules = [
  'Dashboard',
  'Live Parking',
  'Slot Management',
  'Reports',
  'Payment Reports',
  'Booking Reports',
  'Pricing',
  'Passes',
  'Device Configuration', // Renamed
  'Add User',
  'Kiosk Management',
  'Boom Barrier Control',
  'Settings'
];

// Mock data for Boom Barriers (Removed Staff Parking)
export const mockBarrierData = [
  { id: 'barrier_entry_1', name: 'Main Entrance Barrier', location: 'North Gate', status: 'closed', autoCloseTime: null },
  { id: 'barrier_exit_1', name: 'Main Exit Barrier', location: 'North Gate', status: 'closed', autoCloseTime: null },
];
// List of hospital departments
// List of hospital departments
export const hospitalDepartments = ['Administration', 'Security', 'Maintenance', 'Customer Service', 'Operations', 'Visitor'];

// Mock data for bookings
export const mockBookingData = [
  {
    id: 'bk1',
    name: 'John Doe',
    location: 'Location A',
    department: 'Administration',
    vehicleNumbers: ['AA 1234'],
    mobileNumber: '(987) 654-3210',
    numberOfVehicles: 1,
    dateTime: '2026-01-10T10:00:00',
    duration: '2 hours',
    status: 'Booked',
    type: 'Visitor',
    plateImage: 'https://placehold.co/300x100/333/white?text=AA1234'
  },
  {
    id: 'bk2',
    name: 'Jane Smith',
    location: 'Location B',
    department: 'Security',
    vehicleNumbers: ['BB 5678', 'CC 9012'],
    mobileNumber: '(912) 345-6780',
    numberOfVehicles: 2,
    dateTime: '2026-01-10T11:30:00',
    duration: '4 hours',
    status: 'Booked',
    type: 'Staff',
    plateImage: 'https://placehold.co/300x100/333/white?text=BB5678'
  },
  {
    id: 'bk3',
    name: 'Robert Brown',
    location: 'Location C',
    department: 'Visitor',
    vehicleNumbers: ['DD 3456'],
    mobileNumber: '(900) 012-3456',
    numberOfVehicles: 1,
    dateTime: '2026-01-11T09:15:00',
    duration: '1 hour',
    status: 'Cancelled',
    type: 'Visitor',
    plateImage: 'https://placehold.co/300x100/333/white?text=DD3456'
  },
  {
    id: 'bk4',
    name: 'Michael Wilson',
    location: 'Location A',
    department: 'Security',
    vehicleNumbers: ['EE 5566', 'FF 7788', 'GG 9900'],
    mobileNumber: '(988) 877-6655',
    numberOfVehicles: 3,
    dateTime: '2026-01-11T14:45:00',
    duration: '6 hours',
    status: 'Booked',
    type: 'Staff',
    plateImage: 'https://placehold.co/300x100/333/white?text=EE5566'
  }
];
