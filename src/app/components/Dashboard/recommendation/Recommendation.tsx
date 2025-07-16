'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Awaiting Test Results', value: 'awaiting_test_results' },
  { label: 'Care Plan Added', value: 'care_plan_added' },
  { label: 'Closed', value: 'closed' },
];

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    awaiting_test_results: 'bg-blue-100 text-blue-800',
    care_plan_added: 'bg-green-100 text-green-800',
    closed: 'bg-gray-200 text-gray-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/recommendations');
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const groupedCounts = recommendations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filtered = filteredStatus === 'all'
    ? recommendations
    : recommendations.filter((r) => r.status === filteredStatus);

  return (
    <DashboardLayout>
      <div className="font-poppins">
        <div className='mt-1'>
          <h1 className="text-[22px] font-medium text-gray-700 mb-1">Patient Recommendations</h1>
          <p className="text-sm text-gray-500">Manage patient recommendations from risk assessment</p>
        </div>

        <div className="flex flex-wrap gap-3 my-6">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilteredStatus(option.value)}
              className={`px-6 py-3 cursor-pointer rounded-md text-base font-medium shadow-sm ${filteredStatus === option.value
                  ? 'bg-[#3BA1AF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {option.label}
              {option.value !== 'all' && (
                <span className="ml-2 text-sm text-gray-600 font-normal">
                  ({groupedCounts[option.value] || 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading recommendations...</p>
        ) : filtered.length === 0 ? (
            <p className="text-gray-600 text-sm">No recommendations found.</p>
          ) : (
              <div className="overflow-x-auto w-[80%]">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  
                  <thead className="bg-gray-100 text-sm text-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4">Patient code</th>
                      <th className="text-left py-3 px-4">Patient Name</th>
                      <th className="text-left py-3 px-4">Urgency</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Recommendation</th>
                      <th className="text-left py-3 px-4">Additional Services</th>
                      <th className="text-left py-3 px-4">Notes</th>
                      <th className="text-left py-3 px-4">Date Created</th>

                </tr>
              </thead>
                  <tbody className="text-base text-gray-800">
                    {filtered.map((rec, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4">
                          {rec.patient.patient_code}
                        </td>
                        <td className="py-3 px-4">
                          {rec.patient.first_name} {rec.patient.last_name}
                        </td>
                        <td className="py-3 px-4">{rec.urgency}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeClass(
                              rec.status
                            )}`}
                          >
                            {rec.status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <p><strong>Tests:</strong> {rec.test_recommendations || '—'}</p>
                            <p><strong>Non-Test:</strong> {rec.non_test_recommendations || '—'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{rec.additional_services || '—'}</td>

                        <td className="py-3 px-4 max-w-[250px] truncate" title={rec.notes}>
                          {rec.notes || '—'}
                        </td>

                        <td className="py-3 px-4">
                          {new Date(rec.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>

            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Recommendation;
