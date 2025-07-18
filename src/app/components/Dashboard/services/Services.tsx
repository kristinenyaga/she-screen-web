// Updated ServiceCost Component with Modal for Add/Edit
'use client';
import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import AdminLayout from '../../admin/AdminLayout';
import EditServiceCostModal from './EditModal';

interface ServiceObj {
  name: string;
  id: number;
}

interface ServiceCost {
  id: number;
  nhif_covered: boolean;
  base_cost: number;
  insurance_copay_amount: number;
  out_of_pocket: number;
  service: ServiceObj;
  service_id?: number; // for editing
}

const ServiceCost = () => {
  const [serviceCosts, setServiceCosts] = useState<ServiceCost[]>([]);
  const [services, setServices] = useState<ServiceObj[]>([]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [activeCost, setActiveCost] = useState<ServiceCost | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const [serviceRes, costRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/services/", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://127.0.0.1:8000/service-costs/", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!serviceRes.ok || !costRes.ok) throw new Error("Failed fetching data");

        const servicesData = await serviceRes.json();
        const costsData = await costRes.json();

        setServices(servicesData);
        setServiceCosts(costsData);
      } catch (error) {
        console.error("Error fetching services or service costs:", error);
      }
    };

    fetchData();
  }, []);


  const handleOpenAdd = () => {
    setMode('add');
    setActiveCost(null);
    setOpen(true);
  };

  const handleOpenEdit = (cost: ServiceCost) => {
    setMode('edit');
    setActiveCost({
      ...cost,
      service_id: cost.service?.id || 0, 
    });
    setOpen(true);
  };


  const handleModalSubmit = async (formData: any) => {
    const token = sessionStorage.getItem("token");
    const url =
      mode === 'add'
        ? `http://127.0.0.1:8000/service-costs/`
        : `http://127.0.0.1:8000/service-costs/${formData.id}`;
    const method = mode === 'add' ? 'POST' : 'PATCH';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (mode === 'add') {
        setServiceCosts(prev => [...prev, data]);
      } else {
        setServiceCosts(prev => prev.map(item => (item.id === data.id ? data : item)));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="font-poppins w-[90%]">
        <div className="flex items-center justify-between">
          <div className='mb-8'>
            <h1 className="text-[25px] font-semibold text-gray-800 mb-2">
              Screening & Treatment Service cost
            </h1>
            <p className="text-base text-gray-700">
              Managing the service costs of the services offered by the hospital
            </p>
          </div>
          <button onClick={handleOpenAdd} className="inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[#3BA1AF] text-white text-base font-medium rounded-lg shadow hover:bg-[#36929e] transition">
            <FaPlusCircle /> Add ServiceCost
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="border-b bg-blue-50/50 border-gray-200 text-base">
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
              {serviceCosts.map((service) => (
                <tr key={service.id} className="border-b border-gray-200 text-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">{service?.service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.nhif_covered ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">Ksh {service?.base_cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Ksh {service?.insurance_copay_amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Ksh {service?.out_of_pocket}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                    <button onClick={() => handleOpenEdit(service)} className="text-green-600 hover:text-green-500">
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

        <EditServiceCostModal
          open={open}
          handleClose={() => setOpen(false)}
          mode={mode}
          activeCost={activeCost}
          services={services}
          onSubmit={handleModalSubmit}
        />
      </div>
    </AdminLayout>
  );
};

export default ServiceCost;
