import React, { useState } from 'react';
import { Plus, Edit, Trash, UserCircle, KeyRound, X, Save, ChevronDown, MapPin, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { availableAppModules, mockDashboardData } from '../data/mockData';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

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
      location: 'Location A', // Added location
      permissions: {
        'Kiosk Management': { view: true, edit: true },
        'Live Parking': { view: true, edit: false }
      }
    },
    {
      id: 'sample2',
      userName: 'Reporting Staff',
      role: 'Administration',
      location: 'Location B', // Added location
      permissions: {
        'Reports': { view: true, edit: false },
        'Payment Reports': { view: true, edit: false }
      }
    },
    {
      id: 'sample3',
      userName: 'Parking Supervisor',
      role: 'Operations',
      location: 'Location C', // Added location
      permissions: {
        'Dashboard': { view: true, edit: true },
        'Live Parking': { view: true, edit: true },
        'Slot Management': { view: true, edit: true },
        'Add User': { view: true, edit: false }
      }
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'roles'
  const [locationFilter, setLocationFilter] = useState([]); // Filter for the users table
  const [searchTerm, setSearchTerm] = useState(''); // Search for the users table
  const [showFormModal, setShowFormModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false); // New state for Role Modal
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newRoleData, setNewRoleData] = useState({ name: '', description: '' });

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    role: '',
    location: 'Location A', // Added location to form state
    permissions: initializePermissions(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, role: value });
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
      setNewRoleData({ name: '', description: '' });
      setShowRoleModal(false);
    }
  };

  const handleCancelCreateRole = () => {
    setNewRoleData({ name: '', description: '' });
    setShowRoleModal(false);
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
    setFormData({ userName: '', password: '', role: '', locations: [], permissions: initializePermissions() });
    setIsEditing(false);
    setCurrentUser(null);
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
        locations: userToEdit.location ? [userToEdit.location] : (userToEdit.locations || []),
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
    if (!formData.userName || (!isEditing && !formData.password) || !formData.role || formData.locations.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isEditing && currentUser) {
      const updatedUser = {
        ...currentUser,
        userName: formData.userName,
        role: formData.role,
        locations: formData.locations,
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
        locations: formData.locations, // Save locations
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

  const filteredUsers = users.filter(user => {
    if (searchTerm && !user.userName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (locationFilter.length === 0) return true;
    const userLocations = user.locations || (user.location ? [user.location] : []);
    return userLocations.some(loc => locationFilter.includes(loc));
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">Manage system users and their permissions</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
            >
              <Plus size={18} className="mr-2" />
              Add Role
            </button>
            <button
              onClick={() => handleOpenFormModal()}
              className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
            >
              <Plus size={18} className="mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Users Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
            <UserCircle size={20} className="mr-2 text-primary-red" />
            System Users
          </h2>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-64">
              <MultiSelectDropdown
                options={mockDashboardData.parkingZones.map(z => z.name)}
                selected={locationFilter}
                onChange={setLocationFilter}
                placeholder="All Locations"
                icon={MapPin}
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Locations</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Permissions</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserCircle className="h-full w-full text-gray-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                          <div className="text-xs text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.locations ? user.locations.join(', ') : (user.location || '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getPermissionCount(user)} modules
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenFormModal(user)}
                        className="text-primary-blue hover:text-blue-800 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded p-1"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-primary-red hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-primary-red rounded p-1"
                        title="Delete User"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 italic border-t border-gray-200 bg-white">
                No users found
              </div>
            )}
          </div>

          {/* Pagination UI */}
          {filteredUsers.length > itemsPerPage && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white rounded-b-lg no-print">
              <div className="flex-1 flex justify-between sm:hidden">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>Previous</button>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div><p className="text-sm text-gray-700">Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results</p></div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="sr-only">Previous</span><ChevronLeft size={20} /></button>
                    {[...Array(totalPages)].map((_, i) => (<button key={i + 1} onClick={() => paginate(i + 1)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-primary-blue border-primary-blue text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}>{i + 1}</button>))}
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="sr-only">Next</span><ChevronRight size={20} /></button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Roles Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
            <Building2 size={20} className="mr-2 text-primary-blue" />
            Roles & Departments
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{dept.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{dept.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-medium bg-gray-100 px-2.5 py-1 rounded-md text-gray-700">{dept.employeeCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {dept.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Add/Edit User Modal */}
      {
        showFormModal && (
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
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      required
                    >
                      <option value="">Select a role...</option>
                      {departments.filter(d => d.isActive).map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Selection */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Locations
                    </label>
                    <MultiSelectDropdown
                      options={mockDashboardData.parkingZones.map(z => z.name)}
                      selected={formData.locations || []}
                      onChange={(val) => setFormData({ ...formData, locations: val })}
                      placeholder="Select Locations"
                      icon={MapPin}
                    />
                  </div>

                  {/* Permissions Grid */}
                  <div className="pt-4 border-t border-gray-100">
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
        )
      }
      {/* Add Role Modal */}
      {
        showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Add New Role</h3>
                <button
                  onClick={handleCancelCreateRole}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
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
                    <textarea
                      value={newRoleData.description}
                      onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue min-h-[100px]"
                      placeholder="Enter role description..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelCreateRole}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateRole}
                    className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Create Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >

  );
};

export default AddUser;
