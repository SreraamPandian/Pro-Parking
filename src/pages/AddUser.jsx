import React, { useState } from 'react';
import { Plus, Edit, Trash, UserCircle, KeyRound, X, Save } from 'lucide-react';
import { availableAppModules } from '../data/mockData'; 

const AddUser = () => {
  const initialUsers = [
    { 
      id: 'sample1', 
      userName: 'Operator Kiosk', 
      permissions: ['Kiosk Management', 'Live Parking'],
    },
    { 
      id: 'sample2', 
      userName: 'Reporting Staff', 
      permissions: ['Reports', 'Payment Reports'] 
    },
    { 
      id: 'sample3', 
      userName: 'Parking Supervisor', 
      permissions: ['Dashboard', 'Live Parking', 'Slot Management', 'Add User'] 
    },
  ];

  const [users, setUsers] = useState(initialUsers); 
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    permissions: [], 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePermissionChange = (moduleName) => {
    setFormData(prev => {
      const currentPermissions = prev.permissions || [];
      if (currentPermissions.includes(moduleName)) {
        return { ...prev, permissions: currentPermissions.filter(p => p !== moduleName) };
      } else {
        return { ...prev, permissions: [...currentPermissions, moduleName] };
      }
    });
  };

  const resetForm = () => {
    setFormData({ userName: '', password: '', permissions: [] });
    setIsEditing(false);
    setCurrentUser(null);
  };

  const handleOpenFormModal = (userToEdit = null) => {
    resetForm(); 
    if (userToEdit) {
      setIsEditing(true);
      setCurrentUser(userToEdit);
      setFormData({
        userName: userToEdit.userName || '',
        password: '', 
        permissions: userToEdit.permissions || [], 
      });
    } else {
      setIsEditing(false);
      setCurrentUser(null); 
    }
    setShowFormModal(true); 
  };

  const handleCloseFormModal = () => { setShowFormModal(false); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && currentUser) {
      const updatedUser = {
        ...currentUser, 
        userName: formData.userName,
        permissions: formData.permissions, 
        ...(formData.password && { password: formData.password }) 
      };
      setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
    } else {
      const newUser = { 
        id: Date.now().toString(), 
        userName: formData.userName,
        password: formData.password, 
        permissions: formData.permissions, 
      };
      setUsers(prevUsers => [...prevUsers, newUser]); 
    }
    handleCloseFormModal();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); 
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add User</h1>
          <p className="text-gray-600">Manage users and permissions for Life Line Hospital Parking</p>
        </div>
        <button
          className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
          onClick={() => handleOpenFormModal()}
        >
          <Plus size={18} className="mr-2" />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <UserCircle size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No users added yet.</p>
            <p>Click "Add New User" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Icon</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserCircle size={24} className="text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.userName || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.permissions && user.permissions.length > 0 ? user.permissions.join(', ') : 'No specific permissions'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenFormModal(user)}
                        className="text-primary-blue hover:text-blue-700 mr-3 focus:outline-none focus:ring-1 focus:ring-primary-blue p-1 rounded"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-primary-red hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-primary-red p-1 rounded"
                        title="Delete User"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10 border-b">
              <h3 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={handleCloseFormModal} className="text-gray-400 hover:text-gray-600 focus:outline-none"><X size={24} /></button>
            </div>
            {formData && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserCircle size={16} className="text-gray-400" /></div>
                    <input type="text" name="userName" id="userName" value={formData.userName || ''} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" placeholder="e.g., John Doe" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><KeyRound size={16} className="text-gray-400" /></div>
                    <input type="password" name="password" id="password" value={formData.password || ''} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"} required={!isEditing} minLength={isEditing && !formData.password ? undefined : 6} />
                  </div>
                  {isEditing && <p className="mt-1 text-xs text-gray-500">Leave blank if you don't want to change the password.</p>}
                  {!isEditing && <p className="mt-1 text-xs text-gray-500">Minimum 6 characters.</p>}
                </div>
                
                <div className="pt-2">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Module Permissions</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 p-3 border border-gray-200 rounded-md bg-gray-50 max-h-48 overflow-y-auto">
                    {availableAppModules.map(moduleName => (
                      <div key={moduleName} className="flex items-center">
                        <input type="checkbox" id={`perm-${moduleName.replace(/\s+/g, '-')}`} className="h-4 w-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue" checked={(formData.permissions || []).includes(moduleName)} onChange={() => handlePermissionChange(moduleName)} />
                        <label htmlFor={`perm-${moduleName.replace(/\s+/g, '-')}`} className="ml-2 text-sm text-gray-700">{moduleName}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end space-x-3 sticky bottom-0 bg-white py-3 border-t">
                  <button type="button" onClick={handleCloseFormModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"><Save size={18} className="mr-2" />{isEditing ? 'Save Changes' : 'Add User'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
