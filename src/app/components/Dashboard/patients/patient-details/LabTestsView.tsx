'use client';
import React, { useEffect, useState } from 'react';

interface LabTest {
  id: number;
  recommendation_id: number;
  service: {
    id: number;
    name: string;
  };
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    patient_code: string;
  };
  result: string;
  status: 'pending' | 'completed';
  ordered_by: {
    id: number;
    first_name: string;
    last_name: string;
  };
  entered_by_id: number;
  follow_up_id: number | null;
  date_ordered: string;
  date_completed: string | null;
}

export default function LabTestsView({ patientId }: { patientId: number }) {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/lab-tests/by-patient/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setLabTests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch lab tests', err);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) return <p className="p-4 text-gray-500 text-sm">Loading lab tests...</p>;
  if (labTests.length === 0)
    return <p className="p-4 text-gray-500 text-sm">No lab tests available for this patient.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl text-[#3BA1AF] mb-4 tracking-tight">Lab Tests</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Service</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Ordered By</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Result</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Date Ordered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {labTests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50 text-base transition">
                <td className="px-4 py-3">{test.service.name}</td>
                <td className="px-4 py-3">
                  {test.ordered_by.first_name} {test.ordered_by.last_name}
                </td>
                <td className="px-4 py-3">
                  {test.result ? (
                    <span className="text-gray-700">{test.result}</span>
                  ) : (
                    <span className="italic text-gray-400">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${test.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {test.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(test.date_ordered).toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
