import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle, Check, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const SlotManagement = () => {
  const { slots: locations, setSlots: setLocations } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    totalSlots: 0,
    availableSlots: 0,
    reservedSlots: 0,
    occupiedSlots: 0,
    status: 'active'
  });

  const handleEditLocation = (location) => {
    setIsAdding(false);
    setEditingLocation(location);
    setFormData({
      id: location.id,
      name: location.name,
      totalSlots: location.totalSlots,
      availableSlots: location.availableSlots,
      reservedSlots: location.reservedSlots,
      occupiedSlots: location.occupiedSlots,
      status: location.status
    });
    setShowModal(true);
  };

  const handleAddLocation = () => {
    setIsAdding(true);
    setEditingLocation(null);
    setFormData({
      id: '',
      name: '',
      totalSlots: 0,
      availableSlots: 0,
      reservedSlots: 0,
      occupiedSlots: 0,
      status: 'active'
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const total = parseInt(formData.totalSlots);
    const available = parseInt(formData.availableSlots);
    const reserved = parseInt(formData.reservedSlots);
    const occupied = parseInt(formData.occupiedSlots);

    if (available + reserved + occupied !== total) {
      alert('Error: Available + Reserved + Occupied slots must equal Total slots');
      return;
    }

    const isNearlyFull = available <= total * 0.1;

    if (isAdding) {
      const newLocation = {
        ...formData,
        id: Date.now().toString(),
        isNearlyFull
      };
      setLocations([...locations, newLocation]);
    } else {
      setLocations(locations.map(loc =>
        loc.id === formData.id
          ? { ...loc, ...formData, isNearlyFull }
          : loc
      ));
    }

    setShowModal(false);
    setEditingLocation(null);
    setIsAdding(false);
  };

  const getStatusBadge = (status, isNearlyFull) => {
    if (status === 'full') {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-primary-red">Full</span>;
    }

    if (isNearlyFull) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Nearly Full</span>;
    }

    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Location Management</h1>
          <p className="text-gray-600">Manage parking locations and availability</p>
        </div>
        <button
          onClick={handleAddLocation}
          className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
        >
          <Plus size={18} className="mr-2" />
          Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <div className="flex items-center space-x-2">
                {getStatusBadge(location.status, location.isNearlyFull)}
                <button
                  className="p-1 text-gray-400 hover:text-primary-blue hover:bg-blue-50 rounded transition-colors"
                  onClick={() => handleEditLocation(location)}
                  title="Edit Location"
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-primary-blue mb-1">Total Slots</p>
                <p className="text-2xl font-bold text-primary-blue">{location.totalSlots}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-500 mb-1">Available</p>
                <p className="text-2xl font-bold text-green-700">{location.availableSlots}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-500 mb-1">Reserved</p>
                <p className="text-2xl font-bold text-yellow-700">{location.reservedSlots}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-primary-red mb-1">Occupied</p>
                <p className="text-2xl font-bold text-primary-red">{location.occupiedSlots}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Occupancy Rate</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${location.status === 'full' ? 'bg-primary-red' :
                    location.isNearlyFull ? 'bg-yellow-500' : 'bg-green-600'
                    }`}
                  style={{ width: `${((location.occupiedSlots + location.reservedSlots) / location.totalSlots) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {location.isNearlyFull && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                <AlertTriangle size={20} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Parking Nearly Full</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    This location is nearly full. Only {location.availableSlots} slots remain available.
                  </p>
                </div>
              </div>
            )}

            {location.status === 'full' && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertTriangle size={20} className="text-primary-red mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-primary-red">Parking Full</h3>
                  <p className="text-sm text-red-700 mt-1">
                    This location is completely full. No more vehicles can be accommodated.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isAdding ? 'Add New Location' : `Update ${formData.name}`}</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-blue"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.totalSlots}
                  onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) || 0 })}
                  required
                  min="1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.availableSlots}
                  onChange={(e) => setFormData({ ...formData, availableSlots: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reserved Slots</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.reservedSlots}
                  onChange={(e) => setFormData({ ...formData, reservedSlots: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupied Slots</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.occupiedSlots}
                  onChange={(e) => setFormData({ ...formData, occupiedSlots: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Note: Available + Reserved + Occupied slots must equal Total slots
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="full">Full</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
                >
                  {isAdding ? <Plus size={18} className="mr-2" /> : <Check size={18} className="mr-2" />}
                  {isAdding ? 'Add Location' : 'Update Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagement;
