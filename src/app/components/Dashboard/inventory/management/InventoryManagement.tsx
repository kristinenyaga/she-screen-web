'use client';
import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import EditModal from './EditModal';
import AdminLayout from '@/app/components/admin/AdminLayout';

export type Resource = {
  id: number,
  name: string,
  type: string,
  quantity_available: number,
  unit_of_measure: string,
  low_stock_threshold: number
};
export type ResourceFormData = {
  id: number; 
  name: string;
  type: string;
  quantity: number;
  unit: string;
  lowThreshold: number;
};

const InventoryManagement = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/resources/');
        const data = await res.json();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      }
    };
    fetchResources();
  }, []);

  const handleSubmit = async (resource: ResourceFormData) => {
    const normalizedResource: Resource = {
      id: resource.id,
      name: resource.name,
      type: resource.type,
      quantity_available: resource.quantity, 
      unit_of_measure: resource.unit,        
      low_stock_threshold: resource.lowThreshold, 
    };

    if (mode === 'edit') {
      try {
        const res = await fetch(`http://127.0.0.1:8000/resources/${normalizedResource.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalizedResource),
        });
        const updatedResource = await res.json();
        setResources((prev) =>
          prev.map((r) => (r.id === updatedResource.id ? updatedResource : r))
        );
      } catch (error) {
        console.error('Error updating resource:', error);
      }
    } else {
      try {
        const res = await fetch('http://127.0.0.1:8000/resources/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalizedResource),
        });
        const newResource = await res.json();
        setResources((prev) => [...prev, newResource]);
      } catch (error) {
        console.error('Error adding resource:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="font-poppins w-[90%]">
        <div className="mb-6 flex items-center justify-between">
          <div className=''>
            <h1 className="text-2xl mb-2 font-semibold text-[#3BA1AF]">Manage Inventory</h1>
            <p className="text-base text-gray-700">Add, edit, or remove screening and treatment supplies for the hospital</p>
          </div>
          <button onClick={() => {
            setMode('add');
            setActiveResource(null);
            setOpen(true);
          }} className="inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[#3BA1AF] text-white text-base font-medium rounded-lg shadow hover:bg-[#36929e] transition">
            <FaPlusCircle />
            Add Resource
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto mt-2.5">
          <table className="min-w-full text-sm text-left text-gray-900">
            <thead className="border-b bg-blue-50/50 border-gray-200 text-base">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Unit</th>
                <th scope="col" className="px-6 py-4">Low Stock Threshold</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => {
                const needsRestock = resource.quantity_available <= resource.low_stock_threshold;
                return (
                  <tr key={resource.id} className={`border-b border-gray-200 text-[15px] ${needsRestock ? 'bg-orange-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{resource.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{resource.quantity_available}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{resource.unit_of_measure}</td>
                    <td className="pl-20 py-4 whitespace-nowrap text-gray-700">{resource.low_stock_threshold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {needsRestock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-orange-50 text-amber-600 rounded-full">
                          <FaExclamationTriangle className="text-sm" /> Restock Needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4 flex items-center space-x-3">
                      <button onClick={() => {
                        setMode('edit');
                        setActiveResource(resource);
                        setOpen(true);
                      }} className="text-base flex gap-2 items-center cursor-pointer transition">
                         <FaEdit className='text-green-600 hover:text-green-500 mb-[2px]' />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <EditModal
          onSubmit={handleSubmit}
          activeResource={activeResource ? {
            id: activeResource.id,
            name: activeResource.name,
            type: activeResource.type,
            quantity: activeResource.quantity_available,
            unit: activeResource.unit_of_measure,
            lowThreshold: activeResource.low_stock_threshold,
          } : null}
          mode={mode}
          open={open}
          handleClose={() => {
            setOpen(false);
            setActiveResource(null);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default InventoryManagement;
