import React, { useState } from 'react';
import { Plus, Edit, Trash, Building2, X, MapPin } from 'lucide-react';
import { mockDashboardData } from '../data/mockData';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { useData } from '../context/DataContext';

const Departments = () => {
    const { departments, setDepartments } = useData();

    const [showModal, setShowModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        employeeCount: 0,
        location: ['Location A'],
        isActive: true
    });

    const handleAdd = () => {
        setFormData({ name: '', description: '', employeeCount: 0, location: ['Location A'], isActive: true });
        setEditingDepartment(null);
        setShowModal(true);
    };

    const handleEdit = (dept) => {
        setFormData({
            name: dept.name,
            description: dept.description,
            employeeCount: dept.employeeCount,
            location: Array.isArray(dept.location) ? dept.location : [dept.location || 'Location A'],
            isActive: dept.isActive
        });
        setEditingDepartment(dept.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            setDepartments(departments.filter(dept => dept.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingDepartment) {
            // Edit existing department
            setDepartments(departments.map(dept =>
                dept.id === editingDepartment
                    ? { ...dept, ...formData }
                    : dept
            ));
        } else {
            // Add new department
            const newDepartment = {
                id: Math.max(...departments.map(d => d.id), 0) + 1,
                ...formData
            };
            setDepartments([...departments, newDepartment]);
        }

        setShowModal(false);
        setFormData({ name: '', description: '', employeeCount: 0, location: ['Location A'], isActive: true });
    };

    const handleCancel = () => {
        setShowModal(false);
        setFormData({ name: '', description: '', employeeCount: 0, location: ['Location A'], isActive: true });
        setEditingDepartment(null);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
                        <p className="text-gray-600">Manage departments for parking system</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Department
                    </button>
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div
                        key={dept.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg mr-3">
                                    <Building2 size={24} className="text-primary-blue" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                                    <div className="flex space-x-1 mt-1">
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${dept.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {dept.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                            {Array.isArray(dept.location) ? dept.location.join(', ') : (dept.location || 'Location A')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{dept.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{dept.employeeCount}</span> employees
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="p-2 text-primary-blue hover:bg-blue-50 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="p-2 text-primary-red hover:bg-red-50 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-primary-red"
                                    title="Delete"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingDepartment ? 'Edit Department' : 'Add New Department'}
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-blue rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Department Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                                        required
                                        placeholder="e.g., Human Resources"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                                        rows="3"
                                        required
                                        placeholder="Brief description of the department"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Employee Count
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.employeeCount}
                                        onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <MultiSelectDropdown
                                        options={mockDashboardData.parkingZones.map(z => z.name)}
                                        selected={formData.location}
                                        onChange={(val) => setFormData({ ...formData, location: val })}
                                        placeholder="Select Locations"
                                        icon={MapPin}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                        Active Department
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
                                >
                                    {editingDepartment ? 'Update' : 'Add'} Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;
