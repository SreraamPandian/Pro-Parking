import React, { useState } from 'react';
import { Plus, Edit, Trash, AlertTriangle } from 'lucide-react';
import { mockCameraData } from '../data/mockData';

const CameraConfig = () => {
  const [cameras, setCameras] = useState(mockCameraData);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', status: 'active' });

  const handleAddCamera = () => { setSelectedCamera(null); setFormData({ name: '', location: '', status: 'active' }); setShowModal(true); };
  const handleEditCamera = (camera) => { setSelectedCamera(camera); setFormData({ name: camera.name, location: camera.location, status: camera.status }); setShowModal(true); };
  const handleDeleteCamera = (cameraId) => {
    const camera = cameras.find(c => c.id === cameraId);
    if (camera && (camera.name === 'Entrance Camera' || camera.name === 'Exit Camera')) { alert('Cannot delete the main entrance or exit camera. These are required for the system to function.'); return; }
    setCameras(cameras.filter(camera => camera.id !== cameraId));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCamera) setCameras(cameras.map(camera => camera.id === selectedCamera.id ? { ...camera, ...formData } : camera));
    else { const newCamera = { id: Date.now().toString(), ...formData }; setCameras([...cameras, newCamera]); }
    setShowModal(false);
  };

  const hasEntranceCamera = cameras.some(camera => camera.name === 'Entrance Camera' || camera.location.toLowerCase().includes('entrance'));
  const hasExitCamera = cameras.some(camera => camera.name === 'Exit Camera' || camera.location.toLowerCase().includes('exit'));

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Camera Configuration</h1><p className="text-gray-600">Manage ANPR cameras for Life Line Hospital Parking</p></div>
        <button className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red" onClick={handleAddCamera}><Plus size={18} className="mr-2" />Add Camera</button>
      </div>

      {(!hasEntranceCamera || !hasExitCamera) && <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start"><AlertTriangle size={20} className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5" /><div><h3 className="font-medium text-yellow-800">Camera Configuration Warning</h3><p className="text-sm text-yellow-700 mt-1">{!hasEntranceCamera && !hasExitCamera ? 'Both entrance and exit cameras are required.' : !hasEntranceCamera ? 'An entrance camera is required.' : 'An exit camera is required.'}</p></div></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <div key={camera.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center"><h3 className="font-semibold text-lg">{camera.name}</h3><div className={`px-2 py-1 rounded-full text-xs font-medium ${camera.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-primary-red'}`}>{camera.status === 'active' ? 'Active' : 'Inactive'}</div></div>
            <div className="p-4"><div className="mt-2 text-sm text-gray-600"><p className="mb-1"><span className="font-medium">Location:</span> {camera.location}</p></div><div className="mt-4 flex justify-end space-x-2"><button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue" title="Edit Camera" onClick={() => handleEditCamera(camera)}><Edit size={16} className="text-primary-blue" /></button><button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue" title="Delete Camera" onClick={() => handleDeleteCamera(camera.id)} disabled={(camera.name === 'Entrance Camera' || camera.name === 'Exit Camera')}><Trash size={16} className={(camera.name === 'Entrance Camera' || camera.name === 'Exit Camera') ? "text-gray-400" : "text-primary-red"} /></button></div></div>
          </div>
        ))}
      </div>
      
      {showModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg w-full max-w-md p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">{selectedCamera ? 'Edit Camera' : 'Add New Camera'}</h3><button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-blue" onClick={() => setShowModal(false)}>&times;</button></div><form onSubmit={handleSubmit}><div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Camera Name</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/></div><div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required placeholder="e.g. Main Entrance"/></div><div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div><div className="flex justify-end space-x-3"><button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red">{selectedCamera ? 'Update' : 'Add'} Camera</button></div></form></div></div>}
    </div>
  );
};

export default CameraConfig;
