'use client';
import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { useSearchParams } from 'next/navigation';

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
  patient:Patient
}

const FollowUpViewPage = () => {
  const searchParams = useSearchParams();
  const followUpId = searchParams.get('follow_up');

  const [followUp, setFollowUp] = useState<FollowUpRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowUp = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/patients/patientfollowup/${followUpId}`);
        if (!res.ok) throw new Error('Failed to fetch follow-up');
        const data = await res.json();

        data.options = JSON.parse(data.options || '[]');
        data.context = JSON.parse(data.context || '[]');

        setFollowUp(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setFollowUp(null);
      } finally {
        setLoading(false);
      }
    };

    if (followUpId) fetchFollowUp();
  }, [followUpId]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-600 bg-emerald-50';
    if (confidence >= 0.6) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="h-6 bg-slate-200 w-48 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 w-full rounded" />
                <div className="h-4 bg-slate-200 w-3/4 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!followUp) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-lg font-medium">No Follow-Up Found</h2>
            </div>
            <p className="text-gray-600 mt-2">Unable to retrieve follow-up details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen font-inter">
        <div className="space-y-6 w-[80%]">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              Follow-Up Plan for {followUp.patient.first_name} {followUp.patient.last_name}
            </h1>
          </div>

          <div className="bg-white rounded border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Clinical Recommendation</h2>
                <div className={`px-3 py-2 rounded-full text-sm font-medium ${getConfidenceColor(followUp.confidence)}`}>
                  {Math.round(followUp.confidence * 100)}% confident
                </div>
              </div>
              <p className="text-[#3BA1AF] font-medium">{followUp.category}</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Clinical Context</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {followUp.context.map((ctx: string, idx: number) => (
                    <li key={idx}>{ctx}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Final Treatment Plan</h2>
            <p className="text-gray-800 text-lg leading-relaxed">{followUp.final_plan}</p>
            <p className="text-sm text-gray-500 mt-2">
              Finalized by: <span className="font-medium">{followUp.finalized_by.first_name} {followUp.finalized_by.last_name}</span> on{' '}
              {new Date(followUp.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FollowUpViewPage;
