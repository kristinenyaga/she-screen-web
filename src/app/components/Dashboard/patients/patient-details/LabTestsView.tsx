'use client';
import React, { useEffect, useState } from 'react';

interface FinalizedBy {
  id: number;
  first_name: string;
  last_name: string;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}
interface FollowUpRecommendation {
  id: number;
  patient_id: number;
  risk_prediction_id: number | null;
  age: number;
  number_of_sexual_partners: number;
  first_sexual_intercourse_age: number;
  smoking_status: string;
  stds_history: string;
  hpv_current_test_result: string;
  pap_smear_result: string;
  screening_type_last: string;
  category: string;
  context: string[];
  options: string[];
  confidence: number;
  method: string;
  prediction_label: number;
  prediction_probabilities: string;
  final_plan: string;
  finalized_by_user_id: number;
  finalized_by: FinalizedBy;
  created_at: string;
  patient: Patient;
}

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
  const [followUp, setFollowUp] = useState<FollowUpRecommendation | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const getFollowUP = async (id: number | null) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/patients/patientfollowup/${id}`);
      if (!res.ok) throw new Error('Failed to fetch follow-up');
      const data = await res.json();

      data.options = JSON.parse(data.options || '[]');
      data.context = JSON.parse(data.context || '[]');

      setFollowUp(data);
      setShowModal(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setFollowUp(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFollowUp(null);
  };

  if (loading) return <p className="p-4 text-gray-500 text-sm">Loading lab tests...</p>;
  if (labTests.length === 0)
    return <p className="p-4 text-gray-500 text-sm">No lab tests available for this patient.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl text-[#3BA1AF] mb-4 tracking-tight">Lab Tests</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Service</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Ordered By</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Result</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Date Ordered</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Follow up Plan</th>
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
                <td
                  className="px-4 py-3 text-blue-500 cursor-pointer underline"
                  onClick={() => getFollowUP(test.follow_up_id)}
                >
                  view
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && followUp && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 bg-gray-100 px-3 p-1 rounded-full text-gray-800 cursor-pointer hover:text-red-600 text-3xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-3 text-[#3BA1AF]">Follow Up Plan</h3>
            <p className="mb-2"><strong>Final Plan:</strong> {followUp.final_plan}</p>
            <p className="mb-2"><strong>Category:</strong> {followUp.category}</p>
            <p className="mb-2"><strong>Confidence:</strong> {(followUp.confidence * 100).toFixed(2)}%</p>
            <p className="mb-2"><strong>Finalized By:</strong> {followUp.finalized_by.first_name} {followUp.finalized_by.last_name}</p>
            <p className="mb-2"><strong>Context:</strong> {followUp.context.join(', ')}</p>
            <p className="text-sm text-gray-500 mt-4">Created at: {new Date(followUp.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
