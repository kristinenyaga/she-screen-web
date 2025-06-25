'use client';
import React from 'react';
import { FaSms, FaEye } from 'react-icons/fa';
import PatientFilter from './PatientFilter'

const mockPatients = [
  {
    id: 1,
    name: 'Jane Wanjiku',
    phone: '07******45',
    age: 32,
    county: 'Kiambu',
    risk: 'High',
    status: 'contacted',
    lastContact: '2025-06-10',
  },
  {
    id: 2,
    name: 'Mary Atieno',
    phone: '07******89',
    age: 28,
    county: 'Nairobi',
    risk: 'Medium',
    status: 'not contacted',
    lastContact: '2025-06-15',
  },
];

const PatientTable = () => {
  return (
    <div className="overflow-x-auto font-inter">
      <div className='mt-1'>
        <h1 className="text-[22px] font-medium text-gray-700 mb-1">Patient Management</h1>
        <p className="text-sm text-gray-500">Add, edit, or remove screening and treatment supplies.</p>
      </div>
      <PatientFilter />
      
      <table className="w-[90%] mt-5 text-left border border-gray-100 overflow-hidden">
        <thead className="bg-[#f7fafa] text-gray-600 text-sm  rouded-2xl">
          <tr className=' rouded-2xl'>
            <th className="px-6 py-3  rouded-2xl">Name</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Age</th>
            <th className="px-6 py-3">County</th>
            <th className="px-6 py-3">Risk Level</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Last Contact</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-600">
          {mockPatients.map((patient) => (
            <tr key={patient.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">{patient.name}</td>
              <td className="px-6 py-4">{patient.phone}</td>
              <td className="px-6 py-4">{patient.age}</td>
              <td className="px-6 py-4">{patient.county}</td>
              <td className="px-6 py-4 text-[#3BA1AF] font-semibold">{patient.risk}</td>
              <td className="px-6 py-4">{patient.status}</td>
              <td className="px-6 py-4">{patient.lastContact}</td>
              <td className="px-6 py-4 text-center space-x-2">
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#3BA1AF] text-white text-sm hover:bg-[#36929e] transition cursor-pointer"
                  title="Send SMS"
                >
                  <FaSms className="text-white" />
                  send SMS
                </button>

                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition cursor-pointer"
                  title="View Patient Details"
                >
                  <FaEye />
                  View
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;