import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, Calendar, Clock, Car, X, Eye, Plus, QrCode, Check, Printer, CreditCard, DollarSign, FileText, Ticket, Wallet, ShieldCheck, Smartphone, ParkingSquare } from 'lucide-react'; // Added Smartphone icon
import { mockSlotData, mockTieredPricingData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion'; // For modal animation

const VehicleDetails = () => {
  const { vehiclesData, updateVehiclesData } = useOutletContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All'); // New state
  const [selectedVehicleForPreview, setSelectedVehicleForPreview] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddFormModal, setShowAddFormModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scannedVehicleData, setScannedVehicleData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStep, setPaymentStep] = useState('initial');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [waiverRemarks, setWaiverRemarks] = useState('');
  const [addFormState, setAddFormState] = useState({ vehicleNumber: '', entryTime: '', type: 'Visitor', department: 'Visitor', plateImage: '/assets/plates/AB12XYZ.png', location: 'Location A' }); // Added location
  const [slotData, setSlotData] = useState(mockSlotData);
  const receiptRef = useRef(null);
  const [showSampleEntryTicketModal, setShowSampleEntryTicketModal] = useState(false); // New state for entry ticket modal
  const entryTicketRef = useRef(null); // Ref for printing entry ticket

  const vehiclesInsideParking = vehiclesData.filter(vehicle => !vehicle.exitTime);

  const filteredVehiclesToDisplay = vehiclesInsideParking.filter(vehicle => {
    if (searchTerm && !vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (departmentFilter !== 'All' && vehicle.department !== departmentFilter) return false;
    if (locationFilter !== 'All' && vehicle.location !== locationFilter) return false; // Location filter logic
    return true;
  });

  const getTypeBadge = (type) => {
    const colors = { 'Staff': 'bg-blue-100 text-primary-blue', 'Visitor': 'bg-yellow-100 text-yellow-800' };
    return <span className={`px-2 py-1 text-xs rounded-full ${colors[type]}`}>{type}</span>;
  };

  const handlePreview = (vehicle) => { setSelectedVehicleForPreview(vehicle); setShowPreviewModal(true); };

  const handleOpenAddVehicleForm = () => {
    setAddFormState({
      vehicleNumber: '',
      entryTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: 'Visitor',
      department: 'Visitor',
      plateImage: '/assets/plates/AB12XYZ.png'
    });
    setShowAddFormModal(true);
  };

  const handleScanTicket = () => {
    setShowScanModal(true);
    setPaymentStep('initial');
    setScannedVehicleData(null);
    setWaiverRemarks('');
    setTimeout(() => {
      const insideVehicles = vehiclesData.filter(v => !v.exitTime);
      if (insideVehicles.length > 0) {
        const randomVehicle = insideVehicles[Math.floor(Math.random() * insideVehicles.length)];
        setScannedVehicleData({
          ...randomVehicle,
          calculatedFee: calculateParkingFee(randomVehicle),
          paymentTime: new Date().toISOString()
        });
        setPaymentStep('methodOrWaiverSelection');
      } else {
        alert('No vehicles currently inside to scan.');
        setShowScanModal(false);
      }
    }, 1500);
  };

  const calculateParkingFee = (vehicle) => {
    if (!vehicle || !vehicle.entryTime || vehicle.type === 'Staff') return '0.00';
    const pricingTierData = mockTieredPricingData.find(p => p.isActive && p.name.includes('Standard Car Parking')) || mockTieredPricingData[0];
    if (!pricingTierData || !pricingTierData.tiers) return '0.00';
    const entryTime = new Date(vehicle.entryTime); const currentTime = new Date();
    const durationMs = currentTime - entryTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    let totalFee = 0;
    let remainingHours = durationHours;
    const sortedTiers = [...pricingTierData.tiers].sort((a, b) => {
      const durationA = a.unit === 'day' ? a.duration * 24 : a.duration;
      const durationB = b.unit === 'day' ? b.duration * 24 : b.duration;
      return durationA - durationB;
    });
    for (const tier of sortedTiers) {
      if (remainingHours <= 0) break;
      const tierDurationInHours = tier.unit === 'day' ? tier.duration * 24 : tier.duration;
      const hoursInThisTier = Math.min(remainingHours, tierDurationInHours);
      totalFee += hoursInThisTier * parseFloat(tier.priceUSD);
      remainingHours -= hoursInThisTier;
    }
    return totalFee > 0 ? totalFee.toFixed(2) : '0.50';
  };

  const processVehicleExitAndUpdateGlobal = (vehicleId, exitData) => {
    const updatedGlobalVehicles = vehiclesData.map(v =>
      v.id === vehicleId ? { ...v, ...exitData, paymentProcessedTime: new Date().toISOString() } : v
    );
    updateVehiclesData(updatedGlobalVehicles);
    setPaymentStep('receipt');
    setSlotData(prev => ({ ...prev, occupiedSlots: prev.occupiedSlots - 1, availableSlots: prev.availableSlots + 1 }));
  };

  const handleSelectPaymentOrWaiver = (type) => {
    if (type === 'payment') setPaymentStep('paymentMethodSelection');
    else if (type === 'waiver') setPaymentStep('waiverReasonInput');
  };

  const handleProcessPayment = () => {
    if (!scannedVehicleData) return;

    if (paymentMethod === 'Waiver') {
      setPaymentStep('waiverReasonInput');
      return;
    }

    if (paymentMethod === 'Card') {
      setPaymentStep('cardInput');
      return;
    }

    if (paymentMethod === 'Apple Pay' || paymentMethod === 'Google Pay') {
      setPaymentStep('qrData');
      return;
    }

    // Cash or direct processing
    initiateProcessing();
  };

  const initiateProcessing = () => {
    setIsProcessingPayment(true);
    setPaymentStep('processing'); // New step for UI feedback

    setTimeout(() => {
      const exitTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const paymentData = {
        exitTime: exitTime,
        paymentMethod: paymentMethod,
        paymentAmount: scannedVehicleData.calculatedFee,
        paymentTime: new Date().toISOString(),
        waiverReason: null
      };
      setScannedVehicleData(prev => ({ ...prev, ...paymentData }));
      processVehicleExitAndUpdateGlobal(scannedVehicleData.id, paymentData);
      setIsProcessingPayment(false);
    }, 2000); // 2 second delay to simulate processing
  };

  const handleConfirmWaiver = () => {
    if (!scannedVehicleData || !waiverRemarks.trim()) {
      alert("Please enter a reason for the waiver.");
      return;
    }
    const exitTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const waiverData = {
      exitTime: exitTime,
      paymentMethod: 'Waiver',
      paymentAmount: '0.000',
      waiverReason: waiverRemarks.trim(),
      paymentTime: new Date().toISOString()
    };
    setScannedVehicleData(prev => ({ ...prev, ...waiverData }));
    processVehicleExitAndUpdateGlobal(scannedVehicleData.id, waiverData);
  };

  const handleAddNewVehicleSubmit = (e) => {
    e.preventDefault();
    const newVehicleEntry = {
      id: Date.now().toString(),
      ...addFormState,
      vehicleImage: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/333/white?text=Vehicle+Image',
      exitTime: null,
      paymentProcessedTime: null
    };
    updateVehiclesData([...vehiclesData, newVehicleEntry]);
    setShowAddFormModal(false);
    setSlotData(prev => ({ ...prev, occupiedSlots: prev.occupiedSlots + 1, availableSlots: prev.availableSlots - 1 }));
  };

  const handlePrintReceipt = () => {
    const printContent = receiptRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printableArea = printContent.innerHTML;
      document.body.innerHTML = `<div class="print-container p-4">${printableArea}</div>`;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const formatDateTimeForDisplay = (isoString) => {
    if (!isoString) return '-';
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch (e) { return isoString; }
  };

  const SampleEntryTicketContent = () => (
    <div className="flex flex-col items-center text-center p-2 border-2 border-dashed border-gray-300 rounded-md bg-white">
      <img src="https://img-wrapper.vercel.app/image?url=https://i.ibb.co/K9fK5dK/Life-Line-Logo.png" alt="Pro-Parking Logo" className="w-16 h-auto mb-2" />
      <h3 className="text-lg font-bold text-gray-800">Pro-Parking</h3>
      <p className="text-xs text-gray-500 mb-2">ENTRY TICKET</p>

      <div className="w-full text-left space-y-2 mt-2 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Vehicle:</span>
          <span className="font-bold">{addFormState.vehicleNumber.toUpperCase() || 'XXX 0000'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Dept:</span>
          <span>{addFormState.department}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Location:</span> {/* Added Location */}
          <span>{addFormState.location || 'Location A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Entry:</span>
          <span>{new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="my-4">
        {/* Placeholder QR Code */}
        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center border border-gray-200">
          <QrCode size={64} className="text-gray-400" />
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Scan for exit/payment</p>
      </div>

      <p className="text-[10px] text-gray-500 mt-2">
        Please keep this ticket for validation. <br /> Lost ticket charges apply.
      </p>
    </div>
  );

  const handlePrintEntryTicket = () => {
    const printContent = entryTicketRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printableArea = printContent.innerHTML;
      document.body.innerHTML = `<div class="print-container p-4">${printableArea}</div>`;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };


  return (
    <div className="p-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mb-6 flex justify-between items-center no-print">
        <div><h1 className="text-2xl font-bold text-gray-800">Live Parking</h1><p className="text-gray-600">Search vehicle entry logs for parking system</p></div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue" onClick={() => setShowSampleEntryTicketModal(true)}><Ticket size={18} className="mr-2" />Sample Entry Ticket</button>
          <button className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red" onClick={handleScanTicket}><QrCode size={18} className="mr-2" />Scan Ticket</button>
          <button className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red" onClick={handleOpenAddVehicleForm}><Plus size={18} className="mr-2" />Add Vehicle</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print">
        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Parking Slot Status</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-md"><p className="text-sm text-primary-blue mb-1">Total Slots</p><p className="text-xl font-bold text-primary-blue">{slotData.totalSlots}</p></div>
          <div className="bg-green-50 p-3 rounded-md"><p className="text-sm text-green-500 mb-1">Available</p><p className="text-xl font-bold text-green-700">{slotData.availableSlots}</p></div>
          <div className="bg-yellow-50 p-3 rounded-md"><p className="text-sm text-yellow-500 mb-1">Reserved</p><p className="text-xl font-bold text-yellow-700">{slotData.reservedSlots}</p></div>
          <div className="bg-red-50 p-3 rounded-md"><p className="text-sm text-primary-red mb-1">Occupied</p><p className="text-xl font-bold text-primary-red">{slotData.occupiedSlots}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div><input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" placeholder="Search by vehicle number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>

          <div className="w-full md:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ParkingSquare size={18} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue appearance-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="All">All Locations</option>
                <option value="Location A">Location A</option>
                <option value="Location B">Location B</option>
                <option value="Location C">Location C</option>
              </select>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue appearance-none"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Administration">Administration</option>
                <option value="Security">Security</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Operations">Operations</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Time</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider no-print">Location</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ANPR Image</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{filteredVehiclesToDisplay.map((vehicle) => (<tr key={vehicle.id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Car size={16} className="mr-2 text-gray-500" /><span className="font-medium">{vehicle.vehicleNumber}</span></div></td><td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">{vehicle.department || 'N/A'}</span></td><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Clock size={16} className="mr-2 text-gray-500" /><span>{formatDateTimeForDisplay(vehicle.entryTime)}</span></div></td><td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(vehicle.type)}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 no-print">{vehicle.location || '-'}</td><td className="px-6 py-4 whitespace-nowrap"><div className="w-32 h-12 bg-gray-100 rounded overflow-hidden"><img src={vehicle.plateImage} alt={`License plate ${vehicle.vehicleNumber}`} className="w-full h-full object-cover" /></div></td><td className="px-6 py-4 whitespace-nowrap"><button className="flex items-center text-primary-blue hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-primary-blue" onClick={() => handlePreview(vehicle)}><Eye size={16} className="mr-1" />Preview</button></td></tr>))}</tbody></table>{filteredVehiclesToDisplay.length === 0 && <div className="text-center py-8 text-gray-500">No vehicles currently inside parking or matching search.</div>}</div>
      </div>


      {showPreviewModal && selectedVehicleForPreview && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print"><div className="bg-white rounded-lg w-full max-w-lg p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Number Plate: {selectedVehicleForPreview.vehicleNumber}</h3><button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-blue" onClick={() => setShowPreviewModal(false)}><X size={20} /></button></div><div className="flex flex-col items-center"><div className="bg-gray-100 rounded-lg overflow-hidden mb-6 w-full max-w-md"><img src={selectedVehicleForPreview.plateImage} alt={`License plate ${selectedVehicleForPreview.vehicleNumber}`} className="w-full h-auto" /></div><div className="grid grid-cols-2 gap-4 w-full"><div><p className="text-sm text-gray-500">Vehicle Number</p><p className="font-medium">{selectedVehicleForPreview.vehicleNumber}</p></div><div><p className="text-sm text-gray-500">Type</p><p className="font-medium">{selectedVehicleForPreview.type}</p></div><div><p className="text-sm text-gray-500">Entry Time</p><p className="font-medium">{formatDateTimeForDisplay(selectedVehicleForPreview.entryTime)}</p></div></div></div><div className="mt-6 flex justify-end"><button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue" onClick={() => setShowPreviewModal(false)}>Close</button></div></div></div>}

      {showAddFormModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print"><div className="bg-white rounded-lg w-full max-w-lg p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Add New Vehicle</h3><button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-blue" onClick={() => setShowAddFormModal(false)}><X size={20} /></button></div><form onSubmit={handleAddNewVehicleSubmit}><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={addFormState.vehicleNumber} onChange={(e) => setAddFormState({ ...addFormState, vehicleNumber: e.target.value })} required placeholder="e.g. AB12 XYZ" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label><select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={addFormState.type} onChange={(e) => { const newType = e.target.value; setAddFormState({ ...addFormState, type: newType, department: newType === 'Visitor' ? 'Visitor' : 'Administration' }); }}><option value="Visitor">Visitor</option><option value="Staff">Staff</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={addFormState.department} onChange={(e) => setAddFormState({ ...addFormState, department: e.target.value })} disabled={addFormState.type === 'Visitor'} >{addFormState.type === 'Visitor' ? (<option value="Visitor">Visitor</option>) : (<><option value="Administration">Administration</option><option value="Security">Security</option><option value="Maintenance">Maintenance</option><option value="Customer Service">Customer Service</option><option value="Operations">Operations</option></>)}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Entry Time</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-gray-100" value={formatDateTimeForDisplay(addFormState.entryTime)} readOnly /><p className="mt-1 text-xs text-gray-500">Entry time is automatically set to current time</p></div></div><div className="mt-6 flex justify-end space-x-3"><button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue" onClick={() => setShowAddFormModal(false)}>Cancel</button><button type="submit" className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red">Add Vehicle</button></div></form></div></div>}

      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {paymentStep === 'initial' && 'Scan Ticket'}
                {paymentStep === 'methodOrWaiverSelection' && 'Process Exit'}
                {paymentStep === 'paymentMethodSelection' && 'Select Payment Method'}
                {paymentStep === 'waiverReasonInput' && 'Apply Waiver'}
                {paymentStep === 'processing' && 'Processing Transaction...'}
                {paymentStep === 'receipt' && (scannedVehicleData?.paymentMethod === 'Waiver' ? 'Waiver Applied' : 'Payment Successful')}
              </h3>
              {paymentStep !== 'processing' && (
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-blue" onClick={() => { setShowScanModal(false); setScannedVehicleData(null); setPaymentStep('initial'); setWaiverRemarks(''); }}> <X size={20} /> </button>
              )}
            </div>

            {paymentStep === 'initial' && (<div className="flex flex-col items-center py-8"> <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative"><QrCode size={100} className="text-gray-400" /><div className="absolute inset-0 border-2 border-primary-blue animate-pulse rounded-lg"></div></div> <p className="text-gray-600">Scanning ticket... Please wait.</p> </div>)}
            {paymentStep === 'methodOrWaiverSelection' && scannedVehicleData && (<div className="py-4"> <div className="w-full bg-blue-50 p-4 rounded-lg mb-4 flex items-center"><div className="bg-blue-100 rounded-full p-2 mr-3"><Car size={20} className="text-primary-blue" /></div><div><h4 className="font-medium text-primary-blue">Vehicle Details</h4><p className="text-sm text-blue-600">Confirm details and choose an action.</p></div></div> <div className="grid grid-cols-2 gap-4 mb-4"> <div><p className="text-sm text-gray-500">Vehicle Number</p><p className="font-medium">{scannedVehicleData.vehicleNumber}</p></div> <div><p className="text-sm text-gray-500">Type</p><p className="font-medium">{scannedVehicleData.type}</p></div> <div><p className="text-sm text-gray-500">Entry Time</p><p className="font-medium">{formatDateTimeForDisplay(scannedVehicleData.entryTime)}</p></div> <div><p className="text-sm text-gray-500">Duration</p><p className="font-medium">{(() => { const entryTime = new Date(scannedVehicleData.entryTime); const now = new Date(); const diffMs = now - entryTime; const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); return `${diffHrs}h ${diffMins}m`; })()}</p></div> </div> <div className="bg-red-50 p-4 rounded-lg mb-6"><div className="flex justify-between items-center"><span className="font-medium text-primary-red">Parking Fee Due:</span><span className="text-2xl font-bold text-primary-red">${scannedVehicleData.calculatedFee}</span></div></div> <div className="flex flex-col space-y-3"> <button className="w-full px-4 py-3 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red" onClick={() => handleSelectPaymentOrWaiver('payment')}>Process Payment</button> <button className="w-full px-4 py-3 bg-primary-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue" onClick={() => handleSelectPaymentOrWaiver('waiver')}>Apply Waiver</button> </div> </div>)}
            {paymentStep === 'paymentMethodSelection' && scannedVehicleData && (
              <div className="py-4">
                <div className="bg-red-50 p-4 rounded-lg mb-6 flex justify-between items-center shadow-sm">
                  <span className="font-medium text-primary-red">Total Fee Due:</span>
                  <span className="text-3xl font-bold text-primary-red">${scannedVehicleData.calculatedFee}</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-4">Select Payment Method</h4>

                {/* Digital Wallets Section */}
                <div className="mb-6">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Digital Wallets</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={`p-4 rounded-xl border-2 flex items-center justify-start transition-all ${paymentMethod === 'Apple Pay' ? 'border-primary-blue bg-blue-50 ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('Apple Pay')}
                    >
                      <Smartphone size={24} className="mr-3 text-gray-800" />
                      <span className="font-medium text-sm">Apple Pay</span>
                    </button>
                    <button
                      className={`p-4 rounded-xl border-2 flex items-center justify-start transition-all ${paymentMethod === 'Google Pay' ? 'border-primary-blue bg-blue-50 ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('Google Pay')}
                    >
                      <Wallet size={24} className="mr-3 text-green-600" />
                      <span className="font-medium text-sm">Google Pay</span>
                    </button>
                  </div>
                </div>

                {/* Cards & Others Section */}
                <div className="mb-6">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cards & Others</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={`p-4 rounded-xl border-2 flex items-center justify-start transition-all ${paymentMethod === 'Visa' ? 'border-primary-blue bg-blue-50 ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('Visa')}
                    >
                      <CreditCard size={24} className="mr-3 text-blue-600" />
                      <span className="font-medium text-sm">Visa</span>
                    </button>
                    <button
                      className={`p-4 rounded-xl border-2 flex items-center justify-start transition-all ${paymentMethod === 'Mastercard' ? 'border-primary-blue bg-blue-50 ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('Mastercard')}
                    >
                      <CreditCard size={24} className="mr-3 text-orange-600" />
                      <span className="font-medium text-sm">Mastercard</span>
                    </button>
                  </div>
                </div>

                {/* Other Payment Methods */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={`p-4 rounded-xl border-2 flex items-center justify-start transition-all ${paymentMethod === 'PayPal' ? 'border-primary-blue bg-blue-50 ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('PayPal')}
                    >
                      <DollarSign size={24} className="mr-3 text-blue-500" />
                      <span className="font-medium text-sm">PayPal</span>
                    </button>
                    <button
                      className={`p-4 rounded-xl border-2 flex items-center justify-start transition-all ${paymentMethod === 'Tap to Pay' ? 'border-primary-blue bg-blue-50 ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('Tap to Pay')}
                    >
                      <Smartphone size={24} className="mr-3 text-purple-600" />
                      <span className="font-medium text-sm">Tap to Pay</span>
                    </button>
                    <button
                      className={`p-4 rounded-xl border-2 flex items-center justify-start transition-all ${paymentMethod === 'Waiver' ? 'border-primary-blue bg-blue-50 ring-2 ring-primary-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('Waiver')}
                    >
                      <FileText size={24} className="mr-3 text-purple-600" />
                      <span className="font-medium text-sm">Waiver</span>
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="w-full sm:w-auto px-6 py-3 bg-primary-red text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red shadow-md transition-colors" onClick={handleProcessPayment}>
                    {paymentMethod === 'Waiver' ? 'Proceed to Waiver' : `Proceed with ${paymentMethod}`}
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'cardInput' && (
              <div className="py-4">
                <h4 className="font-medium text-gray-800 mb-4">Enter Card Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="123" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button className="w-full px-6 py-3 bg-primary-red text-white font-medium rounded-md hover:bg-red-700" onClick={initiateProcessing}>
                    Pay ${scannedVehicleData.calculatedFee}
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'qrData' && (
              <div className="py-8 flex flex-col items-center">
                <h4 className="font-medium text-gray-800 mb-2">Scan to Pay with {paymentMethod}</h4>
                <p className="text-sm text-gray-500 mb-6">Please scan the QR code below using your device.</p>
                <div className="w-64 h-64 bg-white p-4 rounded-lg shadow-inner border border-gray-200 mb-6 flex items-center justify-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAY-${paymentMethod}-${scannedVehicleData.calculatedFee}`} alt="Payment QR" className="w-full h-full" />
                </div>
                <button className="px-6 py-3 bg-primary-blue text-white font-medium rounded-md hover:bg-blue-700 animate-pulse" onClick={initiateProcessing}>
                  Simulate Payment Confirmation
                </button>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mb-4"></div>
                <h4 className="text-lg font-medium text-gray-800">Processing Payment...</h4>
                <p className="text-gray-500 text-sm mt-2">Connecting to {paymentMethod} gateway securely.</p>
              </div>
            )}

            {paymentStep === 'waiverReasonInput' && scannedVehicleData && (<div className="py-4"> <h4 className="font-medium text-gray-800 mb-2">Waiver Reason/Remarks</h4> <textarea value={waiverRemarks} onChange={(e) => setWaiverRemarks(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" rows="3" placeholder="Enter reason for waiving the parking fee..." /> <div className="mt-6 flex justify-end"> <button className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue" onClick={handleConfirmWaiver}>Confirm Waiver</button> </div> </div>)}
            {paymentStep === 'receipt' && scannedVehicleData && (<div className="py-4"> <div className={`w-full p-4 rounded-lg mb-4 flex items-center ${scannedVehicleData.paymentMethod === 'Waiver' ? 'bg-blue-50' : 'bg-green-50'}`}> <div className={`${scannedVehicleData.paymentMethod === 'Waiver' ? 'bg-blue-100' : 'bg-green-100'} rounded-full p-2 mr-3`}><Check size={20} className={`${scannedVehicleData.paymentMethod === 'Waiver' ? 'text-primary-blue' : 'text-green-600'}`} /></div> <div><h4 className={`font-medium ${scannedVehicleData.paymentMethod === 'Waiver' ? 'text-primary-blue' : 'text-green-800'}`}>{scannedVehicleData.paymentMethod === 'Waiver' ? 'Waiver Applied Successfully!' : 'Payment Successful!'}</h4><p className={`text-sm ${scannedVehicleData.paymentMethod === 'Waiver' ? 'text-blue-600' : 'text-green-600'}`}>Receipt generated below.</p></div> </div> <div ref={receiptRef} className="border border-gray-300 p-4 rounded-md bg-white"> <div className="text-center mb-4"> <img src="https://img-wrapper.vercel.app/image?url=https://i.ibb.co/K9fK5dK/Life-Line-Logo.png" alt="Pro-Parking Logo" className="w-20 h-auto mx-auto mb-2" /> <h3 className="text-lg font-semibold text-primary-blue">Pro-Parking - {scannedVehicleData.paymentMethod === 'Waiver' ? 'Waiver Confirmation' : 'Payment Receipt'}</h3> <p className="text-xs text-gray-500">ID: {scannedVehicleData.paymentMethod === 'Waiver' ? 'WAIV-' : 'RCPT-'}{Date.now()}</p> </div> <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3"> <div><strong className="text-gray-600">Vehicle Number:</strong> {scannedVehicleData.vehicleNumber}</div> <div><strong className="text-gray-600">Department:</strong> {scannedVehicleData.department || 'Visitor'}</div> <div><strong className="text-gray-600">Location:</strong> {scannedVehicleData.location || 'N/A'}</div> <div><strong className="text-gray-600">Payment Mode:</strong> {scannedVehicleData.paymentMethod?.toUpperCase()}</div> <div><strong className="text-gray-600">Entry Time:</strong> {formatDateTimeForDisplay(scannedVehicleData.entryTime)}</div> <div><strong className="text-gray-600">Exit Time:</strong> {formatDateTimeForDisplay(scannedVehicleData.exitTime)}</div> <div><strong className="text-gray-600">Duration:</strong> {(() => { const entryTime = new Date(scannedVehicleData.entryTime); const exitTime = new Date(scannedVehicleData.exitTime); const diffMs = exitTime - entryTime; const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); return `${diffHrs}h ${diffMins}m`; })()}</div> <div><strong className="text-gray-600">{scannedVehicleData.paymentMethod === 'Waiver' ? 'Waiver Time:' : 'Payment Time:'}</strong> {formatDateTimeForDisplay(scannedVehicleData.paymentTime)}</div> </div> {scannedVehicleData.paymentMethod === 'Waiver' && scannedVehicleData.waiverReason && (<div className="text-sm mb-3"><strong className="text-gray-600">Waiver Reason:</strong> {scannedVehicleData.waiverReason}</div>)} <div className="border-t border-gray-200 pt-3 mt-3"> <div className="flex justify-between items-center text-lg font-bold"> <span className="text-gray-700">{scannedVehicleData.paymentMethod === 'Waiver' ? 'Fee Waived:' : 'Total Amount Paid:'}</span> <span className="text-primary-red">${scannedVehicleData.paymentAmount}</span> </div> </div> <p className="text-xs text-gray-500 mt-4 text-center">Thank you for using Pro-Parking. Drive Safe!</p> </div> <div className="mt-6 flex justify-end space-x-3"> <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue" onClick={handlePrintReceipt}><Printer size={16} className="mr-1.5" />Print</button> <button className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-red" onClick={() => { setShowScanModal(false); setScannedVehicleData(null); setPaymentStep('initial'); setWaiverRemarks(''); }}>Close</button> </div> </div>)}
          </div>
        </div>
      )}

      {/* Sample Entry Ticket Modal */}
      <AnimatePresence>
        {showSampleEntryTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 no-print"
            onClick={() => setShowSampleEntryTicketModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-sm p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-md font-semibold text-gray-700">Sample Parking Entry Ticket</h3>
                <button
                  onClick={() => setShowSampleEntryTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4" ref={entryTicketRef}>
                <SampleEntryTicketContent />
              </div>
              <div className="p-3 bg-gray-50 border-t flex justify-end space-x-2">
                <button
                  onClick={handlePrintEntryTicket}
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue"
                >
                  <Printer size={14} className="mr-1" /> Print
                </button>
                <button
                  onClick={() => setShowSampleEntryTicketModal(false)}
                  className="px-3 py-1.5 text-xs bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-red"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleDetails;
