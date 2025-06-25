'use client';
import React, { useState } from 'react';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../DashboardLayout';

const mockServices = [
  {
    id: 1,
    name: 'HPV DNA Test',
    nhifCovered: true,
    totalCost: 2500,
    patientPays: 500,
    resources: ['HPV Test Kit', 'Gloves'],
  },
  {
    id: 2,
    name: 'Visual Inspection with Acetic Acid (VIA)',
    nhifCovered: false,
    totalCost: 300,
    patientPays: 300,
    resources: ['Speculum', 'Acetic Acid'],
  },
  {
    id: 3,
    name: 'Cryotherapy',
    nhifCovered: true,
    totalCost: 4000,
    patientPays: 1000,
    resources: ['Cryotherapy Gas', 'Cryo Gun'],
  },
];

const Services = () => {
  const [services, setServices] = useState(mockServices);

  return (
    <DashboardLayout>
      <div className="font-poppins w-[90%]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-medium text-gray-700 mb-1">
              Screening & Treatment Services
            </h1>
            <p className="text-sm text-gray-500">
              Define the services you offer, associated costs, and required resources.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3BA1AF] text-white text-sm font-medium rounded-lg shadow hover:bg-[#36929e] transition">
            <FaPlusCircle /> Add Service
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="border-b border-gray-200 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">NHIF Covered</th>
                <th className="px-6 py-4">Total Cost</th>
                <th className="px-6 py-4">Patient Pays</th>
                <th className="px-6 py-4">Resources</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.nhifCovered ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">KES {service.totalCost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">KES {service.patientPays}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.resources.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                    <button className="text-green-600 hover:text-green-500">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Services;
