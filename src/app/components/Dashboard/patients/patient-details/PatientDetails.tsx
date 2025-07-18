// Updated component with dynamic fetch for patient profile
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Shield,
  FlaskConical,
  FileText,
  Clock
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import RiskAssessmentView from './RiskAssessmentview';
import LabTestsView from './LabTestsView';

const tabs = [
  { id: 'Profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'Additional Information', label: 'Additional Info', icon: <FileText className="w-4 h-4" /> },
  { id: 'Risk Assessment', label: 'Risk Assessment', icon: <Shield className="w-4 h-4" /> },
  { id: 'Lab Tests', label: 'Lab Tests', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'Follow Up Plans', label: 'Follow Up', icon: <Clock className="w-4 h-4" /> }
];



export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  area_of_residence: string;
}

export interface PatientProfile {
  patient: Patient;

  // Sexual history
  is_sexually_active: string | number;
  number_of_sexual_partners: string | number;
  first_sexual_intercourse_age: string | number;

  // Medical history
  smoking_status: string;
  stds_history: string;
  hpv_result: string;
  immune_compromised: string;
  immune_condition_detail?: string;

  // Reproductive history
  contraceptive_using: string;
  contraceptive_use_years: string | number;
  hpv_vaccinated: string;
  has_children: string;
  children_count: string | number;
  first_pregnancy_age?: string | number;
  family_history: string;
}


const PatientDetails = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const params = useParams();
  const id = params?.patient || null;

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/patient-profiles/${id}`)
        .then(res => res.json())
        .then(data => setPatientProfile(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const getAge = (dob:string) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (!patientProfile) {
    return <div className="p-6">Loading...</div>;
  }

  const patient = patientProfile.patient;

  return (
    <DashboardLayout>
      <div className="w-full px-4 font-poppins">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">Patient Overview</h1>
          <p className="text-gray-600">Comprehensive patient information and care management</p>
        </div>

        <div className="mb-8">
          <div className="flex space-x-1 bg-blue-50 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex font-inter items-center space-x-2 px-4 py-3.5 rounded-md text-base transition-all duration-200
                ${activeTab === tab.id
                    ? 'bg-white text-[#3BA1AF] '
                    : 'text-gray-800 hover:text-[#3BA1AF] hover:bg-white/50'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 min-h-[400px]">
          {activeTab === 'Profile' && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#3BA1AF] rounded-full flex items-center justify-center text-white font-medium text-lg mr-4">
                  {`${patient.first_name[0]}${patient.last_name[0]}`}
                </div>
                <div>
                  <h2 className="text-xl font-medium text-gray-800">{`${patient.first_name} ${patient.last_name}`}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#3BA1AF]" />
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">{patient.date_of_birth}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-[#3BA1AF]" />
                    <div>
                      <p className="text-sm text-gray-600">Phone_number</p>
                      <p className="font-medium">{patient.area_of_residence}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-[#3BA1AF]" />
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="font-medium">{getAge(patient.date_of_birth)} years</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#3BA1AF]" />
                    <div>
                      <p className="text-sm text-gray-600">Residence</p>
                      <p className="font-medium">{patient.area_of_residence}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'Additional Information' && (
            <div className="p-6">
              <h2 className="text-xl font-medium text-[#3BA1AF] mb-6">Additional Patient Information</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Sexual History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <Field label="Sexually Active" value={patientProfile.is_sexually_active} />
                    <Field label="Number of Sexual Partners" value={patientProfile.number_of_sexual_partners} />
                    <Field label="First Sexual Intercourse Age" value={patientProfile.first_sexual_intercourse_age} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <Field label="Smoking Status" value={patientProfile.smoking_status} />
                    <Field label="STDs History" value={patientProfile.stds_history} />
                    <Field label="HPV Result" value={patientProfile.hpv_result} />
                    <Field label="Immune Compromised" value={patientProfile.immune_compromised} />
                    <Field label="Immune Condition Detail" value={patientProfile.immune_condition_detail || 'None'} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Reproductive History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <Field label="Using Contraceptives" value={patientProfile.contraceptive_using} />
                    <Field label="Years Using Contraceptives" value={patientProfile.contraceptive_use_years} />
                    <Field label="HPV Vaccinated" value={patientProfile.hpv_vaccinated} />
                    <Field label="Has Children" value={patientProfile.has_children} />
                    <Field label="Children Count" value={patientProfile.children_count} />
                    <Field label="First Pregnancy Age" value={patientProfile.first_pregnancy_age || 'N/A'} />
                    <Field label="Family History of Cervical Cancer" value={patientProfile.family_history} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Risk Assessment' && patient?.id && (
            <RiskAssessmentView patientId={patient.id} />
          )}
          {activeTab === 'Lab Tests' && patient?.id && (
            <LabTestsView patientId={patient.id} />
          )}


        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetails;

const Field = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-800">{value}</p>
  </div>
);
