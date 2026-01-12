import React, { useState } from 'react';
import { Plus, Edit, Trash, Save, X, Clock, ChevronDown, ChevronUp, Eye, Printer, MapPin } from 'lucide-react';
import { mockDashboardData } from '../data/mockData';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const Pricing = () => {
  const { pricingData, setPricingData } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [locationFilter, setLocationFilter] = useState([]);
  const [formData, setFormData] = useState({
    vehicleType: '4-Wheeler', // Default to 4-Wheeler and only option
    name: '',
    department: 'All', // Default department
    location: ['Location A'], // Default location array
    description: '',
    isActive: true,
    tiers: [
      { id: Date.now(), duration: 1, unit: 'hour', priceUSD: '1.30' }
    ]
  });
  const [showSampleBillModal, setShowSampleBillModal] = useState(false);

  const handleEdit = (item) => {
    setFormData({
      vehicleType: '4-Wheeler', // Always 4-Wheeler
      name: item.name,
      department: item.department || 'All',
      location: Array.isArray(item.location) ? item.location : [item.location || 'Location A'],
      description: item.description,
      isActive: item.isActive,
      tiers: [...item.tiers]
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setPricingData(pricingData.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    setFormData({
      vehicleType: '4-Wheeler', // Default to 4-Wheeler
      name: '',
      department: 'All',
      location: ['Location A'], // Default location array
      description: '',
      isActive: true,
      tiers: [
        { id: Date.now(), duration: 1, unit: 'hour', priceUSD: '1.30' }
      ]
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setPricingData(pricingData.map(item =>
        item.id === editingId ? { ...item, ...formData, vehicleType: '4-Wheeler' } : item
      ));
    } else {
      const newPricing = {
        id: Date.now().toString(),
        ...formData,
        vehicleType: '4-Wheeler'
      };
      setPricingData([...pricingData, newPricing]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const toggleStatus = (id) => {
    setPricingData(pricingData.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredPricing = pricingData.filter(item => {
    if (locationFilter.length === 0) return true;
    const itemLocations = Array.isArray(item.location) ? item.location : [item.location || 'Location A'];
    return itemLocations.some(loc => locationFilter.includes(loc));
  });

  const addTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1];
    const newTier = {
      id: Date.now(),
      duration: lastTier.duration + 1,
      unit: lastTier.unit,
      priceUSD: lastTier.priceUSD
    };
    setFormData({
      ...formData,
      tiers: [...formData.tiers, newTier]
    });
  };

  const removeTier = (tierId) => {
    if (formData.tiers.length <= 1) return;
    setFormData({
      ...formData,
      tiers: formData.tiers.filter(tier => tier.id !== tierId)
    });
  };

  const updateTier = (tierId, field, value) => {
    setFormData({
      ...formData,
      tiers: formData.tiers.map(tier =>
        tier.id === tierId ? { ...tier, [field]: value } : tier
      )
    });
  };

  const SamplePaymentReceiptContent = () => {
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const entryTime = new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const exitTime = currentTime;

    return (
      <div className="font-mono text-xs text-black bg-white p-4 max-w-xs mx-auto border border-dashed border-black">
        <div className="text-center mb-2">
          <img
            src="https://img-wrapper.vercel.app/image?url=https://i.ibb.co/K9fK5dK/Life-Line-Logo.png"
            alt="Pro-Parking Logo"
            className="w-16 h-auto mx-auto mb-1"
          />
          <p className="font-bold">PRO-PARKING</p>
          <p>Salalah, USA</p>
        </div>
        <hr className="border-dashed border-black my-1" />
        <p>Receipt No : RCPT-{Math.floor(Math.random() * 90000) + 10000}</p>
        <p>Date       : {currentDate}</p>
        <p>Time       : {currentTime}</p>
        <hr className="border-dashed border-black my-1" />
        <p>Vehicle No : RNO 1234</p>
        <p>Entry Time : {entryTime}</p>
        <p>Exit Time  : {exitTime}</p>
        <p>Location   : Location A</p>
        <p>Duration   : 2h 0m</p>
        <hr className="border-dashed border-black my-1" />
        <div className="flex justify-between">
          <span>Particulars</span>
          <span>Amount (USD)</span>
        </div>
        <hr className="border-dashed border-black my-1" />
        <div className="flex justify-between">
          <span>Parking Fee</span>
          <span>1.000</span>
        </div>
        <hr className="border-dashed border-black my-1" />
        <div className="flex justify-between font-bold mt-1">
          <span>Total Amount Paid</span>
          <span>$2.60</span>
        </div>
        <hr className="border-dashed border-black my-1" />
        <p className="text-center text-[10px] leading-tight mt-2">
          "Thank you for visiting. We wish you and your loved ones good health and a speedy recovery."
        </p>
        <hr className="border-dashed border-black mt-2" />
      </div>
    );
  };


  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pricing Module</h1>
          <p className="text-gray-600">Manage tiered parking pricing for 4-Wheeler Vehicles</p>
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
            onClick={() => setShowSampleBillModal(true)}
          >
            <Eye size={18} className="mr-2" />
            View Sample Receipt
          </button>
          <button
            className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
            onClick={handleAdd}
          >
            <Plus size={18} className="mr-2" />
            Add Pricing
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingId ? 'Edit Pricing Structure' : 'Add New Pricing Structure'}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-blue"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  value="4-Wheeler"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="All">All / General</option>
                  <option value="Administration">Administration</option>
                  <option value="Security">Security</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Operations">Operations</option>
                  <option value="Visitor">Visitor</option>
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
                  label="Location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Standard Visitor Parking"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="Add any additional details about this pricing structure"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Time-Based Pricing Tiers</label>
                  <button
                    type="button"
                    className="text-primary-blue hover:text-blue-700 text-sm flex items-center focus:outline-none focus:ring-1 focus:ring-primary-blue"
                    onClick={addTier}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Tier
                  </button>
                </div>

                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price (USD)
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.tiers.map((tier, index) => (
                        <tr key={tier.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {index === 0 ? (
                                <span className="text-gray-700">First</span>
                              ) : (
                                <span className="text-gray-700">After</span>
                              )}
                              <div className="flex items-center ml-2">
                                <input
                                  type="number"
                                  min="1"
                                  className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue"
                                  value={tier.duration}
                                  onChange={(e) => updateTier(tier.id, 'duration', parseInt(e.target.value) || 1)}
                                />
                                <select
                                  className="ml-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue"
                                  value={tier.unit}
                                  onChange={(e) => updateTier(tier.id, 'unit', e.target.value)}
                                >
                                  <option value="hour">Hour(s)</option>
                                  <option value="day">Day(s)</option>
                                </select>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="number"
                                step="0.001"
                                min="0"
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue"
                                value={tier.priceUSD}
                                onChange={(e) => updateTier(tier.id, 'priceUSD', e.target.value)}
                              />
                              <span className="ml-2 text-gray-500">USD</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <button
                              type="button"
                              className="text-primary-red hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-primary-red"
                              onClick={() => removeTier(tier.id)}
                              disabled={formData.tiers.length <= 1}
                            >
                              <Trash size={16} className={formData.tiers.length <= 1 ? "text-gray-400" : ""} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>Pricing tiers are applied cumulatively based on parking duration</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
              >
                <Save size={18} className="mr-2" />
                {editingId ? 'Update' : 'Save'} Pricing
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
            <label className="text-sm font-medium text-gray-700 mr-3">Filter by Location:</label>
            <div className="w-64">
              <MultiSelectDropdown
                options={mockDashboardData.parkingZones.map(z => z.name)}
                selected={locationFilter}
                onChange={setLocationFilter}
                placeholder="All Locations"
                icon={MapPin}
                label="Location"
              />
            </div>
            {locationFilter.length > 0 && (
              <button
                onClick={() => setLocationFilter([])}
                className="ml-4 text-sm text-primary-blue hover:underline font-semibold"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPricing.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-gray-50 ${expandedId === item.id ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.vehicleType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {item.department || 'All'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Array.isArray(item.location) ? item.location.join(', ') : (item.location || 'Location A')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900 font-medium">
                            ${item.tiers[0]?.priceUSD ? parseFloat(item.tiers[0].priceUSD).toFixed(2) : '0.00'}
                            <span className="text-gray-500 ml-1">
                              / {item.tiers[0]?.duration || 1} {item.tiers[0]?.unit || 'hour'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleStatus(item.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${item.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-primary-red hover:bg-red-200'
                              }`}
                          >
                            {item.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-primary-blue hover:text-blue-700 mr-3 focus:outline-none focus:ring-1 focus:ring-primary-blue p-1"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="text-primary-red hover:text-red-700 mr-3 focus:outline-none focus:ring-1 focus:ring-primary-red p-1"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash size={16} />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-blue p-1"
                            onClick={() => toggleExpand(item.id)}
                          >
                            {expandedId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      {expandedId === item.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="text-sm text-gray-500 mb-2">{item.description}</div>
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Duration
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Price (USD)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {item.tiers.map((tier, index) => (
                                    <tr key={tier.id}>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        {index === 0 ? (
                                          <span>First {tier.duration} {tier.unit}{tier.duration > 1 ? 's' : ''}</span>
                                        ) : (
                                          <span>After {tier.duration} {tier.unit}{tier.duration > 1 ? 's' : ''}</span>
                                        )}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap font-medium">
                                        ${parseFloat(tier.priceUSD).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {filteredPricing.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No pricing data available for 4-Wheeler vehicles. Click "Add Pricing" to create new pricing rules.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showSampleBillModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
            onClick={() => setShowSampleBillModal(false)}
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
                <h3 className="text-md font-semibold text-gray-700">Sample Payment Receipt</h3>
                <button
                  onClick={() => setShowSampleBillModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div id="samplePaymentReceiptForPrint">
                  <SamplePaymentReceiptContent />
                </div>
              </div>
              <div className="p-3 bg-gray-50 border-t flex justify-end space-x-2">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write('<html><head><title>Payment Receipt</title>');
                    printWindow.document.write('<style>body{font-family:monospace;font-size:10px;margin:10px;color:black;} .bill-container{width:300px;margin:auto;padding:10px;border:1px dashed #000;} .center{text-align:center;} .flex-between{display:flex;justify-content:space-between;} .bold{font-weight:bold;} .logo{width:60px;margin:5px auto;} hr{border:none;border-top:1px dashed #000;margin:5px 0;}</style>');
                    printWindow.document.write('</head><body>');
                    const billContent = document.getElementById('samplePaymentReceiptForPrint');
                    if (billContent) printWindow.document.write(billContent.innerHTML); else printWindow.document.write("Error: Bill content not found.");
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.print();
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue"
                >
                  <Printer size={14} className="mr-1" /> Print
                </button>
                <button
                  onClick={() => setShowSampleBillModal(false)}
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

export default Pricing;
