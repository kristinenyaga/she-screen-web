
'use client';
import React from 'react';
import Link from 'next/link';
import { FaBoxes, FaExclamationTriangle, FaPlusCircle } from 'react-icons/fa';
import DashboardLayout from '../DashboardLayout';

const Inventory = () => {
  const totalResources = 18;
  const lowStockItems = 3;
  const lowStockList = [
    { name: 'HPV Test Kits', quantity: 4, unit: 'kits' },
    { name: 'Speculums', quantity: 6, unit: 'pcs' },
    { name: 'Acetic Acid Solution (VIA)', quantity: 2, unit: 'bottles' },
  ];
  

  return (
    <DashboardLayout>
      <div className="font-poppins w-[90%]">
        <div className="mb-6 mt-1">
          <h1 className="text-[22px] font-medium text-gray-700 mb-1">
            Cervical Cancer Screening & Treatment Inventory
          </h1>
          <p className="text-sm text-gray-500">
            Track critical medical supplies for cervical health services
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-[#3BA1AF] text-white rounded-lg flex items-center justify-center mr-4">
              <FaBoxes />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{totalResources}</h2>
              <p className="text-sm text-gray-500">Total Resource Types</p>
            </div>
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-yellow-500 text-white rounded-lg flex items-center justify-center mr-4">
              <FaExclamationTriangle />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-700">{lowStockItems}</h2>
              <p className="text-sm text-slate-500">Low Stock Alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-3">Low Stock Items</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {lowStockList.map((item, index) => (
              <li key={index} className="flex justify-between border-b border-gray-200 py-2">
                <span>{item.name}</span>
                <span className="text-red-600 font-medium">{item.quantity} {item.unit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-right">
          <Link href="/dashboard/inventory/manage">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3BA1AF] text-white text-sm font-medium rounded-lg shadow hover:bg-[#36929e] transition">
              <FaPlusCircle />
              Manage Inventory
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
