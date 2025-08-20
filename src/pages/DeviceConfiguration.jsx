import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash, Server, Wifi, Network, TerminalSquare, ToggleLeft, ToggleRight, HardDrive, MonitorPlay as KioskIcon, CreditCard as PaymentTerminalIcon, Camera as ANPRCameraIcon, ChevronsUpDown as BoomBarrierIcon, X } from 'lucide-react';
import { mockDeviceData as initialDeviceData, availableDeviceTypes as allDeviceTypes } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const DeviceConfiguration = () => {
  const [devices, setDevices] = useState(initialDeviceData);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Memoize the list of configured device types
  const configuredDeviceTypes = useMemo(() => devices.map(d => d.deviceType), [devices]);

  // Memoize the list of available types for adding a new device
  const availableTypesForNewDevice = useMemo(() => 
    allDeviceTypes.filter(type => !configuredDeviceTypes.includes(type)),
    [configuredDeviceTypes]
  );

  const [formData, setFormData] = useState({
    name: '',
    deviceType: availableTypesForNewDevice.length > 0 ? availableTypesForNewDevice[0] : '',
    ipAddress: '',
    macAddress: '',
    port: '',
    status: 'active'
  });


  const handleAddDevice = () => {
    setSelectedDevice(null);
    const currentAvailableTypes = allDeviceTypes.filter(type => !devices.map(d => d.deviceType).includes(type));
    setFormData({
      name: '',
      deviceType: currentAvailableTypes.length > 0 ? currentAvailableTypes[0] : '',
      ipAddress: '',
      macAddress: '',
      port: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditDevice = (device) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name || '',
      deviceType: device.deviceType || '', // Device type is not editable
      ipAddress: device.ipAddress || '',
      macAddress: device.macAddress || '',
      port: device.port || '',
      status: device.status || 'active'
    });
    setShowModal(true);
  };

  const handleDeleteDevice = (deviceId) => {
    setDevices(devices.filter(device => device.id !== deviceId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDevice) { // Editing existing device
      setDevices(devices.map(device => 
        device.id === selectedDevice.id ? { ...device, ...formData } : device
      ));
    } else { // Adding new device
      if (!formData.deviceType) {
        alert("No available device type to add. All types might be configured.");
        return;
      }
      if (devices.some(d => d.deviceType === formData.deviceType)) {
        alert(`Device type "${formData.deviceType}" is already configured. Please choose a different type or edit the existing one.`);
        return;
      }
      const newDevice = { 
        id: Date.now().toString(), 
        ...formData 
      };
      setDevices([...devices, newDevice]);
    }
    setShowModal(false);
  };

  const toggleDeviceStatus = (deviceId) => {
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, status: device.status === 'active' ? 'inactive' : 'active' } : device
    ));
  };
  
  const getDeviceIcon = (type) => {
    switch(type) {
      case 'ANPR Camera': return <ANPRCameraIcon size={20} className="text-gray-500" />;
      case 'Boom Barrier Controller': return <BoomBarrierIcon size={20} className="text-gray-500" />;
      case 'Kiosk Display': return <KioskIcon size={20} className="text-gray-500" />;
      case 'Payment Terminal': return <PaymentTerminalIcon size={20} className="text-gray-500" />;
      default: return <HardDrive size={20} className="text-gray-500" />;
    }
  };

  const canAddMoreDevices = availableTypesForNewDevice.length > 0;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Device Configuration</h1>
          <p className="text-gray-600">Manage connected hardware devices for Life Line Hospital Parking</p>
        </div>
        <button
          className={`px-4 py-2 bg-primary-red text-white rounded-md flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red ${
            !canAddMoreDevices ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          }`}
          onClick={handleAddDevice}
          disabled={!canAddMoreDevices}
          title={!canAddMoreDevices ? "All device types are configured" : "Add New Device"}
        >
          <Plus size={18} className="mr-2" />
          Add Device
        </button>
      </div>
      {!canAddMoreDevices && devices.length > 0 && (
         <div className="mb-4 p-3 bg-blue-50 border border-primary-blue rounded-md text-sm text-primary-blue">
            All available device types have been configured. You can edit existing devices.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <motion.div 
            key={device.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-4 border-b-4 ${device.status === 'active' ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="mr-2">{getDeviceIcon(device.deviceType)}</span>
                  <h3 className="font-semibold text-lg text-gray-800 truncate" title={device.name || device.deviceType}>{device.name || device.deviceType}</h3>
                </div>
                <button 
                  onClick={() => toggleDeviceStatus(device.id)}
                  title={device.status === 'active' ? 'Deactivate' : 'Activate'}
                  className={`p-1 rounded-full focus:outline-none ${device.status === 'active' ? 'text-green-600 hover:bg-green-100' : 'text-primary-red hover:bg-red-100'}`}
                >
                  {device.status === 'active' ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{device.deviceType}</p>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm text-gray-600 flex items-center"><Wifi size={14} className="mr-2 text-gray-400" /><strong className="font-medium text-gray-700 w-24">IP Address:</strong> {device.ipAddress || '-'}</p>
              <p className="text-sm text-gray-600 flex items-center"><Network size={14} className="mr-2 text-gray-400" /><strong className="font-medium text-gray-700 w-24">MAC Address:</strong> {device.macAddress || '-'}</p>
              <p className="text-sm text-gray-600 flex items-center"><TerminalSquare size={14} className="mr-2 text-gray-400" /><strong className="font-medium text-gray-700 w-24">Port:</strong> {device.port || '-'}</p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-700">Status:</strong> 
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-primary-red'}`}>
                  {device.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="p-3 bg-gray-50 border-t flex justify-end space-x-2">
              <button
                className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                title="Edit Device"
                onClick={() => handleEditDevice(device)}
              >
                <Edit size={16} className="text-primary-blue" />
              </button>
              <button
                className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                title="Delete Device"
                onClick={() => handleDeleteDevice(device.id)}
              >
                <Trash size={16} className="text-primary-red" />
              </button>
            </div>
          </motion.div>
        ))}
        {devices.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            <Server size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No devices configured yet.</p>
            <p>Click "Add Device" to get started.</p>
          </div>
        )}
      </div>
      
      <AnimatePresence>
      {showModal && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10 border-b">
              <h3 className="text-lg font-semibold">{selectedDevice ? 'Edit Device' : 'Add New Device'}</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Name (e.g., Entrance ANPR 1)</label>
                <input type="text" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Unique name for the device"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                {selectedDevice ? (
                     <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" value={formData.deviceType} readOnly title="Device type cannot be changed after creation."/>
                ) : (
                  <select 
                    name="deviceType" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" 
                    value={formData.deviceType} 
                    onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
                    disabled={availableTypesForNewDevice.length === 0 && !selectedDevice}
                  >
                    {availableTypesForNewDevice.length === 0 && !selectedDevice ? (
                      <option value="">All types configured</option>
                    ) : (
                      availableTypesForNewDevice.map(type => <option key={type} value={type}>{type}</option>)
                    )}
                  </select>
                )}
                 {!selectedDevice && availableTypesForNewDevice.length === 0 && <p className="text-xs text-red-500 mt-1">All device types are already configured.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                <input type="text" name="ipAddress" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.ipAddress} onChange={(e) => setFormData({...formData, ipAddress: e.target.value})} placeholder="e.g., 192.168.1.100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
                <input type="text" name="macAddress" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.macAddress} onChange={(e) => setFormData({...formData, macAddress: e.target.value})} placeholder="e.g., 00:1A:2B:3C:4D:5E" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                <input type="number" name="port" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.port} onChange={(e) => setFormData({...formData, port: e.target.value})} placeholder="e.g., 8080" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2 sticky bottom-0 bg-white py-3 z-10 border-t">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue" onClick={() => setShowModal(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className={`px-4 py-2 bg-primary-red text-white rounded-md flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red ${
                    (!selectedDevice && availableTypesForNewDevice.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                  }`}
                  disabled={!selectedDevice && availableTypesForNewDevice.length === 0}
                >
                  {selectedDevice ? 'Update' : 'Add'} Device
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default DeviceConfiguration;
