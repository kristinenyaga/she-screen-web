
'use client';
import React, { useState } from 'react';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../../DashboardLayout';
import EditModal from './EditModal';

const mockResources = [
  {
    id: 1,
    name: 'HPV Test Kits',
    type: 'Equipment',
    quantity: 40,
    unit: 'kits',
    lowThreshold: 10,
  },
  {
    id: 2,
    name: 'Speculums (Disposable)',
    type: 'Equipment',
    quantity: 6,
    unit: 'pcs',
    lowThreshold: 10,
  },
  {
    id: 3,
    name: 'Acetic Acid Solution',
    type: 'Medication',
    quantity: 2,
    unit: 'bottles',
    lowThreshold: 5,
  },
];

type Resource = {
  id: number,
  name: string,
  type: string,
  quantity: number,
  unit: string,
  lowThreshold:number
}

const InventoryManagement = () => {
  const [resources, setResources] = useState(mockResources);
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const handleSubmit = (updated:Resource) => {
    if (mode === 'edit') {
      setResources((prev)=>prev.map((res)=>(res.id === updated.id ?updated:res)))
    } else {
      setResources(prev => [...prev,updated])
    }
  }
  return (
    <DashboardLayout>
      <div className="font-poppins w-[90%]">
        <div className="mb-6 flex items-center justify-between">
          <div className='mt-1'>
            <h1 className="text-[22px] font-medium text-gray-700 mb-1">Manage Inventory</h1>
            <p className="text-sm text-gray-500">Add, edit, or remove screening and treatment supplies.</p>
          </div>
          <button onClick={() => {
            setMode('add');
            setOpen(true);
          }} className="inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[#3BA1AF] text-white text-sm font-medium rounded-lg shadow hover:bg-[#36929e] transition">
            <FaPlusCircle />
            Add Resource
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="border-b border-gray-200 text-xs uppercase">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">type</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Unit</th>
                <th scope="col" className="px-6 py-4">Low Stock Threshold</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap">{resource.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.lowThreshold}</td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <button onClick={() => {
                      setMode('edit');
                      setActiveResource(resource);
                      setOpen(true);
                    }} className="text-green-600 text-lg hover:text-green-500 cursor-pointer transition">
                      <FaEdit />
                    </button>
                    <button onClick={() => {
                      setActiveResource(resource)
                    }} className="text-red-500 hover:text-red-700 cursor-pointer transition">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EditModal onSubmit={handleSubmit} activeResource={activeResource} mode={mode} open={open} handleClose={() => {
          setOpen(false)
          setActiveResource(null)
        }} />
      </div>
    </DashboardLayout>
  );
};

export default InventoryManagement;
