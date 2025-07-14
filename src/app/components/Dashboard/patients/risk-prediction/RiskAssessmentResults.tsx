'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info, User, Calendar, MapPin, FileText, Activity } from 'lucide-react';

const RiskResultPage = () => {
  const [doctorDecision, setDoctorDecision] = useState('accept');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [customActions, setCustomActions] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient');
  const [patientProfile, setPatientProfile] = useState(null);
  const [riskResult, setRiskResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFactors, setShowFactors] = useState(false);
  const [showAdditionalServices, setShowAdditionalServices] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;

      try {
        const [profileRes, riskRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/patient-profiles/${patientId}`),
          fetch(`http://127.0.0.1:8000/patients/risk-prediction/${patientId}`),
        ]);

        const [profileData, riskData] = await Promise.all([
          profileRes.json(),
          riskRes.json(),
        ]);

        setPatientProfile(profileData);
        setRiskResult(riskData);
        const modelUrgency = riskData?.prediction?.screening_recommendations?.urgency;
        if (modelUrgency) {
          setUrgency(modelUrgency); // e.g., "Low", "Medium", "High"
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  if (loading || !patientProfile || !riskResult) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patient data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const patient = patientProfile.patient;


  const additionalInfo = Object.entries(patientProfile)
    .filter(([key]) => !['id', 'patient_id', 'patient', 'number_of_sexual_partners', 'first_sexual_intercourse_age', 'smoking_status', 'stds_history', 'hpv_result'].includes(key));


  const handleSubmit = async () => {
    const payload = {
      patient_id: Number(patientId),
      risk_prediction_id:riskResult.id,
      override: doctorDecision === 'custom',
      urgency,
      doctor_notes: notes,
      final_recommendation: doctorDecision === 'accept'
        ? riskResult.summary.next_steps.toString()
        : customActions.split(',').map(step => step.trim()).filter(Boolean).toString(),
    };
    console.log(payload)

    try {
      const res = await fetch('http://127.0.0.1:8000/recommendations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save recommendation');
      }

      setShowRecommendation(false);
      router.push('/dashboard/patients');
    } catch (err) {
      console.error('Submission error:', err);
    }
  }

  const getRiskStyling = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          accentColor: 'text-red-700',
          badgeColor: 'bg-red-100 text-red-800 border-red-200',
          buttonColor: 'text-red-600 hover:bg-red-100',
          iconColor: 'text-red-600',
          icon: AlertTriangle
        };
      case 'medium':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-600',
          accentColor: 'text-orange-700',
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
          buttonColor: 'text-orange-600 hover:bg-orange-100',
          iconColor: 'text-orange-600',
          icon: Info
        };
      case 'low':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-900',
          accentColor: 'text-green-700',
          badgeColor: 'bg-green-100 text-green-800 border-green-200',
          buttonColor: 'text-green-600 hover:bg-green-100',
          iconColor: 'text-green-600',
          icon: CheckCircle2
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          accentColor: 'text-gray-700',
          badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
          buttonColor: 'text-gray-600 hover:bg-gray-100',
          iconColor: 'text-gray-600',
          icon: Info
        };
    }
  };

  const formatPercentage = (probability) => {
    const percentage = (probability * 100).toFixed(1);
    return `${percentage}%`;
  };
  const styling = getRiskStyling(riskResult.summary.risk_level);
  const RiskIcon = styling.icon;
  return (
    <DashboardLayout>
      <div className="w-[80vw] pb-9 font-poppins text-[#1E1E1E]">
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><Link href="/dashboard" className="text-gray-500 hover:underline">Dashboard</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/dashboard/patients" className="text-gray-500 hover:underline">Patients</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/dashboard/patients/risk-assessment" className="text-gray-500 hover:underline">Risk Assessment</Link></li>
          </ol>
        </nav>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
          </div>

          <div className="bg-white ">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-lg text-gray-900">
                  {patient.first_name} {patient.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {riskResult.risk_assessment.age} years • {patient.date_of_birth}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{patient.area_of_residence}</span>
              </div>
            </div>
          </div>
        </div>
        <section className={`mb-10 p-6 rounded-xl ${styling.bgColor} `}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <RiskIcon className={`w-6 h-6 ${styling.iconColor}`} />
              <div className='flex items-center gap-3'>
                <div className={`text-lg border bg-white ${styling.borderColor} flex justify-center items-center py-4 p-2 rounded-full font-semibold ${styling.accentColor}`}>
                  {formatPercentage(riskResult.prediction.risk_probability)}
                </div>
                <p className={`text-lg ${styling.accentColor}`}>
                  {riskResult.summary.risk_level} Risk Level 
                </p>
              </div>

            </div>

          </div>

          <div className={`bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-6 border ${styling.borderColor}`}>
            <p className={`${styling.textColor} text-base leading-relaxed`}>
              {riskResult.prediction.interpretation}
            </p>

          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className={`text-base font-bold ${styling.textColor} uppercase tracking-wide`}>
                Recommended Actions
              </h3>
            </div>
            <div className="grid grid-cols-1">
              {riskResult.summary.next_steps.map((step, idx) => (
                <div key={idx} className={`${styling.borderColor}`}>
                  <div className="flex items-center">
                    <span className={`font-medium ${styling.textColor}`}>{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowAdditionalServices(!showAdditionalServices)}
              className={`flex items-center justify-between w-full  transition-colors`}
            >
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${styling.textColor} uppercase tracking-wide`}>
                  Additional Services ({riskResult.summary.additional_services.length})
                </span>
              </div>
            </button>
            <div className="mt-3 space-y-2">
              {riskResult.summary.additional_services.map((service, idx) => (
                <div key={idx} className={` ${styling.borderColor}`}>
                  <span className={`text-sm ${styling.textColor}`}>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="mb-10 p-6 rounded-xl border border-[#E0D7F3]">
          <div className="flex items-center gap-10 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Additional Patient Information</h2>
            <button onClick={() => setShowAdditionalInfo(prev => !prev)} className="text-sm font-medium text-[#3BA1AF] underline">
              {showAdditionalInfo ? 'Hide' : 'View more'}
            </button>
          </div>
          {showAdditionalInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
              {additionalInfo.map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="capitalize text-gray-700">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-gray-900">{String(val)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="py-6 rounded-lg mb-10">
          <h2 className="text-xl font-semibold mb-4">Clinician Decision</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Accept button - Success */}
            <button
              onClick={() => {
                setDoctorDecision('accept');
                setShowRecommendation(true);
              }}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-md transition duration-150"
            >
              Accept Recommendation
            </button>

            <button
              onClick={() => {
                setDoctorDecision('custom');
                setShowRecommendation(true);
              }}
              className="border border-green-600 text-green-600 cursor-pointer px-6 py-3 rounded-md transition duration-150"
            >
              Create Custom Recommendation
            </button>
          </div>
        </section>


        {showRecommendation && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white w-[600px] max-w-full rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#3BA1AF] mb-4">
                🩺 Recommended Plan for {patient.first_name}
              </h2>

              {
                doctorDecision !== 'custom' && (<div className="mb-6 text-lg text-gray-800 space-y-1">{riskResult.summary.next_steps.map((step, idx) => <p key={idx}>{step}</p>)}</div>)
              }


              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1 text-gray-800">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full border border-gray-300 text-gray-500 focus:outline-none px-3 py-2 rounded-md"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {doctorDecision === 'custom' && (
                  <div>
                    <label className="block font-medium mb-1 text-gray-800">Doctor&apos;s Recommendation</label>
                    <textarea
                      value={customActions}
                      onChange={(e) => setCustomActions(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 text-gray-500 focus:outline-none px-3 py-2 rounded-md"
                      placeholder="e.g. Refer to gynecologist, Schedule colposcopy"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-medium mb-1 text-gray-800">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 text-gray-500 focus:outline-none px-3 py-2 rounded-md"
                    placeholder="Additional clinical recommendation"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowRecommendation(false)}
                    className="text-sm px-4 cursor-pointer py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowRecommendation(false);
                      handleSubmit()
                      router.push('/dashboard/patients');
                      // TODO: Submit logic goes here
                    }}
                    className="bg-[#3BA1AF] cursor-pointer hover:bg-[#3298a4] text-white text-sm px-4 py-2 rounded-md"
                  >
                    Confirm & Save Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default RiskResultPage;
