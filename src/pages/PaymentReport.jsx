import React, { useState, useEffect } from 'react';
import { Download, Calendar, FileText, Filter, Search, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Printer, CreditCard, DollarSign, MapPin } from 'lucide-react';
import { mockDashboardData } from '../data/mockData';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { useOutletContext } from 'react-router-dom';

const PaymentReport = () => {
  const { vehiclesData = [] } = useOutletContext() || {};
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleNumberFilter, setVehicleNumberFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState([]);
  const [sortField, setSortField] = useState('entryTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const enhancedMockData = (vehiclesData || []).map((vehicle, index) => {
    if (vehicle.exitTime) {
      const staffMembers = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'Robert Wilson'];
      const paymentStatus = vehicle.type === 'Staff' ? 'Waiver' : (Math.random() > 0.2 ? 'Paid' : 'Unpaid');
      const paymentModes = ['Cash', 'Card', 'UPI', 'Wallet'];
      return {
        ...vehicle,
        serialNumber: index + 1,
        paymentStatus: vehicle.paymentMethod === 'waiver' ? 'Waiver' : paymentStatus,
        paymentMode: vehicle.paymentMethod ? vehicle.paymentMethod.charAt(0).toUpperCase() + vehicle.paymentMethod.slice(1) : paymentModes[Math.floor(Math.random() * paymentModes.length)],
        collectedBy: staffMembers[Math.floor(Math.random() * staffMembers.length)],
        paymentAmount: vehicle.paymentAmount || (vehicle.type === 'Staff' ? '0.00' : (Math.random() * 5).toFixed(2))
      };
    }
    return { ...vehicle, serialNumber: index + 1, paymentStatus: 'Pending', paymentMode: '-', collectedBy: '-', paymentAmount: '-' };
  });

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const filteredData = enhancedMockData.filter(vehicle => {
    if (searchTerm && !`${vehicle.vehicleNumber} ${vehicle.paymentMode} ${vehicle.collectedBy}`.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (vehicleNumberFilter && !vehicle.vehicleNumber.toLowerCase().includes(vehicleNumberFilter.toLowerCase())) return false;
    if (paymentStatusFilter !== 'all' && vehicle.paymentStatus !== paymentStatusFilter) return false;
    if (paymentModeFilter !== 'all' && vehicle.paymentMode !== paymentModeFilter) return false;
    if (staffFilter !== 'all' && vehicle.collectedBy !== staffFilter) return false;
    if (departmentFilter !== 'all' && (vehicle.department || 'Visitor') !== departmentFilter) return false;
    if (locationFilter.length > 0 && !locationFilter.includes(vehicle.location || 'Location A')) return false;
    if (dateRange.start && dateRange.end) {
      const entryDate = new Date(vehicle.entryTime);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      if (entryDate < startDate || entryDate > endDate) return false;
    }
    return true;
  }).sort((a, b) => {
    let valueA = a[sortField], valueB = b[sortField];
    if (sortField === 'entryTime' || sortField === 'exitTime') {
      valueA = a[sortField] ? new Date(a[sortField]).getTime() : 0;
      valueB = b[sortField] ? new Date(b[sortField]).getTime() : 0;
    } else if (sortField === 'paymentAmount') {
      valueA = a[sortField] === '-' ? -Infinity : parseFloat(a[sortField]); // Treat '-' as very small for sorting
      valueB = b[sortField] === '-' ? -Infinity : parseFloat(b[sortField]);
    }
    return sortDirection === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
  });

  const totalTransactions = filteredData.filter(v => v.paymentStatus !== 'Pending').length;
  const totalCollected = filteredData.filter(v => v.paymentAmount !== '-').reduce((sum, v) => sum + parseFloat(v.paymentAmount || 0), 0).toFixed(2);

  const uniquePaymentStatuses = ['all', ...new Set(enhancedMockData.map(v => v.paymentStatus))];
  const uniquePaymentModes = ['all', ...new Set(enhancedMockData.map(v => v.paymentMode).filter(mode => mode !== '-'))];
  const uniqueStaffMembers = ['all', ...new Set(enhancedMockData.map(v => v.collectedBy).filter(staff => staff !== '-'))];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => { setCurrentPage(1); }, [searchTerm, dateRange, vehicleNumberFilter, paymentStatusFilter, paymentModeFilter, staffFilter, departmentFilter, locationFilter, sortField, sortDirection]);

  const handleDownload = (format) => {
    let content = "";
    let filename = `payment_report_${new Date().toISOString().slice(0, 10)}`;
    let mimeType = "";
    const header = "S.No,Vehicle Number,Department,Location,Entry Time,Exit Time,Duration,Amount Paid (USD),Payment Status,Payment Mode,Collected By\n";
    const dataToExport = filteredData.map(v => {
      let duration = '-';
      if (v.entryTime) {
        const entry = new Date(v.entryTime);
        const exit = v.exitTime ? new Date(v.exitTime) : new Date();
        const diffMs = exit - entry;
        duration = `${Math.floor(diffMs / 36e5)}h ${Math.floor((diffMs % 36e5) / 6e4)}m`;
      }
      return [v.serialNumber, v.vehicleNumber, v.department || 'N/A', v.location || 'N/A', v.entryTime, v.exitTime || '-', duration, v.paymentAmount, v.paymentStatus, v.paymentMode, v.collectedBy];
    });

    if (format === 'pdf') {
      content = "Payment Report\nDate: " + new Date().toLocaleDateString() + "\n\n" + header.replace(/,/g, " | ") + "-".repeat(header.length * 1.5) + "\n";
      dataToExport.forEach(row => { content += row.join(" | ") + "\n"; });
      filename += ".txt"; mimeType = 'text/plain';
    } else if (format === 'excel') {
      content = header;
      dataToExport.forEach(row => { content += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\n"; });
      filename += ".csv"; mimeType = 'text/csv;charset=utf-8;';
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const getPaymentStatusBadge = (status) => {
    const colors = { 'Paid': 'bg-green-100 text-green-800', 'Unpaid': 'bg-red-100 text-primary-red', 'Pending': 'bg-yellow-100 text-yellow-800', 'Waiver': 'bg-purple-100 text-purple-800' };
    return <span className={`px-2 py-1 text-xs rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };
  const getPaymentModeBadge = (mode) => {
    if (mode === '-') return '-';
    const colors = { 'Cash': 'bg-green-100 text-green-800', 'Card': 'bg-blue-100 text-primary-blue', 'UPI': 'bg-purple-100 text-purple-800', 'Wallet': 'bg-orange-100 text-orange-800', 'Waiver': 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 text-xs rounded-full ${colors[mode] || 'bg-gray-100 text-gray-800'}`}>{mode}</span>;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch (e) { return isoString; }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Reports</h1>
          <p className="text-gray-600">Generate and download parking payment transaction reports</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150" onClick={handlePrint}><Printer size={18} className="mr-2" />Print</button>
          <button className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150" onClick={() => handleDownload('pdf')}><Download size={18} className="mr-2" />PDF</button>
          <button className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150" onClick={() => handleDownload('excel')}><FileText size={18} className="mr-2" />Excel</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4"><CreditCard size={24} className="text-primary-blue" /></div>
          <div><p className="text-sm text-gray-500">Total Transactions</p><p className="text-2xl font-bold">{totalTransactions}</p></div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full bg-red-100 mr-4"><DollarSign size={24} className="text-primary-red" /></div>
          <div><p className="text-sm text-gray-500">Total Collected</p><p className="text-2xl font-bold">${totalCollected}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue" onClick={() => setShowFilters(!showFilters)}><Filter size={18} className="mr-2" />Advanced Filters</button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex items-center space-x-2">
                  <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                  <span className="flex-shrink-0">to</span>
                  <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                </div>
              </div>
              {[
                { label: 'Vehicle Number', value: vehicleNumberFilter, setter: setVehicleNumberFilter, type: 'text', placeholder: 'Enter vehicle number' },
                { label: 'Payment Status', value: paymentStatusFilter, setter: setPaymentStatusFilter, type: 'select', options: uniquePaymentStatuses, allLabel: 'All Statuses' },
                { label: 'Payment Mode', value: paymentModeFilter, setter: setPaymentModeFilter, type: 'select', options: uniquePaymentModes, allLabel: 'All Payment Modes' },
                { label: 'Collected By', value: staffFilter, setter: setStaffFilter, type: 'select', options: uniqueStaffMembers, allLabel: 'All Staff Members' },
                { label: 'Department', value: departmentFilter, setter: setDepartmentFilter, type: 'select', options: ['Administration', 'Security', 'Maintenance', 'Customer Service', 'Operations', 'Visitor'], allLabel: 'All Departments' },
                { label: 'Location', value: locationFilter, setter: setLocationFilter, type: 'select', options: ['All', 'Location A', 'Location B', 'Location C'], allLabel: 'All Locations' }
              ].map(filter => (
                <div key={filter.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
                  {filter.label === 'Location' ? (
                    <MultiSelectDropdown
                      options={mockDashboardData.parkingZones.map(z => z.name)}
                      selected={locationFilter}
                      onChange={setLocationFilter}
                      placeholder="All Locations"
                      icon={MapPin}
                    />
                  ) : filter.type === 'text' ? (
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue"
                      placeholder={filter.placeholder}
                      value={filter.value}
                      onChange={(e) => filter.setter(e.target.value)}
                    />
                  ) : (
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue bg-white font-medium"
                      value={filter.value}
                      onChange={(e) => filter.setter(e.target.value)}
                    >
                      {filter.options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt === 'all' || opt === 'All' ? filter.allLabel : opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-blue" onClick={() => { setDateRange({ start: '', end: '' }); setSearchTerm(''); setVehicleNumberFilter(''); setPaymentStatusFilter('all'); setPaymentModeFilter('all'); setStaffFilter('all'); setDepartmentFilter('all'); setLocationFilter([]); }}>Reset Filters</button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('serialNumber')}>
                  <div className="flex items-center">Serial Number{sortField === 'serialNumber' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('vehicleNumber')}>
                  <div className="flex items-center">Vehicle Number{sortField === 'vehicleNumber' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('entryTime')}>
                  <div className="flex items-center">Entry Time{sortField === 'entryTime' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('exitTime')}>
                  <div className="flex items-center">Exit Time{sortField === 'exitTime' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentAmount')}>
                  <div className="flex items-center">Payment Amount{sortField === 'paymentAmount' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentStatus')}>
                  <div className="flex items-center">Payment Status{sortField === 'paymentStatus' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentMode')}>
                  <div className="flex items-center">Payment Mode{sortField === 'paymentMode' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('collectedBy')}>
                  <div className="flex items-center">Collected By{sortField === 'collectedBy' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((v) => {
                let duration = '-';
                if (v.entryTime) {
                  const entry = new Date(v.entryTime);
                  const exit = v.exitTime ? new Date(v.exitTime) : new Date();
                  const diffMs = exit - entry;
                  duration = `${Math.floor(diffMs / 36e5)}h ${Math.floor((diffMs % 36e5) / 6e4)}m`;
                }
                return (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{v.vehicleNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">{v.department || 'N/A'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.location || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(v.entryTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(v.exitTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{v.paymentAmount === '-' ? '-' : `$${v.paymentAmount}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getPaymentStatusBadge(v.paymentStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getPaymentModeBadge(v.paymentMode)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.collectedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredData.length === 0 && <div className="text-center py-8 text-gray-500">No payment records found.</div>}
        </div>

        {filteredData.length > 0 && (
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-2 md:mb-0">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records</div>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={prevPage} disabled={currentPage === 1}><ChevronLeft size={16} /></button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) pageNumber = i + 1;
                  else if (currentPage <= 3) pageNumber = i + 1;
                  else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
                  else pageNumber = currentPage - 2 + i;
                  return <button key={i} className={`px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => paginate(pageNumber)}>{pageNumber}</button>;
                })}
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={nextPage} disabled={currentPage === totalPages}><ChevronRight size={16} /></button>
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <span className="text-xs">Items per page:</span>
              <select className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-blue" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                {[5, 10, 20, 50].map(val => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default PaymentReport;
