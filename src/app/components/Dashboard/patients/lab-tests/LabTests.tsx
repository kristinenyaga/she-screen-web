'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../DashboardLayout';

type LabTestStatus = 'pending' | 'completed';
type FilterStatus = LabTestStatus | 'all';


interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  patient_code: string;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
}

interface Service {
  id: number;
  name: string;
}

interface LabTest {
  id: number;
  patient: Patient | null;
  ordered_by: Doctor | null;
  service: Service | null;
  date_ordered: string;
  status: LabTestStatus;
  result: string | null;
  comment?: string | null;
}
const STATUS_OPTIONS: FilterStatus[] = ['all', 'pending', 'completed'];
const LabTests = () => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [resultValue, setResultValue] = useState('');
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/lab-tests');
        const data = await res.json();
        setTests(data);
      } catch (err) {
        console.error('Failed to fetch lab tests', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleSave = async () => {
    if (!editingTest || !resultValue) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/lab-tests/${editingTest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: resultValue,
          status: 'completed',
          comment,
        }),
      });

      if (res.ok) {
        setEditingTest(null);
        setResultValue('');
        setComment('');
        // Refresh list
        const updated = await res.json();
        setTests(prev =>
          prev.map(t => (t.id === updated.id ? updated : t))
        );
      }
    } catch (err) {
      console.error('Failed to update lab test result', err);
    }
  };

  const getStatusBadge = (status: LabTestStatus) => {
    switch (status) {
      case 'pending':
        return <span className="text-base px-2 py-1 bg-yellow-100 text-yellow-600 rounded-md">Pending</span>;
      case 'completed':
        return <span className="text-base px-2 py-1 bg-green-100 text-green-800 rounded-md">Completed</span>;
      default:
        return <span className="text-base px-2 py-1 bg-gray-100 text-gray-600 rounded-md">Unknown</span>;
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesStatus = filteredStatus === 'all' || test.status === filteredStatus;
    const matchesSearch =
      test.patient?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patient?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patient?.patient_code?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="font-inter">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Lab Tests</h1>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => setFilteredStatus(status)}
              className={`px-4 py-2 rounded-md text-sm ${filteredStatus === status
                  ? 'bg-[#3BA1AF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by patient, test, or doctor"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="mb-6 w-[90%] px-4 py-3 border border-gray-300 rounded-md focus:ring-[#3BA1AF] focus:border-[#3BA1AF]"
        />


        {/* Lab Tests Table */}
        {loading ? (
          <p className="text-gray-500">Loading lab tests...</p>
        ) : (
          <div className="">
              <table className="w-[90%] text-left border border-gray-100 overflow-hidden">
                <thead className="bg-[#f7fafa] text-gray-800 text-sm font-medium">
                  <tr>
                    <th className="px-4 py-3">Patient Code</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Test</th>
                  <th className="px-4 py-3">Ordered By</th>
                  <th className="px-4 py-3">Date Ordered</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map(test => (
                  <tr key={test.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-gray-700">{test.patient?.patient_code}</td>
                    <td className="p-3 text-gray-700">{test.patient?.first_name} {test.patient?.last_name}</td>
                    <td className="p-3 text-gray-700">{test.service?.name}</td>
                    <td className="p-3 text-gray-700">Dr. {test.ordered_by?.first_name || '—'} {test.ordered_by?.last_name || '—'}</td>
                    <td className="p-3 text-gray-700">{new Date(test.date_ordered).toLocaleDateString()}</td>
                    <td className="p-3 text-gray-700 text-base">{getStatusBadge(test.status)}</td>
                    <td className="p-3 text-gray-700">
                      {test.result ? test.result : <span className="italic text-gray-400">not entered</span>}
                    </td>

                    <td className="p-3 text-gray-700">
                      {test.status === 'pending' && (
                        <button
                          className="text-sm cursor-pointer text-blue-600 hover:underline"
                          onClick={() => {
                            setEditingTest(test);
                            setResultValue('');
                            setComment('');
                          }}
                        >
                          Add Result
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editingTest && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl space-y-5">
              <h2 className="text-xl font-bold text-[#3BA1AF] border-b pb-2">Enter Lab Result</h2>

              <div className="text-base text-gray-800 space-y-1">
                <p>
                  <span className="font-semibold text-gray-600">Patient:</span> {editingTest.patient?.first_name} {editingTest.patient?.last_name}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Test:</span> {editingTest.service?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                <select
                  value={resultValue}
                  onChange={e => setResultValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:border-[#3BA1AF]"
                >
                  <option value="">Select Result</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments (optional)</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  placeholder="e.g. Observed minor abnormalities..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#3BA1AF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setEditingTest(null)}
                  className="px-4 py-2 cursor-pointer text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 cursor-pointer text-sm rounded-md bg-[#3BA1AF] text-white hover:bg-[#3298a4] transition"
                >
                  Save Result
                </button>
              </div>
            </div>
          </div>

        )}
      </div>
    </DashboardLayout>
  );
};

export default LabTests;
