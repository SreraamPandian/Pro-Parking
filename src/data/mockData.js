// Mock data for dashboard
export const mockDashboardData = {
  currentVehicles: 127,
  enteredToday: 243,
  exitedToday: 116,
  availableSlots: 73,
  vehicleFlow: {
    entries: [5, 8, 3, 2, 1, 4, 12, 25, 32, 18, 15, 10, 14, 18, 22, 19, 12, 8, 5, 4, 2, 1, 2, 1],
    exits: [1, 2, 1, 0, 0, 1, 3, 8, 15, 12, 10, 8, 12, 15, 10, 8, 5, 3, 2, 1, 0, 0, 0, 0]
  },
  parkingZones: [
    { id: '1', name: 'Main Parking Zone', total: 200, occupied: 127, isFull: false ,
    department: 'Administration'}
  ]
};

// Mock data for vehicle details
export const mockVehicleData = [
  {
    id: '1',
    vehicleNumber: 'AB12 XYZ',
    entryTime: '2025-05-10 08:15:22',
    exitTime: '2025-05-10 16:45:10',
    type: 'Staff',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=AB12+XYZ',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
    paymentMethod: 'Waiver',
    paymentAmount: '0.000',
    waiverId: 'WAIV-S001',
    waiverReason: 'Official Duty',
    paymentProcessedTime: '2025-05-10 16:40:00', // Example
    department: 'Administration'
  },
  {
    id: '2',
    vehicleNumber: 'CD34 WXY',
    entryTime: '2025-05-10 08:30:45',
    exitTime: null,
    type: 'Staff',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=CD34+WXY',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Security'},
  {
    id: '3',
    vehicleNumber: 'EF56 VUT',
    entryTime: '2025-05-10 09:12:33',
    exitTime: '2025-05-10 11:20:15',
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=EF56+VUT',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
    paymentMethod: 'Cash',
    paymentAmount: '1.000',
    paymentProcessedTime: '2025-05-10 11:18:00', // Example
    department: 'Visitor'
  },
  {
    id: '4',
    vehicleNumber: 'GH78 SRQ',
    entryTime: '2025-05-11 10:00:00',
    exitTime: null,
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=GH78+SRQ',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Visitor'},
  {
    id: '5',
    vehicleNumber: 'IJ90 PON',
    entryTime: '2025-05-11 11:30:00',
    exitTime: '2025-05-11 14:00:00',
    type: 'Staff',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=IJ90+PON',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
    paymentMethod: 'Waiver',
    paymentAmount: '0.000',
    waiverId: 'WAIV-S002',
    waiverReason: 'Dept Head',
    paymentProcessedTime: '2025-05-11 13:55:00', // Example
    department: 'Maintenance'
  },
  {
    id: '6',
    vehicleNumber: 'KL12 MLK',
    entryTime: '2025-05-11 12:15:00',
    exitTime: null,
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=KL12+MLK',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Visitor'},
  {
    id: '7',
    vehicleNumber: 'MN34 JIH',
    entryTime: '2025-05-12 07:50:00',
    exitTime: '2025-05-12 09:55:00',
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=MN34+JIH',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
    paymentMethod: 'Card',
    paymentAmount: '1.500',
    paymentProcessedTime: '2025-05-12 09:50:00', // Example
    department: 'Visitor'
  },
  {
    id: '8',
    vehicleNumber: 'OP56 GFE',
    entryTime: '2025-05-12 09:05:00',
    exitTime: null,
    type: 'Staff',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=OP56+GFE',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Customer Service'},
  {
    id: '9',
    vehicleNumber: 'QR78 DCB',
    entryTime: '2025-05-12 13:20:00',
    exitTime: '2025-05-12 13:50:00',
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=QR78+DCB',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
    paymentMethod: 'Waiver',
    paymentAmount: '0.000',
    waiverReason: 'Drop-off',
    paymentProcessedTime: '2025-05-12 13:48:00', // Example
    department: 'Visitor'
  },
  {
    id: '10',
    vehicleNumber: 'ST90 AZY',
    entryTime: '2025-05-10 15:25:42',
    exitTime: null,
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=ST90+AZY',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Visitor'},
  {
    id: '11',
    vehicleNumber: 'UV12 CBA',
    entryTime: '2025-05-13 09:00:00',
    exitTime: null,
    type: 'Staff',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=UV12+CBA',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Operations'},
  {
    id: '12',
    vehicleNumber: 'WX34 DEF',
    entryTime: '2025-05-13 10:30:00',
    exitTime: '2025-05-13 18:00:00',
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=WX34+DEF',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
    paymentMethod: 'Card',
    paymentAmount: '3.500',
    paymentProcessedTime: '2025-05-13 17:58:00', // Example
    department: 'Visitor'
  },
  {
    id: '13',
    vehicleNumber: 'YZ56 GHI',
    entryTime: '2025-05-13 11:15:00',
    exitTime: null,
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=YZ56+GHI',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Visitor'},
  {
    id: '14',
    vehicleNumber: 'AA78 JKL',
    entryTime: '2025-05-14 08:45:00',
    exitTime: '2025-05-14 12:30:00',
    type: 'Staff',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=AA78+JKL',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
    paymentMethod: 'Waiver',
    paymentAmount: '0.000',
    waiverId: 'WAIV-S003',
    waiverReason: 'Hospital Biz',
    paymentProcessedTime: '2025-05-14 12:25:00', // Example
    department: 'Administration'
  },
  {
    id: '15',
    vehicleNumber: 'BB90 MNO',
    entryTime: '2025-05-14 14:00:00',
    exitTime: null,
    type: 'Visitor',
    plateImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x100/333/white?text=BB90+MNO',
    vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image'
  ,
    department: 'Visitor'}
];

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
    vehicles: [
      { id: 'v1_1', number: 'AA11 BBB', type: 'Car' },
      { id: 'v1_2', number: 'CC22 DDD', type: 'Bike' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2025-12-31',
    isActive: true,
    mobileNumber: '+968 9123 4567'
  },
  {
    id: '2',
    staffName: 'Ms. Fatima Al Harthy',
    department: 'Nursing',
    vehicles: [
      { id: 'v2_1', number: 'EE33 FFF', type: 'Car' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2025-05-15', // Expiring soon
    isActive: true,
    mobileNumber: '+968 9234 5678'
  },
  {
    id: '3',
    staffName: 'Mr. Khalid Al Said',
    department: 'Maintenance',
    vehicles: [
      { id: 'v3_1', number: 'GG44 HHH', type: 'Bike' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2025-04-30', // Expired
    isActive: false,
    mobileNumber: '+968 9345 6789'
  },
  {
    id: '4',
    staffName: 'Mrs. Aisha Al Jabri',
    department: 'IT Support',
    vehicles: [
      { id: 'v4_1', number: 'II55 JJJ', type: 'Car' },
      { id: 'v4_2', number: 'XV12 ZZZ', type: 'Car' },
      { id: 'v4_3', number: 'BC90 YYY', type: 'Bike' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2026-01-01',
    isActive: true,
    mobileNumber: '+968 9456 7890'
  },
  {
    id: '5',
    staffName: 'Mr. Salim Al Maskari',
    department: 'Security',
    vehicles: [
      { id: 'v5_1', number: 'KK66 LLL', type: 'Car' }
    ],
    validFrom: '2025-01-01',
    validUntil: '2025-12-31',
    isActive: false,
    mobileNumber: '+968 9567 8901'
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
    description: 'Regular pricing for visitor cars with progressive rates',
    isActive: true,
    tiers: [
      { id: '1-1', duration: 1, unit: 'hour', priceOMR: '0.500' },
      { id: '1-2', duration: 2, unit: 'hour', priceOMR: '0.300' },
      { id: '1-3', duration: 4, unit: 'hour', priceOMR: '0.200' },
      { id: '1-4', duration: 1, unit: 'day', priceOMR: '3.000' }
    ]
  },
  {
    id: '3', // New ID for another 4-wheeler option
    vehicleType: '4-Wheeler',
    name: 'Premium Car Parking',
    description: 'Covered parking with slightly higher rates',
    isActive: true,
    tiers: [
      { id: '3-1', duration: 1, unit: 'hour', priceOMR: '0.700' },
      { id: '3-2', duration: 3, unit: 'hour', priceOMR: '0.500' },
      { id: '3-3', duration: 1, unit: 'day', priceOMR: '5.000' }
    ]
  }
];

// Mock data for slot management
export const mockSlotData = {
  id: '1',
  name: 'Main Parking Zone',
  totalSlots: 200,
  availableSlots: 73,
  reservedSlots: 50,
  occupiedSlots: 77,
  status: 'active',
  isNearlyFull: false
};

// List of available modules for permissions
export const availableAppModules = [
  'Dashboard',
  'Live Parking',
  'Slot Management',
  'Reports',
  'Payment Reports',
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
