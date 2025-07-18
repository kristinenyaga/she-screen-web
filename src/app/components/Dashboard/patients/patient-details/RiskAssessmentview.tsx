'use client';
import React, { useEffect, useState } from 'react';

interface RiskAssessment {
  age: number;
  number_of_sexual_partners: number;
  first_sexual_intercourse: number;
  smoking_status: string;
  stds_history: string;
  hpv_test_result: string;
  hpv_vaccinated: boolean;
}

interface Prediction {
  interpretation: string;
  risk_probability: number;
  screening_recommendations: {
    recommended_screenings: string[];
    reason: string;
    urgency: string;
    frequency: string;
    additional_services: string[];
  };
}

interface Summary {
  risk_level: string;
  next_steps: string[];
  reason: string;
  additional_services: string[];
  availability: {
    service: string;
    available: boolean;
  }[];
}

interface RiskResult {
  id: number;
  patient_id: number;
  risk_assessment: RiskAssessment;
  prediction: Prediction;
  summary: Summary;
}

export default function RiskAssessmentView({ patientId }: { patientId: number }) {
  const [data, setData] = useState<RiskResult | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/patients/risk-prediction/${patientId}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to fetch risk assessment', err));
  }, [patientId]);

  if (!data) return <p className="p-6 text-gray-500">Loading risk assessment...</p>;

  console.log(data)
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-[#3BA1AF]">Risk Assessment Result</h2>


      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Prediction Summary</h3>
        <p className="text-gray-800 mb-2">
          <strong>Interpretation:</strong> {data.prediction.interpretation}
        </p>
        <p><strong>Risk Probability:</strong> {(data.prediction.risk_probability * 100).toFixed(1)}%</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-800 mb-1">Screenings:</p>
            <ul className="list-disc pl-6">
              {data.prediction.screening_recommendations.recommended_screenings.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-1">Additional Services:</p>
            <ul className="list-disc pl-6">
              {data.prediction.screening_recommendations.additional_services.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3"><strong>Urgency:</strong> {data.prediction.screening_recommendations.urgency}</p>
        <p><strong>Reason:</strong> {data.prediction.screening_recommendations.reason}</p>
      </div>

    </div>
  );
}
