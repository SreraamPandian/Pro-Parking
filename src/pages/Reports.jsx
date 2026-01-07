import React, { useState, useEffect } from 'react';
import { Download, Calendar, FileText, Filter, Search, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom'; // Import useOutletContext

const Reports = () => {
  const { vehiclesData } = useOutletContext(); // Get vehiclesData from context
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [sortField, setSortField] = useState('entryTime');
  const [sortDirection, setSortDirection] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredByTypeData = vehiclesData.filter(vehicle =>
    vehicle.type === 'Staff' || vehicle.type === 'Visitor'
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = filteredByTypeData.filter(vehicle => {
    if (searchTerm && !vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (dateRange.start && dateRange.end) {
      const entryDate = new Date(vehicle.entryTime);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Ensure end date includes the whole day
      if (entryDate < startDate || entryDate > endDate) return false;
    }
    if (departmentFilter !== 'All' && vehicle.department !== departmentFilter) return false;
    return true;
  }).sort((a, b) => {
    let valueA, valueB;
    if (sortField === 'entryTime' || sortField === 'exitTime') {
      valueA = a[sortField] ? new Date(a[sortField]).getTime() : 0;
      valueB = b[sortField] ? new Date(b[sortField]).getTime() : 0;
    } else {
      valueA = a[sortField];
      valueB = b[sortField];
    }
    // For waiverId and waiverReason, handle cases where they might be undefined or null
    if (sortField === 'waiverId' || sortField === 'waiverReason') {
      valueA = a[sortField] || ''; // Default to empty string if undefined/null
      valueB = b[sortField] || ''; // Default to empty string if undefined/null
    }
    return sortDirection === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [searchTerm, dateRange, sortField, sortDirection]);

  const handleDownload = (format) => {
    let content = "";
    let filename = `vehicle_report_${new Date().toISOString().slice(0, 10)}`;
    let mimeType = "";

    const header = "Vehicle Number,Entry Time,Exit Time,Type,Status,Duration,Payment Method,Payment Amount (USD),Waiver ID,Waiver Reason\n";

    const dataToExport = filteredData.map(vehicle => {
      let duration = '-';
      if (vehicle.entryTime) {
        const entryTime = new Date(vehicle.entryTime);
        const exitTime = vehicle.exitTime ? new Date(vehicle.exitTime) : new Date(); // Use current time if not exited for duration calculation
        const diffMs = exitTime - entryTime;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${diffHrs}h ${diffMins}m`;
      }
      const status = vehicle.exitTime ? 'Exited' : 'Inside';
      const paymentMethod = vehicle.exitTime ? (vehicle.paymentMethod || 'N/A') : '-';
      const paymentAmount = vehicle.exitTime ? (vehicle.type === 'Staff' && vehicle.paymentMethod === 'Waiver' ? 'N/A (Waiver)' : (vehicle.paymentAmount || '0.000')) : '-';
      const waiverId = (vehicle.type === 'Staff' && vehicle.paymentMethod === 'Waiver' && vehicle.exitTime) ? (vehicle.waiverId || 'N/A') : '-';
      const waiverReason = (vehicle.type === 'Staff' && vehicle.paymentMethod === 'Waiver' && vehicle.exitTime) ? (vehicle.waiverReason || 'N/A') : '-';

      return [
        vehicle.vehicleNumber,
        vehicle.entryTime,
        vehicle.exitTime || '',
        vehicle.type,
        status,
        duration,
        paymentMethod,
        paymentAmount,
        waiverId,
        waiverReason
      ];
    });

    if (format === 'pdf') {
      // Simplified PDF to text for browser compatibility without heavy libraries
      content = "Vehicle Report\nDate: " + new Date().toLocaleDateString() + "\n\n";
      content += header.replace(/,/g, " | ");
      content += "-".repeat(header.length * 1.5) + "\n"; // Dynamic separator
      dataToExport.forEach(row => {
        content += row.join(" | ") + "\n";
      });
      filename += ".txt"; // Changed to .txt for simplicity
      mimeType = 'text/plain';
    } else if (format === 'excel') {
      content = header;
      dataToExport.forEach(row => {
        content += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\n";
      });
      filename += ".csv";
      mimeType = 'text/csv;charset=utf-8;';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (exitTime) => exitTime ?
    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Exited</span> :
    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Inside</span>;

  const getTypeBadge = (type) => type === 'Staff' ?
    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-primary-blue">Staff</span> :
    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Visitor</span>;

  const getPaymentMethodBadge = (method) => {
    if (!method || method === 'N/A') return <span className="text-gray-500">-</span>;
    const colors = {
      'cash': 'bg-green-100 text-green-800',
      'card': 'bg-blue-100 text-primary-blue',
      'waiver': 'bg-purple-100 text-purple-800' // Consistent with PaymentReport
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${colors[method.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{method.charAt(0).toUpperCase() + method.slice(1)}</span>;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600">Generate and download parking vehicle reports</p>
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150"
            onClick={() => handleDownload('pdf')}
          >
            <Download size={18} className="mr-2" />
            Download PDF
          </button>
          <button
            className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 flex items-center transition duration-150"
            onClick={() => handleDownload('excel')}
          >
            <FileText size={18} className="mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              placeholder="Search by vehicle number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input type="date" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                </div>
                <span className="flex-shrink-0">to</span>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input type="date" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue bg-white"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Administration">Administration</option>
                <option value="Security">Security</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Operations">Operations</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-blue" onClick={() => { setDateRange({ start: '', end: '' }); setSearchTerm(''); setDepartmentFilter('All'); }}>
                <Filter size={18} className="mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['vehicleNumber', 'entryTime', 'exitTime', 'type'].map(field => (
                  <th key={field} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(field)}>
                    <div className="flex items-center">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      {sortField === field && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentMethod')}>
                  <div className="flex items-center">Payment Method{sortField === 'paymentMethod' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentAmount')}>
                  <div className="flex items-center">Amount (USD){sortField === 'paymentAmount' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('waiverId')}>
                  <div className="flex items-center">Waiver ID{sortField === 'waiverId' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('waiverReason')}>
                  <div className="flex items-center">Waiver Reason{sortField === 'waiverReason' && <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((vehicle) => {
                let duration = '-';
                if (vehicle.entryTime) {
                  const entryTime = new Date(vehicle.entryTime);
                  const exitTime = vehicle.exitTime ? new Date(vehicle.exitTime) : new Date(); // Use current time if not exited
                  const diffMs = exitTime - entryTime;
                  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  duration = `${diffHrs}h ${diffMins}m`;
                }
                const showWaiverDetails = vehicle.type === 'Staff' && vehicle.paymentMethod === 'Waiver' && vehicle.exitTime;
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium">{vehicle.vehicleNumber}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.entryTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.exitTime || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(vehicle.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(vehicle.exitTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.exitTime ? getPaymentMethodBadge(vehicle.paymentMethod) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.exitTime ? (showWaiverDetails ? <span className="text-gray-500">N/A (Waiver)</span> : <span className="font-medium">{vehicle.paymentAmount || '0.000'}</span>) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{showWaiverDetails ? vehicle.waiverId || 'N/A' : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{showWaiverDetails ? vehicle.waiverReason || 'N/A' : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">{vehicle.department || 'N/A'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredData.length === 0 && <div className="text-center py-8 text-gray-500">No vehicles found.</div>}
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-2 md:mb-0">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} vehicles</div>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={prevPage} disabled={currentPage === 1}><ChevronLeft size={16} /></button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) pageNumber = i + 1;
                  else if (currentPage <= 3) pageNumber = i + 1;
                  else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
                  else pageNumber = currentPage - 2 + i;

                  return (
                    <button
                      key={i}
                      className={`px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => paginate(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={nextPage} disabled={currentPage === totalPages}><ChevronRight size={16} /></button>
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <span className="text-xs">Items per page:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                {[5, 10, 20, 50].map(val => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
