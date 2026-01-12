import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Printer, Calendar, User, XCircle, Car as CarIcon, ToggleLeft, ToggleRight, Settings2, X, ClipboardList, MapPin, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockDashboardData } from '../data/mockData';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const Passes = () => {
  const { staffPasses, setStaffPasses, waiverReasons, setWaiverReasons } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedStaffPass, setSelectedStaffPass] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const passDetailsRef = useRef(null);

  const initialVehicle = { id: Date.now(), number: '', type: 'Car' };
  const [formData, setFormData] = useState({
    staffName: '',
    type: 'Staff',
    department: '',
    location: ['Location A'], // Default location array
    vehicles: [initialVehicle],
    validFrom: '',
    validUntil: '',
    mobileNumber: '',
    isActive: true,
  });

  const [showWaiverReasonModal, setShowWaiverReasonModal] = useState(false);
  // waiverReasons managed in DataContext now
  const [newWaiverReasonInput, setNewWaiverReasonInput] = useState('');
  const [waiverReasonError, setWaiverReasonError] = useState('');

  const filteredStaffPasses = staffPasses.filter(pass =>
    (departmentFilter.length === 0 || departmentFilter.includes(pass.department)) &&
    (locationFilter.length === 0 || locationFilter.includes(pass.location || 'Location A')) &&
    (pass.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pass.vehicles && pass.vehicles.some(v => v.number.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      pass.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredStaffPasses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaffPasses.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, locationFilter]);

  const handleAddVehicleToForm = () => {
    if (formData.vehicles.length < 3) {
      setFormData(prev => ({
        ...prev,
        vehicles: [...prev.vehicles, { id: Date.now() + Math.random(), number: '', type: 'Car' }]
      }));
    }
  };

  const handleRemoveVehicleFromForm = (vehicleIdToRemove) => {
    if (formData.vehicles.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(vehicle => vehicle.id !== vehicleIdToRemove)
    }));
  };

  const handleVehicleInputChange = (vehicleId, field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, [field]: value } : vehicle
      )
    }));
  };

  const handleAddPass = () => {
    setSelectedStaffPass(null);
    setFormData({ staffName: '', type: 'Staff', department: 'Administration', location: ['Location A'], vehicles: [{ id: Date.now(), number: '', type: 'Car' }], validFrom: '', validUntil: '', mobileNumber: '', isActive: true });
    setShowForm(true);
  };

  const handleEditPass = (pass) => {
    setSelectedStaffPass(pass);
    const vehiclesWithIds = (pass.vehicles && pass.vehicles.length > 0 ?
      pass.vehicles.map(v => ({ ...v, id: v.id || Date.now() + Math.random() }))
      :
      [{ id: Date.now(), number: '', type: 'Car' }]
    );

    setFormData({
      staffName: pass.staffName,
      type: pass.type || 'Staff', // Default to Staff for existing records
      department: pass.department,
      location: Array.isArray(pass.location) ? pass.location : [pass.location || 'Location A'],
      vehicles: vehiclesWithIds,
      validFrom: pass.validFrom,
      validUntil: pass.validUntil,
      mobileNumber: pass.mobileNumber || '',
      isActive: pass.isActive === undefined ? true : pass.isActive,
    });
    setShowForm(true);
  };

  const handleDeletePass = (passId) => {
    setStaffPasses(staffPasses.filter(pass => pass.id !== passId));
    if (selectedStaffPass && selectedStaffPass.id === passId) {
      setSelectedStaffPass(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filledVehicles = formData.vehicles.filter(v => v.number.trim() !== '');
    if (filledVehicles.length === 0) {
      alert("Please add at least one vehicle number.");
      return;
    }
    const updatedFormData = { ...formData, vehicles: filledVehicles };

    if (formData.mobileNumber) {
      const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 10) {
        alert("Mobile number must be between 7 and 10 digits.");
        return;
      }
      formData.mobileNumber = cleanPhone;
    }

    if (selectedStaffPass) {
      setStaffPasses(staffPasses.map(pass => pass.id === selectedStaffPass.id ? { ...pass, ...updatedFormData } : pass));
    } else {
      const newPass = { id: Date.now().toString(), ...updatedFormData };
      setStaffPasses([...staffPasses, newPass]);
    }
    setShowForm(false);
  };

  const getValidityStatusClass = (validUntil) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    if (expiryDate < today) return "text-primary-red border-red-300 bg-red-50";
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) return "text-yellow-600 border-yellow-300 bg-yellow-50";
    return "text-green-600 border-green-300 bg-green-50";
  };

  const getValidityStatusText = (validUntil) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    if (expiryDate < today) return "Expired";
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) return `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
    return "Active";
  };

  const togglePassActiveStatus = (passId) => {
    setStaffPasses(prevPasses =>
      prevPasses.map(pass =>
        pass.id === passId ? { ...pass, isActive: !pass.isActive } : pass
      )
    );
    if (selectedStaffPass && selectedStaffPass.id === passId) {
      setSelectedStaffPass(prev => ({ ...prev, isActive: !prev.isActive }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // Create date object, setting time to noon to avoid timezone shift issues with date-only strings
      const date = new Date(dateString + 'T12:00:00');
      return date.toLocaleDateString('en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric'
      });
    } catch (e) { return dateString; }
  };

  const handlePrintPass = () => {
    const printContent = passDetailsRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printableArea = printContent.innerHTML;
      document.body.innerHTML = `<div class="print-container">${printableArea}</div>`;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const viewPassDetails = (pass) => { setSelectedStaffPass(pass); };

  const handleAddWaiverReason = () => {
    setWaiverReasonError('');
    const reason = newWaiverReasonInput.trim();
    if (!reason) {
      setWaiverReasonError('Reason cannot be empty.');
      return;
    }
    const words = reason.split(/\s+/);
    if (words.length > 2) {
      setWaiverReasonError('Reason must be 1 or 2 words only.');
      return;
    }
    if (waiverReasons.includes(reason)) {
      setWaiverReasonError('This reason already exists.');
      return;
    }
    setWaiverReasons(prev => [...prev, reason]);
    setNewWaiverReasonInput('');
  };

  const handleDeleteWaiverReason = (reasonToDelete) => {
    setWaiverReasons(prev => prev.filter(reason => reason !== reasonToDelete));
  };

  return (
    <div className="p-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="mb-6 flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Parking Passes</h1>
          <p className="text-gray-600">Manage parking passes for staff and visitors</p>
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
            onClick={() => setShowWaiverReasonModal(true)}
          >
            <ClipboardList size={18} className="mr-2" /> {/* Updated Icon */}
            Manage Waiver Reasons
          </button>
          <button
            className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
            onClick={handleAddPass}
          >
            <Plus size={18} className="mr-2" />
            Add New Pass
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" placeholder="Search by staff name or vehicle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="w-full mb-3">
              <MultiSelectDropdown
                options={['Administration', 'Security', 'Maintenance', 'Customer Service', 'Operations', 'Visitor']}
                selected={departmentFilter}
                onChange={setDepartmentFilter}
                placeholder="All Departments"
                icon={Filter}
              />
            </div>

            <div className="w-full">
              <MultiSelectDropdown
                options={mockDashboardData.parkingZones.map(z => z.name)}
                selected={locationFilter}
                onChange={setLocationFilter}
                placeholder="All Locations"
                icon={MapPin}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto mb-4">
            {currentItems.map((pass) => (
              <div key={pass.id} className={`p-3 border rounded-md cursor-pointer ${selectedStaffPass?.id === pass.id ? 'border-primary-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => viewPassDetails(pass)}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{pass.staffName}</div>
                    <div className="text-sm text-gray-500">
                      {pass.vehicles && pass.vehicles.length > 0 ? pass.vehicles.map(v => v.number).join(', ') : 'No vehicle'} • {pass.department} • {Array.isArray(pass.location) ? pass.location.join(', ') : (pass.location || 'Location A')}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${pass.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-primary-red'}`}>
                    {pass.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${getValidityStatusClass(pass.validUntil)}`}>{getValidityStatusText(pass.validUntil)}</div>
              </div>
            ))}
            {filteredStaffPasses.length === 0 && (<div className="text-center py-8 text-gray-500">No passes found.</div>)}
          </div>

          {/* Pagination UI */}
          {filteredStaffPasses.length > itemsPerPage && (
            <div className="py-3 flex items-center justify-between border-t border-gray-100 no-print">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p className="text-xs text-gray-700">
                  <span className="font-medium">{indexOfFirstItem + 1}</span>-
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredStaffPasses.length)}</span> of{' '}
                  <span className="font-medium">{filteredStaffPasses.length}</span>
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-1 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-1 py-1 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          {selectedStaffPass ? (
            <div ref={passDetailsRef}>
              <div className="flex justify-between items-center mb-6 no-print">
                <h3 className="text-lg font-semibold">Parking Pass Details</h3>
                <div className="flex space-x-2 items-center">
                  <button
                    onClick={() => togglePassActiveStatus(selectedStaffPass.id)}
                    title={selectedStaffPass.isActive ? "Deactivate Pass" : "Activate Pass"}
                    className={`p-2 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 ${selectedStaffPass.isActive ? 'bg-green-100 hover:bg-green-200 focus:ring-green-500' : 'bg-red-100 hover:bg-red-200 focus:ring-primary-red'}`}
                  >
                    {selectedStaffPass.isActive ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} className="text-primary-red" />}
                    <span className={`ml-2 text-sm font-medium ${selectedStaffPass.isActive ? 'text-green-700' : 'text-primary-red'}`}>
                      {selectedStaffPass.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                  <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center focus:outline-none focus:ring-2 focus:ring-primary-blue" onClick={handlePrintPass}><Printer size={20} className="text-gray-600 mr-2" /><span>Print</span></button>
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <div className="bg-white p-3 border border-gray-200 rounded-md">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PRO-PARKING-STAFF-PASS" alt="QR Code" className="w-28 h-28" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-center md:text-left mb-4">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        <img src="https://img-wrapper.vercel.app/image?url=https://i.ibb.co/K9fK5dK/Life-Line-Logo.png" alt="Pro-Parking Logo" className="w-10 h-auto mr-2" />
                        <h2 className="text-xl font-bold text-primary-blue">Pro-Parking Staff Pass</h2>
                      </div>
                      <div className="flex items-center justify-center md:justify-start space-x-2">
                        <p className={`text-sm font-medium ${getValidityStatusClass(selectedStaffPass.validUntil)}`}>{getValidityStatusText(selectedStaffPass.validUntil)}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${selectedStaffPass.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-primary-red'}`}>
                          {selectedStaffPass.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><p className="text-sm text-gray-500">Staff Name</p><p className="font-medium">{selectedStaffPass.staffName}</p></div>
                      <div><p className="text-sm text-gray-500">Department</p><p className="font-medium">{selectedStaffPass.department}</p></div>
                      <div><p className="text-sm text-gray-500">Location</p><p className="font-medium">{Array.isArray(selectedStaffPass.location) ? selectedStaffPass.location.join(', ') : (selectedStaffPass.location || 'Location A')}</p></div>
                      <div><p className="text-sm text-gray-500">Mobile Number</p><p className="font-medium">{selectedStaffPass.mobileNumber || 'Not provided'}</p></div>
                      <div><p className="text-sm text-gray-500">Valid Until</p><p className="font-medium">{formatDate(selectedStaffPass.validUntil)}</p></div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Registered Vehicles ({selectedStaffPass.vehicles?.length || 0}/3)</p>
                      {selectedStaffPass.vehicles && selectedStaffPass.vehicles.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {selectedStaffPass.vehicles.map((v, i) => (
                            <li key={v.id || i} className="font-medium text-sm">{v.number} <span className="text-xs text-gray-500">({v.type})</span></li>
                          ))}
                        </ul>
                      ) : (<p className="font-medium text-sm">No vehicles registered.</p>)}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-primary-blue"><User size={18} className="mr-2" /><span className="font-medium">STAFF PARKING PERMIT</span></div>
                    <div className="flex items-center text-gray-600"><Calendar size={16} className="mr-2" /><span>Issue Date: {selectedStaffPass.validFrom}</span></div>
                  </div>
                  <div className="mt-2 text-center text-xs text-gray-500">
                    <p>This pass is for authorized staff only.</p>
                    <p className="mt-1">Pass ID: {selectedStaffPass.id}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2 no-print">
                <button className="px-3 py-1.5 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue" onClick={() => handleEditPass(selectedStaffPass)}><Edit size={16} className="mr-1" />Edit</button>
                <button className="px-3 py-1.5 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-red" onClick={() => handleDeletePass(selectedStaffPass.id)}><Trash size={16} className="mr-1" />Delete</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>Select a staff pass to view details</p>
              <p className="mt-2 text-sm">or</p>
              <button className="mt-2 px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red" onClick={handleAddPass}>
                <Plus size={18} className="mr-2" />Add New Pass
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10 border-b">
                <h3 className="text-lg font-semibold">{selectedStaffPass ? 'Edit Parking Pass' : 'Create New Parking Pass'}</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pass Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      value={formData.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setFormData({ ...formData, type: newType, department: newType === 'Visitor' ? 'Visitor' : 'Administration' });
                      }}
                    >
                      <option value="Faculty / Staff">Faculty / Staff</option>
                      <option value="Visitor">Visitor</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{formData.type === 'Visitor' ? 'Visitor Name' : 'Staff Name'}</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.staffName} onChange={(e) => setFormData({ ...formData, staffName: e.target.value })} required /></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={formData.type === 'Visitor'}
                    >
                      {formData.type === 'Visitor' ? (
                        <option value="Visitor">Visitor</option>
                      ) : (
                        <>
                          <option value="Administration">Administration</option>
                          <option value="Security">Security</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Customer Service">Customer Service</option>
                          <option value="Operations">Operations</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <MultiSelectDropdown
                      options={mockDashboardData.parkingZones.map(z => z.name)}
                      selected={formData.location}
                      onChange={(val) => setFormData({ ...formData, location: val })}
                      placeholder="Select Locations"
                      icon={MapPin}
                    />
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.mobileNumber} onChange={(e) => { const value = e.target.value.replace(/\D/g, ''); if (value.length <= 10) setFormData({ ...formData, mobileNumber: value }); }} placeholder="e.g. 9876543210 (7-10 digits)" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label><input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.validFrom} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label><input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} required /></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pass Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.isActive ? 'active' : 'inactive'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}><option value="active">Active</option><option value="inactive">Inactive</option></select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registered Vehicles ({formData.vehicles.length}/3)</label>
                  {formData.vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="flex items-center gap-2 mb-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex-shrink-0 text-gray-500 mr-1">{index + 1}.</div>
                      <input type="text" className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue" value={vehicle.number} onChange={(e) => handleVehicleInputChange(vehicle.id, 'number', e.target.value)} placeholder="Vehicle Number (e.g. AB12 XYZ)" required={index === 0 || vehicle.number.trim() !== ''} />
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue" value={vehicle.type} onChange={(e) => handleVehicleInputChange(vehicle.id, 'type', e.target.value)}><option value="Car">Car</option><option value="Bike">Bike</option></select>
                      {formData.vehicles.length > 1 && (<button type="button" onClick={() => handleRemoveVehicleFromForm(vehicle.id)} className="p-2 text-primary-red hover:text-red-700 focus:outline-none" title="Remove Vehicle"><XCircle size={18} /></button>)}
                    </div>
                  ))}
                  {formData.vehicles.length < 3 && (<button type="button" onClick={handleAddVehicleToForm} className="mt-1 px-3 py-1.5 border border-dashed border-primary-blue text-primary-blue rounded-md hover:bg-blue-50 flex items-center text-sm"><Plus size={16} className="mr-1" /> Add Another Vehicle (Max 3)</button>)}
                </div>
                <div className="flex justify-end space-x-3 sticky bottom-0 bg-white py-3 border-t z-10">
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red">{selectedStaffPass ? 'Update' : 'Create'} Pass</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWaiverReasonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 no-print"
            onClick={() => setShowWaiverReasonModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg w-full max-w-md p-6 max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Manage Waiver Reasons</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowWaiverReasonModal(false)}><X size={20} /></button>
              </div>
              <div className="mb-4">
                <label htmlFor="newWaiverReason" className="block text-sm font-medium text-gray-700 mb-1">New Waiver Reason (Max 2 words)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="newWaiverReason"
                    value={newWaiverReasonInput}
                    onChange={(e) => setNewWaiverReasonInput(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                    placeholder="e.g., Emergency Duty"
                  />
                  <button
                    onClick={handleAddWaiverReason}
                    className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-red"
                  >
                    <Plus size={16} className="mr-1" /> Add
                  </button>
                </div>
                {waiverReasonError && <p className="text-xs text-red-600 mt-1">{waiverReasonError}</p>}
              </div>
              <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                {waiverReasons.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No waiver reasons added yet.</p>
                ) : (
                  waiverReasons.map((reason, index) => (
                    <div key={index} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-md border border-gray-200">
                      <span className="text-sm text-gray-700">{reason}</span>
                      <button
                        onClick={() => handleDeleteWaiverReason(reason)}
                        className="p-1 text-primary-red hover:text-red-700 focus:outline-none"
                        title="Delete Reason"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 flex justify-end sticky bottom-0 bg-white py-3 border-t z-10">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue"
                  onClick={() => setShowWaiverReasonModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default Passes;
