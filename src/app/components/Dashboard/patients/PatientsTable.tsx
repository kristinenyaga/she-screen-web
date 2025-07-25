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
  risk_level?: 'High' | 'Medium' | 'Low' | null;

  recommendation_count: number;
  latest_recommendation_status?: string;
  lab_tests_count: number;
  latest_lab_test_status?: string;
  follow_up_finalized: boolean;
}


const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case 'High':
      return 'text-red-600 bg-red-100 py-1 px-2 rounded-md font-semibold';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 rounded-md py-1 px-2 font-semibold';
    case 'Low':
      return 'text-green-600 bg-green-100 rounded-md py-1 px-2 font-semibold';
    default:
      return 'text-gray-400 italic';
  }
};

const PatientTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [filterText, setFilterText] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/patients');
        const data = await res.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter((p) => {
      const nameMatch = `${p.first_name} ${p.last_name}`.toLowerCase().includes(filterText.toLowerCase());
      const phoneMatch = p.phone_number?.includes(filterText);
      const riskMatch = riskFilter ? p.risk_level === riskFilter : true;
      return (nameMatch || phoneMatch) && riskMatch;
    });
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [filterText, riskFilter, patients]);

  const paginated = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  return (
    <div className="overflow-x-auto font-inter w-[90%]">
      <div className='mt-1'>
        <h1 className="text-2xl font-medium text-gray-700 mb-1">Patient Management</h1>
        <p className="text-base text-gray-500">Manage risk assessments and care plans.</p>
      </div>

      <PatientFilter
        filterText={filterText}
        setFilterText={setFilterText}
        riskFilter={riskFilter}
        setRiskFilter={setRiskFilter}
      />

      <table className="w-full mt-5 border border-gray-100 overflow-hidden shadow-md rounded-lg">
        <thead className="bg-[#f7fafa] text-gray-700 text-[16.5px]">
          <tr>
            <th className="py-3">Patient Code</th>
            <th className="py-3">Name</th>
            <th className="py-3">Phone</th>
            <th className="py-3">Age</th>
            <th className="py-3">Risk Level</th>
            <th className="py-3">Lab Tests</th>
            <th className="py-3">Follow Up</th>
            <th className="py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="text-base text-gray-600 bg-white">
          {paginated.map((p) => {
            const fullName = `${p.first_name} ${p.last_name}`;
            return (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-center">{p.patient_code}</td>
                <td className="px-6 py-4 text-center">{fullName}</td>
                <td className="px-6 py-4 text-center">{p.phone_number || '—'}</td>
                <td className="px-6 py-4 text-center">
                  {p.date_of_birth
                    ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()
                    : '—'}
                </td>
                <td className="px-6 py-4 text-center">
                  {p.risk_level ? (
                    <span className={getRiskColor(p.risk_level)}>{p.risk_level}</span>
                  ) : (
                    <span className="text-gray-400 italic">Not Assessed</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {p.lab_tests_count} <br />
                  <span className="text-base text-gray-500">{p.latest_lab_test_status || '—'}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {p.follow_up_finalized ? (
                    <span className="bg-green-100 text-green-700 text-base px-2 py-1 rounded-md">Finalized</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-base px-2 py-1 rounded-md">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => router.push(`/dashboard/patients/${p.id}`)}
                    className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-base hover:bg-gray-200 transition"
                  >
                    <FaEye />
                    View
                  </button>
                  
                  {!p.risk_level && (
                    <button
                      onClick={() =>
                        router.push(`/dashboard/patients/risk-prediction?patient_id=${p.id}`)
                      }
                      className="px-4 py-2 cursor-pointer bg-[#3BA1AF] text-white text-sm rounded-md hover:bg-[#3599a0] transition"
                    >
                      risk assessment
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>

  
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#3BA1AF] text-white' : 'bg-gray-100 text-gray-700'
                } hover:bg-[#3BA1AF] hover:text-white transition`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientTable;
