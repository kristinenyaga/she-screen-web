'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';

type Tab = 'Profile' | 'Risk Assessment' | 'Recommended Tests' | 'Test Results' | 'Final Plan';

interface Patient {
  full_name: string;
  date_of_birth: string;
  age: number;
  residence: string;
  phone: string;
}

interface RiskAssessment {
  level: 'High' | 'Medium' | 'Low';
  probability: string;
  interpretation: string;
  factors: Record<string, string>;
}

interface Recommendations {
  tests: string[];
  urgency: 'High' | 'Medium' | 'Low';
  resources_available: Record<string, boolean>;
  costs: Record<string, number>;
}

interface TestResult {
  test: string;
  result: 'Positive' | 'Negative';
  date: string;
}

interface DoctorPlan {
  final_recommendation: string;
  notes: string;
  urgency: 'High' | 'Medium' | 'Low';
}

interface PatientData {
  patient: Patient;
  risk_assessment: RiskAssessment;
  recommendations: Recommendations;
  test_results: TestResult[];
  doctor_plan: DoctorPlan;
}

const tabs: Tab[] = ['Profile', 'Risk Assessment', 'Recommended Tests', 'Test Results', 'Final Plan'];

const PatientDetails = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');

  const data: PatientData = {
    patient: {
      full_name: 'Jane Wanjiku',
      date_of_birth: '1989-06-12',
      age: 35,
      residence: 'Kiambu',
      phone: '0712345678'
    },
    risk_assessment: {
      level: 'Low',
      probability: '72.8%',
      interpretation:
        'Moderate risk, screening required due to reported history of STDs and early sexual activity.',
      factors: {
        'Number of sexual partners': '3',
        'First sexual intercourse age': '17',
        'HPV test result': 'Positive',
        'Smoking status': 'No',
        'STDs history': 'Yes'
      }
    },
    recommendations: {
      tests: ['Pap Smear', 'HPV DNA Test'],
      urgency: 'Medium',
      resources_available: {
        'Pap Smear': true,
        'HPV DNA Test': false
      },
      costs: {
        'Pap Smear': 1500,
        'HPV DNA Test': 2500
      }
    },
    test_results: [
      { test: 'Pap Smear', result: 'Negative', date: '2025-06-22' },
      { test: 'HPV DNA Test', result: 'Negative', date: '2025-07-11' }
    ],
    doctor_plan: {
      final_recommendation: 'Schedule colposcopy and follow-up visit in 6 months',
      notes: 'Patient should abstain from sex until Pap Smear is conducted.',
      urgency: 'Medium'
    }
  };

  return (
    <DashboardLayout>
      <div className="w-[80vw] py-5 font-poppins text-gray-800">
        <h1 className="text-2xl font-medium mb-6">Patient Details</h1>

        {/* Tab Headers */}
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-[#3BA1AF] text-[#3BA1AF]' : 'text-gray-500 hover:text-[#3BA1AF]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          {activeTab === 'Profile' && (
            <ul className="grid grid-cols-2 gap-4 text-sm">
              <li><strong>Name:</strong> {data.patient.full_name}</li>
              <li><strong>Phone:</strong> {data.patient.phone}</li>
              <li><strong>Residence:</strong> {data.patient.residence}</li>
              <li><strong>Date of Birth:</strong> {data.patient.date_of_birth}</li>
              <li><strong>Age:</strong> {data.patient.age}</li>
            </ul>
          )}

          {activeTab === 'Risk Assessment' && (
            <>
              <p><strong>Risk Level:</strong> {data.risk_assessment.level}</p>
              <p><strong>Risk Probability:</strong> {data.risk_assessment.probability}</p>
              <p className="text-gray-600">{data.risk_assessment.interpretation}</p>
              <h3 className="font-medium">Factors Considered:</h3>
              <ul className="list-disc list-inside text-sm">
                {Object.entries(data.risk_assessment.factors).map(([label, value]) => (
                  <li key={label}><strong>{label}:</strong> {value}</li>
                ))}
              </ul>
            </>
          )}

          {activeTab === 'Recommended Tests' && (
            <>
              <p><strong>Urgency:</strong> {data.recommendations.urgency}</p>
              <ul className="space-y-2 text-sm">
                {data.recommendations.tests.map((test) => {
                  const available = data.recommendations.resources_available[test];
                  const cost = data.recommendations.costs[test];
                  return (
                    <li key={test} className="flex justify-between items-center">
                      <span>
                        {available ? (
                          test
                        ) : (
                          <span className="text-gray-400 line-through">{test} <span className="text-red-600 text-xs">(Unavailable)</span></span>
                        )}
                      </span>
                      <span className="text-gray-700">KES {cost.toLocaleString()}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {activeTab === 'Test Results' && (
            <ul className="text-sm space-y-2">
              {data.test_results.map((t, i) => (
                <li key={i} className="flex justify-between">
                  <span><strong>{t.test}</strong> - {t.result}</span>
                  <span>{t.date}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'Final Plan' && (
            <>
              <p><strong>Urgency:</strong> {data.doctor_plan.urgency}</p>
              <p><strong>Recommendation:</strong> {data.doctor_plan.final_recommendation}</p>
              <p><strong>Notes:</strong> {data.doctor_plan.notes}</p>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetails;
