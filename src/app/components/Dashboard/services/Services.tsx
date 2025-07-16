'use client';
import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../DashboardLayout';

interface ServiceObj{
  name:string
}
interface Service{
  id: number;
  nhif_covered: boolean;
  base_cost: number;
  insurance_copay_amount: number;
  out_of_pocket: number
  service:ServiceObj
}


const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [activeService, setActiveService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServiceCosts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/service-costs/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch service costs");
        }

        const data = await res.json();
         setServices(data);
      } catch (error) {
        console.error("Error fetching service costs:", error);
      }
    };
  
    fetchServiceCosts()
   }, [])

  const handleSubmit = (updated) => {
    if (mode === "add") {
      setServices(prev => [...prev,updated])
    }
    else if (mode === "edit") {
      setServices(prev => prev.map(service => (service.id === updated.id ?updated :service)))
    }
  }
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
          <button onClick={() => {
            setMode('add');
            setOpen(true);
          }} className="inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[#3BA1AF] text-white text-sm font-medium rounded-lg shadow hover:bg-[#36929e] transition">
            <FaPlusCircle /> Add Service
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="border-b border-gray-200 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">NHIF Covered</th>
                <th className="px-6 py-4">Base Cost</th>
                <th className="px-6 py-4">Insurance Copay</th>
                <th className="px-6 py-4">Patient Payment</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap">{service?.service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.nhif_covered ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">KES {service?.base_cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">KES {service?.insurance_copay_amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">KES {service?.out_of_pocket}</td>
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
