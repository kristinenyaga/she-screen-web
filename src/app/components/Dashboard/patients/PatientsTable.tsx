'use client';
import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PatientFilter from './PatientFilter';

type RiskLevel = 'High' | 'Medium' | 'Low' | null;

interface Patient {
  id: number;
  patient_code: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  risk_level?: RiskLevel;
}

const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case 'High':
      return 'text-red-600 font-semibold';
    case 'Medium':
      return 'text-yellow-600 font-semibold';
    case 'Low':
      return 'text-green-600 font-semibold';
    default:
      return 'text-gray-400 italic';
  }
};

const PatientTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/patients');
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="overflow-x-auto font-inter">
      <div className='mt-1'>
        <h1 className="text-[22px] font-medium text-gray-700 mb-1">Patient Management</h1>
        <p className="text-sm text-gray-500">Manage risk assessments and care plans.</p>
      </div>

      <PatientFilter />

      <table className="w-[90%] mt-5 text-left border border-gray-100 overflow-hidden">
        <thead className="bg-[#f7fafa] text-gray-700 text-sm">
          <tr>
            <th className="px-6 py-3">Patient Code</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Age</th>
            <th className="px-6 py-3">Risk Level</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-600">
          {patients.map((p) => {
            const fullName = `${p.first_name} ${p.last_name}`;


            return (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{p.patient_code}</td>
                <td className="px-6 py-4 font-medium">{fullName}</td>
                <td className="px-6 py-4">{p.phone_number || '—'}</td>
                <td className="px-6 py-4">
                  {p.date_of_birth
                    ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()
                    : '—'}
                </td>
                <td className="px-6 py-4">
                  {p.risk_level ? (
                    <span className={getRiskColor(p.risk_level)}>{p.risk_level}</span>
                  ) : (
                    <span className="text-gray-400 italic">Not Assessed</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button onClick={() =>
                    router.push(`/dashboard/patients/${p.id}`)
                  } className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition">
                    <FaEye />
                    View
                  </button>
                  {
                    !p.risk_level && (
                      <button
                        onClick={() =>
                          router.push(`/dashboard/patients/risk-prediction?patient_id=${p.id}`)
                        }
                        className="px-4 py-2 cursor-pointer bg-[#3BA1AF] text-white text-sm rounded-md hover:bg-[#3599a0] transition"
                      >
                        risk assessment
                      </button>
                    )
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
