'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBoxes, FaExclamationTriangle, FaPlusCircle } from 'react-icons/fa';
import AdminLayout from '../../admin/AdminLayout';

type Resource = {
  id: number;
  name: string;
  type: string;
  quantity_available: number;
  unit_of_measure: string;
  low_stock_threshold: number;
};

const Inventory = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/resources/');
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const lowStockList = resources.filter(
    (item) => item.quantity_available <= item.low_stock_threshold
  );

  return (
    <AdminLayout>
      <div className="font-poppins w-[90%]">
        <div className="mb-6 ">
          <h1 className="text-[25px] font-semibold text-gray-800 mb-2">
            Inventory Overview
          </h1>
          <p className="text-base text-gray-700">
            Monitor critical cervical cancer screening and treatment supplies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-[#3BA1AF] text-white rounded-lg flex items-center justify-center mr-4">
              <FaBoxes />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {resources.length}
              </h2>
              <p className="text-base text-gray-500">Resource Types In Stock</p>
            </div>
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center mr-4">
              <FaExclamationTriangle />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {lowStockList.length}
              </h2>
              <p className="text-base text-gray-500">Low Stock Alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Low Stock Items
          </h3>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : lowStockList.length === 0 ? (
            <p className="text-sm text-green-600">All items are sufficiently stocked.</p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-800">
              {lowStockList.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-100 py-2"
                >
                  <span>{item.name}</span>
                  <span className="text-red-600 font-medium">
                    {item.quantity_available} {item.unit_of_measure}s
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-right">
          <Link href="/dashboard/inventory/manage">
            <button className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#3BA1AF] text-white text-base font-medium rounded-lg shadow hover:bg-[#36929e] transition">
              <FaPlusCircle />
              Manage Inventory
            </button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Inventory;
