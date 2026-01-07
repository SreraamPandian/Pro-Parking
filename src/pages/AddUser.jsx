import React, { useState } from 'react';
import { Plus, Edit, Trash, UserCircle, KeyRound, X, Save, ChevronDown } from 'lucide-react';
import { availableAppModules } from '../data/mockData';

const AddUser = () => {
  // Initial departments/roles
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Administration', description: 'Administrative and management staff', employeeCount: 12, isActive: true },
    { id: 2, name: 'Security', description: 'Security and surveillance personnel', employeeCount: 8, isActive: true },
    { id: 3, name: 'Maintenance', description: 'Facility maintenance and technical staff', employeeCount: 15, isActive: true },
    { id: 4, name: 'Customer Service', description: 'Customer support and assistance', employeeCount: 6, isActive: true },
    { id: 5, name: 'Operations', description: 'Daily operations and logistics', employeeCount: 10, isActive: true }
  ]);

  // Initialize permissions object for all modules
  const initializePermissions = () => {
    const perms = {};
    availableAppModules.forEach(module => {
      perms[module] = { view: false, edit: false };
    });
    return perms;
  };

  const initialUsers = [
    {
      id: 'sample1',
      userName: 'Operator Kiosk',
      role: 'Operations',
      permissions: {
        'Kiosk Management': { view: true, edit: true },
        'Live Parking': { view: true, edit: false }
      }
    },
    {
      id: 'sample2',
      userName: 'Reporting Staff',
      role: 'Administration',
      permissions: {
        'Reports': { view: true, edit: false },
        'Payment Reports': { view: true, edit: false }
      }
    },
    {
      id: 'sample3',
      userName: 'Parking Supervisor',
      role: 'Operations',
      permissions: {
        'Dashboard': { view: true, edit: true },
        'Live Parking': { view: true, edit: true },
        'Slot Management': { view: true, edit: true },
        'Add User': { view: true, edit: false }
      }
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: '', description: '' });

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    role: '',
    permissions: initializePermissions(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    if (value === '__create_new__') {
      setShowCreateRole(true);
      setFormData({ ...formData, role: '' });
    } else {
      setShowCreateRole(false);
      setFormData({ ...formData, role: value });
    }
  };

  const handleCreateRole = () => {
    if (newRoleData.name.trim()) {
      const newRole = {
        id: Math.max(...departments.map(d => d.id), 0) + 1,
        name: newRoleData.name,
        description: newRoleData.description || '',
        employeeCount: 0,
        isActive: true
      };
      setDepartments([...departments, newRole]);
      setFormData({ ...formData, role: newRoleData.name });
      setNewRoleData({ name: '', description: '' });
      setShowCreateRole(false);
    }
  };

  const handleCancelCreateRole = () => {
    setNewRoleData({ name: '', description: '' });
    setShowCreateRole(false);
  };

  const handlePermissionChange = (moduleName, permissionType) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleName]: {
          ...prev.permissions[moduleName],
          [permissionType]: !prev.permissions[moduleName][permissionType]
        }
      }
    }));
  };

  const handleSelectAllView = () => {
    const allSelected = availableAppModules.every(module => formData.permissions[module]?.view);
    const newPermissions = { ...formData.permissions };
    availableAppModules.forEach(module => {
      newPermissions[module] = { ...newPermissions[module], view: !allSelected };
    });
    setFormData({ ...formData, permissions: newPermissions });
  };

  const handleSelectAllEdit = () => {
    const allSelected = availableAppModules.every(module => formData.permissions[module]?.edit);
    const newPermissions = { ...formData.permissions };
    availableAppModules.forEach(module => {
      newPermissions[module] = { ...newPermissions[module], edit: !allSelected };
    });
    setFormData({ ...formData, permissions: newPermissions });
  };

  const resetForm = () => {
    setFormData({ userName: '', password: '', role: '', permissions: initializePermissions() });
    setIsEditing(false);
    setCurrentUser(null);
    setShowCreateRole(false);
    setNewRoleData({ name: '', description: '' });
  };

  const handleOpenFormModal = (userToEdit = null) => {
    resetForm();
    if (userToEdit) {
      setIsEditing(true);
      setCurrentUser(userToEdit);
      const userPermissions = { ...initializePermissions(), ...userToEdit.permissions };
      setFormData({
        userName: userToEdit.userName || '',
        password: '',
        role: userToEdit.role || '',
        permissions: userPermissions,
      });
    } else {
      setIsEditing(false);
      setCurrentUser(null);
    }
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && currentUser) {
      const updatedUser = {
        ...currentUser,
        userName: formData.userName,
        role: formData.role,
        permissions: formData.permissions,
        ...(formData.password && { password: formData.password })
      };
      setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
    } else {
      const newUser = {
        id: Date.now().toString(),
        userName: formData.userName,
        password: formData.password,
        role: formData.role,
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

  const getPermissionCount = (user) => {
    if (!user.permissions) return 0;
    return Object.values(user.permissions).filter(p => p.view || p.edit).length;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">Manage system users and their permissions</p>
          </div>
          <button
            onClick={() => handleOpenFormModal()}
            className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
          >
            <Plus size={18} className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-blue flex items-center justify-center">
                        <UserCircle size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role || 'No Role'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{getPermissionCount(user)} modules</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenFormModal(user)}
                    className="text-primary-blue hover:text-blue-900 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded p-1"
                    title="Edit User"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-primary-red hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-primary-red rounded p-1"
                    title="Delete User"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={handleCloseFormModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      required
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {isEditing ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      required={!isEditing}
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role / Department *
                  </label>
                  <select
                    value={showCreateRole ? '__create_new__' : formData.role}
                    onChange={handleRoleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                    required={!showCreateRole}
                  >
                    <option value="">Select a role...</option>
                    {departments.filter(d => d.isActive).map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                    <option value="__create_new__">+ Create New Role</option>
                  </select>
                </div>

                {/* Inline Create Role Form */}
                {showCreateRole && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Create New Role</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role Name *
                        </label>
                        <input
                          type="text"
                          value={newRoleData.name}
                          onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          placeholder="e.g., IT Support"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={newRoleData.description}
                          onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          placeholder="Brief description"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleCreateRole}
                          className="px-3 py-1.5 bg-primary-blue text-white rounded-md hover:bg-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        >
                          Create Role
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelCreateRole}
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Permissions Grid */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Module Permissions
                    </label>
                    <div className="flex space-x-4 text-xs">
                      <button
                        type="button"
                        onClick={handleSelectAllView}
                        className="text-primary-blue hover:underline focus:outline-none"
                      >
                        Toggle All View
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectAllEdit}
                        className="text-primary-blue hover:underline focus:outline-none"
                      >
                        Toggle All Edit
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">View</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">Edit</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {availableAppModules.map((module) => (
                          <tr key={module} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{module}</td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={formData.permissions[module]?.view || false}
                                onChange={() => handlePermissionChange(module, 'view')}
                                className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={formData.permissions[module]?.edit || false}
                                onChange={() => handlePermissionChange(module, 'edit')}
                                className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={handleCloseFormModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {isEditing ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
