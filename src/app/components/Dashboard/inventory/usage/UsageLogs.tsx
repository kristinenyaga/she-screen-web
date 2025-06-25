'use client';
import React from 'react';
import DashboardLayout from '../../DashboardLayout';
import { FaSearch } from 'react-icons/fa';

// Mock data for usage logs
const usageLogs = [
  {
    id: 1,
    date: '2025-06-22 10:30 AM',
    resource: 'HPV Test Kit',
    quantity: 1,
    actionType: 'HPV Test',
    usedBy: 'Nurse Mary',
    remaining: 4,
  },
  {
    id: 4,
    date: '2025-06-22 12:30 AM',
    resource: 'HPV Test Kit',
    quantity: 1,
    actionType: 'HPV Test',
    usedBy: 'Nurse Mary',
    remaining: 3,
  },
  {
    id: 2,
    date: '2025-06-22 11:10 AM',
    resource: 'Cryotherapy Gas',
    quantity: 1,
    actionType: 'Cryotherapy',
    usedBy: 'Dr. Kamau',
    remaining: 2,
  },
];

const UsageLogs = () => {
  return (
    <DashboardLayout>
      <div className="font-poppins w-[90%]">
        {/* Header */}
        <div className="mb-6 mt-1">
          <h1 className="text-[22px] font-medium text-gray-700 mb-1">
            Inventory Usage Logs
          </h1>
          <p className="text-sm text-gray-500">
            Track how screening and treatment supplies are used across procedures.
          </p>
        </div>

        {/* Filters (can be enhanced later) */}
        <div className="flex items-center mb-4 gap-3">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by resource or action..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BA1AF]"
            />
            <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="border-b border-gray-200 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Date/Time</th>
                <th className="px-6 py-3">Resource</th>
                <th className="px-6 py-3">Quantity Used</th>
                <th className="px-6 py-3">Action Type</th>
                <th className="px-6 py-3">Remaining Stock</th>
              </tr>
            </thead>
            <tbody>
              {usageLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.resource}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">{log.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.actionType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsageLogs;
