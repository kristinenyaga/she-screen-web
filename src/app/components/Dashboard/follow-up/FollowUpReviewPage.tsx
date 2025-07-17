'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, Save, AlertCircle } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
export interface FollowUpRecommendation {
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
  options: string[];               
  context: string[];               
  confidence: number;              
  method: string;                  
  prediction_label: number;
  prediction_probabilities: string; 
  created_at: string;
}

const FollowUpReviewPage = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient');

  const [followUp, setFollowUp] = useState<FollowUpRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [customPlan, setCustomPlan] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [planType, setPlanType] = useState<'suggested' | 'custom'>('suggested');
  const router = useRouter()
  useEffect(() => {
    const fetchFollowUp = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/patients/followup/${patientId}/latest`);
        if (!res.ok) throw new Error('No recommendation found');
        const data = await res.json();

        data.options = JSON.parse(data.options || '[]');
        data.context = JSON.parse(data.context || '[]');

        setFollowUp(data);
        setSelectedOption(data.options?.[0] || null); 
      } catch (err) {
        console.error('Error fetching follow-up:', err);
        setFollowUp(null);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchFollowUp();
  }, [patientId]);

  const handleSave = async () => {
    if (!followUp) return;

    const finalPlan = planType === 'suggested' ? selectedOption : customPlan;

    if (!finalPlan?.trim()) {
      alert('Please provide or select a treatment plan.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/patients/followup/${followUp.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          final_plan: finalPlan,
          finalized_by_user_id: 1, // TODO: Replace with the actual logged-in user ID
        }),
      });

      if (!res.ok) throw new Error('Failed to save the treatment plan');

      alert('Treatment plan saved successfully!');
      router.push('/dashboard/patients');
    } catch (err) {
      console.error('Error saving plan:', err);
      alert('An error occurred while saving the plan.');
    } finally {
      setSaving(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-600 bg-emerald-50';
    if (confidence >= 0.6) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  console.log(followUp)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded-lg w-64 mb-8"></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!followUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-lg font-medium">No Recommendation Found</h2>
            </div>
            <p className="text-gray-600 mt-2">Unable to find follow-up recommendations for this test.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen  font-inter to-blue-50">
        <div className="space-y-6 w-[80%]">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Christine Follow-Up Plan</h1>
          </div>

          <div className="bg-white rounded border border-gray-100 overflow-hidden">
            <div className=" p-6 border-b border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Clinical Recommendation</h2>
                <div className={`px-3 py-3 rounded-full text-base font-medium ${getConfidenceColor(followUp.confidence)}`}>
                  {Math.round(followUp.confidence * 100)}% confident
                </div>
              </div>
              <p className="text-[#3BA1AF] font-medium">{followUp.category}</p>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">Clinical Context</h3>
                  </div>
                  <div className="space-y-2">
                    {followUp.context?.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-800 text-base leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
{/* 
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Analysis Method</h3>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-blue-800 font-medium capitalize">{followUp.method.replace('_', ' ')}</p>
                    <p className="text-blue-600 text-sm mt-1">Evidence-based clinical guidelines</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded">
            <div className="bg-green-50 p-6 border-b border-green-100">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Select Treatment Plan</h2>
              <p className="text-gray-800">Choose from AI suggestions or create a custom plan</p>
            </div>

            <div className="p-6">
              <div className="flex bg-blue-50 rounded-xl p-1 mb-6 w-fit">
                <button
                  onClick={() => setPlanType('suggested')}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all ${planType === 'suggested'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  AI Suggestions
                </button>
                <button
                  onClick={() => setPlanType('custom')}
                  className={`px-4 py-2 rounded-lg cursor-pointer  font-medium transition-all ${planType === 'custom'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Custom Plan
                </button>
              </div>

              {planType === 'suggested' ? (
                <div className="space-y-3">
                  {followUp.options?.map((option: string, idx: number) => (
                    <div key={idx} className="relative">
                      <input
                        type="radio"
                        id={`option-${idx}`}
                        name="treatment-option"
                        value={option}
                        checked={selectedOption === option}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`option-${idx}`}
                        className={`block focus:outline-none p-4 border-gray-300 rounded-xl border cursor-pointer transition-all ${selectedOption === option
                          ? 'focus:outline-none bg-green-50 '
                          : 'border-gray-200 focus:outline-none '
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${selectedOption === option
                            ? 'border-green-500 focus:outline-none bg-green-500'
                            : 'border-gray-300 focus:outline-none'
                            }`}>
                            {selectedOption === option && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium leading-relaxed">{option}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-gray-900 font-medium">
                    Custom Treatment Plan
                  </label>
                  <textarea
                    value={customPlan}
                    onChange={(e) => setCustomPlan(e.target.value)}
                    rows={6}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Enter your custom treatment plan here...&#10;&#10;Example:&#10;• Schedule colposcopy in 2 weeks&#10;• Review HPV vaccination options&#10;• Follow up in 3 months for reassessment"
                  />
                  <p className="text-sm text-gray-500">
                    Provide detailed instructions for the patient&apos;s follow-up care
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex">
            <button
              onClick={handleSave}
              disabled={saving || (planType === 'suggested' && !selectedOption) || (planType === 'custom' && !customPlan.trim())}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Plan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Treatment Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FollowUpReviewPage;